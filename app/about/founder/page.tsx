import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "../about.module.css";

export const metadata: Metadata = {
  title: "Jennifer's Story | The Biology of You",
  description:
    "Jennifer Barham-Floreani D.C. — 27+ years in health and education, award-winning chiropractor, best-selling author, and founder of The Biology of You Method™.",
};

// Same six brand dots used elsewhere on the site, cycled for the awards list.
const DOT_PALETTE = [
  "/branding/dots/dot-2-accent-soft.png",
  "/branding/dots/dot-3-copper.png",
  "/branding/dots/dot-6-forest.png",
  "/branding/dots/dot-7-maroon.png",
  "/branding/dots/dot-4-accent.png",
  "/branding/dots/dot-5-ink.png",
];

const awards = [
  "Victorian Chiropractor of the Year — 2008",
  "Australian Chiropractor of the Year — 2008",
  "Woman of the Year, World Congress of Women Chiropractors — 2011",
  "Stuart Rynsburger Award for Outstanding Service to Chiropractic, UCA England — 2017",
  "Being of Light Humanitarian Award — 2017",
  "Chiropractor of the Year, Barcelona College of Chiropractic — 2020–2021",
];

export default function FounderStoryPage() {
  return (
    <>
      <Nav />
      <main className={styles.about}>
        {/* ---------- Simple text header (no stock photo standing in for Jennifer) ---------- */}
        <section className={`${styles.section} ${styles.sectionCream}`} style={{ paddingBottom: "2rem" }}>
          <div className={styles.sectionInner}>
            <p className="eyebrow" style={{ color: "var(--accent, var(--color-accent))" }}>Our Founder</p>
            <h1 style={{ lineHeight: 1.05 }}>Jennifer&rsquo;s Story</h1>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionCream}`} style={{ paddingTop: 0 }}>
          <div className={styles.sectionInner}>
            <p>
              Jennifer&rsquo;s work in health and education spans more than three decades. She is an
              established international educator in pregnancy, birth and family health, educating both
              parents and healthcare practitioners around the world.
            </p>
            <p>
              Her best-selling book, <em>Well Adjusted Babies</em>, has sold more than half a million
              copies worldwide and has been used by parents, practitioners and universities. Her career
              has also been recognised with numerous international and Australian awards, including:
            </p>

            <ul className={styles.dotList}>
              {awards.map((award, i) => (
                <li key={award}>
                  <img src={DOT_PALETTE[i % DOT_PALETTE.length]} alt="" className={styles.dotIcon} />
                  <span>{award}</span>
                </li>
              ))}
            </ul>

            <p>
              Over the past decade, Jennifer has studied and worked intensively in nutrigenomics,
              methylation, metabolism, mitochondrial function, bioenergetics and personalised health —
              ultimately leading to the development of The Biology of You Method™.
            </p>
          </div>
        </section>

        {/* ---------- From Individual Consultations to The Biology of You (alt) ---------- */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <p className={styles.heading}>From Individual Consultations to The Biology of You</p>
            <p>Jennifer&rsquo;s vision for The Biology of You extends beyond individual consultations.</p>
            <p>
              The company is developing The Biology of You Clinical Academy™, training practitioners in
              the methodology and building AI-assisted reporting systems that combine modern technology
              with human clinical reasoning — allowing a deeply personalised approach to health to reach
              more people without losing the thinking and human insight at its heart.
            </p>
            <p>The goal is simple: less guessing, more understanding — and health strategies built around the individual.</p>
          </div>
        </section>

        {/* ---------- Why the Next Generation Matters (cream) ---------- */}
        <section className={`${styles.section} ${styles.sectionCream}`}>
          <div className={styles.sectionInner}>
            <p className={styles.heading}>Why the Next Generation Matters</p>
            <p>
              This work has particular significance for Jennifer as she writes the third edition of her
              best-selling book, <em>Well Adjusted Babies</em>.
            </p>
            <p>
              For decades, she has encouraged parents to think about the foundations of health before and
              during pregnancy, and the profound opportunity this period provides to support maternal
              wellbeing and a child&rsquo;s healthy development.
            </p>
            <p>
              Jennifer believes generic advice is no longer enough. If we are asking parents to build the
              healthiest biological foundations they can for the next generation, they deserve access to
              health information and support that recognises their own genetics, physiology, nutritional
              needs and individual health story.
            </p>
            <p>
              The Biology of You Method™ brings that personalisation to life — helping people better
              understand and support their own health today, while recognising that the biological
              environment we create can also influence the foundations we pass forward to the next
              generation.
            </p>
            <p>
              While Jennifer is delighted to now be building The Biology of You alongside a team of
              practitioners, one of her greatest passions remains helping parents understand how to build
              their own health and resilience — and, in doing so, create stronger foundations for the
              next generation.
            </p>
            <p>
              And perhaps that explains why, despite all the professional recognition she has received,
              the achievement Jennifer values most has always been much closer to home.
            </p>

            <blockquote
              style={{
                margin: "2rem 0",
                padding: "0 0 0 1.5rem",
                borderLeft: "3px solid var(--accent, var(--color-accent))",
                fontStyle: "italic",
                fontSize: "1.125rem",
                lineHeight: 1.75,
              }}
            >
              &ldquo;I&rsquo;ve been fortunate to receive many awards and accolades throughout my career, all
              of which I&rsquo;m incredibly grateful for. But the role I value most is being a mum. Of all
              my privileges, my four boys are the greatest gift God entrusted me with. They are the
              clearest and finest manifestation of so much of what I continue to hold true about health,
              family and life. And I couldn&rsquo;t have been the mum I&rsquo;ve been without my incredible
              husband, Simon.&rdquo;
            </blockquote>

            <p>
              Today, Jennifer is based in Europe, where she continues to study, write, teach and develop
              The Biology of You, while working on the third edition of <em>Well Adjusted Babies</em>.
            </p>

            <div className={styles.ctaRow}>
              <Link href="/about" className={`${styles.btn} ${styles["btn--primary"]}`}>
                Back to About
              </Link>
              <Link href="/contact" className={`${styles.btn} ${styles["btn--ghost"]}`}>
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
