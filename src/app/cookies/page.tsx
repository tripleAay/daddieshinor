// src/app/cookies/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

export default function CookiePolicyPage() {
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
          {/* Breadcrumb */}
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
                Cookie Policy
              </li>
            </ol>
          </nav>

          {/* Intro */}
          <header className="mb-20 max-w-[720px]">
            <div className="mb-6 h-1 w-20 rounded-full bg-black dark:bg-white" />

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Cookie Policy
            </h1>

            <p className="mt-8 text-xl md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300">
              How Daddieshinor uses cookies and similar technologies to improve your experience.
            </p>
          </header>

          {/* Main Content */}
          <div className="mx-auto max-w-[720px] space-y-20">
            {/* Last Updated */}
            <section className="space-y-6">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Last updated: February 2026
              </p>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                This Cookie Policy explains how Daddieshinor ("we", "us", or "our") uses cookies and similar technologies when you visit our website (daddieshinor.com), read our content, or interact with our services. By using our site, you consent to our use of cookies as described in this policy.
              </p>
            </section>

            {/* What Are Cookies */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                1. What Are Cookies?
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                Cookies are small text files that are placed on your device (computer, mobile phone, tablet) when you visit a website. They are widely used to make websites work more efficiently, improve user experience, and provide information to site owners.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                We use both first-party cookies (set by us) and third-party cookies (set by partners or service providers) on our site.
              </p>
            </section>

            {/* Types of Cookies We Use */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                2. Types of Cookies We Use
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    Essential Cookies
                  </h3>
                  <p className="mt-3 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    These cookies are necessary for the website to function properly. They enable core features like navigation, security, and page loading. These cookies do not store any personally identifiable information.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    Performance & Analytics Cookies
                  </h3>
                  <p className="mt-3 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    These cookies help us understand how visitors interact with our website by collecting anonymous data such as page views, time spent on pages, and bounce rates. We use tools like Plausible (privacy-friendly analytics) to gather insights and improve our content and user experience.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    Functionality Cookies
                  </h3>
                  <p className="mt-3 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    These cookies remember choices you make (such as dark/light mode preference) to provide a more personalized experience. They are optional and can be disabled.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    Third-Party Cookies
                  </h3>
                  <p className="mt-3 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    Some features on our site may use third-party cookies from embedded content (e.g., YouTube videos). These are controlled by the third party and subject to their privacy policies.
                  </p>
                </div>
              </div>
            </section>

            {/* How to Manage Cookies */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                3. How to Manage or Disable Cookies
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                You can control or delete cookies through your browser settings. Most browsers allow you to:
              </p>

              <ul className="space-y-3 text-lg text-zinc-700 dark:text-zinc-300">
                <li>— Block all cookies</li>
                <li>— Delete cookies after each visit</li>
                <li>— See which cookies are stored and delete specific ones</li>
              </ul>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                Note: Disabling essential cookies may affect the functionality of the site (e.g., layout or login features). Disabling performance cookies will not prevent you from viewing content.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                4. Changes to This Cookie Policy
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated date. Continued use of the site after changes constitutes acceptance.
              </p>
            </section>

            {/* Contact */}
            <section className="space-y-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <h2 className="text-3xl font-black tracking-tight">
                Questions?
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                If you have questions about our use of cookies or this policy, please contact us at:
              </p>

              <p className="text-xl font-semibold text-[#968e68]">
                hello@daddieshinor.com
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </article>
  );
}