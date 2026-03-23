"use client";

import { motion } from "motion/react";
import { useState } from "react";

const reveal = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const allZones = [
  { id: 1, name: "Front Lawn", type: "Grass", area: "450 sqft", sensors: 4, moisture: 82, status: "Active", schedule: "Daily 6AM" },
  { id: 2, name: "Back Garden", type: "Mixed Flora", area: "800 sqft", sensors: 6, moisture: 45, status: "Idle", schedule: "Every 2 days" },
  { id: 3, name: "Veggie Patch", type: "Vegetables", area: "200 sqft", sensors: 3, moisture: 31, status: "Needs Water", schedule: "Twice daily" },
  { id: 4, name: "Greenhouse", type: "Tropical", area: "1,200 sqft", sensors: 8, moisture: 90, status: "Active", schedule: "Humidity-based" },
  { id: 5, name: "North Orchard", type: "Fruit Trees", area: "2,400 sqft", sensors: 12, moisture: 68, status: "Idle", schedule: "Weekly deep soak" },
  { id: 6, name: "Herb Garden", type: "Herbs", area: "100 sqft", sensors: 2, moisture: 40, status: "Needs Water", schedule: "Daily" },
];

export default function ZonesPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? allZones : allZones.filter((zone) => zone.status.toLowerCase().includes(filter));

  return (
    <main className="px-5 py-6 md:px-8 md:py-8">
      <motion.header {...reveal} transition={{ duration: 0.5 }} className="mb-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-end">
        <div>
          <p className="eyebrow text-[9px] text-clay">Zones</p>
          <h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">Every watering zone gets its own readable identity.</h1>
        </div>
        <div className="flex flex-wrap gap-3 xl:justify-end">
          {["all", "active", "idle", "needs water"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full px-5 py-3 text-sm ${
                filter === value ? "atlas-button" : "border border-ink/10 bg-white/75 text-ink-soft"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </motion.header>

      <motion.section {...reveal} transition={{ duration: 0.5, delay: 0.1 }} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((zone, index) => (
          <article key={zone.id} className={`rounded-[2rem] p-6 ${index % 3 === 0 ? "dark-frame text-paper-soft" : "atlas-card text-ink"}`}>
            <p className={`eyebrow text-[8px] ${index % 3 === 0 ? "text-paper-soft/44" : "text-clay"}`}>{zone.status}</p>
            <h2 className={`mt-4 font-display text-4xl ${index % 3 === 0 ? "text-paper-soft" : "text-forest"}`}>{zone.name}</h2>
            <p className={`mt-3 text-sm ${index % 3 === 0 ? "text-paper-soft/68" : "text-ink-soft"}`}>
              {zone.type} • {zone.area}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className={`rounded-[1.2rem] px-4 py-4 ${index % 3 === 0 ? "bg-paper-soft/8" : "bg-white/70"}`}>
                <p className={`eyebrow text-[7px] ${index % 3 === 0 ? "text-paper-soft/44" : "text-ink-soft/58"}`}>Moisture</p>
                <p className={`mt-2 font-display text-3xl ${index % 3 === 0 ? "text-paper-soft" : "text-forest"}`}>{zone.moisture}%</p>
              </div>
              <div className={`rounded-[1.2rem] px-4 py-4 ${index % 3 === 0 ? "bg-paper-soft/8" : "bg-white/70"}`}>
                <p className={`eyebrow text-[7px] ${index % 3 === 0 ? "text-paper-soft/44" : "text-ink-soft/58"}`}>Sensors</p>
                <p className={`mt-2 font-display text-3xl ${index % 3 === 0 ? "text-paper-soft" : "text-forest"}`}>{zone.sensors}</p>
              </div>
            </div>
            <p className={`mt-5 text-sm ${index % 3 === 0 ? "text-paper-soft/68" : "text-ink-soft"}`}>{zone.schedule}</p>
          </article>
        ))}
      </motion.section>
    </main>
  );
}
