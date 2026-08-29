// "Real People. Real Results." — bottom-of-landing-page testimonials.
// Layout borrows the pill-badge + quote-card treatment Jen shared from
// another site as a reference, rebuilt with our own tokens and the
// actual client testimonials drafted 28/8/26.

interface Testimonial {
  quote: string;
  name: string;
  role?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The only reason I can jog for the first time in years after chronic Lyme and co-infections is because of the incredible knowledge of Dr. Jen. You deserve the opportunity to learn from her!",
    name: "Dr. Krysti Wick",
    role: "Chiropractor",
  },
  {
    quote:
      "It's mind blowing to me! After ten years of absolute daily agony with my gut, I feel amazing! I've seen so many people. I can't believe it.",
    name: "Dr Dara Tyrell",
    role: "Chiropractor",
  },
  {
    quote:
      "I feel like I've been provided with a recipe for life. I knew I had genetic SNPs and could see that some of their complications were playing out in my health. She's provided me with a way forward to heal and clean up some of the inadvertent damage done through guessing and biohacking.",
    name: "Laura Shakespeare",
  },
  {
    quote:
      "Jennifer helped me get my homocysteine of 27 down to 8.7 in 6 weeks. I was sore everywhere... I was also anxious and stressed all the time. At 76 years old I didn't know what to expect. Two months later I feel far less anxious, I have less pain each week and people tell me I look much healthier.",
    name: "Maria Gallo",
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
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
            gap: "var(--space-md)",
          }}
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-line)",
                borderRadius: "var(--radius)",
                padding: "var(--space-md)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-sm)",
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
                {t.role && (
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
                    {t.role}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
