import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partnerships | The Biology of You",
  description: "Practitioner and organisation partnerships with The Biology of You.",
};

export default function PartnershipsPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "34rem" }}>
        <p className="eyebrow">Partnerships</p>
        <h1>Partnerships</h1>
        <p>
          This page is being built out — full content coming soon. In the meantime, if you&apos;re a
          practitioner or organisation interested in partnering with The Biology of You, please get in
          touch through our contact page.
        </p>
      </div>
    </section>
  );
}
