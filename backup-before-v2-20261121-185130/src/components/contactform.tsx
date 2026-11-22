"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "react-toastify";

type ContactFormState = {
  name: string;
  email: string;
  message: string;
};

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      message: form.message.trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to send message.");
      }

      toast.success(data?.message || "Message sent successfully.");

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:focus:ring-white"
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:focus:ring-white"
        required
      />

      <textarea
        name="message"
        placeholder="Message"
        rows={3}
        value={form.message}
        onChange={handleChange}
        className="w-full resize-none rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:focus:ring-white"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
      >
        {loading ? "Sending..." : "Send"}
        <Send size={16} />
      </button>
    </form>
  );
}