export type IntakeAnswers = Record<string, unknown>;

export function getValue(answers: IntakeAnswers, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, answers);
}

export function setValue(answers: IntakeAnswers, key: string, value: unknown): IntakeAnswers {
  const parts = key.split(".");
  const next = structuredClone(answers);
  let cursor: Record<string, unknown> = next;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (typeof cursor[part] !== "object" || cursor[part] === null) {
      cursor[part] = {};
    }
    cursor = cursor[part] as Record<string, unknown>;
  }
  cursor[parts[parts.length - 1]] = value;
  return next;
}
