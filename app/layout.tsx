import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const gatherSerif = localFont({
  src: "../public/fonts/Gather_Collector_s_Edition_Serif.woff",
  variable: "--font-gather-serif",
  display: "swap",
});

const gatherScript = localFont({
  src: "../public/fonts/Gather_Collector_s_Edition_Script.woff",
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
    <html lang="en" className={`${gatherSerif.variable} ${gatherScript.variable}`}>
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
