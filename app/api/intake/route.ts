import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { uploadClientDocument } from "@/lib/blob";
import { generateIntakeDocx } from "@/lib/intake-docx";

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

    await sql`
      INSERT INTO documents (user_id, title, blob_url)
      VALUES (${session.user.id as string}, ${"Health History"}, ${pathname});
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Intake submission failed:", err);
    return NextResponse.json(
      { error: "Something went wrong saving your health history. Please try again shortly." },
      { status: 500 }
    );
  }
}
