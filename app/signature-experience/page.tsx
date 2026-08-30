import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "@/app/about/about.module.css";

export const metadata: Metadata = {
  title: "Your Signature Experience | The Biology of You",
  description:
    "Our most comprehensive personalised health assessment — bringing together your health history, genetics, blood results, nutrition, supplements, lifestyle and physiology.",
};

const DOT_PALETTE = [
  "/branding/dots/dot-2-accent-soft.png",
  "/branding/dots/dot-3-copper.png",
  "/branding/dots/dot-6-forest.png",
  "/branding/dots/dot-7-maroon.png",
  "/branding/dots/dot-4-accent.png",
  "/branding/dots/dot-5-ink.png",
];

const assessmentItems = [
  "Comprehensive health history — understanding your health story, family history, current concerns, goals and priorities",
  "Personal video assessment — helping us observe posture, movement patterns and other relevant aspects of your health story",
  "Personalised laboratory guidance — identifying laboratory testing relevant to your individual history and goals",
  "Laboratory analysis — interpreting your results as patterns rather than isolated numbers",
  "DNA analysis — examining more than 300 genetic variants across key biological pathways to identify potential genetic strengths, vulnerabilities and areas where your biology may have differing capacity — always interpreted in the context of your current health, physiology and demands",
  "Food diary analysis — understanding what you're actually eating and how well it supports your biology",
  "Supplement and medication review — examining what you're currently taking and how it fits into the bigger picture",
  "Lifestyle assessment — including movement, sleep, stress, environment and daily rhythms",
];

const recommendationAreas = [
  "Areas where genetic vulnerability and current physiological demand intersect — and how we can build greater capacity and resilience",
  "Genetic strengths that can be built upon",
  "Energy production and metabolic health",
  "Nutrition and personalised meal strategies",
  "Supplement recommendations",
  "Mood, cognition and focus",
  "Hormonal and physiological resilience",
  "Family-history considerations",
  "Movement and exercise",
  "Sleep and circadian health",
  "Stress and nervous system support",
  "Healthy ageing and long-term resilience",
];

const supportItems = [
  "Questions about your recommendations",
  "Meal and food feedback",
  "Supplement questions",
  "Practical implementation",
  "Troubleshooting",
  "Helping you turn your recommendations into everyday habits",
];

