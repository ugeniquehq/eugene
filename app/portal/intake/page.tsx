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
  const [isEditing, setIsEditing] = useState(false);
  const [showJumpMenu, setShowJumpMenu] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/intake")
      .then((res) => res.json())
      .then((data) => {
        if (data?.answers) {
          setAnswers(data.answers);
          setIsEditing(true);
        }
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

        <div style={{ height: "4px", background: "var(--color-line)", borderRadius: "2px", marginBottom: "var(--space-sm)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "var(--color-accent)", transition: "width 0.2s ease" }} />
        </div>

        {isEditing && (
          <div style={{ marginBottom: "var(--space-md)" }}>
            <button
              type="button"
              onClick={() => setShowJumpMenu((v) => !v)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                fontFamily: "var(--font-mono)",
                fontSize: "var(--step-1)",
                color: "var(--color-sage)",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {showJumpMenu ? "Hide sections" : "Jump to a section"}
            </button>

            {showJumpMenu && (
              <div
                className="card"
                style={{
                  marginTop: "var(--space-xs)",
                  maxHeight: "16rem",
                  overflowY: "auto",
                  display: "grid",
                  gap: "0.25rem",
                }}
              >
                {INTAKE_STEPS.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setStepIndex(i);
                      setShowJumpMenu(false);
                    }}
                    style={{
                      textAlign: "left",
                      background: i === stepIndex ? "var(--color-accent-soft)" : "none",
                      border: "none",
                      borderRadius: "var(--radius)",
                      padding: "0.4rem 0.5rem",
                      cursor: "pointer",
                      fontSize: "var(--step-1)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {i + 1}. {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step.part && (
          <div style={{ marginBottom: "var(--space-lg)", paddingBottom: "var(--space-md)", borderBottom: "1px solid var(--color-line)" }}>
            <p className="eyebrow" style={{ marginBottom: "0.25rem" }}>Part {step.part.number}</p>
            <h2 style={{ marginBottom: "0.5rem" }}>{step.part.title}</h2>
            <p style={{ color: "var(--color-ink-soft)", margin: 0, whiteSpace: "pre-line" }}>{step.part.subtitle}</p>
          </div>
        )}

        {step.sectionHeading && (
          <div style={{ marginBottom: "var(--space-lg)", paddingBottom: "var(--space-md)", borderBottom: "1px solid var(--color-line)" }}>
            <h2 style={{ marginBottom: step.sectionHeading.subtitle ? "0.5rem" : 0 }}>{step.sectionHeading.title}</h2>
            {step.sectionHeading.subtitle && (
              <p style={{ color: "var(--color-ink-soft)", margin: 0 }}>{step.sectionHeading.subtitle}</p>
            )}
          </div>
        )}

        {step.id === "welcome" ? (
          <img
            src="/branding/biology-of-you-header.png"
            alt="Welcome to The Biology of You — the story only your biology can tell."
            style={{ width: "100%", maxWidth: "28rem", height: "auto", display: "block", marginBottom: "var(--space-md)" }}
          />
        ) : (
          <h1>{step.title}</h1>
        )}
        {step.intro && (
          <p style={{ color: "var(--color-ink-soft)", whiteSpace: "pre-line" }}>{step.intro}</p>
        )}

        {step.fields.length > 0 && (
          <div className="card" style={{ marginTop: "var(--space-md)" }}>
            {step.fields.map((field) => (
              <Field key={field.key} field={field} answers={answers} onChange={setAnswers} />
            ))}
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
            {isEditing && !isLast && (
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
        </div>

        <p style={{ fontSize: "var(--step-1)", color: "var(--color-ink-soft)", marginTop: "var(--space-md)" }}>
          {isEditing
            ? "Your previous answers are already filled in — jump to a section to update it, or use \u201cSave now\u201d from anywhere to save your changes without going through every step."
            : "Your answers save once you reach the final step and click Save \u2014 if you close the tab partway through, changes made in this session won't be kept."}
        </p>
      </div>
    </section>
  );
}
