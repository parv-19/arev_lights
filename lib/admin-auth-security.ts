import { NextResponse } from "next/server";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const ACCOUNT_LOCK_MS = 15 * 60 * 1000;

type LoginAttemptState = {
  count: number;
  resetAt: number;
};

const loginAttemptStore = new Map<string, LoginAttemptState>();

export const adminAuthPolicy = {
  loginWindowMs: LOGIN_WINDOW_MS,
  maxFailedAttempts: MAX_FAILED_ATTEMPTS,
  accountLockMs: ACCOUNT_LOCK_MS,
};

export function getRequestIpFromHeaders(headers?: Headers | null) {
  return (
    headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers?.get("x-real-ip")?.trim() ??
    "unknown"
  );
}

export function getRequestUserAgent(headers?: Headers | null) {
  return headers?.get("user-agent")?.trim() || "unknown";
}

export function logAdminAuthEvent(event: string, details: Record<string, unknown>) {
  console.info(`[ADMIN_AUTH] ${event}`, details);
}

export function checkAdminLoginRateLimit(ip: string) {
  const now = Date.now();
  const existing = loginAttemptStore.get(ip);

  if (!existing || existing.resetAt <= now) {
    loginAttemptStore.set(ip, { count: 0, resetAt: now + LOGIN_WINDOW_MS });
    return null;
  }

  if (existing.count >= MAX_FAILED_ATTEMPTS) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return NextResponse.json(
      { success: false, message: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }

  return null;
}

export function getAdminLoginRateLimitResponse(ip: string) {
  const now = Date.now();
  const existing = loginAttemptStore.get(ip);

  if (!existing || existing.resetAt <= now || existing.count < MAX_FAILED_ATTEMPTS) {
    return null;
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  return NextResponse.json(
    { success: false, message: "Too many login attempts. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

export function recordAdminLoginFailure(ip: string) {
  const now = Date.now();
  const existing = loginAttemptStore.get(ip);

  if (!existing || existing.resetAt <= now) {
    loginAttemptStore.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return;
  }

  existing.count += 1;
  loginAttemptStore.set(ip, existing);
}

export function resetAdminLoginFailures(ip: string) {
  loginAttemptStore.delete(ip);
}
