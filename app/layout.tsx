import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import branding from "@/lib/branding";
import "./globals.css";

const { getBrandConfig } = branding as {
  getBrandConfig: (brand: string) => {
    key: string;
    name: string;
    tagline: string;
    apiLabel: string;
  };
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brand = getBrandConfig("aasc");

export const metadata: Metadata = {
  title: "Hygie Inventaire | Dashboard matériel",
  description:
    "Pilotage du matériel, conformité et maintenance pour sociétés d'ambulances privées et AASC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-brand={brand.key}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
