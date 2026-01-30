"use client";

import Link from "next/link";
import { Menu, Search, Sun, Moon, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const nav = [
  { label: "Tech", href: "/tech" },
  { label: "Culture", href: "/culture" },
  { label: "Branding", href: "/branding" },
  { label: "Life", href: "/life" },
];

type Theme = "light" | "dark";

// ────────────────────────────────────────────────
// Subscribe Modal (embedded here for self-contained example)
// You can also extract it to components/SubscribeModal.tsx
// ────────────────────────────────────────────────
function SubscribeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
      // Replace this with your real newsletter API call
      // await fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) });
      await new Promise((r) => setTimeout(r, 1400)); // demo delay

      setStatus("success");
      setMessage("Thank you! You've been subscribed.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div
              className="
                pointer-events-auto w-full max-w-md rounded-2xl border border-zinc-200/70
                bg-white/95 shadow-2xl backdrop-blur-lg overflow-hidden
                dark:border-zinc-800/70 dark:bg-zinc-950/95
              "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative px-6 pt-8 pb-4 border-b border-zinc-200/70 dark:border-zinc-800/70">
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black dark:text-white">
                  Join the inner circle
                </h2>
                <p className="mt-2.5 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  New essays, rare thoughts, cultural deep-dives — delivered to your inbox. No spam, ever.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status !== "idle") setStatus("idle");
                    }}
                    placeholder="you@example.com"
                    required
                    disabled={status === "loading" || status === "success"}
                    className="
                      w-full px-5 py-3.5 rounded-xl border border-zinc-300 bg-white/70
                      text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/40 transition
                      dark:bg-zinc-900/70 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500
                      disabled:opacity-60
                    "
                  />

                  <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="
                      w-full py-3.5 rounded-xl font-bold text-base sm:text-lg tracking-wide
                      bg-black text-white hover:bg-zinc-800 transition-all
                      dark:bg-white dark:text-black dark:hover:bg-zinc-200
                      disabled:opacity-60 disabled:cursor-not-allowed
                    "
                  >
                    {status === "loading"
                      ? "Subscribing..."
                      : status === "success"
                      ? "You're in!"
                      : "Subscribe Now"}
                  </button>
                </div>

                {status === "success" && (
                  <p className="mt-5 text-center text-green-600 dark:text-green-400 font-medium">
                    {message}
                  </p>
                )}
                {status === "error" && (
                  <p className="mt-5 text-center text-red-600 dark:text-red-400 font-medium">
                    {message}
                  </p>
                )}
              </form>

              <div className="px-6 pb-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
                We respect your inbox. Unsubscribe anytime with one click.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ────────────────────────────────────────────────
// Header Component
// ────────────────────────────────────────────────
export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-black/90">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:h-16 lg:px-8">
          {/* Left */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              aria-label="Open menu"
              className="lg:hidden rounded-full p-2.5 hover:bg-black/5 dark:hover:bg-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
            >
              <Menu className="h-5 w-5 text-black/80 dark:text-white/80" />
            </button>

            <Link
              href="/"
              className="text-xl sm:text-2xl font-black tracking-tight text-black dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              Daddieshinor
            </Link>
          </div>

          {/* Center nav */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-5 py-2 text-sm font-semibold tracking-tight transition-all ${
                    active
                      ? "bg-black/5 dark:bg-white/10 text-black dark:text-white shadow-sm"
                      : "text-black/80 hover:text-black hover:bg-black/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-t bg-orange-500" />
                  )}
                </Link>
              );
            })}

            <div className="mx-3 h-5 w-px bg-black/10 dark:bg-white/10" />

            <Link
              href="/about"
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                isActive("/about")
                  ? "bg-black/5 dark:bg-white/10 text-black dark:text-white shadow-sm"
                  : "text-black/80 hover:text-black hover:bg-black/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60`}
            >
              About
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-black/10 bg-white/80 hover:bg-black/5 transition-all dark:border-white/10 dark:bg-black/80 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
            >
              {mounted && (theme === "dark" ? <Sun className="h-5 w-5 mx-auto" /> : <Moon className="h-5 w-5 mx-auto" />)}
            </button>

            <button
              aria-label="Search"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-black/10 bg-white/80 hover:bg-black/5 transition-all dark:border-white/10 dark:bg-black/80 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
            >
              <Search className="h-5 w-5 mx-auto" />
            </button>

            {/* Subscribe button – opens modal */}
            <button
              onClick={() => setShowSubscribe(true)}
              className="
                inline-flex items-center justify-center rounded-full bg-orange-600 px-4 py-2 text-xs sm:text-sm font-black uppercase tracking-wider text-white
                shadow-md hover:bg-orange-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 focus-visible:ring-offset-2
                dark:bg-orange-500 dark:hover:bg-orange-600
              "
            >
              Subscribe
            </button>
          </div>
        </div>
      </header>

      {/* The modal – rendered here so it's always available */}
      <SubscribeModal isOpen={showSubscribe} onClose={() => setShowSubscribe(false)} />
    </>
  );
}