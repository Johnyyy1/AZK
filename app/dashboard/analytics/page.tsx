"use client";

import { motion } from "motion/react";

const reveal = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const logs = [
  { time: "Today, 05:30 AM", sub: "Cycle Complete", zone: "North Orchard", duration: "45 min", volume: "120L", method: "Scheduled", status: "Verified" },
  { time: "Yesterday, 10:15 PM", sub: "Manual Override", zone: "West Terrace", duration: "12 min", volume: "32L", method: "Manual", status: "Verified" },
  { time: "Yesterday, 05:30 AM", sub: "Interrupted", zone: "South Lawn", duration: "08 min", volume: "18L", method: "Smart Rain", status: "Low Pressure" },
];

export default function AnalyticsPage() {
  return (
    <main className="px-5 py-6 md:px-8 md:py-8">
      <motion.header {...reveal} transition={{ duration: 0.5 }} className="mb-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-end">
        <div>
          <p className="eyebrow text-[9px] text-clay">Analytics</p>
          <h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">The numbers are readable before they are impressive.</h1>
        </div>
        <div className="section-frame rounded-[1.8rem] p-5 md:p-6">
          <p className="text-sm leading-7 text-ink-soft">
            A dashboard should foreground what changed, what matters, and what to do next. This view keeps the pacing consistent with the public site.
          </p>
        </div>
      </motion.header>

      <motion.section {...reveal} transition={{ duration: 0.5, delay: 0.1 }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Aggregate moisture", "64%", "Optimal"],
          ["Root temperature", "22.4C", "Stable"],
          ["Weekly usage", "1,482L", "12% above avg"],
          ["Health score", "92/100", "Strong"],
        ].map(([label, value, note]) => (
          <div key={label} className="atlas-card rounded-[1.8rem] p-5">
            <p className="eyebrow text-[8px] text-clay">{label}</p>
            <p className="mt-4 font-display text-5xl text-forest">{value}</p>
            <p className="mt-3 text-sm text-ink-soft">{note}</p>
          </div>
        ))}
      </motion.section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.section {...reveal} transition={{ duration: 0.5, delay: 0.15 }} className="section-frame rounded-[2rem] p-6 md:p-7">
          <div className="flex flex-col gap-3 border-b border-ink/10 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-[8px] text-clay">Hydration velocity</p>
              <h2 className="mt-2 font-display text-3xl text-forest">Realtime moisture absorption</h2>
            </div>
            <div className="flex gap-2">
              {["24H", "7D", "30D"].map((label, index) => (
                <button
                  key={label}
                  className={`rounded-full px-4 py-2 text-xs ${index === 0 ? "atlas-button" : "border border-ink/10 bg-white/70 text-ink-soft"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 h-72">
            <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 220">
              <path d="M0,180 C140,170 260,190 410,128 C560,66 760,112 1000,48" fill="none" stroke="#22b07d" strokeWidth="5" strokeLinecap="round" />
              <path d="M0,220 L0,180 C140,170 260,190 410,128 C560,66 760,112 1000,48 L1000,220 Z" fill="url(#analyticsFill)" opacity="0.18" />
              <defs>
                <linearGradient id="analyticsFill" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#7fd4ff" />
                  <stop offset="100%" stopColor="#67f3c8" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.section>

        <motion.section {...reveal} transition={{ duration: 0.5, delay: 0.2 }} className="dark-frame rounded-[2rem] p-6 md:p-7 text-paper-soft">
          <p className="eyebrow text-[8px] text-paper-soft/46">Recent watering logs</p>
          <div className="mt-5 space-y-4">
            {logs.map((log) => (
              <div key={`${log.time}-${log.zone}`} className="rounded-[1.4rem] border border-paper/10 bg-paper-soft/6 p-4">
                <p className="text-sm text-paper-soft/62">{log.time}</p>
                <h3 className="mt-2 font-display text-3xl">{log.zone}</h3>
                <p className="mt-2 text-sm text-paper-soft/72">
                  {log.sub} • {log.duration} • {log.volume}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-paper-soft/46">
                  {log.method} / {log.status}
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
