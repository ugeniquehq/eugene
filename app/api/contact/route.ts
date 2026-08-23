import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().optional(),
});

// The address the form actually delivers to. Sandbox mode (no verified
// domain yet) only allows sending to the address tied to the Resend
// account itself — this needs to match that account's email.
const RECIPIENT = "ugeniquehq@gmail.com";

// Sandbox "from" address. Swap for something branded (e.g.
// contact@welladjusted.com) once the domain is verified in Resend.
const FROM = "onboarding@resend.dev";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please fill in your name and a valid email address." },
      { status: 400 }
    );
  }

  const { name, email, message } = parsed.data;

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again shortly." },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: FROM,
      to: RECIPIENT,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message ?? "").replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend send failed:", err);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again shortly." },
      { status: 500 }
    );
  }
}

// Minimal escaping since this HTML is built from user input.
function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
