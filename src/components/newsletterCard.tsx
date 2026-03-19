"use client";

import { useEffect, useMemo, useState } from "react";
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
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-xl font-black tracking-tight text-black dark:text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        {subtitle}
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="w-full h-12 px-5 rounded-xl border border-zinc-300 bg-white text-base outline-none focus:border-[#968e68] focus:ring-2 focus:ring-[#968e68]/30 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-[#968e68]"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-black text-white font-bold hover:bg-black/90 transition dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          {loading ? "Subscribing..." : buttonText}
        </button>
      </form>

      <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400 text-center">
        {footerText}
      </p>
    </div>
  );
}