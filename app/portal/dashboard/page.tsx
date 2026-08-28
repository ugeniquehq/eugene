import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { getDocumentsForUser } from "@/lib/db";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/portal/login");
  }

  const documents = await getDocumentsForUser(session.user.id as string);

  const items = [
    {
      title: "Health History",
      doc: documents.find((d) => d.title === "Health History"),
      href: "/portal/intake",
      startLabel: "Complete your health history",
      updateLabel: "Update Health History",
    },
    {
      title: "Food Diary",
      doc: documents.find((d) => d.title === "Food Diary"),
      href: "/portal/food-diary",
      startLabel: "Complete your 7-day food diary",
      updateLabel: "Update Food Diary",
    },
    {
      title: "Temperature Record",
      doc: documents.find((d) => d.title === "Temperature Record"),
      href: "/portal/temperature",
      startLabel: "Begin your 14-day temperature record",
      updateLabel: "Update Temperature Record",
    },
  ];

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        minHeight: "calc(100vh - var(--header-height) - var(--footer-height))",
      }}
    >
      {/* Left: content panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "var(--space-xl)",
        }}
      >
        <div style={{ maxWidth: "40rem", width: "100%", marginInline: "auto", textAlign: "center" }}>
          <p className="eyebrow" style={{ color: "var(--color-accent)" }}>Client Portal</p>
          <h1 style={{ fontSize: "var(--step2)", marginBottom: "var(--space-md)" }}>
            Welcome back, {session.user.name}
          </h1>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--step-1)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-ink-soft)",
              marginBottom: "var(--space-sm)",
            }}
          >
            Your documents
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(9rem, 1fr))",
              gap: "var(--space-sm)",
            }}
          >
            {items.map((item) => (
              <div key={item.title} style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                <div
                  style={{
                    border: "1px solid var(--color-line)",
                    borderRadius: "var(--radius)",
                    padding: "var(--space-lg) var(--space-sm)",
                    minHeight: "6rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#ffffff",
                    boxShadow: "0 4px 12px rgba(20,17,14,0.06)",
                  }}
                >
                  {item.doc ? (
                    <a href={`/api/documents/${item.doc.id}`} target="_blank" rel="noreferrer">
                      {item.title}
                    </a>
                  ) : (
                    <span style={{ color: "var(--color-ink-soft)" }}>{item.title}</span>
                  )}
                </div>

                <a
                  href={item.href}
                  className="btn"
                  style={{
                    justifyContent: "center",
                    background: item.doc ? "var(--color-accent-soft)" : "var(--color-ink)",
                    color: item.doc ? "var(--color-ink)" : "var(--color-bg)",
                    border: item.doc ? "1px solid var(--color-ink)" : "1px solid transparent",
                    fontSize: "var(--step-1)",
                    padding: "0.75rem 1rem",
                  }}
                >
                  {item.doc ? item.updateLabel : item.startLabel}
                </a>
              </div>
            ))}
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            style={{ marginTop: "var(--space-lg)" }}
          >
            <button type="submit" className="btn btn-secondary">
              Log out
            </button>
          </form>
        </div>
      </div>

      {/* Right: photo panel, echoes login/hero */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "var(--space-xl)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "26rem",
            aspectRatio: "4 / 3",
            borderRadius: "var(--radius)",
            overflow: "hidden",
            backgroundImage: "url(/grid2/photo-ocean-legs.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(20,17,14,0.5) 0%, rgba(20,17,14,0.05) 55%)",
            }}
          />
          <p
            style={{
              position: "absolute",
              bottom: "var(--space-md)",
              left: "var(--space-md)",
              right: "var(--space-md)",
              color: "var(--color-card)",
              fontSize: "var(--step0)",
            }}
          >
            The story only your biology can tell.
          </p>
        </div>
      </div>
    </section>
  );
}
