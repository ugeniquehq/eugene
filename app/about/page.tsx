import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About | The Biology of You",
  description:
    "Your biology isn't generic. Your healthcare shouldn't be either. Learn how The Biology of You builds a personalised health blueprint from your genetics, metabolism, blood markers and history.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className={styles.about}>
        {/* ---------- Hero ---------- */}
        <section className={styles.hero}>
          <p className={styles.eyebrow}>About The Biology of You</p>
          <h1>
            Your biology isn&rsquo;t generic.
            <br />
            Your healthcare shouldn&rsquo;t be either.
          </h1>
        </section>

        {/* ---------- Story ---------- */}
        <section className={styles.story}>
          <div className={styles.story__col}>
            <p>Maybe you&rsquo;ve followed the traditional advice.</p>
            <p>Or maybe you&rsquo;ve done the exact opposite.</p>

            <p>
              You&rsquo;ve cleaned up your diet. Tracked your sleep. Tested
              your hormones. Taken the supplements. Tried fasting, keto,
              plant-based, carnivore or whatever protocol made the most
              compelling argument at the time.
            </p>

            <p>
              Perhaps you own a wearable that knows more about your sleep
              than your partner does.
            </p>

            <p>
              You&rsquo;ve listened to the podcasts. Read the books. Followed
              the experts. Optimised your morning light, your protein, your
              steps, your glucose, your cold exposure and possibly your
              entire morning before most people have made coffee.
            </p>

            <p className={styles.story__beat}>
              And yet, something still doesn&rsquo;t quite add up.
            </p>

            <p className={styles.story__line}>Maybe you&rsquo;re tired.</p>

            <p>
              Maybe your hormones feel unpredictable. Your digestion
              isn&rsquo;t great. Your sleep isn&rsquo;t restorative. Your
              weight doesn&rsquo;t respond the way it used to. Your brain
              isn&rsquo;t as sharp. Your resilience has changed.
            </p>

            <p className={styles.story__line}>
              Or perhaps you actually feel pretty good.
            </p>

            <p>
              You simply want to understand your body better &mdash; and
              stop making health decisions based on what works for everybody
              else.
            </p>

            <p>
              Because whether you&rsquo;ve followed conventional health
              advice or embraced every biohack available, there is one
              rather important variable that is often missing:
            </p>
          </div>

          <p className={styles.story__signature}>You.</p>
        </section>

        {/* ---------- Philosophy ---------- */}
        <section className={styles.philosophy}>
          <div className={styles.philosophy__intro}>
            <p>
              At The Biology of You, we don&rsquo;t begin with what is
              supposed to work.
            </p>
            <p className={styles.philosophy__lede}>We begin with your biology.</p>
          </div>

          <ul className={styles.philosophy__list}>
            <li>Your genetics.</li>
            <li>Your metabolism.</li>
            <li>Your blood markers.</li>
            <li>Your health history.</li>
            <li>Your food.</li>
            <li>Your lifestyle.</li>
            <li>Your environment.</li>
            <li>And the way your body has adapted to all of it.</li>
          </ul>

          <div className={styles.philosophy__body}>
            <p>
              Because there is no universally perfect diet, supplement
              protocol, exercise routine or path to feeling well.
            </p>
            <p>
              There is only what makes sense for the biology in front of us.
            </p>
            <p>
              And when we start putting those pieces together, something
              rather wonderful happens:
            </p>
            <p className={styles.philosophy__emphasis}>
              Your body starts making sense.
            </p>
            <p>
              You stop second-guessing every health decision and start
              feeling more confident about what your body actually needs.
            </p>
            <p>
              Your energy can change. Your resilience can grow. Your
              confidence in your health can return.
            </p>
            <p>
              And when your body has the energy to do more than simply get
              you through the day, life tends to get better too.
            </p>
          </div>

          <ul className={styles.philosophy__spark}>
            <li>Your spark comes back.</li>
            <li>Your sense of humour.</li>
            <li>Your libido.</li>
            <li>
              Your desire to move, play, create, connect and enjoy yourself.
            </li>
          </ul>

          <div className={styles.philosophy__close}>
            <p>
              Because feeling well isn&rsquo;t just about better blood
              results or fewer symptoms.
            </p>
            <p>
              It&rsquo;s about having enough energy and resilience to feel
              fully alive in your own life.
            </p>
          </div>

          <p className={styles.philosophy__manifesto}>
            Understand your biology. Elevate your health. Get more out of
            being you.
          </p>
        </section>

        {/* ---------- What You Get ---------- */}
        <section className={styles.offer}>
          <p className={`${styles.eyebrow} ${styles["eyebrow--light"]}`}>What You Get</p>
          <h2>A deep dive into the biology of you.</h2>

          <p className={styles.offer__intro}>
            Before we ever make a recommendation, we take the time to
            understand you.
          </p>
          <p className={styles.offer__intro}>We bring together your:</p>

          <ul className={styles.offer__list}>
            <li>DNA and genetic pathways</li>
            <li>Blood markers</li>
            <li>Comprehensive health and family history</li>
            <li>Current symptoms and health goals</li>
            <li>Food and nutritional intake</li>
            <li>Supplements</li>
            <li>Lifestyle, movement, sleep and stress</li>
            <li>
              Metabolic clues, including body temperature and energy
              patterns
            </li>
          </ul>

          <div className={styles.offer__body}>
            <p>But the real value isn&rsquo;t simply collecting more data.</p>
            <p className={styles.offer__emphasis}>It&rsquo;s connecting it.</p>
            <p>
              We look for the patterns between your genetics, metabolism,
              blood results, history and the way you&rsquo;re feeling now
              &mdash; so that seemingly disconnected pieces begin to tell one
              coherent story.
            </p>
            <p>
              From there, you receive a highly personalised Biology of You
              report and consultation, where we teach you what we&rsquo;ve
              discovered and translate it into practical recommendations for
              food, nutrients, movement, lifestyle and the areas of your
              biology that deserve the most attention.
            </p>
          </div>

          <div className={styles.offer__reframe}>
            <p>Not another pile of test results.</p>
            <p>Not another generic protocol.</p>
            <p className={styles["offer__reframe-final"]}>
              A blueprint for understanding your body &mdash; and the
              confidence to know what to do with that information.
            </p>
          </div>

          <div className={styles.offer__cta}>
            <a href="/portal" className={`${styles.btn} ${styles["btn--primary"]}`}>
              Start Your Client Portal
            </a>
            <a href="/#contact" className={`${styles.btn} ${styles["btn--ghost"]}`}>
              Get in Touch
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
