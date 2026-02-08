// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AudioProvider } from "../components/audioProvider";

export const metadata: Metadata = {
  title: "Daddieshinor",
  description:
    "Where tech meets thought — Africa's leading space for culture, branding, tech & life.",
  icons: {
    icon: [
      { url: "/DS.png", type: "image/png", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/DS.png", // for iOS home screen
    shortcut: "/DS.png",
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
        {/* Plausible Analytics */}
        <script
          defer
          data-domain="daddieshinor.com"
          src="https://plausible.io/js/plausible.js"
        ></script>

        {/* Favicons & social icons */}
        <link rel="icon" href="/DS.png" type="image/png" />
        <link rel="apple-touch-icon" href="/DS.png" />
        <link rel="shortcut icon" href="/DS.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/DS.png" />
      </head>

      <body className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  );
}
