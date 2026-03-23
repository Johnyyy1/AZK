"use client";

import { motion } from "motion/react";
import { useState } from "react";

const reveal = {
  initial: { opacity: 0, y: 24 },
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
  { id: 1, name: "Rain Skip", condition: "Rainfall > 5mm in next 6 hrs", action: "Skip scheduled cycle", active: true },
  { id: 2, name: "Heat Protection", condition: "Temperature > 35C", action: "Add 10 min to evening cycle", active: true },
  { id: 3, name: "Frost Guard", condition: "Temperature < 2C at dawn", action: "Cancel morning cycle", active: false },
];

export default function SchedulingPage() {
  const [activeTab, setActiveTab] = useState<"calendar" | "rules">("calendar");

  return (
    <main className="px-5 py-6 md:px-8 md:py-8">
      <motion.header {...reveal} transition={{ duration: 0.5 }} className="mb-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-end">
        <div>
          <p className="eyebrow text-[9px] text-clay">Scheduling</p>
          <h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">Automation should read like a timetable, not a maze.</h1>
        </div>
        <div className="flex flex-wrap gap-3 xl:justify-end">
          {[
            ["calendar", "Weekly calendar"],
            ["rules", "Smart rules"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setActiveTab(value as "calendar" | "rules")}
              className={`rounded-full px-5 py-3 text-sm ${
                activeTab === value ? "atlas-button" : "border border-ink/10 bg-white/75 text-ink-soft"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.header>

      {activeTab === "calendar" ? (
        <motion.section {...reveal} transition={{ duration: 0.5, delay: 0.1 }} className="section-frame rounded-[2rem] p-6 md:p-7">
          <p className="eyebrow text-[8px] text-clay">Weekly schedule</p>
          <div className="mt-6 overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-9 gap-3">
                <div />
                {hours.map((hour) => (
                  <div key={hour} className="eyebrow text-center text-[7px] text-ink-soft/58">
                    {hour}
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                {days.map((day) => (
                  <div key={day} className="grid grid-cols-9 gap-3">
                    <div className="flex items-center font-display text-2xl text-forest">{day}</div>
                    {scheduleData[day].map((value, index) => (
                      <div
                        key={`${day}-${index}`}
                        className={`flex h-12 items-center justify-center rounded-[1rem] border ${
                          value
                            ? "border-mint/30 bg-[linear-gradient(135deg,rgba(103,243,200,0.18),rgba(127,212,255,0.16))]"
                            : "border-ink/8 bg-white/70"
                        }`}
                      >
                        {value ? <span className="material-symbols-outlined text-[18px] text-forest">water_drop</span> : null}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {rules.map((rule, index) => (
            <motion.section
              key={rule.id}
              {...reveal}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className={`${rule.active ? "dark-frame text-paper-soft" : "atlas-card text-ink"} rounded-[2rem] p-6`}
            >
              <p className={`eyebrow text-[8px] ${rule.active ? "text-paper-soft/44" : "text-clay"}`}>{rule.name}</p>
              <p className={`mt-4 font-display text-3xl ${rule.active ? "text-paper-soft" : "text-forest"}`}>{rule.condition}</p>
              <p className={`mt-4 text-sm leading-7 ${rule.active ? "text-paper-soft/72" : "text-ink-soft"}`}>{rule.action}</p>
            </motion.section>
          ))}
        </div>
      )}
    </main>
  );
}
