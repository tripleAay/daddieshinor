// src/app/advertise/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

export default function AdvertisePage() {
  return (
    <article className="min-h-screen bg-zinc-50 text-black dark:bg-black dark:text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/85 backdrop-blur dark:border-zinc-800 dark:bg-black/75">
        <Header />
      </div>

      {/* Spacer for fixed header */}
      <div className="h-[var(--header-height,80px)]" />

      <main className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-[1100px]">
          {/* Breadcrumbs */}
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
                Advertise
              </li>
            </ol>
          </nav>

          {/* Intro / Manifesto */}
          <header className="mb-20 max-w-[720px]">
            <div className="mb-6 h-1 w-20 rounded-full bg-black dark:bg-white" />

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Advertise with Daddieshinor
            </h1>

            <p className="mt-8 text-xl md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300">
              Reach thoughtful readers who value clarity, meaning, and long-term thinking.
            </p>
          </header>

          {/* Flowing Content */}
          <div className="mx-auto max-w-[720px] space-y-24">
            {/* Why Advertise Here */}
            <section className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Why Brands Choose Daddieshinor
              </h2>

              <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300">
                Daddieshinor isn’t mass media. It’s a curated space for people who think deeply — decision-makers, builders, creators, and leaders across Africa and beyond.
              </p>

              <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300">
                When you partner with us, your message reaches an audience that:
              </p>

              <ul className="space-y-4 text-lg md:text-xl text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-black dark:bg-white flex-shrink-0" />
                  Values substance over flash
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-black dark:bg-white flex-shrink-0" />
                  Trusts thoughtful analysis
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-black dark:bg-white flex-shrink-0" />
                  Seeks brands that align with meaning and progress
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-black dark:bg-white flex-shrink-0" />
                  Is tired of noise and ready for real conversations
                </li>
              </ul>
            </section>

            {/* What We Offer */}
            <section className="space-y-10">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Partnership Formats
              </h2>

              <div className="grid gap-10 md:gap-12">
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Sponsored Essays
                  </h3>
                  <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    Long-form content written by our team — exploring your brand, product, or vision with depth and honesty. No fluff. Real insight.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Branded Series
                  </h3>
                  <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    Multi-part series on topics that matter to your audience — technology, culture, leadership, innovation, trust, or future-building.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Newsletter Features
                  </h3>
                  <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    Placement in Daddieshinor Letters — reaching subscribers who actively want thoughtful updates.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Custom Collaborations
                  </h3>
                  <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    Events, interviews, research-backed reports, or co-branded content — designed around your goals.
                  </p>
                </div>
              </div>
            </section>

            {/* Values & Integrity */}
            <section className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Our Commitment
              </h2>

              <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300">
                Every partnership is built on trust and alignment. We only work with brands that:
              </p>

              <ul className="space-y-4 text-lg md:text-xl text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-black dark:bg-white flex-shrink-0" />
                  Respect our readers’ intelligence
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-black dark:bg-white flex-shrink-0" />
                  Have something meaningful to say
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-black dark:bg-white flex-shrink-0" />
                  Value long-term reputation over short-term clicks
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-black dark:bg-white flex-shrink-0" />
                  Are transparent and authentic
                </li>
              </ul>

              <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 border-l-4 border-black dark:border-white pl-5 italic">
                No clickbait. No misleading claims. No native ads disguised as editorial content.
              </p>
            </section>

            {/* Call to Action */}
            <section className="space-y-10 pt-12 border-t border-zinc-200 dark:border-zinc-800">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Ready to Collaborate?
              </h2>

              <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300">
                If your brand stands for something real and wants to reach people who care about real ideas — let’s talk.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-black px-10 py-5 text-lg md:text-xl font-bold text-white hover:bg-zinc-800 transition dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-lg hover:shadow-xl"
                >
                  Get in Touch
                </Link>

                <Link
                  href="/partnerships"
                  className="inline-flex items-center justify-center rounded-full border-2 border-black px-10 py-5 text-lg md:text-xl font-bold hover:bg-black hover:text-white transition dark:border-white dark:hover:bg-white dark:hover:text-black shadow-md hover:shadow-lg"
                >
                  View Partnership Guidelines →
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </article>
  );
}