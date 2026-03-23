"use client";

import { motion } from "motion/react";
import { useState } from "react";

const reveal = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

interface ZoneControl {
  id: number;
  name: string;
  moisture: number;
  isOn: boolean;
  duration: number;
  flowRate: string;
  lastWatered: string;
}

const initialZones: ZoneControl[] = [
  { id: 1, name: "Front Lawn", moisture: 82, isOn: true, duration: 30, flowRate: "12L/min", lastWatered: "2 hours ago" },
  { id: 2, name: "Back Garden", moisture: 45, isOn: false, duration: 15, flowRate: "8L/min", lastWatered: "6 hours ago" },
  { id: 3, name: "Veggie Patch", moisture: 31, isOn: false, duration: 20, flowRate: "6L/min", lastWatered: "12 hours ago" },
  { id: 4, name: "Greenhouse", moisture: 90, isOn: true, duration: 45, flowRate: "10L/min", lastWatered: "1 hour ago" },
];

export default function ControlsPage() {
  const [zones, setZones] = useState(initialZones);

  const toggleZone = (id: number) => {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, isOn: !z.isOn } : z)));
  };

  return (
    <main className="px-5 py-6 md:px-8 md:py-8">
      <motion.header {...reveal} transition={{ duration: 0.5 }} className="mb-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-end">
        <div>
          <p className="eyebrow text-[9px] text-clay">Manual controls</p>
          <h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">Direct zone control without losing the product feel.</h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
          <button className="atlas-button rounded-full px-6 py-4 text-sm font-medium">Start all</button>
          <button className="rounded-full border border-clay/30 bg-white/80 px-6 py-4 text-sm text-clay">Emergency stop</button>
        </div>
      </motion.header>

      <div className="grid gap-5 lg:grid-cols-2">
        {zones.map((zone, index) => (
          <motion.section
            key={zone.id}
            {...reveal}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            className={`${zone.isOn ? "dark-frame text-paper-soft" : "atlas-card text-ink"} rounded-[2rem] p-6 md:p-7`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`eyebrow text-[8px] ${zone.isOn ? "text-paper-soft/44" : "text-clay"}`}>
                  {zone.isOn ? "Active now" : "Standby"}
                </p>
                <h2 className={`mt-3 font-display text-4xl ${zone.isOn ? "text-paper-soft" : "text-forest"}`}>{zone.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => toggleZone(zone.id)}
                className={`rounded-full px-4 py-2 text-xs ${zone.isOn ? "bg-paper-soft/10 text-paper-soft" : "atlas-button"}`}
              >
                {zone.isOn ? "Stop" : "Start"}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                ["Moisture", `${zone.moisture}%`],
                ["Flow", zone.flowRate],
                ["Duration", `${zone.duration}m`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className={`rounded-[1.3rem] px-4 py-4 ${zone.isOn ? "bg-paper-soft/8" : "bg-white/70"} ${
                    label === "Flow" ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  <p className={`eyebrow text-[7px] ${zone.isOn ? "text-paper-soft/44" : "text-ink-soft/58"}`}>{label}</p>
                  <p
                    className={`mt-2 break-words font-display leading-none ${zone.isOn ? "text-paper-soft" : "text-forest"} ${
                      label === "Flow" ? "text-[2rem] sm:text-3xl" : "text-3xl"
                    }`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className={zone.isOn ? "text-paper-soft/58" : "text-ink-soft"}>Run length</span>
                <span className={zone.isOn ? "text-paper-soft" : "text-forest"}>{zone.duration} min</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                value={zone.duration}
                onChange={(e) =>
                  setZones((prev) => prev.map((z) => (z.id === zone.id ? { ...z, duration: Number(e.target.value) } : z)))
                }
                className="w-full accent-moss"
              />
            </div>

            <p className={`mt-5 text-sm ${zone.isOn ? "text-paper-soft/66" : "text-ink-soft"}`}>Last watered {zone.lastWatered}</p>
          </motion.section>
        ))}
      </div>
    </main>
  );
}