export default function SignatureExperiencePage() {
  return (
    <>
      <Nav />
      <main className={styles.about}>
        {/* ---------- Header ---------- */}
        <section className={`${styles.section} ${styles.sectionCream}`} style={{ paddingBottom: "2rem" }}>
          <div className={styles.sectionInner}>
            <p className="eyebrow" style={{ color: "var(--accent, var(--color-accent))" }}>
              The Biology of You Signature Experience
            </p>
            <h1 style={{ lineHeight: 1.05 }}>Your Signature Experience</h1>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionCream}`} style={{ paddingTop: 0 }}>
          <div className={styles.sectionInner}>
            <p>
              The Biology of You Signature Experience is our most comprehensive personalised health
              assessment — bringing together your health history, genetics, blood results, nutrition,
              supplements, lifestyle and physiology to understand the bigger picture of you.
            </p>
            <p>Because collecting more health information isn&rsquo;t the answer.</p>
            <p style={{ fontWeight: 700 }}>Understanding what it means for you is.</p>
            <p>
              Rather than analysing each piece independently, The Biology of You Method™ connects the
              dots — identifying meaningful patterns, understanding your biological individuality and
              translating complex information into practical, personalised recommendations you can
              actually use.
            </p>
          </div>
        </section>

        {/* ---------- We Get to Know Your Biology (alt) ---------- */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <p className={styles.heading}>We Get to Know Your Biology</p>
            <p>Before your consultation, our team undertakes a comprehensive assessment that includes:</p>

            <ul className={styles.dotList}>
              {assessmentItems.map((item, i) => (
                <li key={item}>
                  <img src={DOT_PALETTE[i % DOT_PALETTE.length]} alt="" className={styles.dotIcon} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p style={{ fontStyle: "italic" }}>Laboratory and DNA testing are purchased separately.</p>
          </div>
        </section>

        {/* ---------- What You Receive: Personalised Report (cream) ---------- */}
        <section className={`${styles.section} ${styles.sectionCream}`}>
          <div className={styles.sectionInner}>
            <p className={`${styles.eyebrow} ${styles["eyebrow--light"]}`}>What You Receive</p>
            <p className={styles.heading}>The Biology of You Personalised Report</p>

            <p>This is where everything comes together.</p>
            <p>
              Your personalised report integrates your health history, laboratory findings, genetics,
              nutrition, metabolism, supplements, lifestyle and environment into one clear roadmap for
              your health.
            </p>
            <p>There is no genetic doom and gloom and no overwhelming list of everything that might theoretically go wrong.</p>
            <p>Your genes do not need to dictate your health.</p>
            <p>
              They give us valuable clues about where your biology may be naturally more or less
              efficient. But a genetic vulnerability on its own tells us very little.
            </p>
            <p className={styles.heading}>Vulnerability only has meaning in the context of demand.</p>
            <p>
              A genetic pathway that operates less efficiently may cause no difficulty when demand is low
              and the body has plenty of nutritional, metabolic and physiological capacity. But increase
              the demand — through stress, pregnancy, illness, inflammation, nutrient depletion, hormonal
              change, poor sleep, environmental exposures or simply different stages of life — and that
              same pathway may require considerably more support.
            </p>
            <p>That&rsquo;s why we don&rsquo;t look at your DNA and ask:</p>
            <p style={{ fontStyle: "italic" }}>&ldquo;What could go wrong?&rdquo;</p>
            <p>
              We look at your genetics alongside your blood results, health history, nutrition, lifestyle
              and current circumstances and ask:
            </p>
            <p style={{ fontStyle: "italic" }}>
              &ldquo;Where is demand greatest, where might capacity be lower, and what does your biology
              need now?&rdquo;
            </p>
            <p className={styles.heading}>Because genes may influence your capacity. They do not need to dictate your future.</p>

            <p>Depending on your individual findings, circumstances and goals, your recommendations may address:</p>

            <ul className={styles.dotList}>
              {recommendationAreas.map((item, i) => (
                <li key={item}>
                  <img src={DOT_PALETTE[i % DOT_PALETTE.length]} alt="" className={styles.dotIcon} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p>The aim isn&rsquo;t to give you more health rules.</p>
            <p>It&rsquo;s to help you understand what your biology needs — and why.</p>
          </div>
        </section>

        {/* ---------- Gene Appendix / SmartDNA (alt) ---------- */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <p className={styles.heading}>The Biology of You Personalised Gene Appendix</p>
            <p>
              Your DNA contains an extraordinary amount of information. But a list of genetic variants
              isn&rsquo;t particularly useful without context.
            </p>
            <p>
              Your personalised Gene Appendix takes a deeper look at your individual genetic blueprint,
              organising relevant genes into biological pathways and explaining what your results may
              mean.
            </p>
            <p>
              We explore strengths as well as vulnerabilities, helping you understand where your biology
              may work efficiently, where it may require greater support and — importantly — whether the
              demands being placed on those pathways make those vulnerabilities relevant to you now.
            </p>
            <p>Because your genetics are only one part of your health story.</p>
            <p className={styles.heading}>Your genes are clues, not your destiny.</p>

            <div style={{ marginTop: "3rem" }}>
              <p className={styles.heading}>Your SmartDNA Genomic Wellness Report</p>
              <p>Your original SmartDNA Genomic Wellness Report is provided alongside your Biology of You analysis.</p>
              <p>
                This serves as the underlying genomic reference from which we build our deeper pathway
                interpretation and personalised analysis.
              </p>
              <p style={{ fontStyle: "italic" }}>SmartDNA testing is purchased separately.</p>
            </div>
          </div>
        </section>

        {/* ---------- Consultation + Support (cream) ---------- */}
        <section className={`${styles.section} ${styles.sectionCream}`}>
          <div className={styles.sectionInner}>
            <p className={styles.heading}>Your Personalised Results &amp; Strategy Consultation</p>
            <p>Once we&rsquo;ve done the analysis, we meet.</p>
            <p>
              You&rsquo;ll have a 90-minute one-to-one consultation with Jennifer Barham-Floreani or a
              Biology of You Certified Practitioner™.
            </p>
            <p>This isn&rsquo;t simply someone reading your results back to you.</p>
            <p>
              We&rsquo;ll walk you through the patterns we&rsquo;ve identified, explain the areas we
              believe matter most and help you understand why we&rsquo;re recommending what we&rsquo;re
              recommending.
            </p>
            <p>We&rsquo;ll also help you prioritise.</p>
            <p>
              Because when you receive a lot of information about your health, knowing what matters now —
              and what can wait — is incredibly important.
            </p>
            <p className={styles.heading}>You should leave understanding your body better, not becoming more worried about it.</p>

            <div style={{ marginTop: "3rem" }}>
              <p className={styles.heading}>Four Weeks of Personal Support</p>
              <p>Knowing what to do is one thing.</p>
              <p>Making it work in real life is another.</p>
              <p>For the four weeks following your consultation, you&rsquo;ll have access to personal messaging support for:</p>

              <ul className={styles.dotList}>
                {supportItems.map((item, i) => (
                  <li key={item}>
                    <img src={DOT_PALETTE[i % DOT_PALETTE.length]} alt="" className={styles.dotIcon} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p>Because personalised healthcare shouldn&rsquo;t end when the consultation does.</p>
            </div>
          </div>
        </section>

        {/* ---------- Member Hub + Outcome (alt) ---------- */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <p className={styles.heading}>Continue With — The Biology of You Member Hub</p>
            <p>
              For those who want ongoing education and support, access to The Biology of You Member Hub
              is available through a monthly subscription.
            </p>
            <p>
              The Member Hub helps you continue putting what you&rsquo;ve learned into practice through
              education, practical resources, implementation tools and community support.
            </p>
            <p>Your biology isn&rsquo;t static.</p>
            <p>And understanding it shouldn&rsquo;t be a one-time event.</p>

            <div className={styles.reframeBlock}>
              <p className={styles.heading}>The Outcome?</p>
              <p>Less confusion. Less restriction. Less guessing.</p>
              <p>More understanding of your body.</p>
              <p>More confidence in the decisions you make.</p>
              <p>More clarity about what matters now — and what doesn&rsquo;t.</p>
              <p style={{ fontWeight: 700 }}>And a health strategy designed around the biology of you.</p>
            </div>

            <div className={styles.ctaRow}>
              <Link href="/begin-your-journey" className={`${styles.btn} ${styles["btn--primary"]}`}>
                Begin Your Journey
              </Link>
              <Link href="/about" className={`${styles.btn} ${styles["btn--ghost"]}`}>
                Back to About
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
