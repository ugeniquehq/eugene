import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getClientById, getDocumentsForUser } from "@/lib/db";

export default async function AdminClientPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/portal/login");
  }
  if (session.user.role !== "practitioner") {
    redirect("/portal/dashboard");
  }

  const client = await getClientById(params.id);
  if (!client) {
    notFound();
  }

  const documents = await getDocumentsForUser(client.id);

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "40rem" }}>
        <Link href="/portal/admin/clients" style={{ fontSize: "var(--step-1)", color: "var(--color-ink-soft)" }}>
          &larr; All clients
        </Link>

        <p className="eyebrow" style={{ marginTop: "var(--space-md)" }}>
          Client
        </p>
        <h1>{client.name}</h1>
        <p style={{ color: "var(--color-ink-soft)" }}>{client.email}</p>

        <h2 style={{ marginTop: "var(--space-lg)" }}>Documents</h2>
        {documents.length === 0 ? (
          <p style={{ color: "var(--color-ink-soft)" }}>No documents on file yet.</p>
        ) : (
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
        )}
      </div>
    </section>
  );
}
