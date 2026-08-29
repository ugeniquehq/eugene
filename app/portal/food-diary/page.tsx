"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FOOD_DIARY_STEPS, dayStep, BASE_DAY_COUNT, FoodDiaryStep } from "@/lib/food-diary-schema";
import { getValue } from "@/lib/intake-answers";
import FieldGroup from "@/components/intake/FieldGroup";

const STEP_PHOTOS: Record<string, string> = {
  welcome: "/photography/hand-on-lips.jpg",
};
const DEFAULT_PHOTO = "/photography/food-diary-default.jpg";

function getPhotoForStep(stepId: string): string {
  return STEP_PHOTOS[stepId] ?? DEFAULT_PHOTO;
}

function buildSteps(extraDays: number): FoodDiaryStep[] {
  return [
    ...FOOD_DIARY_STEPS,
    ...Array.from({ length: extraDays }, (_, i) => dayStep(BASE_DAY_COUNT + i + 1)),
  ];
}

// A step counts as "done" once every field on it has something in it.
// Steps with no fields (like the welcome page) are treated as done —
// there's nothing to fill in, so they shouldn't block auto-resume.
function isStepComplete(step: FoodDiaryStep, answers: Record<string, unknown>): boolean {
  if (step.fields.length === 0) return true;
  return step.fields.every((field) => {
    const value = getValue(answers, field.key);
    return value !== undefined && value !== null && value !== "";
  });
}

function shortLabel(step: FoodDiaryStep, index: number): string {
  if (step.id === "welcome") return "Start";
  return `Day ${index}`; // step 0 is welcome, day steps start at index 1
}

function possessive(name: string): string {
  return name.endsWith("s") ? `${name}'` : `${name}'s`;
}

type RoundInfo = { round: number; uploadedAt: string };

