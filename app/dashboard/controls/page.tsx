"use client";

import { motion } from "motion/react";
import { useState } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

interface ZoneControl {
  id: number;
  name: string;
  icon: string;
  moisture: number;
  isOn: boolean;
  duration: number;
  flowRate: string;
  lastWatered: string;
}

const initialZones: ZoneControl[] = [
  { id: 1, name: "Front Lawn", icon: "grass", moisture: 82, isOn: true, duration: 30, flowRate: "12L/min", lastWatered: "2 hours ago" },
  { id: 2, name: "Back Garden", icon: "local_florist", moisture: 45, isOn: false, duration: 15, flowRate: "8L/min", lastWatered: "6 hours ago" },
  { id: 3, name: "Veggie Patch", icon: "eco", moisture: 31, isOn: false, duration: 20, flowRate: "6L/min", lastWatered: "12 hours ago" },
  { id: 4, name: "Greenhouse", icon: "home_work", moisture: 90, isOn: true, duration: 45, flowRate: "10L/min", lastWatered: "1 hour ago" },
  { id: 5, name: "North Orchard", icon: "park", moisture: 68, isOn: false, duration: 60, flowRate: "18L/min", lastWatered: "1 day ago" },
  { id: 6, name: "Herb Garden", icon: "spa", moisture: 40, isOn: false, duration: 10, flowRate: "4L/min", lastWatered: "8 hours ago" },
];

export default function ControlsPage() {
  const [zones, setZones] = useState(initialZones);

  const toggleZone = (id: number) => {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, isOn: !z.isOn } : z)));
  };

  const setDuration = (id: number, dur: number) => {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, duration: dur } : z)));
  };

  return (
    <main className="p-8 min-h-screen">
      <motion.header {...fadeUp} transition={{ duration: 0.5 }} className="mb-12">
        <p className="font-label uppercase tracking-[0.2em] text-secondary-fixed-dim text-xs mb-2">Direct Control Interface</p>
        <h2 className="text-5xl font-bold font-headline tracking-tighter">Manual Controls</h2>
      </motion.header>

      {/* Quick Actions */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="flex gap-4 mb-8">
        <button className="bg-secondary text-on-secondary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 btn-magnetic">
          <span className="material-symbols-outlined text-sm">play_arrow</span> Start All
        </button>
        <button className="bg-error text-on-error px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-sm">stop</span> Emergency Stop
        </button>
      </motion.div>

      {/* Zone Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zones.map((zone, i) => (
          <motion.div
            key={zone.id}
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.05 }}
            whileHover={{ y: -3 }}
            className={`rounded-xl p-6 relative overflow-hidden hover-glow cursor-default ${
              zone.isOn
                ? "bg-secondary-fixed-dim/10 border border-secondary-fixed-dim/20"
                : "bg-surface-container-lowest shadow-sm border border-outline-variant/30"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${zone.isOn ? "bg-secondary-fixed-dim/20" : "bg-surface-container"}`}>
                  <span className={`material-symbols-outlined ${zone.isOn ? "text-secondary-fixed-dim" : "text-on-surface-variant"}`}>{zone.icon}</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg">{zone.name}</h4>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                    {zone.isOn ? (
                      <span className="text-secondary-fixed-dim flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim pulse-emerald inline-block" /> Active
                      </span>
                    ) : (
                      "Standby"
                    )}
                  </p>
                </div>
              </div>
              {/* Toggle */}
              <button
                onClick={() => toggleZone(zone.id)}
                className={`w-14 h-7 rounded-full p-1 transition-colors ${zone.isOn ? "bg-secondary-fixed-dim" : "bg-surface-container-high"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${zone.isOn ? "translate-x-7" : ""}`} />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-2xl font-headline font-bold">{zone.moisture}%</p>
                <p className="text-[10px] font-label text-on-surface-variant uppercase">Moisture</p>
              </div>
              <div>
                <p className="text-2xl font-headline font-bold">{zone.flowRate}</p>
                <p className="text-[10px] font-label text-on-surface-variant uppercase">Flow Rate</p>
              </div>
              <div>
                <p className="text-2xl font-headline font-bold">{zone.duration}m</p>
                <p className="text-[10px] font-label text-on-surface-variant uppercase">Duration</p>
              </div>
            </div>

            {/* Duration Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-label text-on-surface-variant uppercase tracking-widest">
                <span>Duration</span>
                <span className="text-secondary-fixed-dim font-bold">{zone.duration} min</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                value={zone.duration}
                onChange={(e) => setDuration(zone.id, Number(e.target.value))}
                className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-secondary-fixed-dim"
              />
              <div className="flex justify-between text-[10px] font-label text-on-surface-variant/50">
                <span>5m</span><span>120m</span>
              </div>
            </div>

            {/* Last Watered */}
            <div className="mt-4 flex items-center gap-2 text-[10px] text-on-surface-variant uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">history</span> Last watered: {zone.lastWatered}
            </div>

            <div className="absolute -bottom-8 -right-8 opacity-5">
              <span className="material-symbols-outlined text-[120px]">{zone.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
