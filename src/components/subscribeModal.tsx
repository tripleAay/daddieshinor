// components/SubscribeModal.tsx  (your existing file, with small additions)
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const STORAGE_KEY = "daddieshinor_subscribe_seen";

type SubscribeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      // TODO: Replace with real API (Beehiiv, ConvertKit, Mailchimp, etc.)
      // await fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) });
      await new Promise((r) => setTimeout(r, 1400)); // fake delay

      setStatus("success");
      setMessage("Thank you! You've been subscribed.");
      setEmail("");

      // Hide forever after successful subscribe
      localStorage.setItem(STORAGE_KEY, "true");

      // Optional: auto-close after success
      setTimeout(onClose, 2200);
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const internalClose = () => {
    localStorage.setItem(STORAGE_KEY, "true"); // also on manual close
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={internalClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-5 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white/95 shadow-2xl backdrop-blur-md overflow-hidden dark:border-zinc-800/80 dark:bg-zinc-950/95"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative px-6 pt-8 pb-4 border-b border-zinc-200/70 dark:border-zinc-800/70">
                <button
                  onClick={internalClose}
                  className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>

                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-black dark:text-white">
                  Stay in the loop
                </h2>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Get new essays, thoughts, and rare insights delivered straight to your inbox — no spam, ever.
                </p>
              </div>

              {/* Form – unchanged except onSubmit calls handleSubmit */}
              <form onSubmit={handleSubmit} className="p-6">
                {/* ... rest of your form code remains exactly the same ... */}
              </form>

              <div className="px-6 pb-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
                We respect your inbox. Unsubscribe anytime.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}