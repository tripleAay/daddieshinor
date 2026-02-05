// src/app/privacy/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>

            <p className="mt-8 text-xl md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300">
              We take your privacy seriously. This policy explains what we collect, how we use it, and how we protect it.
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
                Daddieshinor is committed to protecting your privacy. This Privacy Policy outlines the types of personal information we collect when you visit our site, subscribe to our newsletter, or interact with our content, and how we use, store, and protect that information.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                1. Information We Collect
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold">
                    Information You Provide
                  </h3>
                  <p className="mt-3 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    When you subscribe to Daddieshinor Letters or contact us, we may collect:
                  </p>
                  <ul className="mt-4 space-y-3 text-lg text-zinc-700 dark:text-zinc-300">
                    <li>— Your email address</li>
                    <li>— Your name (if provided)</li>
                    <li>— Any message or details you send us</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold">
                    Automatically Collected Information
                  </h3>
                  <p className="mt-3 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    When you visit our site, we may automatically collect:
                  </p>
                  <ul className="mt-4 space-y-3 text-lg text-zinc-700 dark:text-zinc-300">
                    <li>— IP address and browser/device type</li>
                    <li>— Pages visited and time spent</li>
                    <li>— Referral source (where you came from)</li>
                    <li>— Cookies and similar tracking technologies (see Cookies section)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                2. How We Use Your Information
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                We use your information only for the following purposes:
              </p>

              <ul className="space-y-3 text-lg text-zinc-700 dark:text-zinc-300">
                <li>— To deliver our newsletter and content updates</li>
                <li>— To respond to your messages or inquiries</li>
                <li>— To improve our site, content, and user experience</li>
                <li>— To understand how visitors use our site (anonymized analytics)</li>
                <li>— To prevent spam, abuse, or security issues</li>
              </ul>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                We never sell, rent, or trade your personal information to third parties.
              </p>
            </section>

            {/* Cookies & Tracking */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                3. Cookies & Similar Technologies
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                We use minimal cookies and tracking technologies to enhance your experience:
              </p>

              <ul className="space-y-3 text-lg text-zinc-700 dark:text-zinc-300">
                <li>— Essential cookies (to remember your preferences like dark mode)</li>
                <li>— Analytics cookies (anonymous usage data via privacy-friendly tools)</li>
              </ul>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                You can control cookies through your browser settings. We do not use targeted advertising cookies.
              </p>
            </section>

            {/* Third Parties */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                4. Third-Party Services
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                We use trusted third-party services to operate our site:
              </p>

              <ul className="space-y-3 text-lg text-zinc-700 dark:text-zinc-300">
                <li>— Newsletter delivery (e.g., via a secure provider)</li>
                <li>— Analytics (privacy-focused, anonymized)</li>
                <li>— Hosting & infrastructure (secure cloud providers)</li>
              </ul>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                These services are bound by strict privacy agreements and do not use your data for their own purposes.
              </p>
            </section>

            {/* Your Rights */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                5. Your Rights
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                You have the right to:
              </p>

              <ul className="space-y-3 text-lg text-zinc-700 dark:text-zinc-300">
                <li>— Access, correct, or delete your personal data</li>
                <li>— Unsubscribe from our newsletter at any time</li>
                <li>— Object to certain uses of your data</li>
              </ul>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                To exercise these rights, email us at hello@daddieshinor.com.
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                6. Changes to This Policy
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                We may update this policy from time to time. Changes will be posted here with the updated date. We encourage you to review it periodically.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                Continued use of our site after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact */}
            <section className="space-y-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <h2 className="text-3xl font-black tracking-tight">
                Questions?
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                If you have any questions about this Privacy Policy or our practices, contact us at:
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