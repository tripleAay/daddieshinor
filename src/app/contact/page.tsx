import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ContactForm from "@/components/contactform";
import BackButton from "@/components/back-button";
import Link from "next/link";
import { Mail, Twitter } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Contact Daddieshinor — Get in Touch",
  description:
    "Contact Daddieshinor for questions, feedback, partnerships, or collaborations.",
  alternates: { canonical: "https://daddieshinor.com/contact" },
};

export default function ContactPage() {
  return (
    <article className="min-h-screen bg-[#D9DCD6] text-black dark:bg-black dark:text-white">
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/70">
        <Header />
      </div>

      <div className="h-[80px]" />

      <main className="px-5 py-12 md:py-24">
        <div className="mx-auto max-w-[900px]">
          <BackButton />

          <nav className="mb-6 text-xs text-zinc-500">
            <Link href="/">Home</Link> / <span>Contact</span>
          </nav>

          <header className="mb-10 max-w-[520px]">
            <h1 className="text-3xl font-semibold md:text-5xl">Let’s talk.</h1>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 md:text-base">
              Ideas, collaborations, or something you're building.
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-white/60 p-4 backdrop-blur dark:border-zinc-800 dark:bg-white/5 md:p-6">
              <ContactForm />
            </div>

            <div className="space-y-6 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:hello@daddieshinor.com">
                  hello@daddieshinor.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Twitter size={16} />
                <a href="https://x.com/daddieshinor" target="_blank" rel="noreferrer">
                  @daddieshinor
                </a>
              </div>

              <p className="border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800">
                Replies within 24–48 hours.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
      <Footer />
    </article>
  );
}