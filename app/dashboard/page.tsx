"use client";

import { motion } from "motion/react";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const zones = [
  { name: "Front Lawn", moisture: 82, remaining: "12m", status: "Watering", icon: "grass" },
  { name: "Back Garden", moisture: 45, remaining: "--", status: "Idle", icon: "local_florist" },
  { name: "Veggie Patch", moisture: 31, remaining: "--", status: "Idle", icon: "eco" },
  { name: "Greenhouse", moisture: 90, remaining: "04m", status: "Watering", icon: "home_work" },
];

export default function DashboardPage() {
  return (
    <main className="p-8 min-h-screen">
      {/* Header */}
      <motion.header
        {...fadeUp}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-end mb-12"
      >
        <div>
          <p className="font-label uppercase tracking-[0.2em] text-secondary-fixed-dim text-xs mb-2">
            Technical Organic System
          </p>
          <h2 className="text-5xl font-bold font-headline tracking-tighter">
            Ecosystem Overview
          </h2>
        </div>
        <div className="glass-card p-4 rounded-xl flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-secondary-fixed-dim rounded-full pulse-emerald" />
            <div>
              <p className="font-headline font-bold text-lg leading-tight">Online</p>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-tighter">System Status</p>
            </div>
          </div>
          <div className="h-8 w-px bg-on-surface-variant/20" />
          <div>
            <p className="font-headline font-medium text-sm">14:02:45</p>
            <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-tighter">Last Sync</p>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Grid */}
        <div className="col-span-12 lg:col-span-9 space-y-12">
          {/* Sensor Gauges */}
          <section className="grid grid-cols-3 gap-6">
            {[
              { icon: "humidity_mid", label: "Air Humidity", value: "64", unit: "%", width: "64%" },
              { icon: "thermostat", label: "Avg. Temperature", value: "24.8", unit: "°C", width: "72%" },
              { icon: "water_drop", label: "Soil Moisture Avg.", value: "52", unit: "%", width: "52%" },
            ].map((sensor, i) => (
              <motion.div
                key={sensor.label}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="glass-card p-6 rounded-xl flex flex-col justify-between group overflow-hidden relative"
              >
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-8xl">{sensor.icon}</span>
                </div>
                <p className="font-label uppercase tracking-widest text-[10px] text-on-surface-variant">{sensor.label}</p>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-headline font-bold">{sensor.value}</span>
                  <span className="text-xl font-headline text-on-surface-variant">{sensor.unit}</span>
                </div>
                <div className="w-full bg-dash-container-high h-1.5 rounded-full mt-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: sensor.width }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
                    className={`h-full rounded-full ${i === 1 ? "bg-secondary-fixed-dim" : "bg-tertiary-fixed-dim"}`}
                  />
                </div>
              </motion.div>
            ))}
          </section>

          {/* Active Zones */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline text-2xl font-bold tracking-tight">Active Zones</h3>
              <Link href="/dashboard/zones" className="text-secondary-fixed-dim font-label text-xs uppercase tracking-widest hover:underline">
                Manage All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {zones.map((zone, i) => (
                <motion.div
                  key={zone.name}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="glass-card rounded-xl p-6 relative overflow-hidden flex items-center justify-between"
                >
                  <div className="z-10">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full mb-3 inline-block ${
                      zone.status === "Watering"
                        ? "bg-secondary-container/20 text-secondary-fixed-dim"
                        : "bg-dash-container-high text-on-surface-variant"
                    }`}>
                      {zone.status}
                    </span>
                    <h4 className="text-xl font-headline font-bold">{zone.name}</h4>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex flex-col">
                        <span className="text-2xl font-headline font-bold">{zone.moisture}%</span>
                        <span className="text-[10px] font-label text-on-surface-variant uppercase">Moisture</span>
                      </div>
                      <div className="w-px h-8 bg-on-surface-variant/20" />
                      <div className={`flex flex-col ${zone.remaining === "--" ? "text-on-surface-variant" : ""}`}>
                        <span className="text-2xl font-headline font-bold">{zone.remaining}</span>
                        <span className="text-[10px] font-label uppercase">Remaining</span>
                      </div>
                    </div>
                  </div>
                  <button className={`z-10 p-4 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity ${
                    zone.status === "Watering"
                      ? "bg-error-container text-on-error-container"
                      : "bg-primary-container text-secondary-fixed-dim border border-secondary/20"
                  }`}>
                    <span className="material-symbols-outlined">
                      {zone.status === "Watering" ? "stop_circle" : "play_circle"}
                    </span>
                  </button>
                  <div className="absolute -bottom-10 -right-10 opacity-5">
                    <span className="material-symbols-outlined text-[160px]">{zone.icon}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-8">
          {/* Alerts */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-dash-container-low rounded-xl p-6 border border-white/5"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-headline font-bold text-lg">System Alerts</h4>
              <span className="bg-error text-on-error text-[10px] px-2 py-0.5 rounded-full font-bold">2</span>
            </div>
            <div className="space-y-4">
              <div className="bg-error-container/10 p-4 rounded-xl border-l-4 border-error">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-error text-lg">warning</span>
                  <div>
                    <p className="font-headline text-sm font-bold">Low Reservoir Level</p>
                    <p className="font-body text-xs text-on-surface-variant mt-1">Water supply currently at 12%. Refill recommended.</p>
                  </div>
                </div>
              </div>
              <div className="bg-dash-container-high/30 p-4 rounded-xl border-l-4 border-outline">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-outline text-lg">signal_cellular_off</span>
                  <div>
                    <p className="font-headline text-sm font-bold">Sensor 04 Offline</p>
                    <p className="font-body text-xs text-on-surface-variant mt-1">Zone: Back Garden. Last ping was 3 hours ago.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hydration Gauge */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card rounded-xl p-8 flex flex-col items-center text-center"
          >
            <p className="font-label uppercase tracking-widest text-[10px] text-on-surface-variant mb-4">Daily Water Target</p>
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-dash-container-high" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="8" />
                <circle className="text-secondary-fixed" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="110" strokeLinecap="round" strokeWidth="12" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-headline font-bold">75%</span>
                <span className="text-[10px] font-label text-on-surface-variant uppercase">Complete</span>
              </div>
            </div>
            <p className="mt-6 text-sm font-body text-on-surface-variant">Scheduled: 1,200L <br /> Delivered: 900L</p>
          </motion.div>

          {/* Map */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="glass-card rounded-xl overflow-hidden h-48 relative group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              alt="Top down satellite view of garden irrigation layout"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCITHsBXAsYUk3kW5TjTtjNxqK8BHhlFrwrzaTR8pAXAiMtVQtkkOknnItJSh400mg4xAcGn4bWXuNOxmoVsfIbJq_KzR7rSfrqXxPawAM9wHrRX4QSJSl35PEWqbeeBUdV_2xqS_3rwnj-pFFC1RpmOIhodpXIYGCYk6ZfKwMXRo5KEGn8jid233mCAvu3xKuJmYOJ2QNI9-1NfVJvG6eeOO-zzYRNb-S8f4zqkYJSUlTIebFBGWXLX9Lrd86y7Q7_0ATPKQMUSzk"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dash-bg to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="font-headline font-bold text-sm">Property View</p>
              <p className="text-[10px] font-label text-on-surface-variant uppercase">San Francisco, CA</p>
            </div>
            <span className="absolute top-4 right-4 bg-dash-container-lowest p-2 rounded-lg material-symbols-outlined text-sm">map</span>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
