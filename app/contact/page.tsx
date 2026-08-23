"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "34rem" }}>
        <p className="eyebrow">Contact</p>
        <h1>Book a visit</h1>
        <p>
          [Placeholder — add practice address, phone, and hours here, or
          embed a booking widget once one is chosen.]
        </p>

        {status === "sent" ? (
          <div className="card" style={{ marginTop: "var(--space-md)" }}>
            <p style={{ margin: 0 }}>
              Thanks — your message is on its way. We&apos;ll be in touch soon.
            </p>
          </div>
        ) : (
          <form className="card" style={{ marginTop: "var(--space-md)" }} onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="message">What brings you in?</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
