export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-line)",
        padding: "var(--space-lg) 0",
        marginTop: "var(--space-xl)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-sm)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--step-1)",
          color: "var(--color-ink-soft)",
        }}
      >
        <span>&copy; {new Date().getFullYear()} Eugene</span>
        <span>Placeholder branding — swap in app/globals.css</span>
      </div>
    </footer>
  );
}
