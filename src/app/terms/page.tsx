// src/app/terms/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function TermsOfUsePage() {
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
              Terms of Use
            </h1>

            <p className="mt-8 text-xl md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300">
              By using Daddieshinor, you agree to these terms. Please read them carefully.
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
                Welcome to Daddieshinor. These Terms of Use ("Terms") govern your access to and use of our website, content, newsletter, and any related services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, please do not use the Service.
              </p>
            </section>

            {/* Use of the Service */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                1. Use of the Service
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>

              <ul className="space-y-3 text-lg text-zinc-700 dark:text-zinc-300">
                <li>— Use the Service in any way that violates any applicable law or regulation</li>
                <li>— Attempt to interfere with the proper working of the Service</li>
                <li>— Access or attempt to access restricted areas of the Service</li>
                <li>— Reproduce, duplicate, copy, sell, or exploit any part of the Service without our express permission</li>
                <li>— Use automated systems (bots, scrapers, etc.) to access or collect data from the Service</li>
              </ul>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                We reserve the right to terminate or suspend access to the Service without notice if we believe you have violated these Terms.
              </p>
            </section>

            {/* Intellectual Property */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                2. Intellectual Property
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                All content on Daddieshinor — including text, essays, graphics, logos, and design — is owned by us or our licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                You may not reproduce, distribute, modify, create derivative works from, publicly display, or commercially exploit any part of the Service without our prior written consent.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                Limited personal, non-commercial use is permitted (e.g., sharing links or quoting short excerpts with proper attribution).
              </p>
            </section>

            {/* Third-Party Links */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                3. Third-Party Links & Content
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                The Service may contain links to third-party websites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites or services.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                You acknowledge and agree that we shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods, or services available on or through any such sites or services.
              </p>
            </section>

            {/* Disclaimer & Limitation of Liability */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                4. Disclaimer & Limitation of Liability
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                The Service is provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that the Service will be uninterrupted, error-free, secure, or free of viruses or other harmful components.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                To the fullest extent permitted by law, Daddieshinor, its founders, writers, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, even if advised of the possibility of such damages.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                5. Changes to These Terms
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                We may revise these Terms from time to time. The updated version will be posted here with the revised date. Continued use of the Service after changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Governing Law */}
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
                6. Governing Law
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to conflict of law principles.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                Any disputes arising under these Terms shall be resolved in the courts of Lagos, Nigeria.
              </p>
            </section>

            {/* Contact */}
            <section className="space-y-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <h2 className="text-3xl font-black tracking-tight">
                Questions?
              </h2>

              <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                If you have any questions about these Terms of Use, please contact us at:
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