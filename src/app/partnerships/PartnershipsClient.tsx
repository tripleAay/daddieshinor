"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Home } from "lucide-react";

const ACCENT = "#968e68";

export default function PartnershipsClient() {
  const typingRef = useRef<HTMLParagraphElement>(null);
  const [typedText, setTypedText] = useState("");
  const fullText = "Reach thoughtful readers who value depth, clarity, and real insight.";

  // Typewriter effect
  useEffect(() => {
    const el = typingRef.current;
    if (!el) return;

    let interval: NodeJS.Timeout | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && typedText.length === 0) {
          let i = 0;
          interval = setInterval(() => {
            if (i < fullText.length) {
              setTypedText((prev) => fullText.slice(0, i + 1));
              i++;
            } else if (interval) {
              clearInterval(interval);
              interval = null;
            }
          }, 45); // faster typing = 45ms per char (feels natural)
        }
      },
      { threshold: 0.7, rootMargin: "0px 0px -100px 0px" } // trigger a bit earlier
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, [typedText, fullText]);

  return (
    <article className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-black dark:from-black dark:to-zinc-950 dark:text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <Header />
      </div>

      {/* Spacer */}
      <div className="h-[var(--header-height,80px)]" />

      <main className="px-5 py-12 md:py-20">
        <div className="mx-auto max-w-[1000px]"> {/* shrunk from 1100px */}
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <Link
              href="/"
              className="hover:text-[#968e68] transition-colors flex items-center gap-1.5"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <span className="text-zinc-400 dark:text-zinc-600">/</span>
            <span className="font-medium text-black dark:text-white">Partnerships</span>
          </nav>

          {/* Intro – more compact */}
          <header className="mb-16 max-w-[720px]">
            <div className="mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-[#968e68] to-[#968e68]/40" />

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Partnerships
            </h1>

            <p
              ref={typingRef}
              className="mt-6 text-xl md:text-2xl leading-relaxed font-medium"
              style={{ color: ACCENT }}
            >
              {typedText}
              <span className="animate-blink">|</span>
            </p>
          </header>

          {/* Main Content – tighter spacing */}
          <div className="space-y-16">
            {/* Intro Paragraph */}
            <section className="space-y-6">
              <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300">
                Daddieshinor is a growing community of curious, reflective people across Africa and beyond. They read for meaning, not just noise. If your brand, product, or idea aligns with depth, integrity, and long-term thinking, a partnership here can feel natural and valuable — not forced.
              </p>
            </section>

            {/* What We Offer */}
            <section className="space-y-10">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                What a partnership can look like
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    title: "Sponsored Essay / Deep-Dive",
                    desc: "A thoughtful, long-form piece written by you or in collaboration with us. Published in our essays section and promoted to subscribers.",
                  },
                  {
                    title: "Newsletter Mention / Takeover",
                    desc: "A dedicated shoutout or short sponsored section in Daddieshinor Letters — reaching thousands directly in their inbox.",
                  },
                  {
                    title: "Branded Series or Column",
                    desc: "Recurring content under your brand — builds ongoing association and trust.",
                  },
                  {
                    title: "Custom Collaboration",
                    desc: "Interviews, roundtables, giveaways, co-created content — anything authentic to both sides.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#968e68]/30 dark:border-zinc-800/50 dark:bg-zinc-900/60 dark:hover:border-[#968e68]/40"
                  >
                    <h3 className="text-xl md:text-2xl font-bold group-hover:text-[#968e68] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-base md:text-lg text-zinc-600 dark:text-zinc-400">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Who It's For */}
            <section className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Who we usually work with
              </h2>

              <ul className="space-y-5 text-lg md:text-xl text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#968e68] flex-shrink-0" />
                  Companies building thoughtful tools, platforms, or services
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#968e68] flex-shrink-0" />
                  Creators, educators, or founders with meaningful stories
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#968e68] flex-shrink-0" />
                  Books, courses, or products centered on personal growth
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#968e68] flex-shrink-0" />
                  Brands that value clarity, depth, and long-term relationships
                </li>
              </ul>

              <p className="text-lg md:text-xl italic text-zinc-600 dark:text-zinc-400 border-l-4 border-[#968e68]/40 pl-5">
                We say no to gambling, crypto scams, get-rich-quick schemes, adult content, or anything misaligned with our voice.
              </p>
            </section>

            {/* How It Works */}
            <section className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                How we work together
              </h2>

              <ol className="space-y-6 text-lg md:text-xl text-zinc-700 dark:text-zinc-300 list-decimal pl-6 marker:text-[#968e68] marker:font-black">
                <li>
                  <strong className="text-black dark:text-white">Reach out.</strong> Email us at{" "}
                  <a
                    href="mailto:hello@daddieshinor.com"
                    className="text-[#968e68] hover:underline font-medium"
                  >
                    hello@daddieshinor.com
                  </a>{" "}
                  with a short description of your idea / brand.
                </li>
                <li>
                  <strong className="text-black dark:text-white">We talk.</strong> If there’s alignment, we’ll schedule a quick call to discuss format, audience fit, and timeline.
                </li>
                <li>
                  <strong className="text-black dark:text-white">We create & publish.</strong> We handle publishing, promotion, and subscriber delivery. You focus on the message.
                </li>
                <li>
                  <strong className="text-black dark:text-white">Transparency.</strong> Pricing and deliverables are agreed upfront. No hidden fees.
                </li>
              </ol>
            </section>

            {/* CTA */}
            <section className="pt-12 border-t border-zinc-200 dark:border-zinc-800 text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Let’s build something meaningful
              </h2>

              <p className="text-xl md:text-2xl text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto">
                If you believe in thoughtful content and long-term relationships, we’d love to hear from you.
              </p>

              <Link
                href="mailto:hello@daddieshinor.com?subject=Partnership%20Inquiry"
                className="
                  inline-flex items-center gap-3 rounded-full bg-black px-8 py-5 text-lg md:text-xl font-bold text-white
                  hover:bg-zinc-800 transition shadow-md hover:shadow-lg dark:bg-white dark:text-black dark:hover:bg-zinc-200
                "
              >
                Email us → hello@daddieshinor.com
              </Link>

              <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400">
                We usually respond within 48–72 hours.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </article>
  );
}