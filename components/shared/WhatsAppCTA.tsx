"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppCTA() {
  const [isExpanded, setIsExpanded] = useState(false);
  const whatsappNumber = "919274776616";
  const message = "Hello! I'm interested in AREV Lights products. Please help me.";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-surface border border-border rounded-xl p-4 shadow-card-hover w-64"
          >
            <p className="text-neutral font-semibold text-sm mb-1">Chat with us</p>
            <p className="text-muted text-xs mb-4 leading-relaxed">
              Have a question or need a quote? We typically reply within minutes.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#20c05b] transition-colors"
            >
              <MessageCircle size={16} />
              Start Conversation
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-gold-lg flex items-center justify-center hover:bg-[#20c05b] transition-colors"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="WhatsApp Chat"
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.span key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
