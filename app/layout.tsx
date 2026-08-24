import type { Metadata } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

const gatherSerif = localFont({
  src: "../public/fonts/gather-serif.woff2",
  variable: "--font-gather-serif",
  display: "swap",
});

const gatherScript = localFont({
  src: "../public/fonts/gather-script.woff2",
  variable: "--font-gather-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Biology of You",
  description: "The story only your biology can tell.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plexMono.variable} ${gatherSerif.variable} ${gatherScript.variable}`}>
      <head>
        {/* Adobe Fonts (Typekit) — Neue Haas Grotesk Display & Text */}
        <link rel="stylesheet" href="https://use.typekit.net/sfo4vod.css" />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
