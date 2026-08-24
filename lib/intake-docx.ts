import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  HeadingLevel,
} from "docx";
import { imageSize } from "image-size";
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

function parseDataUrl(dataUrl: string): { buffer: Buffer; mime: string } | null {
  const match = /^data:(image\/\w+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  return { buffer: Buffer.from(match[2], "base64"), mime: match[1] };
}

function docxImageType(mime: string): "jpg" | "png" | "gif" | "bmp" {
  if (mime.includes("png")) return "png";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("bmp")) return "bmp";
  return "jpg";
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
        })
      );

      if (field.type === "images") {
        const photos = Array.isArray(value) ? (value as { name: string; dataUrl: string }[]) : [];

        if (photos.length === 0) {
          children.push(new Paragraph({ children: [new TextRun({ text: "—" })] }));
          continue;
        }

        for (const photo of photos) {
          const parsed = parseDataUrl(photo.dataUrl);
          if (!parsed) continue;

          let width = 300;
          let height = 300;
          try {
            const dims = imageSize(parsed.buffer);
            if (dims.width && dims.height) {
              const scale = 300 / dims.width;
              width = 300;
              height = Math.round(dims.height * scale);
            }
          } catch {
            // If dimensions can't be read, fall back to a default square —
            // not worth failing the whole submission over one bad photo.
          }

          children.push(
            new Paragraph({
              children: [
                new ImageRun({
                  type: docxImageType(parsed.mime),
                  data: parsed.buffer,
                  transformation: { width, height },
                }),
              ],
              spacing: { after: 150 },
            })
          );
        }
        continue;
      }

      children.push(
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
