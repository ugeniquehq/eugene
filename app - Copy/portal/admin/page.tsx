import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getAllClients } from "@/lib/db";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/portal/login");
  }
  if (session.user.role !== "practitioner") {
    redirect("/portal/dashboard");
  }

  const clients = await getAllClients();

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "40rem" }}>
        <p className="eyebrow">Practitioner</p>
        <h1>Clients</h1>

        {clients.length === 0 ? (
          <p style={{ color: "var(--color-ink-soft)" }}>No client accounts yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {clients.map((client) => (
              <li key={client.id} className="card" style={{ marginBottom: "var(--space-sm)" }}>
                <Link href={`/portal/admin/clients/${client.id}`} style={{ textDecoration: "none" }}>
                  <strong>{client.name}</strong>
                </Link>
                <p style={{ margin: "0.25rem 0 0", fontSize: "var(--step-1)", color: "var(--color-ink-soft)" }}>
                  {client.email} &middot; {client.document_count} document
                  {client.document_count === 1 ? "" : "s"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
