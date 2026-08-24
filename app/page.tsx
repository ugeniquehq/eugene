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
          <p className="eyebrow">The Biology of You</p>
          <h1>The story only your biology can tell.</h1>
          <p style={{ fontSize: "var(--step1)", color: "var(--color-ink-soft)" }}>
            Energy. Mood. Desire. Curiosity. Strength. They&apos;re more connected
            than you think. Your health history, genetics, lab work and lifestyle
            aren&apos;t separate stories — we read them together, so the
            recommendations are actually built for your biology, not somebody
            else&apos;s rules.
          </p>
          <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-md)" }}>
            <Link href="/contact" className="btn btn-primary">
              Book a consultation
            </Link>
            <Link href="/about" className="btn btn-secondary">
              How it works
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
              <h3>Energy Is Fundamental</h3>
              <p>
                Give your body the energy it needs to regulate, repair and adapt.
                We don&apos;t want you simply functioning — we want you thriving.
              </p>
            </div>
            <div className="card">
              <h3>Genes Are Clues, Not Destiny</h3>
              <p>
                Your genes are clues, not your destiny. We don&apos;t analyse a
                mutation in isolation — we map the biology of you.
              </p>
            </div>
            <div className="card">
              <h3>Beyond the Reference Range</h3>
              <p>
                Your blood results are more than &quot;normal&quot; or
                &quot;abnormal.&quot; A number means very little without context.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: "1px solid var(--color-line)" }}>
        <div className="container" style={{ maxWidth: "40rem" }}>
          <p className="eyebrow">Where to start</p>
          <h2>Where your health story starts to make sense.</h2>
          <p>
            Your health history is the first piece of the picture — it takes
            about 20 minutes, and it&apos;s what lets everything else (your labs,
            your genetics, your day-to-day life) actually be read in context,
            rather than in isolation.
          </p>
          <Link href="/portal/login" className="btn btn-primary">
            Go to client portal
          </Link>
        </div>
      </section>
    </>
  );
}
