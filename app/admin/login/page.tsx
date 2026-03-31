"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const callbackUrl =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("callbackUrl")
        : null;
    const safeCallbackUrl =
      callbackUrl && callbackUrl.startsWith("/admin") ? callbackUrl : "/admin";

    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: safeCallbackUrl,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(
        res.status === 429
          ? "Too many login attempts. Please wait a little and try again."
          : "Invalid email or password. Please try again."
      );
    } else {
      toast.success("Welcome back!");
      router.push(safeCallbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <div className="inline-flex flex-col items-center mb-3">
            <span className="font-display text-4xl font-semibold text-neutral">AREV</span>
            <span className="font-label text-[11px] uppercase tracking-[0.5em] text-accent font-medium -mt-1">
              Lights
            </span>
          </div>
          <div className="gold-line mx-auto mt-4 mb-4" />
          <p className="text-muted text-sm font-label uppercase tracking-widest">Admin Dashboard</p>
        </div>

        {/* Form Card */}
        <div className="bg-surface border border-border rounded-lg p-8 shadow-card">
          <h1 className="text-neutral font-semibold text-xl mb-1">Welcome Back</h1>
          <p className="text-muted text-sm mb-8">Sign in to access the admin panel</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-md mb-6"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="admin-label" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-input pl-10"
                  placeholder="admin@arevlights.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="admin-label" htmlFor="password">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input pl-10 pr-11"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full justify-center py-3.5 text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-muted/40 text-xs mt-8">
          AREV Lights Admin Panel · Protected Access
        </p>
      </motion.div>
    </div>
  );
}
