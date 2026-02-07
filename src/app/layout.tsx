import type { Metadata } from "next";
import "./globals.css";
import { AudioProvider } from "../components/audioProvider";

export const metadata: Metadata = {
  title: "Daddieshinor",
  description:
    "Where tech meets thought — Africa's leading space for culture, branding, tech & life.",
  icons: {
    icon: "/DS.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Plausible – Privacy-friendly analytics */}
        <script
          async
          src="https://plausible.io/js/pa-PFIhde_KI0eKufR4Lr.js"
        ></script>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.plausible = window.plausible || function() {
                (plausible.q = plausible.q || []).push(arguments);
              };
              plausible.init = plausible.init || function(i) {
                plausible.o = i || {};
              };
              plausible.init();
            `,
          }}
        />
      </head>

      <body className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  );
}
