import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from "docx";
import { INTAKE_STEPS, IntakeField } from "@/lib/intake-schema";
import { getValue, IntakeAnswers } from "@/lib/intake-answers";

function formatAnswer(field: IntakeField, value: unknown): string {
  if (value === undefined || value === null || value === "") return "—";
  if (field.type === "checkboxes") {
    const arr = Array.isArray(value) ? (value as string[]) : [];
    return arr.length ? arr.join(", ") : "—";
  }
  if (field.type === "scale") {
    return typeof value === "number" ? String(value) : "—";
  }
  return String(value);
}

export async function generateIntakeDocx(
  answers: IntakeAnswers,
  clientName: string
): Promise<Buffer> {
  const children: Paragraph[] = [
    new Paragraph({
      text: "Health History",
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Submitted by: ${clientName}`, italics: true }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Date: ${new Date().toLocaleDateString()}`, italics: true }),
      ],
      spacing: { after: 300 },
    }),
  ];

  for (const step of INTAKE_STEPS) {
    children.push(
      new Paragraph({
        text: step.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 150 },
      })
    );

    for (const field of step.fields) {
      if (field.showIf) {
        const controllingValue = getValue(answers, field.showIf.key);
        if (controllingValue !== field.showIf.equals) continue;
      }

      const value = getValue(answers, field.key);
      children.push(
        new Paragraph({
          children: [new TextRun({ text: field.label, bold: true })],
          spacing: { before: 150 },
        }),
        new Paragraph({
          children: [new TextRun({ text: formatAnswer(field, value) })],
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: { size: { width: 12240, height: 15840 } }, // US Letter
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}
