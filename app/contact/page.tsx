export default function ContactPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "34rem" }}>
        <p className="eyebrow">Contact</p>
        <h1>Book a visit</h1>
        <p>
          [Placeholder — add practice address, phone, and hours here, or
          embed a booking widget once one is chosen.]
        </p>
        <form className="card" style={{ marginTop: "var(--space-md)" }}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className="field">
            <label htmlFor="message">What brings you in?</label>
            <textarea id="message" name="message" rows={4} />
          </div>
          <button type="submit" className="btn btn-primary">
            Send
          </button>
          <p style={{ fontSize: "var(--step-1)", color: "var(--color-ink-soft)", marginTop: "var(--space-sm)" }}>
            This form doesn&apos;t send anywhere yet — wire it up to an email
            provider or a booking system once one&apos;s chosen.
          </p>
        </form>
      </div>
    </section>
  );
}
