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
    title: "Probe layer",
    metric: "Single root-zone sensor",
    text: "Moisture is collected directly from one pot, so the automation is responding to a real root zone instead of a timer.",
  },
  {
    title: "Decision layer",
    metric: "5-minute evaluation loop",
    text: "Recent readings, the previous watering event, and simple safety rules fold into a recommendation window that stays explainable.",
  },
  {
    title: "Pump layer",
    metric: "One line, one override path",
    text: "Schedules, manual overrides, and safety checks remain visible so the pump never feels detached from the person using it.",
  },
];

const specRows = [
  ["Telemetry cadence", "30 seconds"],
  ["Typical response latency", "< 200 ms"],
  ["Managed plants", "1 specimen"],
  ["Offline continuity", "Local queue + replay"],
  ["Control logging", "Single rig event history"],
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
                  The stack is engineered like a careful instrument for one plant.
                </h1>
              </div>

              <div className="section-frame rounded-[2rem] p-6 md:p-8">
                <p className="eyebrow text-[9px] text-ink-soft/56">Operating idea</p>
                <p className="mt-4 text-base leading-8 text-ink-soft md:text-lg">
                  AquaSmart is not a black box and it is not a huge estate platform. It turns one sensor, one decision
                  loop, and one pump path into a readable chain the operator can audit at a glance.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-forest-deep py-24 text-paper-soft md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <motion.div {...reveal} className="mb-12 max-w-3xl">
              <p className="eyebrow text-[10px] text-paper-soft/52">Architecture</p>
              <h2 className="display-title mt-5 text-5xl md:text-7xl">Three layers. One legible watering path.</h2>
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
                Recommendations do not float above the pot. They follow what the roots are doing.
              </h2>
              <div className="mt-10 rounded-[1.9rem] border border-ink/10 bg-paper p-5">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    ["Soil moisture", "42%", "Below target"],
                    ["Room temperature", "27C", "Warm shelf"],
                    ["Last pump run", "14 min ago", "Settling"],
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
                      <h3 className="mt-2 font-display text-4xl">Water in 06 min</h3>
                    </div>
                    <p className="max-w-sm text-sm leading-7 text-paper-soft/70">
                      Recommended because the root zone is still drying, the last dose has already settled, and the safety
                      delay has expired.
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
                <p className="mt-4 font-display text-3xl">Fewer blind spots. Gentler intervention.</p>
                <p className="mt-4 text-sm leading-7 text-paper-soft/78">
                  The platform makes it clear when a recommendation comes from the probe alone and when an operator
                  override changed the plan.
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
                    See the same logic translated into a working operator dashboard.
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-paper-soft/72">
                    The public-facing redesign now lines up with the product itself. Visitors can move from the story into
                    the live single-plant controls without losing the thread.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                  <Link href="/auth" className="atlas-button rounded-full px-6 py-4 text-sm font-medium">
                    Open operator access
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
