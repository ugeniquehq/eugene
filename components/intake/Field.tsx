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
  <label style={{ fontFamily: "var(--font-mono)", fontSize: "var(--step-1)", letterSpacing: "0.04em", color: "var(--color-ink-soft)", display: "block", marginBottom: "0.35rem", fontWeight: 700 }}>
    {field.label}
    {field.helper && (
      <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "var(--step-2)", color: "var(--color-ink-soft)", marginTop: "0.15rem", textTransform: "none", letterSpacing: "normal", fontWeight: 400 }}>
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

    case "date":
      return (
        <div className="field">
          {commonLabel}
          <input type="date" value={(value as string) ?? ""} onChange={(e) => update(e.target.value)} />
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
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "0.35rem" }}>
        {Array.from({ length: 11 }, (_, i) => i).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => update(n)}
            className={numeric === n ? "btn btn-primary" : "btn btn-secondary"}
            style={{
              width: "2.5rem",
              padding: "0.4rem 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
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

    case "images": {
      const photos = Array.isArray(value) ? (value as { name: string; dataUrl: string }[]) : [];

      async function resizeToDataUrl(file: File): Promise<string> {
        const objectUrl = URL.createObjectURL(file);
        try {
          const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const el = new Image();
            el.onload = () => resolve(el);
            el.onerror = reject;
            el.src = objectUrl;
          });
          const maxDim = 1400;
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL("image/jpeg", 0.75);
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      }

      async function handleFiles(fileList: FileList | null) {
        if (!fileList || fileList.length === 0) return;
        const newPhotos = await Promise.all(
          Array.from(fileList).map(async (file) => ({
            name: file.name,
            dataUrl: await resizeToDataUrl(file),
          }))
        );
        update([...photos, ...newPhotos]);
      }

      function removePhoto(index: number) {
        update(photos.filter((_, i) => i !== index));
      }

      return (
        <div className="field">
          {commonLabel}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
          />
          {photos.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(6rem, 1fr))", gap: "0.5rem", marginTop: "0.75rem" }}>
              {photos.map((photo, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img
                    src={photo.dataUrl}
                    alt={photo.name}
                    style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "var(--radius)", border: "1px solid var(--color-line)" }}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    aria-label={`Remove ${photo.name}`}
                    style={{
                      position: "absolute",
                      top: "-0.4rem",
                      right: "-0.4rem",
                      width: "1.5rem",
                      height: "1.5rem",
                      borderRadius: "50%",
                      border: "1px solid var(--color-line)",
                      background: "var(--color-surface)",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      lineHeight: 1,
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    default:
      return null;
  }
}
