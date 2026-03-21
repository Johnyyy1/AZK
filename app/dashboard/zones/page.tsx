"use client";

import { motion } from "motion/react";
import { useState } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const allZones = [
  { id: 1, name: "Front Lawn", type: "Grass", area: "450 sqft", sensors: 4, moisture: 82, status: "Active", icon: "grass", schedule: "Daily 6AM" },
  { id: 2, name: "Back Garden", type: "Mixed Flora", area: "800 sqft", sensors: 6, moisture: 45, status: "Idle", icon: "local_florist", schedule: "Every 2 days" },
  { id: 3, name: "Veggie Patch", type: "Vegetables", area: "200 sqft", sensors: 3, moisture: 31, status: "Needs Water", icon: "eco", schedule: "Twice daily" },
  { id: 4, name: "Greenhouse", type: "Tropical", area: "1,200 sqft", sensors: 8, moisture: 90, status: "Active", icon: "home_work", schedule: "Humidity-based" },
  { id: 5, name: "North Orchard", type: "Fruit Trees", area: "2,400 sqft", sensors: 12, moisture: 68, status: "Idle", icon: "park", schedule: "Weekly deep soak" },
  { id: 6, name: "West Terrace", type: "Ornamental", area: "350 sqft", sensors: 3, moisture: 55, status: "Idle", icon: "deck", schedule: "Every 3 days" },
  { id: 7, name: "South Lawn", type: "Grass", area: "600 sqft", sensors: 4, moisture: 72, status: "Active", icon: "yard", schedule: "Daily 7AM" },
  { id: 8, name: "Herb Garden", type: "Herbs", area: "100 sqft", sensors: 2, moisture: 40, status: "Needs Water", icon: "spa", schedule: "Daily" },
];

export default function ZonesPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? allZones : allZones.filter((z) => z.status.toLowerCase().includes(filter));

  return (
    <main className="p-8 min-h-screen">
      <motion.header {...fadeUp} transition={{ duration: 0.5 }} className="mb-12">
        <p className="font-label uppercase tracking-[0.2em] text-secondary-fixed-dim text-xs mb-2">Zone Management</p>
        <h2 className="text-5xl font-bold font-headline tracking-tighter">Irrigation Zones</h2>
      </motion.header>

      {/* Stats Row */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Zones", value: "8" },
          { label: "Active Now", value: "3" },
          { label: "Avg. Moisture", value: "60%" },
          { label: "Total Sensors", value: "42" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-6 rounded-xl">
            <p className="font-label uppercase tracking-widest text-[10px] text-on-surface-variant mb-2">{s.label}</p>
            <span className="text-3xl font-headline font-bold">{s.value}</span>
          </div>
        ))}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="flex gap-2 mb-8">
        {["all", "active", "idle", "needs water"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              filter === f ? "bg-primary-container text-secondary-fixed-dim" : "bg-dash-container text-on-surface-variant hover:bg-dash-container-high"
            }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Zone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((zone, i) => (
          <motion.div
            key={zone.id}
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
            className="glass-card rounded-xl p-6 relative overflow-hidden group hover:border-secondary-fixed-dim/20 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                zone.status === "Active"
                  ? "bg-secondary-container/20 text-secondary-fixed-dim"
                  : zone.status === "Needs Water"
                    ? "bg-error-container/20 text-error"
                    : "bg-dash-container-high text-on-surface-variant"
              }`}>
                {zone.status}
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-sm opacity-50 group-hover:opacity-100 transition-opacity">more_vert</span>
            </div>
            <h4 className="text-xl font-headline font-bold mb-1">{zone.name}</h4>
            <p className="text-xs text-on-surface-variant mb-4">{zone.type} • {zone.area}</p>

            <div className="flex items-center gap-4 mb-4">
              <div>
                <span className="text-2xl font-headline font-bold">{zone.moisture}%</span>
                <p className="text-[10px] font-label text-on-surface-variant uppercase">Moisture</p>
              </div>
              <div className="w-px h-10 bg-on-surface-variant/20" />
              <div>
                <span className="text-2xl font-headline font-bold">{zone.sensors}</span>
                <p className="text-[10px] font-label text-on-surface-variant uppercase">Sensors</p>
              </div>
            </div>

            <div className="w-full bg-dash-container-high h-1.5 rounded-full mb-4">
              <div
                className={`h-full rounded-full transition-all ${
                  zone.moisture > 70 ? "bg-secondary-fixed-dim" : zone.moisture > 40 ? "bg-tertiary-fixed-dim" : "bg-error"
                }`}
                style={{ width: `${zone.moisture}%` }}
              />
            </div>

            <div className="flex items-center gap-2 text-[10px] text-on-surface-variant uppercase">
              <span className="material-symbols-outlined text-sm">schedule</span>
              {zone.schedule}
            </div>

            <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">{zone.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
