"use client";

import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="mb-6 flex items-center gap-2 text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
}