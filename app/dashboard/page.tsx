"use client";

import Link from "next/link";
import { motion } from "motion/react";

const reveal = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const plantPanels = [
  { name: "Moisture probe", value: "42%", note: "Below target" },
  { name: "Pot temperature", value: "24.8C", note: "Stable" },
  { name: "Reservoir", value: "68%", note: "Enough for today" },
  { name: "Last watering", value: "14m ago", note: "Settling" },
];

const focusCards = [
  {
    label: "Current specimen",
    title: "Monstera Deliciosa",
    status: "Observation mode",
    primaryLabel: "Moisture",
    primaryValue: "42%",
    secondaryLabel: "Target",
    secondaryValue: "48-55%",
  },
  {
    label: "Next action",
    title: "Prepare a short watering pulse",
    status: "Recommended in 06 min",
    primaryLabel: "Dose",
    primaryValue: "120 ml",
    secondaryLabel: "Pump time",
    secondaryValue: "18 sec",
  },
];

export default function DashboardPage() {
  return (
    <main className="px-5 py-6 md:px-8 md:py-8">
      <motion.header
        {...reveal}
        transition={{ duration: 0.5 }}
        className="mb-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-end"
      >
        <div>
          <p className="eyebrow text-[9px] text-clay">Plant overview</p>
          <h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">
            A calm operational read of one living system.
          </h1>
        </div>
        <div className="section-frame rounded-[1.8rem] p-5 md:p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["System status", "Online"],
              ["Plant state", "Drying gently"],
              ["Last sync", "14:02:45"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.3rem] bg-white/60 p-4">
                <p className="eyebrow text-[8px] text-ink-soft/58">{label}</p>
                <p className="mt-3 font-display text-2xl text-forest">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.header>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_0.85fr]">
        <div className="space-y-8">
          <motion.section
            {...reveal}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {plantPanels.map((panel) => (
              <div key={panel.name} className="atlas-card rounded-[1.8rem] p-5">
                <p className="eyebrow text-[8px] text-clay">{panel.name}</p>
                <p className="mt-4 font-display text-5xl text-forest">{panel.value}</p>
                <p className="mt-3 text-sm text-ink-soft">{panel.note}</p>
              </div>
            ))}
          </motion.section>

          <motion.section
            {...reveal}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="section-frame rounded-[2rem] p-6 md:p-7"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow text-[8px] text-clay">Plant focus</p>
                <h2 className="mt-2 font-display text-3xl text-forest">
                  What this plant needs right now
                </h2>
              </div>
              <Link href="/dashboard/zones" className="text-sm text-forest transition hover:text-clay">
                Open profile
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {focusCards.map((card) => (
                <div key={card.title} className="rounded-[1.6rem] border border-ink/8 bg-white/70 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-ink-soft">{card.label}</p>
                      <h3 className="mt-2 font-display text-3xl text-forest">{card.title}</h3>
                      <p className="mt-2 text-sm text-ink-soft">{card.status}</p>
                    </div>
                    <button className="atlas-button rounded-full px-4 py-2 text-xs font-medium">
                      Review
                    </button>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="rounded-[1.2rem] bg-paper p-4">
                      <p className="eyebrow text-[7px] text-ink-soft/58">{card.primaryLabel}</p>
                      <p className="mt-2 font-display text-3xl text-forest">{card.primaryValue}</p>
                    </div>
                    <div className="rounded-[1.2rem] bg-paper p-4">
                      <p className="eyebrow text-[7px] text-ink-soft/58">{card.secondaryLabel}</p>
                      <p className="mt-2 font-display text-3xl text-forest">{card.secondaryValue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <div className="space-y-8">
          <motion.section
            {...reveal}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="dark-frame rounded-[2rem] p-6 text-paper-soft md:p-7"
          >
            <p className="eyebrow text-[8px] text-paper-soft/46">Recommended action</p>
            <h2 className="mt-4 font-display text-4xl">
              Wait for the pot to settle, then add one short pulse.
            </h2>
            <p className="mt-4 text-sm leading-7 text-paper-soft/72">
              Moisture is still falling after the last dose. A small follow-up pulse should land closer to target than a
              long manual run.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {[
                ["Window", "in 06 min"],
                ["Expected use", "120 ml"],
                ["Confidence", "92/100"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.2rem] border border-paper/10 bg-paper-soft/6 px-4 py-3">
                  <p className="eyebrow text-[7px] text-paper-soft/44">{label}</p>
                  <p className="mt-2 text-sm text-paper-soft">{value}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            {...reveal}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="atlas-card rounded-[2rem] p-6 md:p-7"
          >
            <p className="eyebrow text-[8px] text-clay">Alerts</p>
            <div className="mt-5 space-y-4">
              {[
                ["Moisture below target", "The root zone has stayed under 45% for the last 18 minutes."],
                ["Reservoir check tonight", "Water supply is healthy now, but tomorrow morning will need a refill."],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-[1.3rem] bg-white/70 p-4">
                  <h3 className="font-medium text-forest">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-ink-soft">{copy}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
