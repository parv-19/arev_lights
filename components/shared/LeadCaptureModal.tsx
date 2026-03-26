"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, MessageCircle, CheckCircle, Loader2, AlertCircle } from "lucide-react";

interface LeadCaptureModalProps {
  brochureTitle: string;
  onClose: () => void;
}

const WHATSAPP_NUMBER = "919274776616"; // AREV company WhatsApp number

export default function LeadCaptureModal({ brochureTitle, onClose }: LeadCaptureModalProps) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setErrorMsg("Please fill in your name and phone number.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, brochureTitle }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setErrorMsg(data.message || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the "${brochureTitle}". Please share it with me.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full max-w-md bg-surface border border-border rounded-sm shadow-2xl"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted hover:text-neutral transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="p-7">
            {status === "success" ? (
              /* ─── Success State ─── */
              <div className="text-center py-4">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                    <CheckCircle size={32} className="text-accent" />
                  </div>
                </div>
                <h2 className="font-display text-xl text-neutral mb-2">Request Received!</h2>
                <p className="text-muted text-sm leading-relaxed mb-6">
                  Thank you! Our team will contact you on WhatsApp or call you shortly with the <span className="text-accent font-medium">{brochureTitle}</span>.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white text-sm font-label font-semibold uppercase tracking-wide hover:bg-[#1da851] transition-colors rounded-sm"
                  >
                    <MessageCircle size={16} /> Chat on WhatsApp Now
                  </a>
                  <button
                    onClick={onClose}
                    className="py-2.5 border border-border text-muted text-xs font-label uppercase tracking-wide hover:border-border-light hover:text-neutral transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* ─── Form State ─── */
              <>
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Download size={16} className="text-accent" />
                    <span className="section-label text-xs">Brochure Request</span>
                  </div>
                  <h2 className="font-display text-xl text-neutral leading-snug">
                    Get Your Copy
                  </h2>
                  <p className="text-muted text-xs mt-1.5 leading-relaxed">
                    Fill in your details and our team will personally share the <span className="text-neutral font-medium">{brochureTitle}</span> with you on WhatsApp.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-label uppercase tracking-wider text-muted mb-1.5">
                      Full Name <span className="text-accent">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      className="w-full bg-surface-2 border border-border text-neutral placeholder-muted px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-label uppercase tracking-wider text-muted mb-1.5">
                      WhatsApp / Phone <span className="text-accent">*</span>
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      required
                      type="tel"
                      className="w-full bg-surface-2 border border-border text-neutral placeholder-muted px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-label uppercase tracking-wider text-muted mb-1.5">
                      Email Address
                    </label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      type="email"
                      className="w-full bg-surface-2 border border-border text-neutral placeholder-muted px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-2 text-red-400 text-xs">
                      <AlertCircle size={13} />
                      {errorMsg}
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="flex items-center justify-center gap-2 py-3 bg-accent text-primary text-sm font-label font-semibold uppercase tracking-wide hover:bg-accent-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? (
                        <><Loader2 size={15} className="animate-spin" /> Submitting…</>
                      ) : (
                        <><Download size={15} /> Request Brochure</>
                      )}
                    </button>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 border border-[#25D366]/50 text-[#25D366] text-xs font-label uppercase tracking-wide hover:bg-[#25D366]/10 transition-all"
                    >
                      <MessageCircle size={14} /> Chat on WhatsApp Instead
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
