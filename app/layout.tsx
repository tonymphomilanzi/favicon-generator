import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Favicon Generator — Free & Instant | FaviconKit",
  description:
    "Generate a professional favicon package in seconds. Get PNG, ICO, Apple Touch Icon, and ready-to-paste HTML — free, no signup required.",
  keywords: [
    "favicon generator",
    "free favicon maker",
    "favicon png",
    "apple touch icon generator",
    "favicon ico generator",
    "website icon generator",
  ],
  openGraph: {
    title: "Favicon Generator — Free & Instant",
    description:
      "Create your favicon package in seconds. PNG, ICO, Apple Touch Icon + HTML snippet included.",
    type: "website",
    url: "https://faviconkit.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Favicon Generator — Free & Instant",
    description: "Generate a complete favicon package in seconds. Free, no signup.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.className} antialiased`}>{children}</body>
    </html>
  );
}