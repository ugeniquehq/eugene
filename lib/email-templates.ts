// Canned emails a practitioner can send to a batch of selected clients from
// /portal/admin/emails. Keep these short and editable — the admin UI lets
// the practitioner tweak subject/body before sending, this is just a
// starting point per occasion.

export interface EmailTemplate {
  id: string;
  label: string;
  subject: string;
  body: string; // plain text with {{firstName}} placeholders; converted to simple HTML on send
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "welcome",
    label: "Welcome / getting started",
    subject: "Welcome to The Biology of You",
    body:
      "Hi {{firstName}},\n\n" +
      "Welcome to The Biology of You! Your client portal is ready to go.\n\n" +
      "The first step is your Health History — it usually takes about 20 minutes, and everything you enter is saved as you go, so you can finish it in more than one sitting.\n\n" +
      "Log in any time at the client portal to pick up where you left off.\n\n" +
      "Looking forward to getting to know your biology.\n\n" +
      "Warmly,\nThe Biology of You",
  },
  {
    id: "intake-reminder",
    label: "Reminder to complete Health History",
    subject: "A quick reminder — your Health History",
    body:
      "Hi {{firstName}},\n\n" +
      "Just a friendly nudge — we're missing your Health History, and it's an important piece of building your Biology of You report.\n\n" +
      "It's saved automatically as you go, so feel free to do it in a few short sessions rather than all at once.\n\n" +
      "Let us know if you hit any snags.\n\n" +
      "Warmly,\nThe Biology of You",
  },
  {
    id: "report-ready",
    label: "Your report is ready",
    subject: "Your Biology of You report is ready",
    body:
      "Hi {{firstName}},\n\n" +
      "Good news — your Biology of You report is ready and waiting for you in the client portal.\n\n" +
      "Log in any time to view or download it. If you'd like to talk through anything in it, just reply to this email.\n\n" +
      "Warmly,\nThe Biology of You",
  },
];

export function renderTemplate(body: string, vars: { firstName: string }): string {
  return body.replaceAll("{{firstName}}", vars.firstName || "there");
}

export function textToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<p>${escaped.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br />")}</p>`;
}
