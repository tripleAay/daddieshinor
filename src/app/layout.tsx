import type { Metadata } from "next";
import "./globals.css";
import { AudioProvider } from "../components/audioProvider";
import Toaster from "@/components/toaster";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Daddieshinor",
  description:
    "Where tech meets thought — Africa's leading space for culture, branding, tech & life.",

  metadataBase: new URL("https://daddieshinor.com"),

  openGraph: {
    title: "Daddieshinor",
    description:
      "Where tech meets thought — Africa's leading space for culture, branding, tech & life.",
    url: "https://daddieshinor.com",
    siteName: "Daddieshinor",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Daddieshinor – Tech, Culture & Thought",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Daddieshinor",
    description:
      "Where tech meets thought — Africa's leading space for culture, branding, tech & life.",
    images: ["/opengraph-image.png"],
  },

  icons: {
    icon: [
      { url: "/DS.png", type: "image/png", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/DS.png",
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
        {/* Favicon links */}
        <link rel="icon" href="/DS.png" type="image/png" />
        <link rel="apple-touch-icon" href="/DS.png" />
        <link rel="shortcut icon" href="/DS.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/DS.png" />

        {/* Sacramento font - loaded globally but can be applied selectively */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kavoon&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <Providers>
          <AudioProvider>
            {children}
            <Toaster />
          </AudioProvider>
        </Providers>
      </body>
    </html>
  );
}