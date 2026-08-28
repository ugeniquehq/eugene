// Canned emails a practitioner can send to a batch of selected clients from
// /portal/admin/emails. These are the two standard emails sent to every
// new client; {{firstName}} and the three portal links are filled in
// automatically per recipient. Anything in [SQUARE BRACKETS] varies
// client-to-client (DNA kit link, personalised lab panel, upload
// instructions) and is left for the practitioner to fill in by hand in the
// compose box before sending.

// TODO: confirm this is the right live domain for the client portal —
// swap it here if not, and every template link updates at once.
export const SITE_URL = "https://www.thebiologyofyou.com";

export const EMAIL_FROM_ADDRESSES = [
  "info@thebiologyofyou.com",
  "accounts@thebiologyofyou.com",
  "admin@thebiologyofyou.com",
];

export interface EmailTemplate {
  id: string;
  label: string;
  subject: string;
  body: string; // plain text with {{placeholders}}; converted to HTML on send
}

const TESTIMONIALS_1 = `What Clients Are Saying

"The only reason I can jog for the first time in years after chronic Lyme and co-infections is because of the incredible knowledge of Dr. Jen. You deserve the opportunity to learn from her!"
⭐⭐⭐⭐⭐
— Dr. Krysti Wick

"Jennifer is so thorough in her approach. You can tell she has really taken the time to dissect your paperwork to come up with the best plan for you. It's about truly healing and not just patching your symptoms. She made the process easy to understand and implement into my daily life. Looking forward to continuing to work together!"
⭐⭐⭐⭐⭐
— Dr. Kate McCann`;

const TESTIMONIALS_2 = `What Clients Are Saying

"Very detailed explanations and reports. Profound plan that's easy to understand and follow. Very client-centered! Thank you."
⭐⭐⭐⭐⭐
— Dr. Viktoria Meier

"I highly recommend Jen. She explained everything in a way that actually made sense. You can tell she genuinely cares and is an expert! Very grateful for her guidance, support, and expertise throughout the whole process."
— Dr Ben McDonell`;

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "welcome",
    label: "1. Welcome to The Biology of You",
    subject: "Welcome to The Biology of You",
    body:
