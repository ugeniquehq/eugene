"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FOOD_DIARY_STEPS, dayStep, BASE_DAY_COUNT, FoodDiaryStep } from "@/lib/food-diary-schema";
import { getValue } from "@/lib/intake-answers";
import Field from "@/components/intake/Field";

const STEP_PHOTOS: Record<string, string> = {
  welcome: "/photography/hand-on-lips.jpg",
  personal: "/photography/womans-face.jpg",
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
  if (step.id === "personal") return "You";
  return `Day ${index - 1}`; // steps 0 and 1 are welcome/personal, days start at index 2
}

export default function FoodDiaryPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [extraDays, setExtraDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/food-diary")
      .then((res) => res.json())
      .then((data) => {
        if (data?.answers) {
          const loadedAnswers = data.answers;
          setAnswers(loadedAnswers);

          const meta = loadedAnswers.meta;
          const loadedExtraDays =
            meta && typeof meta === "object" && typeof meta.extraDays === "number" ? meta.extraDays : 0;
          setExtraDays(loadedExtraDays);

          // Resume where they left off: jump to the first step that isn't
          // fully filled in yet, rather than always starting back at the
          // welcome page. If everything's already filled in, land on the
          // last step so they can add another day or finish up.
          const loadedSteps = buildSteps(loadedExtraDays);
          const firstIncomplete = loadedSteps.findIndex((s) => !isStepComplete(s, loadedAnswers));
          setStepIndex(firstIncomplete === -1 ? loadedSteps.length - 1 : firstIncomplete);
        }
      })
      .catch(() => {
        // Starts blank if this fails — not worth blocking on.
      })
      .finally(() => setLoading(false));
  }, []);

  const allSteps: FoodDiaryStep[] = useMemo(() => buildSteps(extraDays), [extraDays]);

  const step = allSteps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === allSteps.length - 1;
  const progress = Math.round(((stepIndex + 1) / allSteps.length) * 100);
  const photo = getPhotoForStep(step.id);

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
        body: JSON.stringify({ answers: toSave }),
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

  return (
    <section className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div className="intake-photo-fixed" style={{ backgroundImage: `url(${photo})` }} />

      <div className="intake-form-col">
        <div style={{ maxWidth: "40rem" }}>
          <p className="eyebrow">
            Food Diary &middot; Step {stepIndex + 1} of {allSteps.length}
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
              {step.fields.map((field) => (
                <Field
                  key={field.key}
                  field={{ ...field, options: undefined }}
                  answers={answers}
                  onChange={setAnswers}
                />
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
