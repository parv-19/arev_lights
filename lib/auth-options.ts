import type { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { z } from "zod";
import dbConnect from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import {
  adminAuthPolicy,
  checkAdminLoginRateLimit,
  getRequestIpFromHeaders,
  getRequestUserAgent,
  logAdminAuthEvent,
  recordAdminLoginFailure,
  resetAdminLoginFailures,
} from "@/lib/admin-auth-security";

const loginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(1).max(256),
});

const INVALID_CREDENTIALS_ERROR = "Invalid credentials";
const DUMMY_PASSWORD_HASH = "$2a$10$Q7Yl8YjR5sJ7y0nD1wD6..tW3iZ6Qx1rX1m7V8dR3nHj4Zk2L0T4O";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const headers = req?.headers instanceof Headers ? req.headers : null;
        const ip = getRequestIpFromHeaders(headers);
        const userAgent = getRequestUserAgent(headers);
        const blocked = checkAdminLoginRateLimit(ip);

        if (blocked) {
          logAdminAuthEvent("rate_limit_hit", { ip, userAgent });
          throw new Error("Too many login attempts. Please try again later.");
        }

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          recordAdminLoginFailure(ip);
          logAdminAuthEvent("failed_login_validation", { ip, userAgent });
          throw new Error(INVALID_CREDENTIALS_ERROR);
        }

        const email = parsed.data.email.toLowerCase();
        const password = parsed.data.password;

        await dbConnect();
        const user = await AdminUser.findOne({ email })
          .select("+passwordHash failedLoginAttempts lockUntil lastFailedLoginAt");

        if (!user) {
          await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
          recordAdminLoginFailure(ip);
          logAdminAuthEvent("failed_login_unknown_user", { email, ip, userAgent });
          throw new Error(INVALID_CREDENTIALS_ERROR);
        }

        const lockUntil = user.lockUntil instanceof Date ? user.lockUntil.getTime() : 0;
        if (lockUntil > Date.now()) {
          recordAdminLoginFailure(ip);
          logAdminAuthEvent("account_locked", { email, ip, userAgent, lockUntil: user.lockUntil });
          throw new Error(INVALID_CREDENTIALS_ERROR);
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          const failedLoginAttempts = (user.failedLoginAttempts ?? 0) + 1;
          const lockAccount = failedLoginAttempts >= adminAuthPolicy.maxFailedAttempts;

          await AdminUser.updateOne(
            { _id: user._id },
            {
              $set: {
                failedLoginAttempts,
                lastFailedLoginAt: new Date(),
                lockUntil: lockAccount ? new Date(Date.now() + adminAuthPolicy.accountLockMs) : null,
              },
            }
          );

          recordAdminLoginFailure(ip);
          logAdminAuthEvent(lockAccount ? "account_locked" : "failed_login_password", {
            email,
            ip,
            userAgent,
            failedLoginAttempts,
          });
          throw new Error(INVALID_CREDENTIALS_ERROR);
        }

        await AdminUser.updateOne(
          { _id: user._id },
          {
            $set: {
              failedLoginAttempts: 0,
              lockUntil: null,
              lastFailedLoginAt: null,
            },
          }
        );
        resetAdminLoginFailures(ip);
        logAdminAuthEvent("successful_login", { email, ip, userAgent, role: user.role });

        return {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
    updateAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: "/admin/login",
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.callback-url" : "next-auth.callback-url",
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === "production" ? "__Host-next-auth.csrf-token" : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "admin";
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
