"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { INTAKE_STEPS } from "@/lib/intake-schema";
import { IntakeAnswers } from "@/lib/intake-answers";
import Field from "@/components/intake/Field";

export default function IntakePage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<IntakeAnswers>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/intake")
      .then((res) => res.json())
      .then((data) => {
        if (data?.answers) setAnswers(data.answers);
      })
      .catch(() => {
        // If this fails, the form just starts blank — not worth blocking on.
      })
      .finally(() => setLoading(false));
  }, []);

  const step = INTAKE_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === INTAKE_STEPS.length - 1;
  const progress = Math.round(((stepIndex + 1) / INTAKE_STEPS.length) * 100);

  if (loading) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: "40rem" }}>
          <p style={{ color: "var(--color-ink-soft)" }}>Loading your health history…</p>
        </div>
      </section>
    );
  }

  async function handleSubmit() {
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong saving your health history. Please try again.");
        setStatus("error");
        return;
      }
      router.push("/portal/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong saving your health history. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "40rem" }}>
        <p className="eyebrow">
          Health History &middot; Step {stepIndex + 1} of {INTAKE_STEPS.length}
        </p>

        <div style={{ height: "4px", background: "var(--color-line)", borderRadius: "2px", marginBottom: "var(--space-md)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "var(--color-accent)", transition: "width 0.2s ease" }} />
        </div>

        <h1>{step.title}</h1>
        {step.intro && <p style={{ color: "var(--color-ink-soft)" }}>{step.intro}</p>}

        <div className="card" style={{ marginTop: "var(--space-md)" }}>
          {step.fields.map((field) => (
            <Field key={field.key} field={field} answers={answers} onChange={setAnswers} />
          ))}
        </div>

        {error && <p className="error-text" style={{ marginTop: "var(--space-sm)" }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-md)" }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={isFirst || status === "submitting"}
          >
            Back
          </button>

          {isLast ? (
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={status === "submitting"}>
              {status === "submitting" ? "Saving…" : "Save health history"}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStepIndex((i) => Math.min(INTAKE_STEPS.length - 1, i + 1))}
            >
              Next
            </button>
          )}
        </div>

        <p style={{ fontSize: "var(--step-1)", color: "var(--color-ink-soft)", marginTop: "var(--space-md)" }}>
          Your answers save once you reach the final step and click Save — if you close the tab
          partway through, you can come back and pick up from your last saved version, but changes
          made in this session before saving won&apos;t be kept.
        </p>
      </div>
    </section>
  );
}
