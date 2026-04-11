import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Favicon Generator — Free & Instant | FaviconKit",
  description:
    "Generate a professional favicon package in seconds. Get PNG, ICO, Apple Touch Icon, and ready-to-paste HTML — free, no signup required.",
  keywords: [
    "favicon generator",
    "free favicon maker",
    "favicon png",
    "apple touch icon generator",
    "website icon generator",
  ],
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
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}