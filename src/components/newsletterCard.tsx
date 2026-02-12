"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";

interface NewsletterCardProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  buttonText?: string;
  footerText?: string;
}

export default function NewsletterCard({
  title,
  subtitle,
  badgeText = "Newsletter",
  buttonText = "Subscribe",
  footerText = "powered by fynaro tech",
}: NewsletterCardProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl = useMemo(() => {
    // Fallback for dev if env is missing
    return (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
  }, []);

  const toastBase = useMemo(
    () => ({
      position: "bottom-right" as const,
      autoClose: 2800,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored" as const,
      // Brand styling (cream -> warm, bold type, soft shadow)
      style: {
        borderRadius: "14px",
        boxShadow: "0 12px 30px rgba(0,0,0,.12)",
        fontWeight: 800,
        letterSpacing: ".01em",
      },
    }),
    []
  );

  const showBrandToast = {
    success: (msg: string) =>
      toast.success(`✅ ${msg}`, {
        ...toastBase,
        className:
          "bg-gradient-to-b from-[#f8f7e8] to-[#f0efd8] text-black border border-black/10",
      }),
    error: (msg: string) =>
      toast.error(`⚠️ ${msg}`, {
        ...toastBase,
        className:
          "bg-gradient-to-b from-[#fff1f2] to-[#ffe4e6] text-black border border-rose-200",
      }),
    info: (msg: string) =>
      toast.info(`✨ ${msg}`, {
        ...toastBase,
        className:
          "bg-gradient-to-b from-[#ecfeff] to-[#cffafe] text-black border border-cyan-200",
      }),
    loading: (msg: string) =>
      toast.loading(msg, {
        ...toastBase,
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        className:
          "bg-gradient-to-b from-[#111827] to-[#0b1220] text-white border border-white/10",
      }),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      showBrandToast.error("Please enter your email.");
      return;
    }

    // quick sanity check (keeps UX nice)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showBrandToast.error("That email doesn’t look valid.");
      return;
    }

    if (loading) return;
    setLoading(true);

    const toastId = showBrandToast.loading("Subscribing you to Daddieshinor Letters…");

    try {
      const res = await fetch(`${apiUrl}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      // handle both JSON and non-JSON responses safely
      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (!res.ok) {
        const msg =
          data?.detail ||
          data?.message ||
          (res.status === 409 ? "You’re already subscribed 💛" : "Subscription failed. Try again.");
        throw new Error(msg);
      }

      toast.update(toastId, {
        render: "You’re in! Welcome to the Letters 💌",
        type: "success",
        isLoading: false,
        autoClose: 2600,
        className:
          "bg-gradient-to-b from-[#f8f7e8] to-[#f0efd8] text-black border border-black/10",
      });

      setEmail("");
    } catch (err: any) {
      toast.update(toastId, {
        render: err?.message || "Something went wrong. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3200,
        className:
          "bg-gradient-to-b from-[#fff1f2] to-[#ffe4e6] text-black border border-rose-200",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-gradient-to-b from-[#f8f7e8] to-[#f0efd8] p-6 shadow-md dark:border-zinc-700/60 dark:from-zinc-900/80 dark:to-zinc-900/60">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-black/80 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-950/80 dark:text-white/80">
        {badgeText}
      </div>

      {/* Title */}
      <h3 className="mt-4 text-xl font-black leading-tight">{title}</h3>

      {/* Subtitle */}
      <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
        {subtitle}
      </p>

      {/* Form */}
      <form className="mt-5 flex items-center gap-2" onSubmit={handleSubmit}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="h-10 w-full rounded-lg border border-black/15 bg-white/90 px-3.5 text-sm outline-none focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/20 dark:border-white/15 dark:bg-zinc-800/90 dark:focus:border-orange-400/40 dark:focus:ring-orange-400/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-10 shrink-0 rounded-lg bg-gradient-to-b from-black to-zinc-900 px-5 text-sm font-black text-white hover:from-zinc-900 hover:to-black dark:from-white dark:to-zinc-200 dark:text-black dark:hover:from-zinc-200 dark:hover:to-white transition disabled:opacity-60"
        >
          {loading ? "Subscribing..." : buttonText}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-5 flex justify-end text-[11px] text-black/40 dark:text-white/40">
        <span>{footerText}</span>
      </div>
    </div>
  );
}
