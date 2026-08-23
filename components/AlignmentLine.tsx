"use client";

import { useEffect, useRef } from "react";

/**
 * The site's signature element: a vertical rule that starts slightly
 * off-axis in the hero and straightens as the visitor scrolls —
 * a literal, quiet nod to "well adjusted." Runs once, on the home
 * page hero only. Respects prefers-reduced-motion.
 */
export default function AlignmentLine() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || !lineRef.current) return;

    const el = lineRef.current;
    const maxScroll = 480; // px of scroll over which it straightens

    function onScroll() {
      const progress = Math.min(window.scrollY / maxScroll, 1);
      const angle = 6 * (1 - progress); // degrees, 6 -> 0
      const offset = 14 * (1 - progress); // px, 14 -> 0
      el.style.transform = `translateX(${offset}px) rotate(${angle}deg)`;
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={lineRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        width: "1px",
        height: "100%",
        background: "var(--color-accent)",
        transformOrigin: "top center",
        transform: "translateX(14px) rotate(6deg)",
        opacity: 0.55,
      }}
    />
  );
}
