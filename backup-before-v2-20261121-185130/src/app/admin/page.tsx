"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import MarqueeNote from "@/components/marqueeNote";
import MarqueeNoteEditor from "@/components/admin/marqueenotes";

function HeroSkeleton() {
  return (
    <section className="mx-auto max-w-[1400px] animate-pulse px-5 py-10 md:py-14 lg:py-20">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-6 lg:col-span-5">
          <div className="flex items-center justify-between gap-4">
            <div className="h-10 w-56 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="hidden gap-3 sm:flex">
              <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>

          <div className="space-y-5">
            <div className="h-16 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800 md:h-20 lg:h-24" />
            <div className="h-5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-5 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>

          <div className="aspect-[16/10] w-full rounded-2xl bg-zinc-200 shadow-2xl ring-1 ring-black/10 dark:bg-zinc-800 dark:ring-white/10" />
        </div>

        <div className="flex flex-col space-y-8 lg:col-span-5">
          <div className="flex items-center justify-between">
            <div className="h-10 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-1 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-5">
              <div className="h-24 w-24 shrink-0 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-6 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-6 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="aspect-[3/4] rounded-2xl bg-zinc-200 shadow-2xl dark:bg-zinc-800" />
          <div className="space-y-3 px-2">
            <div className="h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-8 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#D9DCD6] font-sans antialiased dark:bg-black">
      <div className="sticky top-0 z-50 w-full">
        <Header />
        <MarqueeNote />
      </div>

      <main className="relative z-10">
        <section className="mx-auto max-w-[1400px] px-5 pt-6 md:px-6 lg:px-8">
          <MarqueeNoteEditor />
        </section>

        <HeroSkeleton />
      </main>

      <Footer />
    </div>
  );
}