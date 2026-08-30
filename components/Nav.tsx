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
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "1.25rem",
          paddingRight: "1.25rem",
        }}
      >
        {/* LHS: logo only */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <img
            src="/branding/logo-badge.png"
            alt=""
            style={{ height: "2.6rem", width: "2.6rem", display: "block", borderRadius: "50%" }}
          />
          <img
            src="/branding/logo-wordmark2.png"
            alt="The Biology of You"
            style={{ height: "2.6rem", width: "auto", display: "block" }}
          />
        </Link>

        {/* RHS: nav tabs */}
        <nav
          style={{
            display: "flex",
            gap: "var(--space-md)",
            alignItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            flexWrap: "wrap",
          }}
        >
          <Link href="/about" style={{ textDecoration: "none" }}>
            About
          </Link>
          <Link href="/contact" style={{ textDecoration: "none" }}>
            Contact
          </Link>
          <Link href="/portal/login" style={{ textDecoration: "none" }}>
            Client Portal
          </Link>
        </nav>
      </div>
    </header>
  );
}