`Hello {{firstName}},

Welcome to The Biology of You

We believe your biology is unique — and your healthcare should be too.

You may be here because something doesn't feel quite right. Perhaps your energy, sleep, hormones, digestion, mood, weight or recovery aren't what they used to be.

Or perhaps you already feel pretty well and simply want to understand your body better, protect your health and continue feeling strong, curious and fully engaged with life for years to come.

Either way, our starting point is the same:

Understand what makes you different.

Before we meet, we spend considerable time getting to know your biology — looking at your DNA, blood results, health and family history, current concerns, metabolism and nutrition to build a much more complete picture of you.

What your consultation package includes

Your comprehensive package is €1800 and includes:

* Detailed analysis of your health and family history
* Comprehensive SMART DNA pathway analysis
* Personalised laboratory analysis
* Your personalised Biology of You Report
* Your detailed Gene Appendix
* A 90-minute one-to-one consultation
* Four weeks of direct WhatsApp support following your consultation
* A 30-minute follow-up consultation
* Personalised resources and supporting information where appropriate

The goal isn't simply to give you another list of things you should and shouldn't do.

We want you to understand your biology — why certain things may work differently for you, where your body may be under greater demand, and what matters most for supporting your health going forward.

Health should give you more life — not more rules.

Step 1 — Payment

Full payment is required to begin the process and secure your place on our consultation waitlist.

Consultation Package: €1800

Please deposit payment to:

Beneficiary: Jennifer Barham-Floreani
Account number: 101158764
BSB Number: 772772
Bank: Revolut Payments Australia Pty Ltd

Once payment has been received, we'll get everything underway.

BEFORE YOU PROCEED

The Biology of You is designed for people looking to better understand their biology and take a personalised approach to improving their health, energy and resilience.

It may not be the appropriate service for you at this time if you are currently:

* Undergoing active chemotherapy or radiotherapy, or being treated for a newly diagnosed or unstable cancer
* Experiencing an acute or unstable medical condition requiring specialist management
* Recovering from a recent serious illness, hospitalisation or major surgery where immediate medical care and recovery should remain the priority

If none of these apply, you're welcome to proceed with payment.

If you have a current medical condition and aren't sure whether this consultation is appropriate for you right now, simply reply to this email before paying and we'll help you determine the appropriate next step.

ONCE YOU'VE PAID — TWO THINGS TO GET STARTED

Step 2 — Complete your Health History & Food Diary

1. Your Health History
{{healthHistoryLink}}
Please take your time with this. Your history gives us important clues about the demands your body has experienced over time — not just the symptoms you're experiencing today.

2. Your 7-Day Food Diary
{{foodDiaryLink}}
Please record what you actually eat rather than changing your diet for us.
We're not looking for a "perfect" week. We want an honest picture of how you're currently fuelling your body.

WHY DO WE NEED THESE BEFORE ORDERING YOUR BLOODS?

Because your health is personal. Your testing should be too.

We don't believe in ordering the same laboratory work for everybody.

A generic panel can be expensive, include tests that aren't particularly relevant to you and still miss something important to your individual health picture.

We review your information first so we can identify which laboratory markers will help us understand you.

Step 3 — Get your DNA underway

Please don't wait to do this part.

[DNA ORDERING LINK]

Your DNA helps us understand what makes your biology different.

It shows us where you may naturally have excellent biological capacity, where you may have less reserve, and why your needs may differ from someone else's.

But your genes are only the beginning of the story.

Your genetics show us your underlying capacity. Your health history and blood results help us understand the demands being placed upon that capacity today.

It's the relationship between the two that makes this genuinely personalised.

DNA processing takes approximately 4 weeks once your completed sample reaches the laboratory, so getting your kit underway now helps prevent unnecessary delays.

What happens next?

Once we've received and reviewed your Health History and Food Diary, we'll be in touch with the next stage, including your personalised blood testing and the additional information we'd like you to collect for us like body temperatures and a short video.

There's no need to remember the whole process now. We'll guide you through it one step at a time.

If you have any questions along the way, simply reply to this email.

Warmly,
The Biology of You Team

${TESTIMONIALS_1}`,
  },
  {
    id: "next-steps",
    label: "2. Your next steps",
    subject: "Your next steps — The Biology of You",
    body:
`Hello {{firstName}},

Thank you for completing your Health History and 7-Day Food Diary.

By now, you should also have ordered your SMART DNA kit. If you haven't yet done this, please order it as soon as possible, as your DNA takes approximately 4 weeks to process once your completed sample reaches the laboratory.

[DNA ORDERING LINK]

We've now reviewed the information you've provided and have a much better understanding of your health history, your current concerns and the areas of your biology we want to explore further.

Your personalised blood testing

Based on our review, we've identified the laboratory tests we'd like you to have completed.

[PERSONALISED LAB TESTING LINK / INSTRUCTIONS]

We don't order exactly the same laboratory panel for everyone.

Your blood testing has been selected based on your health history, current symptoms and the areas of your biology we want to understand more clearly.

Once we have your results, we'll interpret them alongside your health history and, ultimately, your DNA — rather than looking at individual blood markers in isolation.

While we're reviewing your information, there are a couple of additional things we'd like from you to help us build a more complete picture of how your body is functioning.

Send us a short video

We'd love to hear from you directly before we meet.

Please send us a short video — approximately 2–5 minutes.

First, stand or sit naturally facing the camera and tell us:

* What are your main health concerns?
* What would you most like to gain from working with us?
* What would feeling really well allow you to do, enjoy or experience more of?

Then, position your phone so we can see your whole body.

Move several steps away from the camera, stand as you normally would for a few moments, and then walk naturally towards the camera.

There is no need to change the way you stand or move — we're simply interested in seeing your natural movement pattern.

One additional photo

We'd also like one full-length photo of you standing comfortably with your back against a wall, with your body visible from head to toe.

Stand as naturally as possible rather than trying to alter or correct your posture for the photo.

This gives us another useful piece of information about how your body naturally organises itself when standing — including the relationship between your head, shoulders, spine and the wall.

[VIDEO / PHOTO UPLOAD INSTRUCTIONS]

Temperature tracking

{{temperatureLink}}

Please follow the instructions provided and begin your temperature tracking as soon as you can.

Track your body temperature

We'd like you to track your body temperature using a digital oral thermometer.

* Men and women who are not menstruating: track for 14 days.
* Women who are menstruating: track for one full menstrual cycle and include your cycle day each day.

Please take your temperature three times each day:

1. Immediately on waking — before getting out of bed if possible.
2. 30 minutes after breakfast.
3. 5–10 minutes after exercise or movement.

Please record your results like this:

Monday 14 May — Day 12 of cycle
Waking: 36.2°C at 6:36 am
After breakfast: 36.7°C at 8:00 am
After exercise: 37.0°C at 6:15 pm — 45-minute walk

If applicable, make a brief note if you were unwell, slept particularly poorly, travelled, drank alcohol or experienced significant stress that day.

We're looking at the pattern — your waking temperature, how it responds to food and movement, and, for women, how it changes throughout the menstrual cycle.

Please use the same digital oral thermometer throughout. Do not use readings from an Oura Ring, smartwatch or other wearable, as these measure skin temperature rather than giving us the consistent oral readings we need.

When you've completed the tracking period, please send us the full record together.

What happens next?

Your DNA should now be underway. While we're waiting for those results, please:

* Complete your personalised blood testing.
* Send us your short video and wall photo.
* Complete your temperature tracking.

Once we've collected everything we need, we can begin bringing the different pieces of your biology together.

No single piece tells the whole story. It's how these pieces connect that helps us build a much more complete understanding of you.

We'll be in touch with your personalised blood testing once we've completed our initial review.

If you have any questions or need help with anything along the way, simply reply to this email.

Warmly,
The Biology of You Team

${TESTIMONIALS_2}`,
  },
];

