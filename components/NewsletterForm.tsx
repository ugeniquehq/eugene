"use client";

export default function NewsletterForm() {
  return (
    <form
      style={{ display: "flex", gap: "var(--space-xs)", width: "100%", maxWidth: "26rem", justifyContent: "center" }}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Enter your email"
        required
        className="newsletter-input"
        style={{
          flex: 1,
          padding: "0.75rem 1rem",
          border: "1px solid rgba(229,222,203,0.3)",
          borderRadius: "var(--radius)",
          background: "rgba(229,222,203,0.08)",
          fontFamily: "var(--font-body)",
          fontSize: "var(--step-1)",
          color: "var(--color-card)",
        }}
      />
      <button
        type="submit"
        style={{
          whiteSpace: "nowrap",
          padding: "0.75rem 1.5rem",
          borderRadius: "var(--radius)",
          border: "none",
          background: "var(--color-accent-soft)",
          color: "var(--color-ink)",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Subscribe
      </button>
    </form>
  );
}