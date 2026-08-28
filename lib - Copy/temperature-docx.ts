import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import { TEMPERATURE_STEPS } from "@/lib/temperature-schema";

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
  if (Array.isArray(current)) return current.join(", ");
  return typeof current === "string" ? current : "";
}

export async function generateTemperatureDocx(answers: Answers, clientName: string): Promise<Buffer> {
  const children: Paragraph[] = [
    new Paragraph({
      text: "14-Day Body Temperature Tracking",
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({
      children: [new TextRun({ text: `Client: ${clientName}`, bold: true })],
    }),
    new Paragraph({ text: "" }),
  ];

  for (const step of TEMPERATURE_STEPS) {
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