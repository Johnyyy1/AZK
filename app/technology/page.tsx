"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Footer from "../components/Footer";
import TopNav from "../components/TopNav";

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7 },
};

const layers = [
  {
    title: "Field layer",
    metric: "IP67 sensor mesh",
    text: "Moisture, pressure, light, and canopy temperature are collected directly where irrigation decisions matter.",
  },
  {
    title: "Prediction layer",
    metric: "72-hour horizon",
    text: "Forecasts, evapotranspiration, and prior watering response are folded into a recommendation window that stays explainable.",
  },
  {
    title: "Control layer",
    metric: "Zone-first orchestration",
    text: "Schedules, overrides, and safety checks remain visible so automation feels supervised rather than hidden.",
  },
];

const specRows = [
  ["Telemetry cadence", "30 seconds"],
  ["Typical response latency", "< 200 ms"],
  ["Supported landscape zones", "1 to 128"],
  ["Offline continuity", "Local queue + replay"],
  ["Control logging", "Full event history"],
];

export default function TechnologyPage() {
  return (
    <div className="site-shell bg-paper text-ink">
      <TopNav />

      <main className="relative z-10">
        <section className="contour-paper contour-map relative overflow-hidden bg-paper-soft pt-32 md:pt-40">
          <div className="mx-auto max-w-7xl px-5 pb-20 md:px-8 md:pb-24">
            <motion.div {...reveal} className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <p className="eyebrow text-[10px] text-clay">Technology</p>
                <h1 className="display-title mt-6 text-5xl text-forest md:text-7xl xl:text-[6.2rem]">
                  The stack is engineered like a survey instrument for water.
                </h1>
              </div>

              <div className="section-frame rounded-[2rem] p-6 md:p-8">
                <p className="eyebrow text-[9px] text-ink-soft/56">Operating idea</p>
                <p className="mt-4 text-base leading-8 text-ink-soft md:text-lg">
                  AquaSmart is not a black box. It turns sensing, prediction, and control into one readable chain, so
                  users see why the system is suggesting a watering decision before they approve or automate it.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-forest-deep py-24 text-paper-soft md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <motion.div {...reveal} className="mb-12 max-w-3xl">
              <p className="eyebrow text-[10px] text-paper-soft/52">Architecture</p>
              <h2 className="display-title mt-5 text-5xl md:text-7xl">Three layers. One legible decision path.</h2>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-3">
              {layers.map((layer, index) => (
                <motion.article
                  key={layer.title}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: index * 0.08 }}
                  className="dark-frame rounded-[2rem] p-6 md:p-7"
                >
                  <p className="eyebrow text-[9px] text-paper-soft/48">{layer.metric}</p>
                  <h3 className="mt-6 font-display text-4xl">{layer.title}</h3>
                  <p className="mt-5 text-sm leading-7 text-paper-soft/72">{layer.text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-28">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.article {...reveal} className="section-frame rounded-[2.25rem] p-7 md:p-10">
              <p className="eyebrow text-[10px] text-clay">Signal choreography</p>
              <h2 className="display-title mt-6 text-5xl text-forest md:text-7xl">
                Forecasts don’t float on top of telemetry. They bend around it.
              </h2>
              <div className="mt-10 rounded-[1.9rem] border border-ink/10 bg-paper p-5">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    ["Soil moisture", "68%", "Stable / rising"],
                    ["Heat load", "31°C", "High exposure"],
                    ["Wind speed", "9 km/h", "Dropping after dusk"],
                  ].map(([label, value, note]) => (
                    <div key={label} className="rounded-[1.6rem] bg-paper-soft p-4">
                      <p className="eyebrow text-[8px] text-ink-soft/56">{label}</p>
                      <p className="mt-3 font-display text-4xl text-forest">{value}</p>
                      <p className="mt-2 text-xs text-ink-soft">{note}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[1.8rem] bg-forest-deep p-5 text-paper-soft">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="eyebrow text-[8px] text-paper-soft/46">Decision window</p>
                      <h3 className="mt-2 font-display text-4xl">20:10 to 22:00</h3>
                    </div>
                    <p className="max-w-sm text-sm leading-7 text-paper-soft/70">
                      Recommended because wind drops, soil remains below target, and the next six hours show no rain risk.
                    </p>
                  </div>

                  <div className="mt-6 h-28 rounded-[1.3rem] border border-paper/10 bg-paper-soft/6 p-4">
                    <div className="flex h-full items-end gap-2">
                      {[14, 28, 42, 54, 68, 74, 66, 52, 34, 18].map((height) => (
                        <div
                          key={height}
                          className="flex-1 rounded-t-full bg-gradient-to-t from-moss to-gold"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>

            <motion.aside
              {...reveal}
              transition={{ ...reveal.transition, delay: 0.1 }}
              className="atlas-card rounded-[2.25rem] p-7 md:p-10"
            >
              <p className="eyebrow text-[10px] text-clay">Field specifications</p>
              <div className="mt-8 space-y-4">
                {specRows.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 border-b border-ink/10 pb-4 text-sm"
                  >
                    <span className="text-ink-soft">{label}</span>
                    <span className="font-mono text-[13px] text-forest">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.7rem] bg-clay px-5 py-6 text-paper-soft">
                <p className="eyebrow text-[8px] text-paper-soft/60">Practical outcome</p>
                <p className="mt-4 font-display text-3xl">Fewer blind spots. Faster intervention.</p>
                <p className="mt-4 text-sm leading-7 text-paper-soft/78">
                  The platform surfaces when a recommendation is based on sensor confidence, weather confidence, or both.
                </p>
              </div>
            </motion.aside>
          </div>
        </section>

        <section className="bg-paper-soft py-24 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <motion.div {...reveal} className="rounded-[2.4rem] bg-forest-deep px-6 py-8 text-paper-soft md:px-10 md:py-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="eyebrow text-[10px] text-paper-soft/48">Next step</p>
                  <h2 className="display-title mt-5 text-5xl md:text-6xl">
                    See the same logic translated into a working client experience.
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-paper-soft/72">
                    The public-facing redesign is now consistent from first impression to sign-in. Visitors can move from
                    atmosphere into architecture without losing the thread.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                  <Link href="/auth" className="atlas-button rounded-full px-6 py-4 text-sm font-medium">
                    Open client access
                  </Link>
                  <Link href="/" className="atlas-button-secondary rounded-full px-6 py-4 text-sm font-medium">
                    Back to landing page
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
