import type { Metadata } from "next";
import "./globals.css";
import { AudioProvider } from "../components/audioProvider";
import Toaster from "@/components/toaster";
import { Providers } from "./providers";

// Import your popup component (adjust path if needed, e.g., @/components/NewsletterCard)
import NewsletterCard from "@/components/subsribers";  // ← already added

export const metadata: Metadata = {
  title: "Daddieshinor",
  description:
    "Where tech meets thought — Africa's leading space for culture, branding, tech & life.",

  metadataBase: new URL("https://daddieshinor.com"),

  // Verification for Google Search Console (URL prefix property)
  // Use ONLY the code string (no "google-site-verification=" prefix)
  verification: {
    google: "YV1g9ZuomNHfiGncDN38w7gygmaFHpRNpQLy2uG-otc",
  },

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
        <link rel="icon" href="/DS.png" type="image/png" />
        <link rel="apple-touch-icon" href="/DS.png" />
        <link rel="shortcut icon" href="/DS.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/DS.png" />
      </head>

      <body className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <Providers>  {/* ← PostHog wrapper added here */}
          <AudioProvider>
            {children}
            {/* Add the popup here – it will overlay site-wide, appear after 7s for new visitors only */}
            <NewsletterCard 
              title="Join Shina Hustlé's Letters"
              subtitle="Get exclusive updates, tech insights & culture vibes straight to your inbox – no spam, promise 💌"
              badgeText="Newsletter"
              buttonText="Subscribe Now"
              footerText="powered by fynaro tech"
            />
            <Toaster />
          </AudioProvider>
        </Providers>
      </body>
    </html>
  );
}