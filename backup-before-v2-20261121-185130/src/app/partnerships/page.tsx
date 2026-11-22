import type { Metadata } from "next";
import PartnershipsClient from "./PartnershipsClient";

export const metadata: Metadata = {
  title: "Partnerships – Daddieshinor",
  description:
    "Collaborate with Daddieshinor to reach thoughtful readers across Africa and beyond. Sponsored insights, brand stories, and meaningful visibility — done with integrity.",
  openGraph: {
    title: "Partnerships – Daddieshinor",
    description:
      "Collaborate with Daddieshinor to reach thoughtful readers across Africa and beyond. Sponsored insights, brand stories, and meaningful visibility — done with integrity.",
    url: "https://daddieshinor.com/partnerships",
    siteName: "Daddieshinor",
    type: "website",
    images: [
      {
        url: "/og-home.jpg", // ← replace with real OG image if you have one
        width: 1200,
        height: 630,
        alt: "Partnerships – Daddieshinor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Partnerships – Daddieshinor",
    description:
      "Collaborate with Daddieshinor to reach thoughtful readers across Africa and beyond.",
    images: ["/og-home.jpg"],
  },
};

export default function PartnershipsPage() {
  return <PartnershipsClient />;
}