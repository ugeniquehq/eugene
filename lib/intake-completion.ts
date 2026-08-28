// Single source of truth for whether a client's Health History is
// genuinely finished. Rather than a stored flag that can drift out of
// sync, completion is always computed fresh from whatever answers are
// currently saved — used both to gate the client-facing form and to show
// status on the practitioner's client list.
//
// "Complete" means every applicable field has *something* in it — the
// intake's own instructions tell clients to write "not relevant" rather
// than skip a question, so a blank field is always a gap, never a valid
// answer. Checkbox lists and photo uploads are the exception: an empty
// selection ("none of these apply") is itself a meaningful answer, so
// those are never counted as missing.
import { INTAKE_STEPS, IntakeField } from "@/lib/intake-schema";
import { IntakeAnswers, getValue } from "@/lib/intake-answers";

export interface MissingField {
  stepIndex: number;
  stepId: string;
  stepTitle: string;
  fieldLabel: string;
}

function isFieldApplicable(field: IntakeField, answers: IntakeAnswers): boolean {
  if (!field.showIf) return true;
  return getValue(answers, field.showIf.key) === field.showIf.equals;
}

function isFieldRequired(field: IntakeField): boolean {
  return field.type !== "checkboxes" && field.type !== "images";
}

function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

export function getMissingFields(answers: IntakeAnswers): MissingField[] {
  const missing: MissingField[] = [];
  INTAKE_STEPS.forEach((step, stepIndex) => {
    step.fields.forEach((field) => {
      if (!isFieldRequired(field)) return;
      if (!isFieldApplicable(field, answers)) return;
      if (isEmptyValue(getValue(answers, field.key))) {
        missing.push({ stepIndex, stepId: step.id, stepTitle: step.title, fieldLabel: field.label });
      }
    });
  });
  return missing;
}

export function isIntakeComplete(answers: IntakeAnswers | null): boolean {
  if (!answers) return false;
  return getMissingFields(answers).length === 0;
}

export function countRequiredFields(answers: IntakeAnswers): { total: number; answered: number } {
  let total = 0;
  let answered = 0;
  INTAKE_STEPS.forEach((step) => {
    step.fields.forEach((field) => {
      if (!isFieldRequired(field)) return;
      if (!isFieldApplicable(field, answers)) return;
      total++;
      if (!isEmptyValue(getValue(answers, field.key))) answered++;
    });
  });
  return { total, answered };
}
