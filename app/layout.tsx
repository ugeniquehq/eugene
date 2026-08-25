import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

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
    <html lang="en">
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
