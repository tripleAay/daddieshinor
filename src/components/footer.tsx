// components/Footer.tsx
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
      {/* Main */}
      <div className="mx-auto max-w-[1440px] px-6 pt-16 pb-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                Daddieshinor
              </h2>
            </Link>

            <p className="mt-4 max-w-md text-lg leading-relaxed text-zinc-300">
              A thinking space for tech, culture, work, and the quiet questions
              people don’t always say out loud.
            </p>

            {/* Social */}
            <div className="mt-8 flex items-center gap-6">
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-white transition"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="X / Twitter"
                className="hover:text-white transition"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="hover:text-white transition"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="hover:text-white transition"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="/"
                aria-label="Website"
                className="hover:text-white transition"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/latest" className="hover:text-white">Latest</Link></li>
              <li><Link href="/essays" className="hover:text-white">Essays</Link></li>
              <li><Link href="/tech" className="hover:text-white">Tech</Link></li>
              <li><Link href="/culture" className="hover:text-white">Culture</Link></li>
              <li><Link href="/thinking" className="hover:text-white">Thinking</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
              About
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-white">About Daddieshinor</Link></li>
              <li><Link href="/editorial-ethos" className="hover:text-white">Editorial Ethos</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/advertise" className="hover:text-white">Advertise</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Use</Link></li>
              <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-zinc-800 bg-zinc-950 py-6">
        <div className="mx-auto max-w-[1440px] px-6 flex flex-col gap-2 text-center text-sm text-zinc-500 md:flex-row md:justify-between md:text-left">
          <p>
            © {new Date().getFullYear()} Daddieshinor. All rights reserved.
          </p>
          <p>
            Built slowly. Written thoughtfully.
          </p>
        </div>
      </div>
    </footer>
  );
}
