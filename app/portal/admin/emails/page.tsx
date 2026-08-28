import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getAllClientsDetailed } from "@/lib/db";
import EmailComposer from "@/components/admin/EmailComposer";

export default async function AdminEmailsPage() {
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
      <div className="container" style={{ maxWidth: "56rem" }}>
        <Link href="/portal/admin" style={{ fontSize: "var(--step-1)", color: "var(--color-ink-soft)" }}>
          &larr; Admin
        </Link>

        <p className="eyebrow" style={{ marginTop: "var(--space-md)" }}>
          Practitioner
        </p>
        <h1>Emails</h1>
        <p style={{ color: "var(--color-ink-soft)" }}>
          Pick a template, tweak it if you like, choose who gets it, and send.
        </p>

        {clients.length === 0 ? (
          <p style={{ color: "var(--color-ink-soft)" }}>No client accounts yet.</p>
        ) : (
          <EmailComposer clients={clients} />
        )}
      </div>
    </section>
  );
}
