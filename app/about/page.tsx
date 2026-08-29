import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AboutTabs from "@/components/AboutTabs";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About | The Biology of You",
  description:
    "The Biology of You is a personalised healthcare platform connecting your genetics, blood results, health history, nutrition and lifestyle into one clear picture of you.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className={styles.about}>
        {/* ---------- Hero ---------- */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            height: "28rem",
          }}
        >
          {/* Full-bleed hero photo */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url(/hero/hero-about.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Dark scrim for text legibility, fading out toward the right */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(20,17,14,0.6) 0%, rgba(20,17,14,0.35) 38%, rgba(20,17,14,0) 65%)",
            }}
          />

          {/* Overlaid content: dots + copy */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "stretch",
              height: "100%",
            }}
          >
            {/* Vertical stack of brand dots */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.6rem",
                paddingTop: "var(--space-xl)",
                paddingLeft: "var(--space-md)",
              }}
            >
              {[
                "/branding/dots/dot-1-card.png",
                "/branding/dots/dot-2-accent-soft.png",
                "/branding/dots/dot-3-copper.png",
                "/branding/dots/dot-4-accent.png",
                "/branding/dots/dot-5-ink.png",
                "/branding/dots/dot-6-forest.png",
                "/branding/dots/dot-7-maroon.png",
                "/branding/dots/dot-8-bg.png",
              ].map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  style={{ width: "0.85rem", height: "0.85rem", borderRadius: "50%", display: "block" }}
                />
              ))}
            </div>

            {/* Copy */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "var(--space-xl)",
                paddingBottom: "var(--space-xl)",
                paddingLeft: "var(--space-md)",
                paddingRight: "var(--space-md)",
                maxWidth: "32rem",
              }}
            >
              <p className="eyebrow" style={{ color: "var(--color-card)" }}>About</p>
              <h1 style={{ lineHeight: 1.02, color: "var(--color-card)" }}>The Biology of You</h1>
              <p
                style={{
                  fontSize: "var(--step1)",
                  color: "var(--color-card)",
                  opacity: 0.85,
                  marginTop: "var(--space-sm)",
                }}
              >
                Your biology isn&rsquo;t generic.
                <br />
                Your healthcare shouldn&rsquo;t be either.
              </p>
              <div style={{ marginTop: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
                <Link href="/contact" className="btn btn-primary">
                  Begin Your Journey
                </Link>
              </div>
            </div>
          </div>
        </section>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          @media (max-width: 900px) {
            section:first-of-type {
              min-height: auto !important;
              max-height: none !important;
            }
            section:first-of-type > div:nth-child(3) {
              min-height: 60vh !important;
            }
          }
        `,
          }}
        />

        {/* ---------- Who We Are / Our Founder tabs ---------- */}
        <AboutTabs />
      </main>
      <Footer />
    </>
  );
}