export default function FoodDiaryPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [extraDays, setExtraDays] = useState(0);
  const [clientName, setClientName] = useState<string | null>(null);
  const [round, setRound] = useState(1);
  const [rounds, setRounds] = useState<RoundInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function applyLoadedAnswers(loadedAnswers: Record<string, unknown> | null) {
    if (!loadedAnswers) {
      setAnswers({});
      setExtraDays(0);
      setStepIndex(0);
      return;
    }
    setAnswers(loadedAnswers);
    const meta = loadedAnswers.meta;
    const loadedExtraDays =
      meta && typeof meta === "object" && typeof (meta as Record<string, unknown>).extraDays === "number"
        ? (meta as Record<string, number>).extraDays
        : 0;
    setExtraDays(loadedExtraDays);

    // Resume where they left off: jump to the first step that isn't fully
    // filled in yet, rather than always starting back at the welcome page.
    // If everything's already filled in, land on the last step so they can
    // add another day or finish up.
    const loadedSteps = buildSteps(loadedExtraDays);
    const firstIncomplete = loadedSteps.findIndex((s) => !isStepComplete(s, loadedAnswers));
    setStepIndex(firstIncomplete === -1 ? loadedSteps.length - 1 : firstIncomplete);
  }

  function loadRound(targetRound?: number) {
    setLoading(true);
    const url = targetRound ? `/api/food-diary?round=${targetRound}` : "/api/food-diary";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data?.name) setClientName(data.name);
        setRounds(data?.rounds ?? []);
        setRound(data?.round ?? 1);
        applyLoadedAnswers(data?.answers ?? null);
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
    // Client asked to start a fresh diary — find the next round number,
    // then start it blank (the API treats a round beyond anything saved
    // yet as a fresh slate once they save).
    fetch("/api/food-diary")
      .then((res) => res.json())
      .then((data) => {
        if (data?.name) setClientName(data.name);
        const existingRounds: RoundInfo[] = data?.rounds ?? [];
        setRounds(existingRounds);
        const nextRound = (data?.latestRound ?? 1) + (existingRounds.length > 0 ? 1 : 0);
        setRound(nextRound || 1);
        applyLoadedAnswers(null);
      })
      .catch(() => {
        setRound(1);
        applyLoadedAnswers(null);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allSteps: FoodDiaryStep[] = useMemo(() => buildSteps(extraDays), [extraDays]);

  const step = allSteps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === allSteps.length - 1;
  const progress = Math.round(((stepIndex + 1) / allSteps.length) * 100);
  const photo = getPhotoForStep(step.id);
  const heading = clientName ? `${possessive(clientName)} Food Diary` : "Food Diary";
  const highestKnownRound = Math.max(round, ...rounds.map((r) => r.round), 1);

  if (loading) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: "40rem" }}>
          <p style={{ color: "var(--color-ink-soft)" }}>Loading your food diary…</p>
        </div>
      </section>
    );
  }

  function withMeta(current: Record<string, unknown>, days: number) {
    return { ...current, meta: { ...(current.meta as object), extraDays: days } };
  }

  async function saveAnswers(toSave: Record<string, unknown>) {
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/food-diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: toSave, round }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong saving your food diary. Please try again.");
        setStatus("error");
        return false;
      }
      setStatus("idle");
      return true;
    } catch {
      setError("Something went wrong saving your food diary. Please try again.");
      setStatus("error");
      return false;
    }
  }

  async function handleSaveNow() {
    await saveAnswers(withMeta(answers, extraDays));
  }

  async function handleFinish() {
    const ok = await saveAnswers(withMeta(answers, extraDays));
    if (ok) {
      router.push("/portal/dashboard");
      router.refresh();
    }
  }

  function handleAddDay() {
    const nextExtraDays = extraDays + 1;
    setExtraDays(nextExtraDays);
    setAnswers((prev) => withMeta(prev, nextExtraDays));
    // Jump straight to the newly added day once it exists in allSteps.
    setStepIndex(FOOD_DIARY_STEPS.length + nextExtraDays - 1);
  }

  function jumpTo(index: number) {
    if (status === "submitting") return;
    setStepIndex(index);
  }

  function handleStartNew() {
    if (status === "submitting") return;
    const nextRound = highestKnownRound + 1;
    setRound(nextRound);
    applyLoadedAnswers(null);
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
              aria-label="Switch food diary round"
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
            {round > 1 ? ` · Round ${round}` : ""} &middot; Step {stepIndex + 1} of {allSteps.length}
          </p>

          <div style={{ height: "4px", background: "var(--color-line)", borderRadius: "2px", marginBottom: "var(--space-sm)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "var(--gradient-brand)", transition: "width 0.2s ease" }} />
          </div>

          <div
            role="tablist"
            aria-label="Jump to a step"
            style={{
              display: "flex",
              gap: "0.35rem",
              overflowX: "auto",
              paddingBottom: "var(--space-sm)",
              marginBottom: "var(--space-sm)",
            }}
          >
            {allSteps.map((s, i) => {
              const complete = isStepComplete(s, answers);
              const isCurrent = i === stepIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  title={s.title}
                  onClick={() => jumpTo(i)}
                  disabled={status === "submitting"}
                  style={{
                    flex: "0 0 auto",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.3rem 0.6rem",
                    borderRadius: "999px",
                    border: `1px solid ${isCurrent ? "transparent" : "var(--color-line)"}`,
                    background: isCurrent ? "var(--gradient-brand)" : complete ? "var(--color-surface)" : "transparent",
                    color: isCurrent ? "#fff" : "var(--color-ink)",
                    fontSize: "var(--step-1)",
                    fontFamily: "var(--font-mono)",
                    cursor: status === "submitting" ? "default" : "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {complete && !isCurrent && <span aria-hidden="true">✓</span>}
                  {shortLabel(s, i)}
                </button>
              );
            })}
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

            <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
              {stepIndex > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSaveNow}
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Saving…" : "Save now"}
                </button>
              )}

              {isLast && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddDay}
                  disabled={status === "submitting"}
                >
                  + Add another day
                </button>
              )}

              {isLast ? (
                <button type="button" className="btn btn-primary" onClick={handleFinish} disabled={status === "submitting"}>
                  {status === "submitting" ? "Saving…" : "Save food diary"}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setStepIndex((i) => Math.min(allSteps.length - 1, i + 1))}
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
