"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const nav = [
  { label: "Tech", href: "/tech" },
  { label: "Culture", href: "/culture" },
  { label: "Branding", href: "/branding" },
  { label: "Life", href: "/life" },
];

type Theme = "light" | "dark";

function applyTheme(next: Theme) {
  const root = document.documentElement;
  if (next === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  useEffect(() => {
    setMounted(true);

    const stored = localStorage.getItem("theme") as Theme | null;
    const prefersDark =
      window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial: Theme = stored ?? (prefersDark ? "dark" : "light");

    setTheme(initial);
    applyTheme(initial);
  }, []);

  // Optional: if user didn't choose a theme, follow system changes
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return; // user has preference

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next: Theme = media.matches ? "dark" : "light";
      setTheme(next);
      applyTheme(next);
    };

    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  const [q, setQ] = useState("");
  const searchHref = useMemo(
    () => `/search?q=${encodeURIComponent(q.trim())}`,
    [q]
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-black/90">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:h-16 lg:px-8">
        {/* Left: menu + brand */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            aria-label="Open menu"
            className="lg:hidden rounded-full p-2.5 hover:bg-black/5 dark:hover:bg-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
          >
            <Menu className="h-5 w-5 text-black/80 dark:text-white/80" />
          </button>

          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-95 transition"
            aria-label="Daddieshinor Home"
          >
            <span className="relative h-8 w-8 sm:h-9 sm:w-9 overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10 bg-zinc-100 dark:bg-zinc-900">
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src="/ds.jpg"
                  alt="Daddieshinor"
                  fill
                  sizes="48px"
                  className="object-cover"
                  priority
                />
              </div>


            </span>

            <span className="text-xl sm:text-2xl font-black tracking-tight text-black dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              Daddieshinor
            </span>
          </Link>
        </div>

        {/* Center nav */}
        <nav className="hidden lg:flex items-center gap-1.5 ml-2">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-5 py-2 text-sm font-semibold tracking-tight transition-all ${active
                  ? "bg-black/5 dark:bg-white/10 text-black dark:text-white shadow-sm"
                  : "text-black/80 hover:text-black hover:bg-black/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60`}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-t bg-orange-500" />
                )}
              </Link>
            );
          })}

          <div className="mx-3 h-5 w-px bg-black/10 dark:bg-white/10" />

          <Link
            href="/about"
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${isActive("/about")
              ? "bg-black/5 dark:bg-white/10 text-black dark:text-white shadow-sm"
              : "text-black/80 hover:text-black hover:bg-black/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60`}
          >
            About
          </Link>
        </nav>

        {/* Long search bar */}
        <div className="flex-1 hidden md:flex justify-center">
          <div className="w-full max-w-[720px] lg:max-w-[860px]">
            <form
              action="/search"
              className="relative"
              onSubmit={(e) => {
                if (!q.trim()) e.preventDefault();
              }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/60 dark:text-white/60" />
              <input
                suppressHydrationWarning
                name="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search essays, ideas, culture, tech..."
                autoComplete="off"
                spellCheck={false}
                className="h-11 w-full rounded-full border border-black/10 bg-white/80 pl-12 pr-4 text-sm font-medium text-black placeholder:text-black/45 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500/30 dark:border-white/10 dark:bg-black/60 dark:text-white dark:placeholder:text-white/40"
              />
            </form>
          </div>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href={q.trim() ? searchHref : "/search"}
            aria-label="Search"
            className="md:hidden h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-black/10 bg-white/80 hover:bg-black/5 transition-all dark:border-white/10 dark:bg-black/80 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 grid place-items-center"
          >
            <Search className="h-5 w-5" />
          </Link>

          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-black/10 bg-white/80 hover:bg-black/5 transition-all dark:border-white/10 dark:bg-black/80 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-5 w-5 mx-auto" />
              ) : (
                <Moon className="h-5 w-5 mx-auto" />
              )
            ) : null}
          </button>
        </div>
      </div>

      {/* Mobile search row */}
      <div className="md:hidden border-t border-black/5 dark:border-white/10 px-4 pb-3 pt-3">
        <form
          action="/search"
          className="relative"
          onSubmit={(e) => {
            if (!q.trim()) e.preventDefault();
          }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/60 dark:text-white/60" />
          <input
            suppressHydrationWarning
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Daddieshinor..."
            autoComplete="off"
            spellCheck={false}
            className="h-11 w-full rounded-full border border-black/10 bg-white/80 pl-12 pr-4 text-sm font-medium text-black placeholder:text-black/45 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500/30 dark:border-white/10 dark:bg-black/60 dark:text-white dark:placeholder:text-white/40"
          />
        </form>
      </div>
    </header>
  );
}
