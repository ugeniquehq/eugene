"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FOOD_DIARY_STEPS, dayStep, BASE_DAY_COUNT, FoodDiaryStep } from "@/lib/food-diary-schema";
import Field from "@/components/intake/Field";

const STEP_PHOTOS: Record<string, string> = {
  welcome: "/photography/hand-on-lips.jpg",
  personal: "/photography/womans-face.jpg",
};
const DEFAULT_PHOTO = "/photography/food-diary-default.jpg";

function getPhotoForStep(stepId: string): string {
  return STEP_PHOTOS[stepId] ?? DEFAULT_PHOTO;
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
          setAnswers(data.answers);
          const meta = data.answers.meta;
          if (meta && typeof meta === "object" && typeof meta.extraDays === "number") {
            setExtraDays(meta.extraDays);
          }
        }
      })
      .catch(() => {
        // Starts blank if this fails — not worth blocking on.
      })
      .finally(() => setLoading(false));
  }, []);

  const allSteps: FoodDiaryStep[] = useMemo(
    () => [
      ...FOOD_DIARY_STEPS,
      ...Array.from({ length: extraDays }, (_, i) => dayStep(BASE_DAY_COUNT + i + 1)),
    ],
    [extraDays]
  );

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