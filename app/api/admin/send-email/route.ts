import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { auth } from "@/auth";
import { getAllClientsDetailed } from "@/lib/db";
import { renderTemplate, textToHtml, EMAIL_FROM_ADDRESSES } from "@/lib/email-templates";

const sendSchema = z.object({
  clientIds: z.array(z.string()).min(1),
  from: z.enum(EMAIL_FROM_ADDRESSES as [string, ...string[]]),
  subject: z.string().min(1),
  body: z.string().min(1), // may still contain {{firstName}} etc. — resolved per-recipient below
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "practitioner") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing subject, body, recipients, or a valid from address." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Email sending isn't configured yet." }, { status: 500 });
  }

  const { clientIds, from, subject, body: templateBody } = parsed.data;
  const clients = await getAllClientsDetailed();
  const recipients = clients.filter((c) => clientIds.includes(c.id));

  if (recipients.length === 0) {
    return NextResponse.json({ error: "No matching clients found." }, { status: 400 });
  }

  // Note: Resend's sandbox mode (until a sending domain is verified on the
  // account) only actually delivers to the email address tied to the
  // Resend account itself, regardless of which of these addresses is
  // chosen as "from" or who it's addressed "to".
  const resend = new Resend(process.env.RESEND_API_KEY);

  const results = await Promise.allSettled(
    recipients.map((client) => {
      const personalised = renderTemplate(templateBody, { firstName: client.first_name });
      return resend.emails.send({
        from,
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
