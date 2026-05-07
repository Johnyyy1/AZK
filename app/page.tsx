"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Footer from "./components/Footer";
import Icon from "./components/Icon";
import TopNav from "./components/TopNav";

const reveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7 },
};

const manifestoCards = [
  {
    id: "01",
    title: "Read the ground before it asks.",
    body: "Moisture, wind, heat load, and forecast are composed as one field narrative instead of four disconnected dashboards.",
  },
  {
    id: "02",
    title: "Water by contour, not by habit.",
    body: "Irrigation zones act like terrain bands, each one tuned to slope, crop personality, and the day ahead.",
  },
  {
    id: "03",
    title: "Make the invisible feel legible.",
    body: "AquaSmart turns every hidden signal into a visual language a grower can trust at a glance.",
  },
];

const systemChapters = [
  {
    label: "Chapter One",
    title: "Edge sensing that lives in the field.",
    text: "Solar-fed nodes collect real conditions every few seconds and stay useful even when the network gets messy.",
    metric: "30 sec sampling",
  },
  {
    label: "Chapter Two",
    title: "Decision logic shaped by weather and crop behavior.",
    text: "The platform blends live telemetry with forecasts and historical response patterns so irrigation timing feels anticipatory.",
    metric: "72 hr forecast horizon",
  },
  {
    label: "Chapter Three",
    title: "Control surfaces growers actually want to open.",
    text: "Schedules, overrides, and zone health are arranged like an atlas spread rather than a stack of forms.",
    metric: "12 zones / one view",
  },
];

const proofStats = [
  { value: "61%", label: "less wasted water", note: "Compared with timer-based watering across mixed landscapes." },
  { value: "4.8x", label: "faster issue detection", note: "Pressure drops and offline sensors surface as visible anomalies." },
  { value: "98.4%", label: "schedule adherence", note: "Autonomy without losing the option for hands-on intervention." },
];

const ticker = [
  "Contour-guided irrigation",
  "Predictive watering windows",
  "Zone-level sensor telemetry",
  "Valve control with audit trail",
  "Weather-aware automation",
  "A field atlas for every site",
];

