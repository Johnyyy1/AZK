"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";

const reveal = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const logs = [
  {
    time: "Today, 06:10 AM",
    sub: "Pulse Complete",
    zone: "Monstera Deliciosa",
    duration: "18 sec",
    volume: "120 ml",
    method: "Scheduled",
    status: "Verified",
  },
  {
    time: "Yesterday, 09:40 PM",
    sub: "Manual Override",
    zone: "Monstera Deliciosa",
    duration: "10 sec",
    volume: "70 ml",
    method: "Manual",
    status: "Verified",
  },
  {
    time: "Yesterday, 07:00 AM",
    sub: "Skipped",
    zone: "Monstera Deliciosa",
    duration: "--",
    volume: "0 ml",
    method: "Safety Delay",
    status: "Protected",
  },
];

const moistureSeries = {
  "24H": [
    { label: "00:00", value: 39 },
    { label: "03:00", value: 36 },
    { label: "06:00", value: 42 },
    { label: "09:00", value: 49 },
    { label: "12:00", value: 53 },
    { label: "15:00", value: 50 },
    { label: "18:00", value: 46 },
    { label: "21:00", value: 44 },
  ],
  "7D": [
    { label: "Mon", value: 41 },
    { label: "Tue", value: 44 },
    { label: "Wed", value: 48 },
    { label: "Thu", value: 52 },
    { label: "Fri", value: 50 },
    { label: "Sat", value: 47 },
    { label: "Sun", value: 45 },
  ],
  "30D": [
    { label: "W1", value: 38 },
    { label: "W2", value: 43 },
    { label: "W3", value: 49 },
    { label: "W4", value: 46 },
    { label: "W5", value: 51 },
    { label: "W6", value: 54 },
    { label: "W7", value: 50 },
    { label: "W8", value: 47 },
  ],
} as const;

const moistureHistory = [
  { time: "Today, 06:10", zone: "Monstera Deliciosa", moisture: 49, change: "+4%" },
  { time: "Today, 03:20", zone: "Monstera Deliciosa", moisture: 45, change: "-2%" },
  { time: "Today, 00:15", zone: "Monstera Deliciosa", moisture: 47, change: "+1%" },
  { time: "Yesterday, 21:05", zone: "Monstera Deliciosa", moisture: 44, change: "-3%" },
  { time: "Yesterday, 18:00", zone: "Monstera Deliciosa", moisture: 47, change: "+5%" },
];

type RangeKey = keyof typeof moistureSeries;

export default function AnalyticsPage() {
  const [activeRange, setActiveRange] = useState<RangeKey>("24H");

  const chart = useMemo(() => {
    const points = moistureSeries[activeRange];
    const minValue = Math.min(...points.map((point) => point.value));
    const maxValue = Math.max(...points.map((point) => point.value));
    const padding = 4;
    const domainMin = Math.max(0, minValue - padding);
    const domainMax = Math.min(100, maxValue + padding);
    const domain = Math.max(1, domainMax - domainMin);

    const x = (index: number) => (index / (points.length - 1)) * 900;
    const y = (value: number) => 30 + (1 - (value - domainMin) / domain) * 150;

    const linePoints = points.map((point, index) => `${x(index)},${y(point.value)}`).join(" ");
    const areaPoints = `0,190 ${linePoints} 900,190`;

    const latest = points[points.length - 1].value;
    const previous = points[Math.max(points.length - 2, 0)].value;

    return {
      points,
      domainMin,
      domainMax,
      linePoints,
      areaPoints,
      latest,
      delta: latest - previous,
      y,
    };
  }, [activeRange]);

  return (
    <main className="px-5 py-6 md:px-8 md:py-8">
      <motion.header
        {...reveal}
        transition={{ duration: 0.5 }}
        className="mb-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-end"
      >
        <div>
          <p className="eyebrow text-[9px] text-clay">Analytics</p>
          <h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">
            One plant&apos;s history, readable before it becomes a problem.
          </h1>
        </div>
        <div className="section-frame rounded-[1.8rem] p-5 md:p-6">
          <p className="text-sm leading-7 text-ink-soft">
            This view foregrounds the one thing that matters: how the plant responded to the last watering pulse and
            what that means for the next one.
          </p>
        </div>
      </motion.header>

      <motion.section {...reveal} transition={{ duration: 0.5, delay: 0.1 }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Current moisture", "49%", "Near target"],
          ["Root temperature", "22.4C", "Stable"],
          ["Weekly usage", "3.4 L", "5% below avg"],
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
        <motion.section
          {...reveal}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="section-frame rounded-[2rem] p-6 md:p-7"
        >
          <div className="flex flex-col gap-3 border-b border-ink/10 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-[8px] text-clay">Moisture history</p>
              <h2 className="mt-2 font-display text-3xl text-forest">Root-zone moisture over time</h2>
              <p className="mt-3 text-sm text-ink-soft">
                Latest reading: {chart.latest}% ({chart.delta >= 0 ? "+" : ""}
                {chart.delta}% vs previous sample)
              </p>
            </div>
            <div className="flex gap-2">
              {(["24H", "7D", "30D"] as const).map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveRange(label)}
                  className={`rounded-full px-4 py-2 text-xs transition ${
                    activeRange === label ? "atlas-button" : "border border-ink/10 bg-white/70 text-ink-soft hover:bg-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 h-72">
            <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 900 210">
              {[0, 1, 2, 3].map((index) => {
                const value = chart.domainMin + ((chart.domainMax - chart.domainMin) / 3) * index;
                const lineY = chart.y(value);

                return (
                  <g key={index}>
                    <line x1="0" y1={lineY} x2="900" y2={lineY} stroke="rgba(11,22,32,0.08)" strokeWidth="1" />
                    <text x="0" y={lineY - 6} fontSize="10" fill="#48606a">
                      {Math.round(value)}%
                    </text>
                  </g>
                );
              })}

              <polygon points={chart.areaPoints} fill="url(#analyticsFill)" opacity="0.22" />
              <polyline
                points={chart.linePoints}
                fill="none"
                stroke="#22b07d"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {chart.points.map((point, index) => {
                const pointX = (index / (chart.points.length - 1)) * 900;
                const pointY = chart.y(point.value);

                return (
                  <g key={`${point.label}-${point.value}`}>
                    <circle cx={pointX} cy={pointY} r="5" fill="#22b07d" />
                    <circle cx={pointX} cy={pointY} r="9" fill="rgba(34,176,125,0.18)" />
                  </g>
                );
              })}

              <defs>
                <linearGradient id="analyticsFill" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#7fd4ff" />
                  <stop offset="100%" stopColor="#67f3c8" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            <div className="mt-2 flex items-center justify-between text-xs text-ink-soft/74">
              {chart.points.map((point) => (
                <span key={point.label}>{point.label}</span>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {moistureHistory.map((entry) => (
              <div key={`${entry.time}-${entry.zone}`} className="rounded-[1.2rem] border border-ink/8 bg-white/70 px-4 py-3">
                <p className="text-xs text-ink-soft/72">{entry.time}</p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-sm text-ink-soft">{entry.zone}</p>
                    <p className="mt-1 font-display text-2xl text-forest">{entry.moisture}%</p>
                  </div>
                  <p className={`text-sm font-medium ${entry.change.startsWith("+") ? "text-forest" : "text-clay"}`}>
                    {entry.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          {...reveal}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="dark-frame rounded-[2rem] p-6 text-paper-soft md:p-7"
        >
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
