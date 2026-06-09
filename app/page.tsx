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
    title: "Read one pot before it droops.",
    body: "Moisture, room heat, and the last pump run stay in one readable thread instead of in scattered hobby charts.",
  },
  {
    id: "02",
    title: "Water by signal, not by guilt.",
    body: "AquaSmart triggers one watering line around the plant's actual condition instead of a vague human routine.",
  },
  {
    id: "03",
    title: "Make small hardware feel trustworthy.",
    body: "The dashboard shows exactly what the probe saw, what the pump did, and when the next intervention should happen.",
  },
];

const systemChapters = [
  {
    label: "Chapter One",
    title: "A soil probe sits right where the roots live.",
    text: "The system samples one pot directly, so the reading is about the plant you care about and not a guessed average.",
    metric: "30 sec sampling",
  },
  {
    label: "Chapter Two",
    title: "The controller decides if another sip is actually needed.",
    text: "Moisture trend, recent watering, and a light room context turn into a recommendation that is small, cautious, and explainable.",
    metric: "5 min decision loop",
  },
  {
    label: "Chapter Three",
    title: "The operator gets one calm surface to approve or override.",
    text: "Schedules, manual pump control, and plant history stay in one atlas-like view instead of six hobby panels.",
    metric: "1 plant / one view",
  },
];

const proofStats = [
  { value: "1", label: "plant in focus", note: "Everything on the interface is centered on a single monitored specimen." },
  { value: "24/7", label: "watchful loop", note: "Probe readings and pump state stay visible even when nobody is nearby." },
  { value: "< 5s", label: "manual response", note: "A live override can push the pump faster than walking over with a watering can." },
];

const ticker = [
  "Single pot moisture telemetry",
  "One pump with a clear audit trail",
  "Manual override for one plant",
  "Calm watering recommendations",
  "Small hardware, legible status",
  "A dashboard for one living specimen",
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
                  AquaSmart / Smart watering for one plant
                </p>
                <h1 className="max-w-5xl text-center font-body text-[3.4rem] font-semibold leading-[0.98] tracking-[-0.05em] md:text-[6rem] xl:text-[7.25rem]">
                  A single plant watering system shown as a calm map of{" "}
                  <span className="serif-accent gradient-accent-text italic tracking-[-0.03em]">
                    one living root zone.
                  </span>
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-7 text-paper-soft/88 md:text-xl md:leading-8">
                  AquaSmart is not a giant irrigation platform. It is one compact rig that watches one plant, drives one
                  pump, and makes every watering decision feel deliberate and easy to trust.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link href="/auth" className="atlas-button rounded-full px-6 py-4 text-sm font-medium md:px-7">
                    Open the dashboard
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
                  The moving contour lines and restrained copy make AquaSmart feel like a real instrument, not a gadget pitch.
                </p>
              </div>
              <div>
                <p className="eyebrow text-[9px] text-paper-soft/66">Visual direction</p>
                <p className="mt-2 text-sm leading-6 text-paper-soft/86">
                  Nature-tech calm: clear hierarchy, editorial contrast, and enough atmosphere to make a tiny system feel premium.
                </p>
              </div>
              <div>
                <p className="eyebrow text-[9px] text-paper-soft/66">Built for</p>
                <p className="mt-2 text-sm leading-6 text-paper-soft/86">
                  A single pot, a small pump, and an operator who wants better information before adding more water.
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
              <p className="eyebrow text-[10px] text-clay">Story</p>
              <h2 className="display-title mt-5 text-5xl text-forest md:text-7xl">
                Designed like a plant journal, not a bloated control suite.
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
                &ldquo;When one plant&apos;s watering history becomes visible, the hardware feels less mysterious.&rdquo;
              </p>
              <div className="mt-10 grid gap-6 border-t border-ink/10 pt-6 md:grid-cols-3">
                {[
                  ["Small scope", "The copy never pretends this rig manages an estate or greenhouse fleet."],
                  ["Contour memory", "Topographic line work keeps the interface feeling measured instead of improvised."],
                  ["Bench calm", "Motion stays restrained so one plant's status reads faster than the decoration."],
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
                  ["Mineral greens", "Deep greens still suggest living growth, even though the system scale is deliberately small."],
                  ["Parchment light", "Warm paper tones make sensor numbers feel like notes from a careful keeper."],
                  ["Clay accents", "Action states stay warm and tactile instead of looking like industrial alarms."],
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
                  One continuous watering loop from probe to pump.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-paper-soft/72 md:text-lg">
                The system is simple on purpose. Visitors should understand what the probe saw, what logic ran, and why
                the pump is about to switch before they are asked to trust automation.
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
                  Small only works when the decisions stay sharp.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-ink-soft md:text-lg">
                The redesign is not just softer branding. It makes a bench-scale watering rig feel understandable,
                premium, and operationally credible from the first scroll to the live dashboard.
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
                  <p className="eyebrow text-[10px] text-paper-soft/50">Ready to open the rig?</p>
                  <h3 className="display-title mt-5 text-5xl md:text-6xl">
                    Step from the story into the live one-plant dashboard.
                  </h3>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-paper-soft/74">
                    Every public page now points at the same thing: one moisture probe, one pump control path, and one
                    calm interface for keeping a single plant alive without guesswork.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                  <Link href="/auth" className="atlas-button rounded-full px-6 py-4 text-sm font-medium">
                    Open dashboard access
                  </Link>
                  <Link href="/technology" className="atlas-button-secondary rounded-full px-6 py-4 text-sm font-medium">
                    Read the build notes
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
