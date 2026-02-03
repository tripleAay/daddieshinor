// src/app/about/page.tsx
import Header from "@/components/header";
import Image from "next/image";
import Footer from "@/components/footer";

export default function AboutPage() {
  return (
    <article className="min-h-screen bg-zinc-50 text-black dark:bg-black dark:text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/85 backdrop-blur dark:border-zinc-800 dark:bg-black/75">
        <Header />
      </div>

      {/* Spacer */}
      <div className="h-[var(--header-height,80px)]" />

      <main className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-[1100px]">
          {/* Intro / Manifesto */}
          <header className="mb-20 max-w-[720px]">
            <div className="mb-6 h-1 w-20 rounded-full bg-black dark:bg-white" />

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              About Daddieshinor
            </h1>

            <p className="mt-8 text-xl md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300">
              Daddieshinor is not a publication chasing attention. It is a place
              for thinking clearly in a noisy world.
            </p>
          </header>

          {/* Flowing Editorial Content */}
          <div className="mx-auto max-w-[720px] space-y-20">
            {/* Intro */}
            <section className="space-y-6">
              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                We live in an era of constant updates and very little meaning.
                Information moves fast. Understanding doesn’t. Daddieshinor
                exists to slow things down to look past headlines and ask better
                questions about what technology, culture, life, and brands are
                actually doing to people.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                This isn’t about being first. It’s about being thoughtful. And
                getting it right.
              </p>
            </section>

            {/* What This Is */}
            <section id="what-this-is" className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                What This Is
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                Daddieshinor sits at the intersection of technology, culture,
                life, and brands not to report faster, but to understand deeper.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                Every piece published here begins with a simple question:
              </p>

              <div className="rounded-2xl bg-zinc-50 p-6 ring-1 ring-zinc-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
                <p className="text-xl md:text-2xl font-black">
                  What does this really change for people?
                </p>
              </div>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                We focus on patterns instead of noise. Intentions instead of
                hype. Consequences instead of announcements.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                If something doesn’t meaningfully affect how people think, live,
                build, or decide it doesn’t belong here.
              </p>
            </section>

            {/* Why It Exists */}
            <section id="why-it-exists" className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                Why It Exists
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                The world doesn’t need more recycled narratives about technology.
                It needs original thinking rooted in real contexts, real people,
                and real futures.
              </p>

              <ul className="space-y-3 text-lg text-zinc-700 dark:text-zinc-300">
                <li>
                  — Decode technology beyond specs, launches, and press releases
                </li>
                <li>
                  — Read culture beneath trends, virality, and surface behavior
                </li>
                <li>
                  — Reflect on life without pretending to have all the answers
                </li>
                <li>
                  — Think about brands as systems of meaning, not just marketing
                  tools
                </li>
              </ul>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                This is not hot-take journalism. It is not trend-chasing content.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                It is writing for people who want to think better not just know
                more.
              </p>
            </section>

            {/* Who’s Behind It */}
            <section id="whos-behind-it" className="space-y-8">
              <h2 className="text-3xl font-black tracking-tight">
                Who’s Behind It
              </h2>

              <div className="flex items-center gap-5">
                <div className="shrink-0">
                  <div className="h-24 w-24 overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                    <Image
                      src="/shine.jpg"
                      alt="Shina Hustle"
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                      priority
                    />
                  </div>
                </div>

                <div className="leading-tight">
                  <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    Shina Hustle
                  </p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Founder & Writer
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                  Daddieshinor is founded and written by Shina Hustle, a thinker
                  and builder deeply interested in how systems shape people, and
                  how people quietly reshape systems in return.
                </p>

                <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                  This platform carries a personal voice, but not a personal
                  agenda.
                </p>
              </div>
            </section>

            {/* Long View */}
            <section id="the-long-view" className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                The Long View
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                This is a long game. And if you’re here, you’re already part of
                it.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </article>
  );
}
