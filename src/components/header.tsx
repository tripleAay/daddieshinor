// components/Header.tsx
import Link from "next/link";
import { Menu, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b border-black/10 dark:border-white/10 bg-white dark:bg-black">
      <div className="mx-auto flex h-14 md:h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Menu + Brand */}
        <div className="flex items-center gap-4">
          {/* Mobile menu */}
          <button
            aria-label="Open menu"
            className="lg:hidden rounded p-1.5 hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Brand */}
          <Link
            href="/"
            className="text-lg sm:text-xl font-semibold tracking-tight text-black dark:text-white"
          >
            Daddieshinor
          </Link>
        </div>

        {/* Center: Navigation (desktop) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-black/80 dark:text-white/80">
          <Link href="/essays" className="hover:text-black dark:hover:text-white transition">
            Essays
          </Link>
          <Link href="/tech" className="hover:text-black dark:hover:text-white transition">
            Tech
          </Link>
          <Link href="/culture" className="hover:text-black dark:hover:text-white transition">
            Culture
          </Link>
          <Link href="/branding" className="hover:text-black dark:hover:text-white transition">
            Branding
          </Link>
          <Link
            href="/about"
            className="text-black dark:text-white underline underline-offset-4"
          >
            About
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Search"
            className="hover:text-black dark:hover:text-white transition text-black/70 dark:text-white/70"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Quiet CTA (optional later) */}
          <Link
            href="/newsletter"
            className="hidden sm:inline-flex rounded-full border border-black/20 dark:border-white/20 px-4 py-1.5 text-xs font-medium text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
          >
            Subscribe
          </Link>
        </div>
      </div>
    </header>
  );
}
