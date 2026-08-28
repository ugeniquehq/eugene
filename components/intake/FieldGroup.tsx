"use client";

import Field from "@/components/intake/Field";
import type { IntakeField } from "@/lib/intake-schema";
import type { IntakeAnswers } from "@/lib/intake-answers";

// A minimal shape covering both FoodDiaryField and TemperatureField so this
// component can group either without depending on either schema directly.
interface GroupableField {
  key: string;
  label: string;
  helper?: string;
  type: string;
  options?: string[];
  inlineWithNext?: boolean;
}

interface FieldGroupProps {
  fields: GroupableField[];
  answers: IntakeAnswers;
  onChange: (next: IntakeAnswers) => void;
}

function toIntakeField(field: GroupableField): IntakeField {
  const { inlineWithNext: _inlineWithNext, ...rest } = field;
  return rest as IntakeField;
}

// Renders a list of fields, pairing up any field marked `inlineWithNext`
// with the field right after it in a side-by-side row (used for a meal's
// time sitting next to the meal itself, or a reading's time next to its
// value) instead of each one stacking full-width down the page.
export default function FieldGroup({ fields, answers, onChange }: FieldGroupProps) {
  const rows: GroupableField[][] = [];
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (field.inlineWithNext && i + 1 < fields.length) {
      rows.push([field, fields[i + 1]]);
      i++;
    } else {
      rows.push([field]);
    }
  }

  return (
    <>
      {rows.map((row) =>
        row.length === 2 ? (
          <div key={row[0].key} style={{ display: "flex", gap: "var(--space-sm)", alignItems: "flex-start" }}>
            <div style={{ flex: "0 0 9rem" }}>
              <Field field={toIntakeField(row[0])} answers={answers} onChange={onChange} />
            </div>
            <div style={{ flex: "1 1 auto", minWidth: 0 }}>
              <Field field={toIntakeField(row[1])} answers={answers} onChange={onChange} />
            </div>
          </div>
        ) : (
          <Field key={row[0].key} field={toIntakeField(row[0])} answers={answers} onChange={onChange} />
        )
      )}
    </>
  );
}
