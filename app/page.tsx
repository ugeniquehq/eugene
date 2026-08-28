import Link from "next/link";

export default function HomePage() {
  return (
    <>
<section
        style={{
          position: "relative",
          overflow: "hidden",
          height: "28rem",
        }}
      >
        {/* Full-bleed hero photo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/hero/hero-main.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Dark scrim for text legibility, fading out toward the right */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(20,17,14,0.6) 0%, rgba(20,17,14,0.35) 38%, rgba(20,17,14,0) 65%)",
          }}
        />

        {/* Overlaid content: dots + copy */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "stretch",
            height: "100%",
          }}
        >
          {/* Vertical stack of brand dots */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.6rem",
              paddingTop: "var(--space-xl)",
              paddingLeft: "var(--space-md)",
            }}
          >
            {[
              "/branding/dots/dot-1-card.png",
              "/branding/dots/dot-2-accent-soft.png",
              "/branding/dots/dot-3-copper.png",
              "/branding/dots/dot-4-accent.png",
              "/branding/dots/dot-5-ink.png",
              "/branding/dots/dot-6-forest.png",
              "/branding/dots/dot-7-maroon.png",
              "/branding/dots/dot-8-bg.png",
            ].map((src) => (
              <img key={src} src={src} alt="" style={{ width: "0.85rem", height: "0.85rem", borderRadius: "50%", display: "block" }} />
            ))}
          </div>

          {/* Copy */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingTop: "var(--space-xl)",
              paddingBottom: "var(--space-xl)",
              paddingLeft: "var(--space-md)",
              paddingRight: "var(--space-md)",
              maxWidth: "32rem",
            }}
          >
            <p className="eyebrow" style={{ color: "var(--color-card)" }}>Welcome to</p>
            <h1 style={{ lineHeight: 1.02, color: "var(--color-card)" }}>The Biology of You</h1>
            <p style={{ fontSize: "var(--step1)", color: "var(--color-card)", opacity: 0.85, marginTop: "var(--space-sm)" }}>
              The story only your biology can tell.
            </p>
            <div style={{ marginTop: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
              <Link href="/contact" className="btn btn-primary">
                Begin Your Journey
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style
  dangerouslySetInnerHTML={{
    __html: `
  @media (max-width: 900px) {
    section:first-of-type {
      min-height: auto !important;
      max-height: none !important;
    }
    section:first-of-type > div:nth-child(3) {
      min-height: 60vh !important;
    }
  }
`,
  }}
/>

      <section style={{ borderTop: "1px solid var(--color-line)", borderBottom: "1px solid var(--color-line)", padding: "var(--space-lg) 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(9rem, 1fr))",
              gap: "2.0rem",
              textAlign: "center",
            }}
          >
            {[
              { dot: "/branding/dots/dot-2-accent-soft.png", title: "Your Biology", desc: "Understand why you are uniquely you." },
              { dot: "/branding/dots/dot-3-copper.png", title: "Your Genetics", desc: "Genes are clues, not destiny." },
              { dot: "/branding/dots/dot-6-forest.png", title: "Your Blood", desc: "Beyond 'normal'. Understand what your results mean for you." },
              { dot: "/branding/dots/dot-7-maroon.png", title: "Your Energy", desc: "Because energy changes everything." },
              { dot: "/branding/dots/dot-4-accent.png", title: "Your Fuel", desc: "Food freedom. Nourish, don't restrict." },
              { dot: "/branding/dots/dot-5-ink.png", title: "Your Health Story", desc: "Your symptoms aren't random. There is always a why." },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <img src={item.dot} alt="" style={{ width: "0.75rem", height: "0.75rem", borderRadius: "50%", display: "block" }} />
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--step-1)", letterSpacing: "0.04em", textTransform: "uppercase", margin: 0 }}>
                  {item.title}
                </p>
                <p style={{ fontSize: "var(--step-1)", color: "var(--color-ink-soft)", margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--color-bg)", padding: "0.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.5rem",
            minHeight: "26rem",
          }}
        >
          <div
            style={{
              backgroundImage: "url(/grid1/photo-hand-lips.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            style={{
              background: "var(--color-sage)",
              color: "var(--color-card)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "var(--space-lg) var(--space-md)",
              gap: "var(--space-sm)",
            }}
          >
            <h2 style={{ color: "var(--color-card)", margin: 0, fontSize: "var(--step1)" }}>
              You Are Designed to Thrive.
            </h2>
            <p style={{ margin: 0, opacity: 0.85 }}>
              We decode your biology so you can live beyond average.
            </p>
          </div>
          <div
            style={{
              backgroundImage: "url(/grid1/photo-pomegranate.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            style={{
              background: "var(--color-accent)",
              color: "var(--color-card)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "var(--space-lg) var(--space-md)",
              gap: "var(--space-sm)",
            }}
          >
            <h2 style={{ color: "var(--color-card)", margin: 0, fontSize: "var(--step1)" }}>
              Personalised to You.
            </h2>
            <p style={{ margin: 0, opacity: 0.85 }}>
              No one else has your biology. Your plan shouldn&apos;t be one-size-fits-all.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "0.5rem",
            minHeight: "20rem",
            marginTop: "0.5rem",
          }}
        >
          <div
            style={{
              backgroundImage: "url(/grid2/photo-blanket-cup.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            style={{
              backgroundImage: "url(/grid2/photo-ocean-legs.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            style={{
              background: "var(--color-card)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "var(--space-lg) var(--space-md)",
              gap: "var(--space-sm)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "var(--step1)" }}>
              Knowledge Is Power. Insight Is Freedom.
            </h2>
            <p style={{ margin: 0, color: "var(--color-ink-soft)" }}>
              We turn complex science into clarity you can use.
            </p>
          </div>
          <div
            style={{
              backgroundImage: "url(/grid2/photo-oyster.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            style={{
              backgroundImage: "url(/grid2/photo-paddleboard.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
      </section>

<section style={{ position: "relative", display: "grid", gridTemplateColumns: "3fr 7fr", minHeight: "9rem" }}>
        <div
          style={{
            background: "var(--color-ink)",
            color: "var(--color-card)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "var(--space-lg) var(--space-xl)",
            gap: "0.65rem",
          }}
        >
          <h2 style={{ color: "var(--color-card)", margin: 0, maxWidth: "22rem" }}>
            Feeling Good Isn&apos;t Luck. It&apos;s Biology.
          </h2>
          <p style={{ margin: 0, maxWidth: "22rem", opacity: 0.85 }}>
            We connect your genetics, blood results, health history, nutrtition and lifestyle 
            to understand what your body needs to thrive.
          </p>
          <div style={{ marginTop: "0.5rem" }}>
            <Link href="/portal/login" className="btn btn-primary">
              Discover Your Biology
            </Link>
          </div>
        </div>
        <div
          style={{
            backgroundImage: "url(/longevity/photo-mountain-sunset.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
{/* Brand mark — cross with scattered dots around the outside */}
<div
  style={{
    position: "absolute",
    top: "50%",
    left: "38%",
    transform: "translate(-50%, -50%)",
    width: "18rem",
    height: "18rem",
  }}
>
  {/* Outer scattered dots */}
  <img
    src="/branding/mark-dots-ring.png"
    alt=""
    style={{
      position: "absolute",
      right: "99%",
      inset: 0,
      width: "120%",
      height: "120%",
      objectFit: "contain",
      transform: "scale(0.75)",
    }}
  />

</div>
      </section>

     
    </>
  );
}