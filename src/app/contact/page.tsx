// src/app/contact/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

export default function ContactPage() {
  return (
    <article className="min-h-screen bg-zinc-50 text-black dark:bg-black dark:text-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/85 backdrop-blur dark:border-zinc-800 dark:bg-black/75">
        <Header />
      </div>

      {/* Spacer */}
      <div className="h-[var(--header-height,80px)]" />

      <main className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-[1100px]">
          {/* Intro */}
          <header className="mb-20 max-w-[720px]">
            <div className="mb-6 h-1 w-20 rounded-full bg-black dark:bg-white" />

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Contact Daddieshinor
            </h1>

            <p className="mt-8 text-xl md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300">
              Questions, ideas, partnerships, or just want to say hello? We read every message.
            </p>
          </header>

          {/* Main Content */}
          <div className="mx-auto max-w-[720px] space-y-20">
            {/* How to Reach Us */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                Get in Touch
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                Whether you're a reader with feedback, a brand interested in collaboration, a writer with an idea, or someone who just wants to connect — we're listening.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                The best way to reach us is email — we aim to respond within 48 hours (usually much faster).
              </p>
            </section>

            {/* Contact Form */}
            <section className="space-y-8">
              <h2 className="text-3xl font-black tracking-tight">
                Send a Message
              </h2>

              <form className="space-y-6">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="hello@yourname.com"
                    className="w-full h-12 px-5 rounded-xl border border-zinc-300 bg-white text-black placeholder-zinc-500 focus:border-[#968e68] focus:ring-2 focus:ring-[#968e68]/30 outline-none transition dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-[#968e68] dark:focus:ring-[#968e68]/20"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    placeholder="Tell us what's on your mind..."
                    className="w-full px-5 py-4 rounded-xl border border-zinc-300 bg-white text-black placeholder-zinc-500 focus:border-[#968e68] focus:ring-2 focus:ring-[#968e68]/30 outline-none transition resize-none dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-[#968e68] dark:focus:ring-[#968e68]/20"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-black px-10 py-5 text-lg font-bold text-white hover:bg-zinc-800 transition dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Send Message
                </button>
              </form>

              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                We respect your privacy — your email will only be used to reply.
              </p>
            </section>

            {/* Alternative Ways */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                Other Ways to Connect
              </h2>

              <ul className="space-y-4 text-lg text-zinc-700 dark:text-zinc-300">
                <li>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:hello@daddieshinor.com"
                    className="text-[#968e68] hover:underline"
                  >
                    hello@daddieshinor.com
                  </a>
                </li>
                <li>
                  <strong>X (Twitter):</strong>{" "}
                  <a
                    href="https://x.com/Aaytriple"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#968e68] hover:underline"
                  >
                    @Aaytriple
                  </a>
                </li>
                <li>
                  <strong>Partnerships & Advertising:</strong>{" "}
                  <Link href="/advertise" className="text-[#968e68] hover:underline">
                    Visit our Advertise page →
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </article>
  );
}