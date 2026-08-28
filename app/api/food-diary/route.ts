import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getFoodDiaryForUser, insertFoodDiary, updateFoodDiary } from "@/lib/db";
import { uploadClientDocument, deleteClientDocument } from "@/lib/blob";
import { generateFoodDiaryDocx } from "@/lib/food-diary-docx";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const existing = await getFoodDiaryForUser(session.user.id as string);
  return NextResponse.json({ answers: existing?.answers ?? null, name: session.user.name ?? null });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "You need to be logged in to submit your food diary." }, { status: 401 });
  }

  const body = await req.json();
  const answers = body?.answers;
  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "Missing form answers." }, { status: 400 });
  }

  try {
    const buffer = await generateFoodDiaryDocx(answers, session.user.name ?? "Client");
    const safeName = (session.user.name ?? "client").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const fileName = `food-diary-${safeName}-${Date.now()}.docx`;
    const { pathname } = await uploadClientDocument(fileName, buffer);

    const existing = await getFoodDiaryForUser(session.user.id as string);

    if (existing) {
      await updateFoodDiary(existing.id, pathname, answers);
      try {
        await deleteClientDocument(existing.blob_url);
      } catch (cleanupErr) {
        console.error("Failed to delete superseded food diary blob:", cleanupErr);
      }
    } else {
      await insertFoodDiary(session.user.id as string, pathname, answers);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Food diary submission failed:", err);
    return NextResponse.json(
      { error: "Something went wrong saving your food diary. Please try again shortly." },
      { status: 500 }
    );
  }
}