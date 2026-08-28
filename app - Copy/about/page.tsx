import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About | The Biology of You",
  description:
    "Your biology isn't generic. Your healthcare shouldn't be either. Learn how The Biology of You builds a personalised health blueprint from your genetics, metabolism, blood markers and history.",
};

// Same six brand dots used in the homepage icon strip, cycled for any bulleted list on this page.
const DOT_PALETTE = [
  "/branding/dots/dot-2-accent-soft.png",
  "/branding/dots/dot-3-copper.png",
  "/branding/dots/dot-6-forest.png",
  "/branding/dots/dot-7-maroon.png",
  "/branding/dots/dot-4-accent.png",
  "/branding/dots/dot-5-ink.png",
];

const biologyItems = [
  "Your genetics.",
  "Your metabolism.",
  "Your blood markers.",
  "Your health history.",
  "Your food.",
  "Your lifestyle.",
  "Your environment.",
  "And the way your body has adapted to all of it.",
];

const offerItems = [
  "DNA and genetic pathways",
  "Blood markers",
  "Comprehensive health and family history",
  "Current symptoms and health goals",
  "Food and nutritional intake",
  "Supplements",
  "Lifestyle, movement, sleep and stress",
  "Metabolic clues, including body temperature and energy patterns",
];

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

        {/* ---------- 1. Opening (cream) ---------- */}
        <section className={`${styles.section} ${styles.sectionCream}`}>
          <div className={styles.sectionInner}>
            <p>Maybe you&rsquo;ve followed the traditional advice.</p>
            <p>Or maybe you&rsquo;ve done the exact opposite.</p>

            <p>
              You&rsquo;ve cleaned up your diet. Tracked your sleep. Tested
              your hormones. Taken the supplements. Tried fasting, keto,
              plant-based, carnivore or whatever protocol made the most
              compelling argument at the time.
            </p>

            <p>
              Perhaps you own a wearable that knows more about your sleep
              than your partner does.
            </p>

            <p>
              You&rsquo;ve listened to the podcasts. Read the books. Followed
              the experts. Optimised your morning light, your protein, your
              steps, your glucose, your cold exposure and possibly your
              entire morning before most people have made coffee.
            </p>

            <p className={styles.heading}>
              And yet, something still doesn&rsquo;t quite add up.
            </p>
          </div>
        </section>

        {/* ---------- 2. Tired / good — You. (alt) ---------- */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <p className={styles.heading}>
              Maybe you&rsquo;re tired.
            </p>

            <p>
              Maybe your hormones feel unpredictable. Your digestion
              isn&rsquo;t great. Your sleep isn&rsquo;t restorative. Your
              weight doesn&rsquo;t respond the way it used to. Your brain
              isn&rsquo;t as sharp. Your resilience has changed.
            </p>

            <p className={styles.heading}>
              Or perhaps you actually feel pretty good.
            </p>

            <p>
              You simply want to understand your body better &mdash; and
              stop making health decisions based on what works for everybody
              else.
            </p>

            <p>
              Because whether you&rsquo;ve followed conventional health
              advice or embraced every biohack available, there is one
              rather important variable that is often missing:
            </p>

            <p className={styles.heading}>You.</p>
          </div>
        </section>

        {/* ---------- 3. We begin with your biology (cream) ---------- */}
        <section className={`${styles.section} ${styles.sectionCream}`}>
          <div className={styles.sectionInner}>
            <p>
              At The Biology of You, we don&rsquo;t begin with what is
              supposed to work.
            </p>
            <p className={styles.heading}>We begin with your biology.</p>

            <ul className={styles.dotList}>
              {biologyItems.map((item, i) => (
                <li key={item}>
                  <img src={DOT_PALETTE[i % DOT_PALETTE.length]} alt="" className={styles.dotIcon} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- 4. No universal protocol (alt) ---------- */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <p>
              Because there is no universally perfect diet, supplement
              protocol, exercise routine or path to feeling well.
            </p>
            <p>
              There is only what makes sense for the biology in front of us.
            </p>
            <p>
              And when we start putting those pieces together, something
              rather wonderful happens:
            </p>
            <p className={styles.heading}>Your body starts making sense.</p>
            <p>
              You stop second-guessing every health decision and start
              feeling more confident about what your body actually needs.
            </p>
            <p>
              Your energy can change. Your resilience can grow. Your
              confidence in your health can return.
            </p>
            <p>
              And when your body has the energy to do more than simply get
              you through the day, life tends to get better too.
            </p>
          </div>
        </section>

        {/* ---------- 5. Spark stanza + manifesto (cream) ---------- */}
        <section className={`${styles.section} ${styles.sectionCream}`}>
          <div className={styles.sectionInner}>
            <p className={`${styles.heading} ${styles.headingTight}`}>
              Your spark comes back.
              <br />
              Your sense of humour.
              <br />
              Your libido.
              <br />
              Your desire to move, play, create, connect and enjoy yourself.
            </p>

            <p>
              Because feeling well isn&rsquo;t just about better blood
              results or fewer symptoms.
            </p>
            <p>
              It&rsquo;s about having enough energy and resilience to feel
              fully alive in your own life.
            </p>

            <p className={styles.heading}>
              Understand your biology. Elevate your health. Get more out of
              being you.
            </p>
          </div>
        </section>

        {/* ---------- 6. What You Get (alt) ---------- */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <p className={`${styles.eyebrow} ${styles["eyebrow--light"]}`}>What You Get</p>
            <p className={styles.heading}>A deep dive into the biology of you.</p>

            <p>
              Before we ever make a recommendation, we take the time to
              understand you.
            </p>
            <p>We bring together your:</p>

            <ul className={styles.dotList}>
              {offerItems.map((item, i) => (
                <li key={item}>
                  <img src={DOT_PALETTE[i % DOT_PALETTE.length]} alt="" className={styles.dotIcon} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- 7. Connecting the dots + reframe + CTA (cream) ---------- */}
        <section className={`${styles.section} ${styles.sectionCream}`}>
          <div className={styles.sectionInner}>
            <p>But the real value isn&rsquo;t simply collecting more data.</p>
            <p className={styles.heading}>It&rsquo;s connecting it.</p>
            <p>
              We look for the patterns between your genetics, metabolism,
              blood results, history and the way you&rsquo;re feeling now
              &mdash; so that seemingly disconnected pieces begin to tell one
              coherent story.
            </p>
            <p>
              From there, you receive a highly personalised Biology of You
              report and consultation, where we teach you what we&rsquo;ve
              discovered and translate it into practical recommendations for
              food, nutrients, movement, lifestyle and the areas of your
              biology that deserve the most attention.
            </p>

            <div className={styles.reframeBlock}>
              <p>Not another pile of test results.</p>
              <p>Not another generic protocol.</p>
              <p className={styles.heading}>
                A blueprint for understanding your body &mdash; and the
                confidence to know what to do with that information.
              </p>
            </div>

            <div className={styles.ctaRow}>
              <a href="/portal" className={`${styles.btn} ${styles["btn--primary"]}`}>
                Start Your Client Portal
              </a>
              <a href="/#contact" className={`${styles.btn} ${styles["btn--ghost"]}`}>
                Get in Touch
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
