"use client";

import { motion } from "motion/react";
import { useState } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM"];
const scheduleData: Record<string, number[]> = {
  Mon: [1, 1, 0, 0, 0, 1, 1, 0],
  Tue: [1, 0, 0, 0, 0, 0, 1, 0],
  Wed: [1, 1, 0, 0, 0, 1, 1, 0],
  Thu: [1, 0, 0, 0, 0, 0, 1, 0],
  Fri: [1, 1, 0, 0, 0, 1, 1, 0],
  Sat: [0, 1, 1, 0, 0, 0, 0, 0],
  Sun: [0, 0, 0, 0, 0, 0, 0, 0],
};

const rules = [
  { id: 1, name: "Rain Skip", condition: "IF rainfall > 5mm in next 6hrs", action: "THEN skip scheduled cycle", active: true, icon: "rainy" },
  { id: 2, name: "Heat Protection", condition: "IF temperature > 35°C", action: "THEN add 10min to evening cycle", active: true, icon: "thermostat" },
  { id: 3, name: "Frost Guard", condition: "IF temperature < 2°C at dawn", action: "THEN cancel morning cycle", active: false, icon: "ac_unit" },
  { id: 4, name: "Moisture Override", condition: "IF soil moisture > 80%", action: "THEN postpone next cycle by 12hrs", active: true, icon: "water_drop" },
];

export default function SchedulingPage() {
  const [activeTab, setActiveTab] = useState<"calendar" | "rules">("calendar");

  return (
    <main className="p-8 min-h-screen">
      <motion.header {...fadeUp} transition={{ duration: 0.5 }} className="mb-12">
        <p className="font-label uppercase tracking-[0.2em] text-secondary-fixed-dim text-xs mb-2">Automation Engine</p>
        <h2 className="text-5xl font-bold font-headline tracking-tighter">Scheduling & Automation</h2>
      </motion.header>

      {/* Tab Bar */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab("calendar")}
          className={`px-6 py-3 rounded-xl text-sm font-bold font-headline transition-all ${activeTab === "calendar" ? "bg-primary-container text-secondary-fixed-dim" : "bg-surface-container text-on-surface-variant"}`}
        >
          <span className="material-symbols-outlined text-sm mr-2 align-middle">calendar_month</span>
          Weekly Calendar
        </button>
        <button
          onClick={() => setActiveTab("rules")}
          className={`px-6 py-3 rounded-xl text-sm font-bold font-headline transition-all ${activeTab === "rules" ? "bg-primary-container text-secondary-fixed-dim" : "bg-surface-container text-on-surface-variant"}`}
        >
          <span className="material-symbols-outlined text-sm mr-2 align-middle">rule</span>
          Smart Rules
        </button>
      </motion.div>

      {activeTab === "calendar" && (
        <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="space-y-8">
          {/* Schedule Grid */}
          <div className="bg-surface-container-lowest rounded-xl p-8 overflow-x-auto">
            <h3 className="font-headline text-xl font-bold mb-8">Weekly Watering Schedule</h3>
            <div className="min-w-[600px]">
              {/* Header row */}
              <div className="grid grid-cols-9 gap-2 mb-4">
                <div />
                {hours.map((h) => (
                  <div key={h} className="text-center text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant">{h}</div>
                ))}
              </div>
              {/* Data rows */}
              {days.map((day) => (
                <div key={day} className="grid grid-cols-9 gap-2 mb-2">
                  <div className="flex items-center text-sm font-bold font-headline">{day}</div>
                  {scheduleData[day].map((val, j) => (
                    <div
                      key={j}
                      className={`h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer hover:scale-105 ${
                        val ? "bg-secondary-fixed-dim/20 border border-secondary-fixed-dim/40 hover:bg-secondary-fixed-dim/30 hover:shadow-[0_0_12px_rgba(77,224,130,0.15)]" : "bg-surface-container hover:bg-surface-container-high"
                      }`}
                    >
                      {val ? <span className="material-symbols-outlined text-secondary-fixed-dim text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span> : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-surface-container-lowest rounded-xl p-8">
            <h3 className="font-headline text-xl font-bold mb-6">Upcoming Cycles</h3>
            <div className="space-y-4">
              {[
                { zone: "Front Lawn", time: "Tomorrow, 6:00 AM", duration: "30 min", type: "Scheduled" },
                { zone: "Greenhouse", time: "Tomorrow, 6:00 AM", duration: "45 min", type: "Humidity-triggered" },
                { zone: "North Orchard", time: "Wed, 6:00 AM", duration: "60 min", type: "Deep Soak" },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between bg-surface-container-lowest shadow-sm border border-outline-variant/30 p-4 rounded-xl hover-glow cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary-fixed-dim/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary-fixed-dim text-sm">schedule</span>
                    </div>
                    <div>
                      <p className="font-headline font-bold text-sm">{c.zone}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase">{c.time} • {c.duration}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-surface-container px-3 py-1 rounded-lg text-on-surface-variant">{c.type}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "rules" && (
        <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="space-y-6">
          {rules.map((rule, i) => (
            <motion.div
              key={rule.id}
              {...fadeUp}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className="bg-surface-container-lowest rounded-xl p-6 flex items-center justify-between hover-glow"
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${rule.active ? "bg-secondary-fixed-dim/20" : "bg-surface-container"}`}>
                  <span className={`material-symbols-outlined text-2xl ${rule.active ? "text-secondary-fixed-dim" : "text-on-surface-variant"}`}>{rule.icon}</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg">{rule.name}</h4>
                  <p className="text-xs text-on-surface-variant mt-1">
                    <span className="text-tertiary-fixed-dim font-bold">{rule.condition}</span>
                    <span className="mx-2">→</span>
                    <span className="text-secondary-fixed-dim font-bold">{rule.action}</span>
                  </p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full relative cursor-pointer p-1 transition-colors ${rule.active ? "bg-secondary-fixed-dim" : "bg-surface-container-high"}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${rule.active ? "translate-x-6" : ""}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
}
