// src/app/contact/page.tsx
import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ContactForm from "@/components/contactform";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Daddieshinor — Get in Touch",
  description:
    "Contact Daddieshinor for questions, feedback, partnerships, or collaborations. We read every message and respond quickly.",
  alternates: { canonical: "https://daddieshinor.com/contact" },
  openGraph: {
    title: "Contact Daddieshinor",
    description:
      "Questions, ideas, partnerships, or just want to say hello? Reach out to Daddieshinor — we read every message.",
    url: "https://daddieshinor.com/contact",
    siteName: "Daddieshinor",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Daddieshinor",
    description: "Reach out to Daddieshinor for feedback, ideas, or partnerships. We’re listening.",
  },
};

export default function ContactPage() {
  return (
    <article className="min-h-screen bg-zinc-50 text-black dark:bg-black dark:text-white">
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/85 backdrop-blur dark:border-zinc-800 dark:bg-black/75">
        <Header />
      </div>

      <div className="h-[var(--header-height,80px)]" />

      <main className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-[1100px]">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <li>
                <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-zinc-400 dark:text-zinc-600">
                ›
              </li>
              <li aria-current="page" className="font-semibold text-black dark:text-white">
                Contact
              </li>
            </ol>
          </nav>

          <header className="mb-20 max-w-[720px]">
            <div className="mb-6 h-1 w-20 rounded-full bg-black dark:bg-white" />
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Contact Daddieshinor
            </h1>
            <p className="mt-8 text-xl md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300">
              Questions, ideas, partnerships, or just want to say hello? We read every message.
            </p>
          </header>

          <div className="mx-auto max-w-[720px] space-y-20">
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">Get in Touch</h2>
              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                Whether you're a reader with feedback, a brand interested in collaboration, a writer with an idea,
                or someone who just wants to connect — we're listening.
              </p>
              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                The best way to reach us is email — we aim to respond within 48 hours (usually much faster).
              </p>
            </section>

            <ContactForm />

            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">Other Ways to Connect</h2>
              <ul className="space-y-4 text-lg text-zinc-700 dark:text-zinc-300">
                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:hello@daddieshinor.com" className="text-[#968e68] hover:underline">
                    hello@daddieshinor.com
                  </a>
                </li>
                <li>
                  <strong>X (Twitter):</strong>{" "}
                  <a
                    href="https://x.com/daddieshinor"   // 👈 brand account recommended
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#968e68] hover:underline"
                  >
                    @daddieshinor
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </article>
  );
}