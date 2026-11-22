"use client";

import { FormEvent, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Sparkles } from "lucide-react";
import { subscribeGuest } from "@/app/lib/subscribeGuest";

interface NewsletterCardProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  buttonText?: string;
  footerText?: string;
  source?: string;
}

export default function NewsletterCard({
  title,
  subtitle,
  badgeText = "Newsletter",
  buttonText = "Subscribe",
  footerText = "powered by fynaro tech",
  source = "daddieshinor_post_sidebar",
}: NewsletterCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const toastBase = useMemo(
    () => ({
      position: "bottom-right" as const,
      autoClose: 2600,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored" as const,
      style: {
        borderRadius: "12px",
        boxShadow: "0 10px 24px rgba(0,0,0,.12)",
        fontWeight: 700,
      },
    }),
    []
  );

  const showBrandToast = {
    success: (msg: string) =>
      toast.success(`✅ ${msg}`, {
        ...toastBase,
        className:
          "bg-[#f8f7e8] text-black border border-black/10",
      }),
    error: (msg: string) =>
      toast.error(`⚠️ ${msg}`, {
        ...toastBase,
        className:
          "bg-[#fff1f2] text-black border border-rose-200",
      }),
    loading: (msg: string) =>
      toast.loading(msg, {
        ...toastBase,
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        className:
          "bg-black text-white border border-white/10",
      }),
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) return showBrandToast.error("Enter your name.");
    if (!cleanEmail) return showBrandToast.error("Enter your email.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return showBrandToast.error("Invalid email.");
    }

    if (loading) return;
    setLoading(true);

    const toastId = showBrandToast.loading("Subscribing...");

    try {
      const result = await subscribeGuest({
        name: cleanName,
        email: cleanEmail,
        source,
      });

      toast.update(toastId, {
        render: result?.message || "You’re in 💌",
        type: "success",
        isLoading: false,
        autoClose: 2200,
      });

      setName("");
      setEmail("");
    } catch (err) {
      toast.update(toastId, {
        render:
          err instanceof Error
            ? err.message
            : "Something went wrong.",
        type: "error",
        isLoading: false,
        autoClose: 2800,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-[#f8f7e8] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-black dark:border-white/10 dark:bg-zinc-800 dark:text-white">
        <Sparkles className="h-3 w-3 text-[#968e68]" />
        {badgeText}
      </div>

      {/* Title */}
      <h3 className="mt-2 text-[15px] font-extrabold leading-snug text-black dark:text-white">
        {title}
      </h3>

      {/* Subtitle */}
      <p className="mt-1 text-[12px] leading-[1.4] text-zinc-600 dark:text-zinc-400">
        {subtitle}
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-3 space-y-2.5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="w-full h-9 rounded-lg border border-zinc-300 bg-white px-3 text-[13px] text-black outline-none placeholder:text-zinc-400 focus:border-[#968e68] focus:ring-1 focus:ring-[#968e68]/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full h-9 rounded-lg border border-zinc-300 bg-white px-3 text-[13px] text-black outline-none placeholder:text-zinc-400 focus:border-[#968e68] focus:ring-1 focus:ring-[#968e68]/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full h-9 rounded-lg bg-black text-[13px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
        >
          {loading ? "..." : buttonText}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-3 text-center text-[10px] text-zinc-500 dark:text-zinc-400">
        {footerText}
      </p>
    </div>
  );
}