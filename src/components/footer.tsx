"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, Twitter, Youtube, Linkedin, Globe } from "lucide-react";
import LatestComponent from "@/components/latest";

export default function PostFooter() {
  const [showLatest, setShowLatest] = useState(false);

  return (
    <footer className="mt-16 md:mt-24 border-t border-zinc-200/70 dark:border-zinc-800/70 pt-12 pb-16 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm rounded-xl">
      <div className="mx-auto max-w-4xl px-5 md:px-0">
        {/* Brand & short tagline – centered */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black dark:text-white">
              Daddieshinor
            </h2>
          </Link>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Thinking space for tech, culture, brand and the questions we rarely voice.
          </p>
        </div>

        {/* Social links – centered on mobile, left-aligned on larger */}
        <div className="flex justify-center sm:justify-start items-center gap-5 sm:gap-6 mb-10">
          <a
            href="#"
            aria-label="Instagram"
            className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
          <a
            href="#"
            aria-label="X / Twitter"
            className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
          <a
            href="#"
            aria-label="YouTube"
            className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <Youtube className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
          <a
            href="/"
            aria-label="Website"
            className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <Globe className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
        </div>

        {/* Quick links – stacked on mobile, grid on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-center mb-10">
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
              Quick
            </h4>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <button
                  onClick={() => setShowLatest(true)}
                  className="hover:text-black dark:hover:text-white transition-colors"
                >
                  Latest
                </button>
              </li>
              <li>
                <Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black dark:hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
              Legal
            </h4>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-black dark:hover:text-white transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
              More
            </h4>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/advertise" className="hover:text-black dark:hover:text-white transition-colors">
                  Advertise
                </Link>
              </li>
              <li>
                <Link href="/partnerships" className="hover:text-black dark:hover:text-white transition-colors">
                  Partnerships
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1 text-center sm:text-left">
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2 sm:mt-0">
             
              Built slowly. Written thoughtfully.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className="border-t border-zinc-200/70 dark:border-zinc-800/70 bg-white/40 dark:bg-zinc-950/40 py-6">
        <div className="mx-auto max-w-4xl px-5 md:px-0 text-center text-xs text-zinc-500 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} Daddieshinor. All rights reserved.</p>
         
        </div>
      </div>
    </footer>
  );
}