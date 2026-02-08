"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      email: String(formData.get("email") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus({ type: "success", message: "✅ Message sent successfully!" });
        form.reset();
      } else {
        setStatus({
          type: "error",
          message: `❌ Failed to send message: ${data?.error || "Unknown error"}`,
        });
      }
    } catch {
      setStatus({ type: "error", message: "❌ Something went wrong, please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-black tracking-tight">Send a Message</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="hello@yourname.com"
            className="w-full h-12 px-5 rounded-xl border border-zinc-300 bg-white text-black placeholder-zinc-500 focus:border-[#968e68] focus:ring-2 focus:ring-[#968e68]/30 outline-none transition dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-[#968e68] dark:focus:ring-[#968e68]/20"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            placeholder="Tell us what's on your mind..."
            className="w-full px-5 py-4 rounded-xl border border-zinc-300 bg-white text-black placeholder-zinc-500 focus:border-[#968e68] focus:ring-2 focus:ring-[#968e68]/30 outline-none transition resize-none dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-[#968e68] dark:focus:ring-[#968e68]/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-black px-10 py-5 text-lg font-bold text-white hover:bg-zinc-800 transition dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {status && (
        <p className={`mt-2 text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {status.message}
        </p>
      )}

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        We respect your privacy — your email will only be used to reply.
      </p>
    </section>
  );
}
