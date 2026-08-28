import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getClientById, getDocumentsForUser, getHealthHistoryForUser } from "@/lib/db";
import { getMissingFields } from "@/lib/intake-completion";

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
  const healthHistory = await getHealthHistoryForUser(client.id);
  const missingFields = healthHistory ? getMissingFields(healthHistory.answers ?? {}) : null;

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

        <h2 style={{ marginTop: "var(--space-lg)" }}>Health History</h2>
        {!healthHistory ? (
          <p style={{ color: "var(--color-ink-soft)" }}>Not started yet.</p>
        ) : missingFields && missingFields.length === 0 ? (
          <p style={{ color: "var(--color-sage)", fontWeight: 700 }}>Complete — every required field has an answer.</p>
        ) : (
          <div>
            <p style={{ fontWeight: 700 }}>
              In progress — {missingFields?.length} field{missingFields?.length === 1 ? "" : "s"} still need
              {missingFields?.length === 1 ? "s" : ""} an answer
            </p>
            <div className="card" style={{ maxHeight: "14rem", overflowY: "auto", display: "grid", gap: "0.15rem" }}>
              {missingFields?.map((m, i) => (
                <p key={`${m.stepId}-${m.fieldLabel}-${i}`} style={{ margin: 0, fontSize: "var(--step-1)" }}>
                  <span style={{ color: "var(--color-ink-soft)" }}>{m.stepTitle}:</span> {m.fieldLabel}
                </p>
              ))}
            </div>
          </div>
        )}

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
