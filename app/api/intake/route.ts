import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getHealthHistoryForUser, insertHealthHistory, updateHealthHistory } from "@/lib/db";
import { uploadClientDocument, deleteClientDocument } from "@/lib/blob";
import { generateIntakeDocx } from "@/lib/intake-docx";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const existing = await getHealthHistoryForUser(session.user.id as string);
  return NextResponse.json({ answers: existing?.answers ?? null });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "You need to be logged in to submit your health history." }, { status: 401 });
  }

  const body = await req.json();
  const answers = body?.answers;
  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "Missing form answers." }, { status: 400 });
  }

  try {
    const buffer = await generateIntakeDocx(answers, session.user.name ?? "Client");
    const safeName = (session.user.name ?? "client").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const fileName = `health-history-${safeName}-${Date.now()}.docx`;
    const { pathname } = await uploadClientDocument(fileName, buffer);

    const existing = await getHealthHistoryForUser(session.user.id as string);

    if (existing) {
      await updateHealthHistory(existing.id, pathname, answers);
      // Best-effort cleanup of the superseded file — if this fails, the
      // old blob just lingers unused rather than breaking the update.
      try {
        await deleteClientDocument(existing.blob_url);
      } catch (cleanupErr) {
        console.error("Failed to delete superseded health history blob:", cleanupErr);
      }
    } else {
      await insertHealthHistory(session.user.id as string, pathname, answers);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Intake submission failed:", err);
    return NextResponse.json(
      { error: "Something went wrong saving your health history. Please try again shortly." },
      { status: 500 }
    );
  }
}
