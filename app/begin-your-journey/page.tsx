// Structure-only build per Jen's doc: a Contact-style page with payment
// steps for people ready to just pay and start (often referred by a
// chiropractor), plus a spot for Andrea's explainer video.
//
// TODO (needs Andrea's input before this is real):
// - Which payment provider to use and how checkout actually happens.
// - The two email flows: one for people referred-and-ready-to-pay, a
//   different one for people who land here with questions first. Right
//   now both buttons just route to /contact as a safe placeholder.
// - The actual video file/embed for Andrea's explainer.

import Link from "next/link";

export default function BeginYourJourneyPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "34rem" }}>
        <p className="eyebrow">Begin Your Journey</p>
        <h1>Ready to Begin?</h1>
        <p>
          Whether you&apos;ve been referred by your chiropractor and you&apos;re ready to pay and start
          straight away, or you&apos;ve still got questions first — start here.
        </p>

        {/* Video placeholder */}
        <div
          className="card"
          style={{
            marginTop: "var(--space-md)",
            aspectRatio: "16 / 9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-ink-soft)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--step-1)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Video coming soon — Andrea explains what happens next
        </div>

        <div className="card" style={{ marginTop: "var(--space-md)" }}>
          <p style={{ fontWeight: 700, marginTop: 0 }}>How it works</p>
          <ol style={{ paddingLeft: "1.25rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>Complete a short intake so we know a little about you before we begin.</li>
            <li>Make your payment to secure your Signature Experience.</li>
            <li>We&apos;ll be in touch to schedule your personal video assessment and next steps.</li>
          </ol>
        </div>

        <div style={{ marginTop: "var(--space-lg)", display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
          <Link href="/contact" className="btn btn-primary">
            I&apos;m Ready — Pay &amp; Start
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            I Still Have a Question
          </Link>
        </div>
      </div>
    </section>
  );
}
