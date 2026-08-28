import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getAllClientsDetailed } from "@/lib/db";
import ClientsTable from "@/components/admin/ClientsTable";

export default async function AdminClientsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/portal/login");
  }
  if (session.user.role !== "practitioner") {
    redirect("/portal/dashboard");
  }

  const clients = await getAllClientsDetailed();

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "44rem" }}>
        <Link href="/portal/admin" style={{ fontSize: "var(--step-1)", color: "var(--color-ink-soft)" }}>
          &larr; Admin
        </Link>

        <p className="eyebrow" style={{ marginTop: "var(--space-md)" }}>
          Practitioner
        </p>
        <h1>Clients</h1>

        {clients.length === 0 ? (
          <p style={{ color: "var(--color-ink-soft)" }}>No client accounts yet.</p>
        ) : (
          <ClientsTable clients={clients} />
        )}
      </div>
    </section>
  );
}
