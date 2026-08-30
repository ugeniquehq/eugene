// "Real People. Real Results." — bottom-of-landing-page testimonials.
// Reordered 30/8/26 per Jen's notes: lead with Maria Gallo, then Laura,
// short descriptor added to each so visitors can see themselves in them,
// and the section now scrolls horizontally instead of stacking in a big
// grid (addressed the "feels too prominent" note along with toning the
// card background down from solid white).

interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  descriptor: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Jennifer helped me get my homocysteine of 27 down to 8.7 in 6 weeks. I was sore everywhere... I was also anxious and stressed all the time. At 76 years old I didn't know what to expect. Two months later I feel far less anxious, I have less pain each week and people tell me I look much healthier.",
    name: "Maria Gallo",
    descriptor: "76 years young",
  },
  {
    quote:
      "I feel like I've been provided with a recipe for life. I knew I had genetic SNPs and could see that some of their complications were playing out in my health. She's provided me with a way forward to heal and clean up some of the inadvertent damage done through guessing and biohacking.",
    name: "Laura Shakespeare",
    descriptor: "years of guessing and biohacking",
  },
  {
    quote:
      "It's mind blowing to me! After ten years of absolute daily agony with my gut, I feel amazing! I've seen so many people. I can't believe it.",
    name: "Dr Dara Tyrell",
    role: "Chiropractor",
    descriptor: "10 years of daily gut pain",
  },
  {
    quote:
      "The only reason I can jog for the first time in years after chronic Lyme and co-infections is because of the incredible knowledge of Dr. Jen. You deserve the opportunity to learn from her!",
    name: "Dr. Krysti Wick",
    role: "Chiropractor",
    descriptor: "chronic Lyme, first jog in years",
  },
];

export default function Testimonials() {
  return (
    <section style={{ padding: "var(--space-xl) var(--space-md)", background: "var(--color-bg)" }}>
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "var(--space-sm)",
            marginBottom: "var(--space-lg)",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-block",
                border: "1px solid var(--color-line)",
                borderRadius: "999px",
                padding: "0.35rem 1rem",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--step-1)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-ink-soft)",
                marginBottom: "var(--space-sm)",
              }}
            >
              Testimonials
            </span>
            <h2 style={{ margin: 0, fontSize: "var(--step2)" }}>Real People. Real Results.</h2>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "var(--space-md)",
            overflowX: "auto",
            paddingBottom: "var(--space-sm)",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-line)",
                borderRadius: "var(--radius)",
                padding: "var(--space-md)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-sm)",
                flex: "0 0 20rem",
                scrollSnapAlign: "start",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "2.5rem",
                  lineHeight: 1,
                  color: "var(--color-accent-soft)",
                }}
              >
                &ldquo;
              </span>

              <p style={{ margin: 0, flexGrow: 1, color: "var(--color-ink)" }}>{t.quote}</p>

              <div>
                <p style={{ margin: 0, color: "var(--color-accent)", letterSpacing: "0.1em" }} aria-label="5 out of 5 stars">
                  ★★★★★
                </p>
                <p style={{ margin: "0.35rem 0 0", fontWeight: 700 }}>{t.name}</p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--step-1)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-ink-soft)",
                  }}
                >
                  {[t.role, t.descriptor].filter(Boolean).join(" — ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
