"use client";

import { motion } from "motion/react";
import { useState } from "react";
import PumpControlCard from "@/app/components/PumpControlCard";

const reveal = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

interface ControlLine {
  id: number;
  name: string;
  statusReference: string;
  isOn: boolean;
  duration: number;
  flowRate: string;
  lastActivity: string;
}

const initialLines: ControlLine[] = [
  {
    id: 1,
    name: "Primary watering line",
    statusReference: "42% moisture",
    isOn: false,
    duration: 18,
    flowRate: "400 ml/min",
    lastActivity: "14 minutes ago",
  },
  {
    id: 2,
    name: "Reservoir refill line",
    statusReference: "68% reservoir",
    isOn: false,
    duration: 45,
    flowRate: "1.2 L/min",
    lastActivity: "Yesterday evening",
  },
];

export default function ControlsPage() {
  const [lines, setLines] = useState(initialLines);

  const toggleLine = (id: number) => {
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, isOn: !line.isOn } : line)));
  };

  return (
    <main className="px-5 py-6 md:px-8 md:py-8">
      <motion.header
        {...reveal}
        transition={{ duration: 0.5 }}
        className="mb-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-end"
      >
        <div>
          <p className="eyebrow text-[9px] text-clay">Manual controls</p>
          <h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">
            Direct hardware control without pretending there are zones.
          </h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
          <button className="atlas-button rounded-full px-6 py-4 text-sm font-medium">
            Prime watering line
          </button>
          <button className="rounded-full border border-clay/30 bg-white/80 px-6 py-4 text-sm text-clay">
            Emergency stop
          </button>
        </div>
      </motion.header>

      <motion.div {...reveal} transition={{ duration: 0.45, delay: 0.05 }} className="mb-8">
        <PumpControlCard />
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-2">
        {lines.map((line, index) => (
          <motion.section
            key={line.id}
            {...reveal}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            className={`${line.isOn ? "dark-frame text-paper-soft" : "atlas-card text-ink"} rounded-[2rem] p-6 md:p-7`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`eyebrow text-[8px] ${line.isOn ? "text-paper-soft/44" : "text-clay"}`}>
                  {line.isOn ? "Active now" : "Standby"}
                </p>
                <h2 className={`mt-3 font-display text-4xl ${line.isOn ? "text-paper-soft" : "text-forest"}`}>
                  {line.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => toggleLine(line.id)}
                className={`rounded-full px-4 py-2 text-xs ${line.isOn ? "bg-paper-soft/10 text-paper-soft" : "atlas-button"}`}
              >
                {line.isOn ? "Stop" : "Start"}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                ["Reference", line.statusReference],
                ["Flow", line.flowRate],
                ["Duration", `${line.duration} sec`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className={`rounded-[1.3rem] px-4 py-4 ${line.isOn ? "bg-paper-soft/8" : "bg-white/70"} ${
                    label === "Flow" ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  <p className={`eyebrow text-[7px] ${line.isOn ? "text-paper-soft/44" : "text-ink-soft/58"}`}>
                    {label}
                  </p>
                  <p
                    className={`mt-2 break-words font-display leading-none ${line.isOn ? "text-paper-soft" : "text-forest"} ${
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
                <span className={line.isOn ? "text-paper-soft/58" : "text-ink-soft"}>Run length</span>
                <span className={line.isOn ? "text-paper-soft" : "text-forest"}>{line.duration} sec</span>
              </div>
              <input
                type="range"
                min="5"
                max="180"
                value={line.duration}
                onChange={(event) =>
                  setLines((prev) =>
                    prev.map((item) =>
                      item.id === line.id ? { ...item, duration: Number(event.target.value) } : item
                    )
                  )
                }
                className="w-full accent-moss"
              />
            </div>

            <p className={`mt-5 text-sm ${line.isOn ? "text-paper-soft/66" : "text-ink-soft"}`}>
              Last activity {line.lastActivity}
            </p>
          </motion.section>
        ))}
      </div>
    </main>
  );
}
