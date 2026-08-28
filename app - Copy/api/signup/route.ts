import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sql, getUserByEmail } from "@/lib/db";

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form — all fields are required and passwords need 8+ characters." },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "An account already exists for that email." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await sql`
    INSERT INTO users (name, email, password_hash)
    VALUES (${name}, ${email}, ${passwordHash});
  `;

  return NextResponse.json({ ok: true });
}