export default function LandingPage() {
  return (
    <div className="site-shell bg-paper text-ink">
      <TopNav />

      <main className="relative z-10">
        <section className="contour-map grain relative min-h-screen overflow-hidden bg-forest-deep text-paper-soft">
          <video
            autoPlay
            muted
            loop
            playsInline
            src="https://res.cloudinary.com/dxprtqtv9/video/upload/w_1920,q_auto/12860602_3840_2160_25fps_sapk6w.webm"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="video-mask absolute inset-0" />

          <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pb-10 pt-32 md:px-8 md:pb-14 md:pt-40">
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 42 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85 }}
                className="flex max-w-4xl flex-col items-center"
              >
                <p className="eyebrow mb-6 text-[10px] text-paper-soft/82 md:text-[11px]">
                  AquaSmart / A field atlas for water
                </p>
                <h1 className="max-w-5xl text-center font-body text-[3.4rem] font-semibold leading-[0.98] tracking-[-0.05em] md:text-[6rem] xl:text-[7.25rem]">
                  Irrigation reimagined as a cinematic map of{" "}
                  <span className="serif-accent gradient-accent-text italic tracking-[-0.03em]">
                    living ground.
                  </span>
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-7 text-paper-soft/88 md:text-xl md:leading-8">
                  The hero memory is simple: contour lines drifting over real field footage while every watering decision
                  feels deliberate, technical, and deeply natural.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link href="/auth" className="atlas-button rounded-full px-6 py-4 text-sm font-medium md:px-7">
                    Enter the Atlas
                    <Icon name="north_east" className="text-[18px]" />
                  </Link>
                  <Link
                    href="/technology"
                    className="atlas-button-secondary rounded-full px-6 py-4 text-sm font-medium md:px-7"
                  >
                    See the technology
                    <Icon name="arrow_forward" className="text-[18px]" />
                  </Link>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mx-auto mt-10 grid w-full max-w-5xl gap-4 rounded-[2rem] border border-paper/18 bg-[linear-gradient(135deg,rgba(103,243,200,0.18),rgba(127,212,255,0.12),rgba(255,127,92,0.12))] p-5 backdrop-blur-md md:grid-cols-3 md:p-6"
            >
              <div>
                <p className="eyebrow text-[9px] text-paper-soft/66">What visitors remember</p>
                <p className="mt-2 text-sm leading-6 text-paper-soft/86">
                  The moving contour lines over the hero footage make AquaSmart feel like an instrument, not a brochure.
                </p>
              </div>
              <div>
                <p className="eyebrow text-[9px] text-paper-soft/66">Visual direction</p>
                <p className="mt-2 text-sm leading-6 text-paper-soft/86">
                  Nature-tech startup energy: clean sans hierarchy, Playfair accents, brighter contrast, and atmospheric gradients.
                </p>
              </div>
              <div>
                <p className="eyebrow text-[9px] text-paper-soft/66">Built for</p>
                <p className="mt-2 text-sm leading-6 text-paper-soft/86">
                  Growers, estates, and controlled landscapes that need clarity before they need another control panel.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="overflow-hidden border-y border-ink/10 bg-paper-soft py-5">
          <div className="marquee-track flex min-w-max gap-6">
            {[...ticker, ...ticker].map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex items-center gap-6 whitespace-nowrap text-sm text-ink-soft"
              >
                <span className="eyebrow text-[9px] text-clay">Atlas</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="manifesto" className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <motion.div {...reveal} className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="field-line">
              <p className="eyebrow text-[10px] text-clay">Manifesto</p>
              <h2 className="display-title mt-5 text-5xl text-forest md:text-7xl">
                Designed like a landscape section, not a software checklist.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {manifestoCards.map((card, index) => (
                <motion.article
                  key={card.id}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: index * 0.08 }}
                  className="atlas-card rounded-[2rem] p-6"
                >
                  <p className="eyebrow text-[9px] text-clay">{card.id}</p>
                  <h3 className="mt-6 font-display text-[2rem] leading-[0.95] text-forest">
                    {card.title}
                  </h3>
                  <p className="mt-5 text-sm leading-7 text-ink-soft">{card.body}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...reveal}
            transition={{ ...reveal.transition, delay: 0.15 }}
            className="mt-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="section-frame contour-paper contour-map relative rounded-[2.25rem] p-7 md:p-10">
              <p className="eyebrow text-[10px] text-clay">Principle</p>
              <p className="mt-8 max-w-3xl font-display text-4xl leading-[1.02] text-forest md:text-6xl">
                &ldquo;When watering becomes visible as terrain, operators trust the system faster.&rdquo;
              </p>
              <div className="mt-10 grid gap-6 border-t border-ink/10 pt-6 md:grid-cols-3">
                {[
                  ["Atlas spread", "Asymmetric sections that read like edited print layouts."],
                  ["Contour memory", "Topographic line work repeats across pages and interactions."],
                  ["Field calm", "Motion is measured and atmospheric, never dashboard-noisy."],
                ].map(([title, copy]) => (
                  <div key={title}>
                    <p className="eyebrow text-[9px] text-ink-soft/60">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-ink-soft">{copy}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="dark-frame contour-map rounded-[2.25rem] p-7 text-paper-soft md:p-10">
              <p className="eyebrow text-[10px] text-paper-soft/50">Atmosphere</p>
              <div className="mt-8 grid gap-7">
                {[
                  ["Mineral greens", "Deep forest greens ground the brand in landscape rather than tech cliche."],
                  ["Parchment light", "Warm paper tones make data feel editorial and human."],
                  ["Clay accents", "The call-to-action color carries warmth and earth without collapsing into rustic nostalgia."],
                ].map(([title, copy]) => (
                  <div key={title}>
                    <h3 className="font-display text-3xl">{title}</h3>
                    <p className="mt-3 max-w-md text-sm leading-7 text-paper-soft/72">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section id="system" className="relative overflow-hidden bg-forest-deep py-24 text-paper-soft md:py-32">
          <div className="contour-map absolute inset-0 opacity-80" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <motion.div {...reveal} className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="eyebrow text-[10px] text-paper-soft/56">System architecture</p>
                <h2 className="display-title mt-5 text-5xl md:text-7xl">
                  One continuous irrigation narrative from sensor to command.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-paper-soft/72 md:text-lg">
                The experience is organized as chapters, so people understand how the platform thinks before they are
                asked to trust it with automation.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {systemChapters.map((chapter, index) => (
                <motion.article
                  key={chapter.title}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: index * 0.08 }}
                  className="dark-frame rounded-[2rem] p-6 md:p-7"
                >
                  <p className="eyebrow text-[9px] text-paper-soft/48">{chapter.label}</p>
                  <h3 className="mt-6 font-display text-4xl leading-[0.95]">{chapter.title}</h3>
                  <p className="mt-5 text-sm leading-7 text-paper-soft/68">{chapter.text}</p>
                  <div className="stat-rule mt-7" />
                  <p className="mt-5 text-lg text-gold">{chapter.metric}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="proof" className="bg-paper-soft py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <motion.div {...reveal} className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <p className="eyebrow text-[10px] text-clay">Proof</p>
                <h2 className="display-title mt-5 text-5xl text-forest md:text-7xl">
                  Beautiful doesn&apos;t matter unless the decisions get sharper.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-ink-soft md:text-lg">
                The redesign does more than look distinct. It organizes value into a sequence that makes AquaSmart feel
                understandable, premium, and operationally credible.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {proofStats.map((stat, index) => (
                <motion.article
                  key={stat.label}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: index * 0.07 }}
                  className="atlas-card rounded-[2rem] p-7"
                >
                  <p className="font-display text-6xl leading-none text-forest md:text-7xl">{stat.value}</p>
                  <p className="eyebrow mt-5 text-[9px] text-clay">{stat.label}</p>
                  <p className="mt-5 text-sm leading-7 text-ink-soft">{stat.note}</p>
                </motion.article>
              ))}
            </div>

            <motion.div
              {...reveal}
              transition={{ ...reveal.transition, delay: 0.15 }}
              className="mt-14 rounded-[2.4rem] bg-forest-deep px-6 py-8 text-paper-soft md:px-10 md:py-10"
            >
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="eyebrow text-[10px] text-paper-soft/50">Ready to walk the map?</p>
                  <h3 className="display-title mt-5 text-5xl md:text-6xl">
                    Bring the contour memory into your own landscape.
                  </h3>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-paper-soft/74">
                    Every public page now speaks the same language: field atlas, contour precision, and grounded elegance.
                    The next click should take visitors directly into a working product narrative.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                  <Link href="/auth" className="atlas-button rounded-full px-6 py-4 text-sm font-medium">
                    Start a demo session
                  </Link>
                  <Link href="/technology" className="atlas-button-secondary rounded-full px-6 py-4 text-sm font-medium">
                    Read the stack
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
