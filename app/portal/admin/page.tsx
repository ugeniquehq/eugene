import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

type Tile = {
  title: string;
  href?: string;
  description?: string;
};

const TILES: Tile[] = [
  { title: "Clients", href: "/portal/admin/clients", description: "Browse, sort and filter every client account" },
  { title: "Emails", href: "/portal/admin/emails", description: "Send a template email to selected clients" },
  { title: "TBA" },
  { title: "TBA" },
  { title: "TBA" },
  { title: "TBA" },
  { title: "TBA" },
  { title: "TBA" },
  { title: "TBA" },
];

export default async function AdminLandingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/portal/login");
  }
  if (session.user.role !== "practitioner") {
    redirect("/portal/dashboard");
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "48rem" }}>
        <p className="eyebrow">Practitioner</p>
        <h1 style={{ marginBottom: "var(--space-lg)" }}>Admin landing page</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--space-sm)",
          }}
        >
          {TILES.map((tile, i) => {
            const enabled = Boolean(tile.href);
            const content = (
              <div
                style={{
                  border: `1px solid ${enabled ? "var(--color-ink)" : "var(--color-line)"}`,
                  borderRadius: "var(--radius)",
                  background: "var(--color-surface)",
                  minHeight: "6.5rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.35rem",
                  padding: "var(--space-sm)",
                  textAlign: "center",
                  boxShadow: enabled ? "0 4px 12px rgba(20,17,14,0.06)" : "none",
                  opacity: enabled ? 1 : 0.55,
                }}
              >
                <strong style={{ fontSize: "var(--step0)" }}>{tile.title}</strong>
                {tile.description && (
                  <span style={{ fontSize: "var(--step-1)", color: "var(--color-ink-soft)" }}>
                    {tile.description}
                  </span>
                )}
              </div>
            );

            return enabled ? (
              <Link key={i} href={tile.href!} style={{ textDecoration: "none", color: "inherit" }}>
                {content}
              </Link>
            ) : (
              <div key={i}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
