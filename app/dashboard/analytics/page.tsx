"use client";

import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const logs = [
  { time: "Today, 05:30 AM", sub: "Cycle Complete", zone: "North Orchard", duration: "45 min", volume: "120L", method: "Scheduled", status: "Verified", statusOk: true },
  { time: "Yesterday, 10:15 PM", sub: "Manual Override", zone: "West Terrace", duration: "12 min", volume: "32L", method: "Manual", status: "Verified", statusOk: true },
  { time: "Yesterday, 05:30 AM", sub: "Interrupted", zone: "South Lawn", duration: "08 min", volume: "18L", method: "Smart Rain", status: "Low Pressure", statusOk: false },
];

export default function AnalyticsPage() {
  return (
    <main className="p-8 min-h-screen">
      <motion.header {...fadeUp} transition={{ duration: 0.5 }} className="mb-12">
        <p className="font-label uppercase tracking-[0.2em] text-secondary-fixed-dim text-xs mb-2">Data Intelligence</p>
        <h2 className="text-5xl font-bold font-headline tracking-tighter">Analytics Dashboard</h2>
      </motion.header>

      {/* KPI Grid */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Main KPI */}
        <div className="md:col-span-2 bg-dash-container-lowest rounded-xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
          </div>
          <div className="relative z-10 space-y-6">
            <p className="font-label text-sm uppercase tracking-widest text-on-surface-variant font-bold">Aggregate Soil Moisture</p>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-6xl font-bold">64</span>
              <span className="font-headline text-2xl font-medium text-on-surface-variant">%</span>
            </div>
            <div className="h-2 w-full bg-dash-container-low rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "64%" }} transition={{ duration: 1.5 }} className="h-full bg-secondary-fixed-dim rounded-full" />
            </div>
            <div className="flex justify-between items-center text-xs font-label text-on-surface-variant">
              <span>Last 24h: +4.2%</span>
              <span className="text-secondary-fixed-dim font-bold">Optimal Level</span>
            </div>
          </div>
        </div>
        {/* Temp KPI */}
        <div className="bg-dash-container-low rounded-xl p-6 flex flex-col justify-between">
          <div>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">Avg. Root Temp</p>
            <span className="font-headline text-4xl font-bold">22.4°C</span>
          </div>
          <div className="mt-4 flex items-end gap-1 h-12">
            {[40, 60, 45, 70, 55, 80].map((h, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }} className="w-full bg-tertiary-fixed-dim rounded-sm" />
            ))}
          </div>
        </div>
        {/* Usage KPI */}
        <div className="bg-dash-container-high rounded-xl p-6 flex flex-col justify-between">
          <div>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">Total Usage (Wk)</p>
            <span className="font-headline text-4xl font-bold">1,482L</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-error font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>12% above seasonal avg</span>
          </div>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Moisture Trend Chart */}
        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-2 bg-dash-container-lowest rounded-xl p-8">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="font-headline text-xl font-bold">Hydration Velocity</h3>
              <p className="text-sm text-on-surface-variant">Real-time moisture absorption rates across active zones</p>
            </div>
            <div className="flex bg-dash-container p-1 rounded-lg">
              <button className="px-3 py-1 text-xs font-bold bg-dash-container-lowest shadow-sm rounded-md">24H</button>
              <button className="px-3 py-1 text-xs text-on-surface-variant">7D</button>
              <button className="px-3 py-1 text-xs text-on-surface-variant">30D</button>
            </div>
          </div>
          <div className="h-64 relative flex items-end">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
              <line stroke="#112235" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50" />
              <line stroke="#112235" strokeWidth="1" x1="0" x2="1000" y1="100" y2="100" />
              <line stroke="#112235" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150" />
              <path d="M0,200 L0,150 C150,140 250,180 400,120 C550,60 750,100 1000,40 L1000,200 Z" fill="url(#gradient-blue-dark)" opacity="0.15" />
              <path d="M0,150 C150,140 250,180 400,120 C550,60 750,100 1000,40" fill="none" stroke="#adc6ff" strokeLinecap="round" strokeWidth="4" />
              <circle cx="400" cy="120" fill="#adc6ff" r="6" stroke="#0d1c2e" strokeWidth="3" />
              <defs>
                <linearGradient id="gradient-blue-dark" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#adc6ff", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#adc6ff", stopOpacity: 0 }} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute left-[40%] bottom-[130px] -translate-x-1/2 glass-card p-2 rounded-lg shadow-xl">
              <p className="text-[10px] font-bold uppercase text-on-surface-variant">Zone 04 Absorption</p>
              <p className="text-sm font-bold">0.82 cm/hr</p>
            </div>
          </div>
          <div className="flex justify-between mt-6 text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60 font-bold">
            <span>06:00 AM</span><span>12:00 PM</span><span>06:00 PM</span><span>12:00 AM</span><span>NOW</span>
          </div>
        </motion.div>

        {/* Zone Efficiency */}
        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }} className="bg-dash-container rounded-xl p-8 space-y-8">
          <h3 className="font-headline text-xl font-bold">Zone Status</h3>
          <div className="space-y-6">
            {[
              { name: "North Orchard", eff: 88, color: "bg-secondary" },
              { name: "Lower Vineyard", eff: 62, color: "bg-secondary-fixed-dim" },
              { name: "East Perimeter", eff: 41, color: "bg-error" },
            ].map((z) => (
              <div key={z.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">{z.name}</span>
                  <span className="text-xs font-label text-on-surface-variant">{z.eff}% Eff.</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full">
                  <div className={`h-full ${z.color} rounded-full`} style={{ width: `${z.eff}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-on-surface-variant/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-dash-container-high rounded-full">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
              </div>
              <div>
                <p className="text-xs font-label uppercase tracking-widest font-bold text-on-surface-variant">Health Score</p>
                <p className="text-lg font-headline font-bold">92/100</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Watering Logs */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.4 }} className="bg-dash-container-lowest rounded-xl overflow-hidden">
        <div className="p-8 flex justify-between items-center border-b border-dash-container-low">
          <h3 className="font-headline text-xl font-bold">Watering Logs</h3>
          <button className="flex items-center gap-2 text-xs font-label font-bold text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined text-lg">download</span> EXPORT CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dash-container-low">
                {["Timestamp", "Zone", "Duration", "Volume", "Method", "Status"].map((h) => (
                  <th key={h} className="px-8 py-4 text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dash-container-low">
              {logs.map((log, i) => (
                <tr key={i} className="hover:bg-dash-container-low/50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold">{log.time}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase">{log.sub}</p>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium">{log.zone}</td>
                  <td className="px-8 py-5 text-sm">{log.duration}</td>
                  <td className="px-8 py-5 text-sm font-bold">{log.volume}</td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] px-2 py-1 rounded-md font-bold ${
                      log.method === "Manual" ? "bg-tertiary-fixed/20 text-tertiary-fixed-dim" : "bg-dash-container-high text-on-surface-variant"
                    }`}>{log.method}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`flex items-center gap-2 font-bold text-xs ${log.statusOk ? "text-secondary-fixed-dim" : "text-error"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${log.statusOk ? "bg-secondary-fixed-dim" : "bg-error"}`} />
                      {log.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-dash-container-low/30 text-center">
          <button className="text-xs font-bold text-on-surface-variant hover:underline">View All 248 Previous Entries</button>
        </div>
      </motion.div>
    </main>
  );
}
