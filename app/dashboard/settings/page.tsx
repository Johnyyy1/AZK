"use client";

import { motion } from "motion/react";

const reveal = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  return (
    <main className="px-5 py-6 md:px-8 md:py-8">
      <motion.header
        {...reveal}
        transition={{ duration: 0.5 }}
        className="mb-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-end"
      >
        <div>
          <p className="eyebrow text-[9px] text-clay">Settings</p>
          <h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">
            Configuration belongs in the same calm language as the plant controls.
          </h1>
        </div>
        <p className="section-frame rounded-[1.8rem] p-5 text-sm leading-7 text-ink-soft">
          Security, units, alerts, and operator preferences are now framed around one rig and one plant instead of a
          fictitious fleet.
        </p>
      </motion.header>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <motion.section
          {...reveal}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="section-frame rounded-[2rem] p-6 md:p-7"
        >
          <p className="eyebrow text-[8px] text-clay">System settings</p>
          <div className="mt-6 space-y-5">
            {[
              ["Measurement units", "Metric (Celsius, L)"],
              ["System timezone", "Central European Time"],
              ["Default pulse duration", "18 seconds"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.4rem] bg-white/70 p-5">
                <p className="eyebrow text-[7px] text-ink-soft/58">{label}</p>
                <p className="mt-3 font-display text-3xl text-forest">{value}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="space-y-8">
          <motion.section
            {...reveal}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="dark-frame rounded-[2rem] p-6 text-paper-soft md:p-7"
          >
            <p className="eyebrow text-[8px] text-paper-soft/44">Profile</p>
            <h2 className="mt-4 font-display text-4xl">Sarah Jenkins</h2>
            <p className="mt-3 text-sm text-paper-soft/68">Plant operator • Bench rig 01</p>
            <div className="mt-6 space-y-3">
              <div className="rounded-[1.2rem] border border-paper/10 bg-paper-soft/8 px-4 py-3">
                s.jenkins@aquasmart.one
              </div>
              <div className="rounded-[1.2rem] border border-paper/10 bg-paper-soft/8 px-4 py-3">
                Two-factor auth active
              </div>
            </div>
            <button className="atlas-button mt-6 rounded-full px-6 py-4 text-sm font-medium">Update account</button>
          </motion.section>

          <motion.section
            {...reveal}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="atlas-card rounded-[2rem] p-6 md:p-7"
          >
            <p className="eyebrow text-[8px] text-clay">Notifications</p>
            <div className="mt-5 space-y-4">
              {[
                ["Email digests", "Weekly plant hydration summaries"],
                ["Critical alerts", "Push notifications for dry soil or hardware issues"],
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
