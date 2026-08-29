import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getFoodDiaryForUser, getFoodDiaryRoundsForUser, insertFoodDiary, updateFoodDiary } from "@/lib/db";
import { uploadClientDocument, deleteClientDocument } from "@/lib/blob";
import { generateFoodDiaryDocx } from "@/lib/food-diary-docx";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const roundParam = searchParams.get("round");
  const requestedRound = roundParam ? parseInt(roundParam, 10) : undefined;

  const rounds = await getFoodDiaryRoundsForUser(session.user.id as string);
  const latestRound = rounds.length > 0 ? rounds[rounds.length - 1].round : 0;

  // A requested round beyond anything saved yet means the client is
  // starting a fresh one (e.g. clicked "Start a new food diary") — that's
  // a deliberate blank slate, not a lookup that should 404.
  const isNewRound = requestedRound !== undefined && requestedRound > latestRound;
  const targetRound = requestedRound ?? (latestRound || 1);
  const existing = isNewRound ? null : rounds.find((r) => r.round === targetRound) ?? null;

  return NextResponse.json({
    answers: existing?.answers ?? null,
    name: session.user.name ?? null,
    round: targetRound,
    latestRound: latestRound || 1,
    rounds: rounds.map((r) => ({ round: r.round, uploadedAt: r.uploaded_at })),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "You need to be logged in to submit your food diary." }, { status: 401 });
  }

  const body = await req.json();
  const answers = body?.answers;
  const round = typeof body?.round === "number" && body.round > 0 ? Math.floor(body.round) : 1;
  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "Missing form answers." }, { status: 400 });
  }

  try {
    const buffer = await generateFoodDiaryDocx(answers, session.user.name ?? "Client", round);
    const safeName = (session.user.name ?? "client").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const fileName = `food-diary-${safeName}-round${round}-${Date.now()}.docx`;
    const { pathname } = await uploadClientDocument(fileName, buffer);

    const existing = await getFoodDiaryForUser(session.user.id as string, round);

    if (existing) {
      await updateFoodDiary(existing.id, pathname, answers);
      try {
        await deleteClientDocument(existing.blob_url);
      } catch (cleanupErr) {
        console.error("Failed to delete superseded food diary blob:", cleanupErr);
      }
    } else {
      await insertFoodDiary(session.user.id as string, pathname, answers, round);
    }

    return NextResponse.json({ ok: true, round });
  } catch (err) {
    console.error("Food diary submission failed:", err);
    return NextResponse.json(
      { error: "Something went wrong saving your food diary. Please try again shortly." },
      { status: 500 }
    );
  }
}
