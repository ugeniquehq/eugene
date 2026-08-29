"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "@/app/about/about.module.css";

type TabId = "who-we-are" | "our-founder";

export default function AboutTabs() {
  const [active, setActive] = useState<TabId>("who-we-are");

  return (
    <section className={`${styles.section} ${styles.sectionCream}`}>
      <div className={styles.sectionInner}>
        {/* Tab switcher */}
        <div
          role="tablist"
          aria-label="About"
          style={{
            display: "flex",
            gap: "var(--space-md)",
            borderBottom: "1px solid var(--color-line)",
            marginBottom: "var(--space-lg)",
          }}
        >
          {(
            [
              { id: "who-we-are", label: "01 Who We Are" },
              { id: "our-founder", label: "02 Our Founder" },
            ] as { id: TabId; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              onClick={() => setActive(tab.id)}
              style={{
                background: "none",
                border: "none",
                borderBottom: `2px solid ${active === tab.id ? "var(--color-accent)" : "transparent"}`,
                padding: "0.75rem 0",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--step-1)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: active === tab.id ? "var(--color-ink)" : "var(--color-ink-soft)",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {active === "who-we-are" ? (
          <div>
            <p>Healthcare is undergoing one of its most significant transformations in generations.</p>
            <p>
              For the first time in history, advances in genomics, laboratory science, wearable
              technology and artificial intelligence have given us unprecedented access to personal
              health information. We can sequence our DNA, continuously monitor glucose, track sleep,
              analyse heart rate variability, measure hormones, upload laboratory results and ask AI for
              health advice — all from home.
            </p>
            <p className={styles.heading}>The challenge is no longer collecting information. The challenge is understanding it.</p>
            <p>
              The Biology of You Method™ was built on the belief that health cannot be understood by
              looking at isolated pieces of information.
            </p>
            <p>
              Genes don&rsquo;t operate independently. Laboratory markers don&rsquo;t exist in isolation.
              Symptoms rarely occur without context. And two people can follow exactly the same health
              advice and experience completely different results.
            </p>
            <p className={styles.heading}>Meaningful personalised healthcare comes from connecting the dots.</p>
            <p>
              The Biology of You is a personalised healthcare platform built around a proprietary clinical
              methodology developed through decades of clinical practice and refined through thousands of
              patient consultations.
            </p>
            <p>
              We bring together your genetics, blood results, health history, nutrition, supplements,
              lifestyle and individual health goals to build a much more complete picture of you.
            </p>
            <p>
              Then we interpret those pieces together — looking for patterns, relationships, strengths,
              vulnerabilities and areas where your biology may be asking for greater support.
            </p>
            <p>Because knowing what is happening is only the beginning.</p>
            <p className={styles.heading}>We want to understand why.</p>
            <p>
              And from that understanding comes something incredibly powerful: the ability to make health
              decisions based on your biology rather than somebody else&rsquo;s rules.
            </p>
            <p className={styles.heading}>Less guessing. More understanding. Health personalised to you.</p>
          </div>
        ) : (
          <div>
            <p className="eyebrow" style={{ color: "var(--color-accent)" }}>Our Founder</p>
            <h2 style={{ marginTop: 0 }}>Jennifer Barham-Floreani D.C.</h2>
            <p>
              For more than 27 years, Jennifer Barham-Floreani has been asking a deceptively simple
              question: why can two people do all the same &ldquo;healthy&rdquo; things and experience
              completely different results? An award-winning former chiropractor, best-selling author and
              internationally respected health educator, Jennifer has spent the past decade bringing
              genetics, metabolism, blood results, nutrition and health history together to understand
              the individual. That thinking became The Biology of You Method™ — The story only your
              biology can tell.
            </p>
            <p>
              In 2026, Jennifer brought together a team of health practitioners and collaborators to
              launch The Biology of You — connecting patterns across multiple areas of biology to help
              explain why one person may thrive on an approach that leaves another feeling worse.
            </p>

            <div className={styles.ctaRow}>
              <Link href="/about/founder" className={`${styles.btn} ${styles["btn--primary"]}`}>
                Read More &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
