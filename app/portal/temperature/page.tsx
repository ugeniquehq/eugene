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

type RoundInfo = { round: number; uploadedAt: string };

export default function TemperaturePage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [clientName, setClientName] = useState<string | null>(null);
  const [round, setRound] = useState(1);
  const [rounds, setRounds] = useState<RoundInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function loadRound(targetRound?: number) {
    setLoading(true);
    const url = targetRound ? `/api/temperature?round=${targetRound}` : "/api/temperature";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data?.name) setClientName(data.name);
        setRounds(data?.rounds ?? []);
        setRound(data?.round ?? 1);
        setAnswers(data?.answers ?? {});
        setStepIndex(0);
      })
      .catch(() => {
        // Starts blank if this fails — not worth blocking on.
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const wantsNew = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("new") === "1";
    if (!wantsNew) {
      loadRound();
      return;
    }
    // Client asked to start a fresh record — find the next round number,
    // then load it (the API returns a blank slate for a round beyond
    // anything saved yet).
    fetch("/api/temperature")
      .then((res) => res.json())
      .then((data) => {
        if (data?.name) setClientName(data.name);
        const rounds = data?.rounds ?? [];
        setRounds(rounds);
        const nextRound = (data?.latestRound ?? 1) + (rounds.length > 0 ? 1 : 0);
        setRound(nextRound || 1);
        setAnswers({});
        setStepIndex(0);
      })
      .catch(() => {
        setRound(1);
        setAnswers({});
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = TEMPERATURE_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === TEMPERATURE_STEPS.length - 1;
  const progress = Math.round(((stepIndex + 1) / TEMPERATURE_STEPS.length) * 100);
  const photo = getPhotoForStep(step.id);
  const heading = clientName ? `${possessive(clientName)} Temperature Record` : "Temperature Record";
  const highestKnownRound = Math.max(round, ...rounds.map((r) => r.round), 1);

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
        body: JSON.stringify({ answers, round }),
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

  function handleStartNew() {
    if (status === "submitting") return;
    const nextRound = highestKnownRound + 1;
    setRound(nextRound);
    setAnswers({});
    setStepIndex(0);
    setError(null);
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

          {(rounds.length > 1 || round > 1) && (
            <div
              role="tablist"
              aria-label="Switch temperature record round"
              style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "var(--space-sm)" }}
            >
              {Array.from({ length: highestKnownRound }, (_, i) => i + 1).map((r) => (
                <button
                  key={r}
                  type="button"
                  role="tab"
                  aria-selected={r === round}
                  onClick={() => loadRound(r)}
                  disabled={status === "submitting"}
                  className={r === round ? "btn btn-primary" : "btn btn-secondary"}
                  style={{ padding: "0.3rem 0.75rem", fontSize: "var(--step-1)" }}
                >
                  Round {r}
                </button>
              ))}
              {round === highestKnownRound && rounds.some((r) => r.round === round) && (
                <button
                  type="button"
                  onClick={handleStartNew}
                  disabled={status === "submitting"}
                  className="btn btn-secondary"
                  style={{ padding: "0.3rem 0.75rem", fontSize: "var(--step-1)" }}
                >
                  + Start new
                </button>
              )}
            </div>
          )}

          <p className="eyebrow">
            {heading}
            {round > 1 ? ` · Round ${round}` : ""} &middot; Day {stepIndex === 0 ? "—" : stepIndex} of 14
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
