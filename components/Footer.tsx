export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-line)",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "var(--footer-height)",
        display: "flex",
        alignItems: "center",
        zIndex: 50,
        background: "var(--color-bg)",
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "var(--space-sm)",
          width: "100%",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--step-1)",
          color: "var(--color-ink-soft)",
        }}
      >
        <span>&copy; {new Date().getFullYear()} The Biology of You</span>
        <span style={{ textAlign: "center" }}>The story only your biology can tell.</span>
        <span />
      </div>
    </footer>
  );
}