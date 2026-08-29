import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { getDocumentsForUser, ClientDocument } from "@/lib/db";

// Parses "Food Diary" -> 1 and "Food Diary — Round 3" -> 3, so the rounds
// of a repeatable document (Food Diary, Temperature Record) can be listed
// oldest-to-newest regardless of when each was actually saved.
function roundOf(title: string): number {
  const match = title.match(/Round (\d+)$/);
  return match ? parseInt(match[1], 10) : 1;
}

function roundsOf(documents: ClientDocument[], baseTitle: string): ClientDocument[] {
  return documents
    .filter((d) => d.title === baseTitle || d.title.startsWith(`${baseTitle} — Round`))
    .sort((a, b) => roundOf(a.title) - roundOf(b.title));
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/portal/login");
  }

  const documents = await getDocumentsForUser(session.user.id as string);

  const healthHistoryDoc = documents.find((d) => d.title === "Health History");
  const foodDiaryRounds = roundsOf(documents, "Food Diary");
  const temperatureRounds = roundsOf(documents, "Temperature Record");

  const singleItems = [
    {
      title: "Health History",
      doc: healthHistoryDoc,
      href: "/portal/intake",
      startLabel: "Complete your health history",
      updateLabel: "Update Health History",
    },
  ];

  // Food Diary and Temperature Record can be repeated (e.g. a 6- or
  // 12-month re-check) — every round a client has saved stays visible and
  // downloadable here, alongside buttons to continue the latest one or
  // start a brand new one.
  const repeatableItems = [
    {
      title: "Food Diary",
      rounds: foodDiaryRounds,
      href: "/portal/food-diary",
      startLabel: "Complete your 7-day food diary",
      continueLabel: "Continue Food Diary",
      newLabel: "+ Start a new food diary",
    },
    {
      title: "Temperature Record",
      rounds: temperatureRounds,
      href: "/portal/temperature",
      startLabel: "Begin your 14-day temperature record",
      continueLabel: "Continue Temperature Record",
      newLabel: "+ Start a new temperature record",
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
            {singleItems.map((item) => (
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

            {repeatableItems.map((item) => (
              <div key={item.title} style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                <div
                  style={{
                    border: "1px solid var(--color-line)",
                    borderRadius: "var(--radius)",
                    padding: "var(--space-md) var(--space-sm)",
                    minHeight: "6rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.2rem",
                    background: "#ffffff",
                    boxShadow: "0 4px 12px rgba(20,17,14,0.06)",
                  }}
                >
                  {item.rounds.length === 0 ? (
                    <span style={{ color: "var(--color-ink-soft)" }}>{item.title}</span>
                  ) : (
                    item.rounds.map((doc, i) => (
                      <a key={doc.id} href={`/api/documents/${doc.id}`} target="_blank" rel="noreferrer">
                        {item.rounds.length > 1 ? `${item.title} — Round ${i + 1}` : item.title}
                      </a>
                    ))
                  )}
                </div>

                <a
                  href={item.href}
                  className="btn"
                  style={{
                    justifyContent: "center",
                    background: item.rounds.length > 0 ? "var(--color-accent-soft)" : "var(--color-ink)",
                    color: item.rounds.length > 0 ? "var(--color-ink)" : "var(--color-bg)",
                    border: item.rounds.length > 0 ? "1px solid var(--color-ink)" : "1px solid transparent",
                    fontSize: "var(--step-1)",
                    padding: "0.75rem 1rem",
                  }}
                >
                  {item.rounds.length > 0 ? item.continueLabel : item.startLabel}
                </a>

                {item.rounds.length > 0 && (
                  <a
                    href={`${item.href}?new=1`}
                    className="btn btn-secondary"
                    style={{
                      justifyContent: "center",
                      fontSize: "var(--step-2)",
                      padding: "0.5rem 1rem",
                    }}
                  >
                    {item.newLabel}
                  </a>
                )}
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
