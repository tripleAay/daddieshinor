// src/app/about/page.tsx

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black px-5 py-16 md:py-24">
      <div className="mx-auto max-w-[980px]">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-black dark:text-white mb-8">
          About Daddieshinor
        </h1>

        <p className="text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
          This is your About page. Add your mission, story, or content here.
        </p>

        {/* Add more sections as needed */}
      </div>
    </main>
  );
}