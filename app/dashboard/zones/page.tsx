"use client";

import Link from "next/link";
import { motion } from "motion/react";

const reveal = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function ZonesPage() {
  return (
    <main className="px-5 py-6 md:px-8 md:py-8">
      <motion.header
        {...reveal}
        transition={{ duration: 0.5 }}
        className="mb-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-end"
      >
        <div>
          <p className="eyebrow text-[9px] text-clay">Plant profile</p>
          <h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">
            The whole dashboard now revolves around one specimen.
          </h1>
        </div>
        <div className="section-frame rounded-[1.8rem] p-5 text-sm leading-7 text-ink-soft">
          This route used to describe many zones. It now acts as the single source of truth for the plant, pot, sensor,
          and watering target the hardware is actually managing.
        </div>
      </motion.header>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <motion.section
          {...reveal}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="dark-frame rounded-[2rem] p-6 text-paper-soft md:p-7"
        >
          <p className="eyebrow text-[8px] text-paper-soft/44">Current specimen</p>
          <h2 className="mt-4 font-display text-5xl">Monstera Deliciosa</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-paper-soft/72">
            One moisture probe, one watering tube, one ceramic pot, and one operator workflow. That is the entire
            system.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["Pot volume", "12 L"],
              ["Soil mix", "Aroid blend"],
              ["Target moisture", "48-55%"],
              ["Light profile", "Bright indirect"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.3rem] border border-paper/10 bg-paper-soft/6 px-4 py-4">
                <p className="eyebrow text-[7px] text-paper-soft/44">{label}</p>
                <p className="mt-2 text-sm text-paper-soft">{value}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="space-y-8">
          <motion.section
            {...reveal}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="atlas-card rounded-[2rem] p-6 md:p-7"
          >
            <p className="eyebrow text-[8px] text-clay">Sensor placement</p>
            <div className="mt-5 space-y-4">
              {[
                ["Probe depth", "Inserted halfway into the root zone for a stable reading."],
                ["Pump outlet", "Aimed toward the inner edge of the pot to avoid channeling."],
                ["Drainage check", "Last runoff check was clean with no standing water."],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-[1.3rem] bg-white/70 p-4">
                  <h3 className="font-medium text-forest">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-ink-soft">{copy}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            {...reveal}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="section-frame rounded-[2rem] p-6 md:p-7"
          >
            <p className="eyebrow text-[8px] text-clay">Next moves</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard/controls" className="atlas-button rounded-full px-5 py-3 text-sm font-medium">
                Open manual controls
              </Link>
              <Link
                href="/dashboard/scheduling"
                className="atlas-button-secondary rounded-full px-5 py-3 text-sm font-medium"
              >
                Review cycle rules
              </Link>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
