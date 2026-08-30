"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DotItem {
  dot: string;
  title: string;
  desc: string;
  paragraphs: string[];
}

// Full pop-up copy for each of the six homepage dots, drafted 28/8/26.
// Short "desc" stays on the homepage tile itself; "paragraphs" is the
// fuller copy shown once a client clicks through, with a Read More link
// into the About page.
const ITEMS: DotItem[] = [
  {
    dot: "/branding/dots/dot-2-accent-soft.png",
    title: "Your Biology",
    desc: "Understand why you are uniquely you.",
    paragraphs: [
      "There is no universally perfect diet, supplement, exercise routine or health protocol — because there is no universally identical human biology.",
      "The Biology of You Method™ connects the dots, looking for the patterns and relationships that help explain why your body responds the way it does.",
      "Because understanding your health isn't about one test, one gene or one symptom.",
      "It's about understanding how your biology works together — and what that means for you.",
    ],
  },
  {
    dot: "/branding/dots/dot-3-copper.png",
    title: "Your Genetics",
    desc: "Genes are clues, not destiny.",
    paragraphs: [
      "We analyse 300+ genetic variants across key biological pathways to understand where your biology may have natural strengths, differing efficiencies or potential vulnerabilities.",
      "But a genetic vulnerability doesn't automatically mean there is a problem. Vulnerability only has meaning in the context of demand. Stress, pregnancy, illness, inflammation, nutrition, hormones, sleep, environment and different stages of life can all change how much is being asked of a pathway.",
      "That's why we interpret your DNA alongside the rest of your health story.",
      "Your genes may influence your capacity. They do not need to dictate your health.",
    ],
  },
  {
    dot: "/branding/dots/dot-6-forest.png",
    title: "Your Blood",
    desc: "Beyond 'normal'. Understand what your results mean for you.",
    paragraphs: [
      "A laboratory result sitting inside a reference range doesn't always tell the whole story — and one number viewed in isolation rarely tells us very much.",
      "We look at your blood markers together, and alongside your symptoms, genetics, nutrition, health history and current physiological demands. This helps us identify patterns and ask a much more useful question than simply “Is this normal?”",
      "What is this telling us about you?",
    ],
  },
  {
    dot: "/branding/dots/dot-7-maroon.png",
    title: "Your Energy",
    desc: "Because energy changes everything.",
    paragraphs: [
      "Energy isn't simply whether you feel tired at 3pm. Your cells require energy to repair, think, move, digest, regulate hormones, respond to stress and maintain the countless processes keeping you alive.",
      "When energy availability and demand are out of balance, the body adapts — often prioritising what it needs for survival over the things that make us feel at our best.",
      "We look for clues about how well you're producing, using and conserving energy — and what may be increasing the demand.",
      "Because when your biology has more capacity, you have more available for life.",
    ],
  },
  {
    dot: "/branding/dots/dot-4-accent.png",
    title: "Your Fuel",
    desc: "Food freedom. Nourish, don't restrict.",
    paragraphs: [
      "Nutrition has become remarkably complicated. Eat this. Never eat that. Fast longer. Eat more often. Avoid carbs. Avoid fat.",
      "We take a different approach.",
      "We look at what your biology needs to produce energy, build hormones, support metabolism, recover and thrive — and how your current diet is meeting those needs.",
      "The goal isn't another restrictive food philosophy. In fact, you may be surprised by how many foods make their way back onto your plate.",
      "Less food fear. More nourishment. More freedom.",
    ],
  },
  {
    dot: "/branding/dots/dot-5-ink.png",
    title: "Your Health Story",
    desc: "Your symptoms aren't random. There is always a why.",
    paragraphs: [
      "Your current health didn't begin with your latest blood test.",
      "Your symptoms, family history, pregnancies, illnesses, medications, periods of stress, previous diets, injuries, environment and experiences all help tell the story of how your biology arrived where it is today.",
      "Rather than seeing symptoms as isolated problems to silence, we ask what they may be telling us about adaptation, demand and capacity.",
      "When we put your history alongside your genetics, blood results, nutrition and physiology, seemingly unrelated pieces can begin to make sense.",
      "Your body has a story. We want to understand it.",
    ],
  },
];

export default function BiologyDots() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex !== null ? ITEMS[openIndex] : null;

  useEffect(() => {
    if (active === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(9rem, 1fr))",
          gap: "2.0rem",
          textAlign: "center",
        }}
      >
        {ITEMS.map((item, i) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-haspopup="dialog"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              font: "inherit",
              color: "inherit",
            }}
          >
            <img src={item.dot} alt="" style={{ width: "0.75rem", height: "0.75rem", borderRadius: "50%", display: "block" }} />
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--step-1)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {item.title}
            </span>
            <span style={{ display: "block", fontSize: "var(--step-1)", color: "var(--color-ink-soft)" }}>{item.desc}</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                opacity: 0.85,
              }}
            >
              <span aria-hidden="true" style={{ fontSize: "0.9rem", lineHeight: 1 }}>+</span>
              Tap to Explore
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div
          role="presentation"
          onClick={() => setOpenIndex(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(20,17,14,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-md)",
            zIndex: 100,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--color-card, #fff)",
              borderRadius: "var(--radius)",
              maxWidth: "34rem",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              padding: "var(--space-lg)",
              position: "relative",
              boxShadow: "0 20px 60px rgba(20,17,14,0.25)",
              textAlign: "left",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: "var(--space-sm)",
                right: "var(--space-sm)",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                lineHeight: 1,
                cursor: "pointer",
                color: "var(--color-ink-soft)",
              }}
            >
              &times;
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "var(--space-sm)" }}>
              <img src={active.dot} alt="" style={{ width: "0.85rem", height: "0.85rem", borderRadius: "50%", display: "block" }} />
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--step-1)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                {active.title}
              </p>
            </div>

            <p style={{ fontSize: "var(--step0)", fontWeight: 700, marginTop: 0 }}>{active.desc}</p>

            {active.paragraphs.map((p, i) => (
              <p key={i} style={{ color: "var(--color-ink-soft)" }}>
                {p}
              </p>
            ))}

            <Link
              href="/about/story"
              className="btn btn-secondary"
              style={{ marginTop: "var(--space-sm)", display: "inline-flex" }}
              onClick={() => setOpenIndex(null)}
            >
              Read More &rarr;
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
