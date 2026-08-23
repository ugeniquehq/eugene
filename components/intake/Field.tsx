"use client";

import { IntakeField } from "@/lib/intake-schema";
import { getValue, setValue, IntakeAnswers } from "@/lib/intake-answers";

interface FieldProps {
  field: IntakeField;
  answers: IntakeAnswers;
  onChange: (next: IntakeAnswers) => void;
}

export default function Field({ field, answers, onChange }: FieldProps) {
  const value = getValue(answers, field.key);

  function update(v: unknown) {
    onChange(setValue(answers, field.key, v));
  }

  if (field.showIf) {
    const controllingValue = getValue(answers, field.showIf.key);
    if (controllingValue !== field.showIf.equals) return null;
  }

  const commonLabel = (
    <label style={{ fontFamily: "var(--font-mono)", fontSize: "var(--step-1)", letterSpacing: "0.04em", color: "var(--color-ink-soft)", display: "block", marginBottom: "0.35rem" }}>
      {field.label}
      {field.helper && (
        <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "var(--step0)", color: "var(--color-ink-soft)", marginTop: "0.15rem", textTransform: "none", letterSpacing: "normal" }}>
          {field.helper}
        </span>
      )}
    </label>
  );

  switch (field.type) {
    case "text":
      return (
        <div className="field">
          {commonLabel}
          <input type="text" value={(value as string) ?? ""} onChange={(e) => update(e.target.value)} />
        </div>
      );

    case "textarea":
      return (
        <div className="field">
          {commonLabel}
          <textarea rows={4} value={(value as string) ?? ""} onChange={(e) => update(e.target.value)} />
        </div>
      );

    case "select":
      return (
        <div className="field">
          {commonLabel}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {field.options?.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => update(opt)}
                className={value === opt ? "btn btn-primary" : "btn btn-secondary"}
                style={{ padding: "0.5rem 1rem", fontSize: "var(--step-1)" }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );

    case "yesno":
      return (
        <div className="field">
          {commonLabel}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["Yes", "No"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => update(opt)}
                className={value === opt ? "btn btn-primary" : "btn btn-secondary"}
                style={{ padding: "0.5rem 1.25rem" }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );

    case "yesnounsure":
      return (
        <div className="field">
          {commonLabel}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["Yes", "No", "Unsure"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => update(opt)}
                className={value === opt ? "btn btn-primary" : "btn btn-secondary"}
                style={{ padding: "0.5rem 1.25rem" }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );

    case "scale": {
      const numeric = typeof value === "number" ? value : null;
      return (
        <div className="field">
          {commonLabel}
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
            {Array.from({ length: 11 }, (_, i) => i).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => update(n)}
                className={numeric === n ? "btn btn-primary" : "btn btn-secondary"}
                style={{ width: "2.5rem", padding: "0.4rem 0", textAlign: "center" }}
              >
                {n}
              </button>
            ))}
          </div>
          {field.scaleLabels && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--step-1)", color: "var(--color-ink-soft)" }}>
              <span>{field.scaleLabels[0]}</span>
              <span>{field.scaleLabels[1]}</span>
            </div>
          )}
        </div>
      );
    }

    case "checkboxes": {
      const checked = Array.isArray(value) ? (value as string[]) : [];
      function toggle(opt: string) {
        const next = checked.includes(opt) ? checked.filter((c) => c !== opt) : [...checked, opt];
        update(next);
      }
      return (
        <div className="field">
          {commonLabel}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(13rem, 1fr))",
              gap: "0.4rem 1rem",
              background: "var(--color-surface)",
              border: "1px solid var(--color-line)",
              borderRadius: "var(--radius)",
              padding: "0.75rem",
            }}
          >
            {field.options?.map((opt) => (
              <label key={opt} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "var(--step-1)", cursor: "pointer" }}>
                <input type="checkbox" checked={checked.includes(opt)} onChange={() => toggle(opt)} />
                {opt}
              </label>
            ))}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
