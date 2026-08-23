import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { getDocumentsForUser } from "@/lib/db";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/portal/login");
  }

  const documents = await getDocumentsForUser(session.user.id as string);

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "40rem" }}>
        <p className="eyebrow">Client Portal</p>
        <h1>Welcome back, {session.user.name}</h1>

        <h2 style={{ marginTop: "var(--space-lg)" }}>Your documents</h2>
        {documents.length === 0 ? (
          <p style={{ color: "var(--color-ink-soft)" }}>
            Nothing here yet — your intake forms and visit records will
            appear once they&apos;re added to your file.
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {documents.map((doc) => (
              <li key={doc.id} className="card" style={{ marginBottom: "var(--space-sm)" }}>
                <a href={doc.blob_url} target="_blank" rel="noreferrer">
                  {doc.title}
                </a>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--step-1)", color: "var(--color-ink-soft)", margin: 0 }}>
                  {new Date(doc.uploaded_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
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