export function renderTemplate(
  body: string,
  vars: { firstName: string; healthHistoryLink?: string; foodDiaryLink?: string; temperatureLink?: string }
): string {
  return body
    .replaceAll("{{firstName}}", vars.firstName || "there")
    .replaceAll("{{healthHistoryLink}}", vars.healthHistoryLink ?? `${SITE_URL}/portal/intake`)
    .replaceAll("{{foodDiaryLink}}", vars.foodDiaryLink ?? `${SITE_URL}/portal/food-diary`)
    .replaceAll("{{temperatureLink}}", vars.temperatureLink ?? `${SITE_URL}/portal/temperature`);
}

// Converts the plain-text template body (paragraphs separated by blank
// lines, "* " bullet lists, "1. " numbered lists) into simple HTML for
// sending. Deliberately conservative — this only needs to handle the
// shapes these templates actually use.
export function textToHtml(text: string): string {
  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const blocks = text.split(/\n\s*\n/);
  const html = blocks
    .map((block) => {
      const lines = block.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length === 0) return "";

      const isBulleted = lines.every((l) => /^\s*\*\s+/.test(l));
      const isNumbered = lines.every((l) => /^\s*\d+\.\s+/.test(l));

      if (isBulleted) {
        const items = lines.map((l) => `<li>${escape(l.replace(/^\s*\*\s+/, ""))}</li>`).join("");
        return `<ul>${items}</ul>`;
      }
      if (isNumbered) {
        const items = lines.map((l) => `<li>${escape(l.replace(/^\s*\d+\.\s+/, ""))}</li>`).join("");
        return `<ol>${items}</ol>`;
      }
      return `<p>${lines.map(escape).join("<br />")}</p>`;
    })
    .join("\n");

  return html;
}
