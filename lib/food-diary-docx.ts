import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import { FOOD_DIARY_STEPS, dayStep, BASE_DAY_COUNT } from "@/lib/food-diary-schema";

type Answers = Record<string, unknown>;

function getValue(answers: Answers, key: string): string {
  const parts = key.split(".");
  let current: unknown = answers;
  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return "";
    }
  }
  return typeof current === "string" ? current : "";
}

export async function generateFoodDiaryDocx(answers: Answers, clientName: string, round: number = 1): Promise<Buffer> {
  const extraDays = typeof answers.meta === "object" && answers.meta !== null
    ? (answers.meta as Record<string, unknown>).extraDays
    : 0;
  const extraDayCount = typeof extraDays === "number" ? extraDays : 0;

  const allSteps = [
    ...FOOD_DIARY_STEPS,
    ...Array.from({ length: extraDayCount }, (_, i) => dayStep(BASE_DAY_COUNT + i + 1)),
  ];

  const children: Paragraph[] = [
    new Paragraph({
      text: round > 1 ? `Seven Days of Meals — Round ${round}` : "Seven Days of Meals",
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({
      children: [new TextRun({ text: `Client: ${clientName}`, bold: true })],
    }),
    new Paragraph({ text: "" }),
  ];

  for (const step of allSteps) {
    if (step.fields.length === 0) continue;

    children.push(
      new Paragraph({
        text: step.title,
        heading: HeadingLevel.HEADING_1,
      })
    );

    for (const field of step.fields) {
      const value = getValue(answers, field.key);
      children.push(
        new Paragraph({
          children: [new TextRun({ text: field.label, bold: true })],
        }),
        new Paragraph({
          text: value || "—",
        }),
        new Paragraph({ text: "" })
      );
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  return Packer.toBuffer(doc);
}