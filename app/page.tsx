import Link from "next/link";
import AlignmentLine from "@/components/AlignmentLine";

export default function HomePage() {
  return (
    <>
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: "var(--space-xl)",
          paddingBottom: "var(--space-xl)",
        }}
      >
        <AlignmentLine />
        <div className="container" style={{ position: "relative", maxWidth: "40rem" }}>
          <p className="eyebrow">Chiropractic &amp; Wellness Care</p>
          <h1>
            Care that meets you<br />where your body is.
          </h1>
          <p style={{ fontSize: "var(--step1)", color: "var(--color-ink-soft)" }}>
            Dr. Jen works with patients through hands-on adjustment, honest
            assessment, and a plan that actually fits your life — not a
            generic protocol.
          </p>
          <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-md)" }}>
            <Link href="/contact" className="btn btn-primary">
              Book a visit
            </Link>
            <Link href="/about" className="btn btn-secondary">
              Meet Dr. Jen
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: "1px solid var(--color-line)" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
              gap: "var(--space-md)",
            }}
          >
            <div className="card">
              <h3>Initial assessment</h3>
              <p>
                A full look at posture, movement, and history before any
                hands-on work begins, so the plan fits the person, not the
                other way round.
              </p>
            </div>
            <div className="card">
              <h3>Ongoing adjustment</h3>
              <p>
                Regular sessions built around what your body actually needs
                this week, not a fixed package.
              </p>
            </div>
            <div className="card">
              <h3>Client portal</h3>
              <p>
                Complete your intake once, then log in any time to see your
                visit history and documents in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: "1px solid var(--color-line)" }}>
        <div className="container" style={{ maxWidth: "40rem" }}>
          <p className="eyebrow">New here?</p>
          <h2>Start with your intake</h2>
          <p>
            New patients complete a short health history before their first
            visit. It takes about ten minutes and means your first
            appointment can start with care, not paperwork.
          </p>
          <Link href="/portal/login" className="btn btn-primary">
            Go to client portal
          </Link>
        </div>
      </section>
    </>
  );
}
