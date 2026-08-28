import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { auth } from "@/auth";
import { getAllClientsDetailed } from "@/lib/db";
import { textToHtml } from "@/lib/email-templates";

const sendSchema = z.object({
  clientIds: z.array(z.string()).min(1),
  subject: z.string().min(1),
  body: z.string().min(1), // already has {{firstName}} resolved per-recipient on the client side isn't safe, so resolve here
});

// Sandbox "from" address, same as the contact form — swap for something
// branded (e.g. hello@thebiologyofyou.com) once the domain is verified in
// Resend. Until then, Resend's sandbox mode will only actually deliver to
// the email address tied to the Resend account itself, regardless of who
// this endpoint is told to send to.
const FROM = "onboarding@resend.dev";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "practitioner") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing subject, body, or recipients." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Email sending isn't configured yet." }, { status: 500 });
  }

  const { clientIds, subject, body: templateBody } = parsed.data;
  const clients = await getAllClientsDetailed();
  const recipients = clients.filter((c) => clientIds.includes(c.id));

  if (recipients.length === 0) {
    return NextResponse.json({ error: "No matching clients found." }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const results = await Promise.allSettled(
    recipients.map((client) => {
      const personalised = templateBody.replaceAll("{{firstName}}", client.first_name || "there");
      return resend.emails.send({
        from: FROM,
        to: client.email,
        subject,
        html: textToHtml(personalised),
      });
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.length - sent;

  return NextResponse.json({ ok: true, sent, failed, total: results.length });
}
