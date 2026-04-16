"use client";

import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { subscribeGuest } from "@/app/lib/subscribeGuest";

const STORAGE_KEY = "daddieshinor_subscribe_seen_v1";

type SubscribeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail) {
      setStatus("error");
      setMessage("Please enter your name and email.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const result = await subscribeGuest({
        name: cleanName,
        email: cleanEmail,
        source: "daddieshinor_modal",
      });

      setStatus("success");
      setMessage(result.message || "You’re in 💌");

      setName("");
      setEmail("");

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, "true");
        sessionStorage.removeItem("daddieshinor_subscribe_closed_session");
      }

      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  const internalClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close subscribe modal overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]"
            onClick={internalClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 pointer-events-none"
          >
            <div
              className="pointer-events-auto relative w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_18px_60px_rgba(0,0,0,0.16)] dark:border-zinc-800 dark:bg-zinc-900"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={internalClose}
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:bg-zinc-50 hover:text-black dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                aria-label="Close"
                type="button"
              >
                <X size={16} />
              </button>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-[#f8f7e8] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-black dark:border-white/10 dark:bg-zinc-800 dark:text-white">
                <Sparkles className="h-3 w-3 text-[#968e68]" />
                Newsletter
              </div>

              <h2 className="mt-2 pr-8 text-[15px] font-extrabold leading-snug text-black dark:text-white">
                Stay in the loop
              </h2>

              <p className="mt-1 text-[12px] leading-[1.45] text-zinc-600 dark:text-zinc-400">
                Get new essays, thoughts, and rare insights delivered straight to
                your inbox.
              </p>

              <form onSubmit={handleSubmit} className="mt-3 space-y-2.5">
                <input
                  id="subscriber-name"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-[13px] text-black outline-none placeholder:text-zinc-400 transition focus:border-[#968e68] focus:ring-1 focus:ring-[#968e68]/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />

                <input
                  id="subscriber-email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-9 w-full rounded-lg border border-zinc-300 bg-white px-3 text-[13px] text-black outline-none placeholder:text-zinc-400 transition focus:border-[#968e68] focus:ring-1 focus:ring-[#968e68]/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-9 w-full rounded-lg bg-black text-[13px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>

                {message && (
                  <p
                    className={`text-[12px] leading-relaxed ${
                      status === "success"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </form>

              <p className="mt-3 text-center text-[10px] text-zinc-500 dark:text-zinc-400">
                We respect your inbox. Unsubscribe anytime.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}