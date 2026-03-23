"use client";

import Link from "next/link";
import { motion } from "motion/react";

const reveal = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const zones = [
  { name: "Front Lawn", moisture: 82, remaining: "12m", status: "Watering" },
  { name: "Back Garden", moisture: 45, remaining: "--", status: "Idle" },
  { name: "Veggie Patch", moisture: 31, remaining: "--", status: "Needs water" },
  { name: "Greenhouse", moisture: 90, remaining: "04m", status: "Watering" },
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
          <p className="eyebrow text-[9px] text-clay">Ecosystem overview</p>
          <h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">A calm operational read of the whole site.</h1>
        </div>
        <div className="section-frame rounded-[1.8rem] p-5 md:p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["System status", "Online"],
              ["Active zones", "2 now"],
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
          <motion.section {...reveal} transition={{ duration: 0.5, delay: 0.1 }} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              ["Air humidity", "64%", "Stable"],
              ["Avg. temperature", "24.8C", "Warm"],
              ["Soil moisture", "52%", "Recovering"],
            ].map(([label, value, note]) => (
              <div key={label} className="atlas-card rounded-[1.8rem] p-5">
                <p className="eyebrow text-[8px] text-clay">{label}</p>
                <p className="mt-4 font-display text-5xl text-forest">{value}</p>
                <p className="mt-3 text-sm text-ink-soft">{note}</p>
              </div>
            ))}
          </motion.section>

          <motion.section {...reveal} transition={{ duration: 0.5, delay: 0.15 }} className="section-frame rounded-[2rem] p-6 md:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow text-[8px] text-clay">Active zones</p>
                <h2 className="mt-2 font-display text-3xl text-forest">What needs attention right now</h2>
              </div>
              <Link href="/dashboard/zones" className="text-sm text-forest transition hover:text-clay">
                Manage all
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {zones.map((zone) => (
                <div key={zone.name} className="rounded-[1.6rem] border border-ink/8 bg-white/70 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-ink-soft">{zone.status}</p>
                      <h3 className="mt-2 font-display text-3xl text-forest">{zone.name}</h3>
                    </div>
                    <button className="atlas-button rounded-full px-4 py-2 text-xs font-medium">
                      {zone.status === "Watering" ? "Stop" : "Start"}
                    </button>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="rounded-[1.2rem] bg-paper p-4">
                      <p className="eyebrow text-[7px] text-ink-soft/58">Moisture</p>
                      <p className="mt-2 font-display text-3xl text-forest">{zone.moisture}%</p>
                    </div>
                    <div className="rounded-[1.2rem] bg-paper p-4">
                      <p className="eyebrow text-[7px] text-ink-soft/58">Remaining</p>
                      <p className="mt-2 font-display text-3xl text-forest">{zone.remaining}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <div className="space-y-8">
          <motion.section {...reveal} transition={{ duration: 0.5, delay: 0.2 }} className="dark-frame rounded-[2rem] p-6 md:p-7 text-paper-soft">
            <p className="eyebrow text-[8px] text-paper-soft/46">Recommended action</p>
            <h2 className="mt-4 font-display text-4xl">Shift the next turf cycle to dusk.</h2>
            <p className="mt-4 text-sm leading-7 text-paper-soft/72">
              Wind speed softens after sunset and moisture remains below target in the exposed lawn zones.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {[
                ["Window", "20:10-22:00"],
                ["Expected use", "120 L"],
                ["Confidence", "92/100"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.2rem] border border-paper/10 bg-paper-soft/6 px-4 py-3">
                  <p className="eyebrow text-[7px] text-paper-soft/44">{label}</p>
                  <p className="mt-2 text-sm text-paper-soft">{value}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section {...reveal} transition={{ duration: 0.5, delay: 0.25 }} className="atlas-card rounded-[2rem] p-6 md:p-7">
            <p className="eyebrow text-[8px] text-clay">Alerts</p>
            <div className="mt-5 space-y-4">
              {[
                ["Low reservoir level", "Water supply currently at 12%. Refill recommended."],
                ["Sensor 04 offline", "Back Garden has not reported in the last three hours."],
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
