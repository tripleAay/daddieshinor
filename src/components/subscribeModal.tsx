"use client";

import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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

    setStatus("loading");
    setMessage("");

    try {
      const result = await subscribeGuest({
        name,
        email,
        source: "daddieshinor_modal",
      });

      setStatus("success");
      setMessage(result.message);

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
              className="pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/95 shadow-2xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative border-b border-zinc-200/70 px-6 pt-8 pb-4 dark:border-zinc-800/70">
                <button
                  onClick={internalClose}
                  className="absolute top-5 right-5 text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  aria-label="Close"
                  type="button"
                >
                  <X size={24} />
                </button>

                <h2 className="text-2xl font-black tracking-tight text-black md:text-3xl dark:text-white">
                  Stay in the loop
                </h2>

                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Get new essays, thoughts, and rare insights delivered straight to your inbox — no spam, ever.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="subscriber-name"
                    className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                  >
                    Name
                  </label>
                  <input
                    id="subscriber-name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subscriber-email"
                    className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
                  >
                    Email address
                  </label>
                  <input
                    id="subscriber-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>

                {message && (
                  <p
                    className={`text-sm ${
                      status === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {message}
                  </p>
                )}
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