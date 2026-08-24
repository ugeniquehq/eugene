import Link from "next/link";

export default function Nav() {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--color-line)",
        background: "var(--color-bg)",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "var(--space-sm)",
          paddingBottom: "var(--space-sm)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/branding/logo-wordmark.png"
            alt="The Biology of You"
            style={{ height: "1.1rem", width: "auto", display: "block" }}
          />
        </Link>
        <nav
          style={{
            display: "flex",
            gap: "var(--space-md)",
            alignItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--step-1)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <Link href="/about" style={{ textDecoration: "none" }}>
            About
          </Link>
          <Link href="/contact" style={{ textDecoration: "none" }}>
            Contact
          </Link>
          <Link
            href="/portal/login"
            className="btn btn-secondary"
            style={{ textTransform: "none", fontFamily: "var(--font-body)" }}
          >
            Client Portal
          </Link>
        </nav>
      </div>
    </header>
  );
}
