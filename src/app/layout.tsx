import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { AppShell } from "@/components/site/app-shell";
import { getSettings } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const displayFont = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Ohm Jóga | Prémium jóga és belső egyensúly",
    template: "%s | Ohm Jóga",
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ohm Jóga",
    description: siteConfig.description,
    type: "website",
    locale: "hu_HU",
    url: siteConfig.siteUrl,
    siteName: "Ohm Jóga",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ohm Jóga",
    description: siteConfig.description,
    images: ["/twitter-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ed",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="hu">
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        <AppShell settings={settings}>{children}</AppShell>
      </body>
    </html>
  );
}
