"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TEMPERATURE_STEPS } from "@/lib/temperature-schema";
import FieldGroup from "@/components/intake/FieldGroup";

const STEP_PHOTOS: Record<string, string> = {
  welcome: "/photography/hand-on-lips.jpg",
};
const DEFAULT_PHOTO = "/photography/womans-face.jpg";

function getPhotoForStep(stepId: string): string {
  return STEP_PHOTOS[stepId] ?? DEFAULT_PHOTO;
}

function possessive(name: string): string {
  return name.endsWith("s") ? `${name}'` : `${name}'s`;
}

export default function TemperaturePage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [clientName, setClientName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/temperature")
      .then((res) => res.json())
      .then((data) => {
        if (data?.name) setClientName(data.name);
        if (data?.answers) setAnswers(data.answers);
      })
      .catch(() => {
        // Starts blank if this fails — not worth blocking on.
      })
      .finally(() => setLoading(false));
  }, []);

  const step = TEMPERATURE_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === TEMPERATURE_STEPS.length - 1;
  const progress = Math.round(((stepIndex + 1) / TEMPERATURE_STEPS.length) * 100);
  const photo = getPhotoForStep(step.id);
  const heading = clientName ? `${possessive(clientName)} Temperature Record` : "Temperature Record";

  if (loading) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: "40rem" }}>
          <p style={{ color: "var(--color-ink-soft)" }}>Loading your temperature record…</p>
        </div>
      </section>
    );
  }

  async function handleSubmit() {
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/temperature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong saving your temperature record. Please try again.");
        setStatus("error");
        return;
      }
      router.push("/portal/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong saving your temperature record. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div className="intake-photo-fixed" style={{ backgroundImage: `url(${photo})` }} />

      <div className="intake-form-col">
        <div style={{ maxWidth: "40rem" }}>
          <a
            href="/portal/dashboard"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--step-1)",
              letterSpacing: "0.04em",
              color: "var(--color-ink-soft)",
              textDecoration: "none",
              marginBottom: "var(--space-sm)",
            }}
          >
            &larr; Back to portal
          </a>

          <p className="eyebrow">
            {heading} &middot; Day {stepIndex === 0 ? "—" : stepIndex} of 14
          </p>

          <div style={{ height: "4px", background: "var(--color-line)", borderRadius: "2px", marginBottom: "var(--space-sm)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "var(--gradient-brand)", transition: "width 0.2s ease" }} />
          </div>

          <h1>{step.title}</h1>
          {step.intro && (
            <p style={{ color: "var(--color-ink-soft)", whiteSpace: "pre-line" }}>{step.intro}</p>
          )}

          {step.fields.length > 0 && (
            <div className="card" style={{ marginTop: "var(--space-md)" }}>
              <FieldGroup fields={step.fields} answers={answers} onChange={setAnswers} />
            </div>
          )}

          {error && <p className="error-text" style={{ marginTop: "var(--space-sm)" }}>{error}</p>}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-md)", flexWrap: "wrap", gap: "var(--space-sm)" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              disabled={isFirst || status === "submitting"}
            >
              Back
            </button>

            <div style={{ display: "flex", gap: "var(--space-sm)" }}>
              {stepIndex > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSubmit}
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Saving…" : "Save now"}
                </button>
              )}

              {isLast ? (
                <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={status === "submitting"}>
                  {status === "submitting" ? "Saving…" : "Save temperature record"}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setStepIndex((i) => Math.min(TEMPERATURE_STEPS.length - 1, i + 1))}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
