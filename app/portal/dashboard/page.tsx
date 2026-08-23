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

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "40rem" }}>
        <p className="eyebrow">Client Portal</p>
        <h1>Welcome back, {session.user.name}</h1>

        <h2 style={{ marginTop: "var(--space-lg)" }}>Your documents</h2>
        {documents.length === 0 ? (
          <div className="card">
            <p style={{ marginBottom: "var(--space-sm)" }}>
              You haven&apos;t completed your health history yet — it takes about 20 minutes and
              helps your Biology of You team understand the full picture before your first review.
            </p>
            <a href="/portal/intake" className="btn btn-primary">
              Complete your health history
            </a>
          </div>
        ) : (
          <>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {documents.map((doc) => (
                <li key={doc.id} className="card" style={{ marginBottom: "var(--space-sm)" }}>
                  <a href={`/api/documents/${doc.id}`} target="_blank" rel="noreferrer">
                    {doc.title}
                  </a>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--step-1)", color: "var(--color-ink-soft)", margin: 0 }}>
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>

            {hasHealthHistory && (
              <a href="/portal/intake" className="btn btn-secondary" style={{ marginTop: "var(--space-xs)" }}>
                Update your health history
              </a>
            )}
          </>
        )}

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
    </section>
  );
}
