import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Is This For You? | The Biology of You",
  description:
    "Find out whether The Biology of You Signature Experience is the right fit for where you are right now.",
};

export default function IsThisForYouPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "34rem" }}>
        <p className="eyebrow">Is This For You?</p>
        <h1>Is This For You?</h1>
        <p>
          This page is being built out now — full content coming soon. In the meantime, if you&apos;re
          wondering whether The Biology of You Signature Experience is right for you, the short version
          is: if you&apos;re tired of guessing, tired of generic advice, and ready to understand what your
          own biology is telling you, it probably is.
        </p>
        <div style={{ marginTop: "var(--space-md)" }}>
          <Link href="/signature-experience" className="btn btn-primary">
            Explore Your Signature Experience
          </Link>
        </div>
      </div>
    </section>
  );
}
