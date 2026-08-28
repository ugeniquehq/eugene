import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getTemperatureRecordForUser, insertTemperatureRecord, updateTemperatureRecord } from "@/lib/db";
import { uploadClientDocument, deleteClientDocument } from "@/lib/blob";
import { generateTemperatureDocx } from "@/lib/temperature-docx";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const existing = await getTemperatureRecordForUser(session.user.id as string);
  return NextResponse.json({ answers: existing?.answers ?? null, name: session.user.name ?? null });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "You need to be logged in to submit your temperature record." }, { status: 401 });
  }

  const body = await req.json();
  const answers = body?.answers;
  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "Missing form answers." }, { status: 400 });
  }

  try {
    const buffer = await generateTemperatureDocx(answers, session.user.name ?? "Client");
    const safeName = (session.user.name ?? "client").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const fileName = `temperature-record-${safeName}-${Date.now()}.docx`;
    const { pathname } = await uploadClientDocument(fileName, buffer);

    const existing = await getTemperatureRecordForUser(session.user.id as string);

    if (existing) {
      await updateTemperatureRecord(existing.id, pathname, answers);
      try {
        await deleteClientDocument(existing.blob_url);
      } catch (cleanupErr) {
        console.error("Failed to delete superseded temperature record blob:", cleanupErr);
      }
    } else {
      await insertTemperatureRecord(session.user.id as string, pathname, answers);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Temperature record submission failed:", err);
    return NextResponse.json(
      { error: "Something went wrong saving your temperature record. Please try again shortly." },
      { status: 500 }
    );
  }
}