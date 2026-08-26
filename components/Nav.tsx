import Link from "next/link";

export default function Nav() {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--color-line)",
        background: "var(--color-bg)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "var(--header-height)",
        display: "flex",
        alignItems: "center",
        zIndex: 50,
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
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <img
            src="/branding/logo-badge.png"
            alt=""
            style={{ height: "2.6rem", width: "2.6rem", display: "block", borderRadius: "50%" }}
          />
          <img
            src="/branding/logo-wordmark.png"
            alt="The Biology of You"
            style={{ height: "1.5rem", width: "auto", display: "block" }}
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
