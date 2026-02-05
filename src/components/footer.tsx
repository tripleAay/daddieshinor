"use client";

import Link from "next/link";
import {
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Globe,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-zinc-400">
      {/* Main content */}
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-8 lg:px-12 pt-12 pb-16 md:pt-16 md:pb-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Brand + description + social */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Daddieshinor
              </h2>
            </Link>

            <p className="mt-4 max-w-md text-base sm:text-lg leading-relaxed text-zinc-300">
              A thinking space for tech, culture, work, and the quiet questions people don’t always say out loud.
            </p>

            {/* Social icons – centered on mobile, left-aligned on larger */}
            <div className="mt-6 flex justify-center sm:justify-start items-center gap-5 sm:gap-6">
              <a
                href="#"
                aria-label="Instagram"
                className="text-zinc-400 hover:text-white transition-colors duration-200"
              >
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a
                href="#"
                aria-label="X / Twitter"
                className="text-zinc-400 hover:text-white transition-colors duration-200"
              >
                <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="text-zinc-400 hover:text-white transition-colors duration-200"
              >
                <Youtube className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-zinc-400 hover:text-white transition-colors duration-200"
              >
                <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a
                href="/"
                aria-label="Website"
                className="text-zinc-400 hover:text-white transition-colors duration-200"
              >
                <Globe className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-4 sm:mb-5 text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
              Explore
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-sm">
              <li>
                <Link href="/latest" className="hover:text-white transition-colors">
                  Latest
                </Link>
              </li>
              <li>
                <Link href="/brand" className="hover:text-white transition-colors">
                  Branding
                </Link>
              </li>
              <li>
                <Link href="/tech" className="hover:text-white transition-colors">
                  Tech
                </Link>
              </li>
              <li>
                <Link href="/culture" className="hover:text-white transition-colors">
                  Culture
                </Link>
              </li>
              <li>
                <Link href="/life" className="hover:text-white transition-colors">
                  Thinking
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-4 sm:mb-5 text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
              About
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Daddieshinor
                </Link>
              </li>
              <li>
                <Link href="/editorial-ethos" className="hover:text-white transition-colors">
                  Editorial Ethos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="hover:text-white transition-colors">
                  Advertise
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 sm:mb-5 text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
              Legal
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800 bg-zinc-950 py-6">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-8 flex flex-col items-center gap-3 text-sm text-zinc-500 md:flex-row md:justify-between md:text-left">
          <p>© {new Date().getFullYear()} Daddieshinor. All rights reserved.</p>
          <p>Built slowly. Written thoughtfully.</p>
        </div>
      </div>
    </footer>
  );
}