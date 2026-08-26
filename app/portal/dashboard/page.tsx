import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { getDocumentsForUser } from "@/lib/db";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/portal/login");
  }

  const documents = await getDocumentsForUser(session.user.id as string);
  const hasHealthHistory = documents.some((doc) => doc.title === "Health History");
  const hasFoodDiary = documents.some((doc) => doc.title === "Food Diary");
  const hasTemperatureRecord = documents.some((doc) => doc.title === "Temperature Record");

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
        <div style={{ maxWidth: "30rem", width: "100%", marginInline: "auto" }}>
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

          {documents.length === 0 ? (
            <div
              className="card"
              style={{ border: "1px solid var(--color-line)", boxShadow: "0 10px 30px rgba(20,17,14,0.08)" }}
            >
              <p style={{ marginBottom: "var(--space-sm)" }}>
                You haven&apos;t completed your health history yet — it takes about 20 minutes and
                helps your Biology of You team understand the full picture before your first review.
              </p>
              <a href="/portal/intake" className="btn btn-primary">
                Complete your health history
              </a>
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="card"
                  style={{
                    marginBottom: "var(--space-sm)",
                    border: "1px solid var(--color-line)",
                    boxShadow: "0 10px 30px rgba(20,17,14,0.08)",
                  }}
                >
                  <a href={`/api/documents/${doc.id}`} target="_blank" rel="noreferrer">
                    {doc.title}
                  </a>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--step-1)", color: "var(--color-ink-soft)", margin: 0 }}>
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)", marginTop: "var(--space-sm)" }}>
            {hasHealthHistory && (
              <a href="/portal/intake" className="btn btn-secondary">
                Update your health history
              </a>
            )}

            {hasFoodDiary ? (
              <a href="/portal/food-diary" className="btn btn-secondary">
                Update your food diary
              </a>
            ) : (
              <a href="/portal/food-diary" className="btn btn-primary">
                Complete your 7-day food diary
              </a>
            )}

            {hasTemperatureRecord ? (
              <a href="/portal/temperature" className="btn btn-secondary">
                Update your temperature record
              </a>
            ) : (
              <a href="/portal/temperature" className="btn btn-primary">
                Begin your 14-day temperature record
              </a>
            )}
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
          position: "relative",
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
            bottom: "var(--space-lg)",
            left: "var(--space-lg)",
            right: "var(--space-lg)",
            color: "var(--color-card)",
            fontSize: "var(--step1)",
            maxWidth: "22rem",
          }}
        >
          The story only your biology can tell.
        </p>
      </div>
    </section>
  );
}