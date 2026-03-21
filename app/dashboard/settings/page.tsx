"use client";

import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  return (
    <main className="p-8 min-h-screen">
      <motion.header {...fadeUp} transition={{ duration: 0.5 }} className="mb-12">
        <p className="font-label uppercase tracking-[0.2em] text-secondary-fixed-dim text-xs mb-2">Configuration</p>
        <h2 className="text-5xl font-bold font-headline tracking-tighter">Settings & Profile</h2>
        <p className="text-on-surface-variant font-body mt-2">Manage your ecosystem preferences and security credentials.</p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Global Settings */}
        <motion.section {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-7 space-y-8">
          <div className="bg-dash-container-low rounded-[2rem] p-8 relative overflow-hidden hover-glow-dark">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary-fixed-dim/10 rounded-full blur-3xl" />
            <h3 className="text-xl font-headline font-bold flex items-center gap-2 mb-8">
              <span className="material-symbols-outlined text-secondary-fixed-dim">settings_suggest</span>
              Global System Settings
            </h3>
            <div className="space-y-10">
              {/* Units */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="font-headline font-bold text-sm block">Measurement Units</label>
                  <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Atmospheric & Liquid data</span>
                </div>
                <div className="flex bg-dash-container p-1 rounded-xl">
                  <button className="flex-1 py-2 px-4 rounded-lg text-sm font-bold bg-primary-container text-secondary-fixed-dim">Metric (Celsius, L)</button>
                  <button className="flex-1 py-2 px-4 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-dash-container-high transition-colors">Imperial (Fahr, Gal)</button>
                </div>
              </div>
              {/* Timezone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="font-headline font-bold text-sm block">System Timezone</label>
                  <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Used for scheduling cycles</span>
                </div>
                <div className="relative">
                  <select className="w-full bg-dash-container border-0 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary-fixed appearance-none text-white">
                    <option>Pacific Time (PT) - UTC-8</option>
                    <option>Mountain Time (MT) - UTC-7</option>
                    <option>Central Time (CT) - UTC-6</option>
                    <option>Eastern Time (ET) - UTC-5</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">unfold_more</span>
                </div>
              </div>
              {/* Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                  <label className="font-headline font-bold text-sm block">Default Cycle Duration</label>
                  <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Base value for new zones</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-2xl font-headline font-bold text-secondary-fixed-dim">
                      15 <span className="text-sm font-medium text-on-surface-variant">mins</span>
                    </span>
                  </div>
                  <input className="w-full h-2 bg-dash-container rounded-lg appearance-none cursor-pointer accent-secondary-fixed-dim" max="60" min="5" type="range" defaultValue="15" />
                  <div className="flex justify-between text-[10px] font-label text-on-surface-variant/60 uppercase tracking-tighter">
                    <span>Quick Pulse (5m)</span>
                    <span>Deep Soak (60m)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-dash-container rounded-3xl p-6 flex flex-col justify-between hover-glow-dark cursor-default">
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-3xl">mail</span>
                <div className="w-12 h-6 bg-dash-container-high rounded-full relative cursor-pointer p-1">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
              <div>
                <h4 className="font-headline font-bold">Email Digests</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">Weekly hydration reports and nutrient analysis summaries.</p>
              </div>
            </div>
            <div className="bg-primary-container rounded-3xl p-6 flex flex-col justify-between overflow-hidden relative hover-glow-dark cursor-default">
              <div className="absolute -bottom-4 -right-4 opacity-10">
                <span className="material-symbols-outlined text-8xl">bolt</span>
              </div>
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-secondary-fixed text-3xl">notifications_active</span>
                <div className="w-12 h-6 bg-secondary-fixed rounded-full relative cursor-pointer p-1">
                  <div className="w-4 h-4 bg-primary-container rounded-full shadow-sm translate-x-6" />
                </div>
              </div>
              <div>
                <h4 className="font-headline font-bold text-white">Critical Alerts</h4>
                <p className="text-xs text-on-primary-container/80 leading-relaxed">Instant push notifications for leaks or hardware malfunctions.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Right: Account Management */}
        <motion.aside {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-5 space-y-8">
          {/* Profile */}
          <div className="bg-dash-container-lowest rounded-[2rem] p-8 relative border border-white/5 hover-glow-dark">
            <div className="flex items-center gap-6 mb-10">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-dash-container overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="User profile"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk63-bv1q_cj6FPhQMerYqQOzhnZjBnHJHOwUnm3GWcjBRRaHYEJTRgrNwWJG7wJ4S7rV9mPjqr2NX8YcYI1YQqzJhyZEWxhwQIaFZNIBneJ5V5CCN360Eb-GM3Qp9Dm8ciFNbRCPWxOTsCRd7y5t5huC9_w3DtUt1LWspcTxTNszq4VpcXFGOYm-jtV4LEgb7jHx13Hsu7jHzby3m5sIciWfnwgAh2a4aMuUY0ImTcBWq-hEg2eHlNt0PtdQirXN8-_of5K6IbgE"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute -bottom-2 -right-2 bg-secondary-fixed-dim text-primary p-2 rounded-xl shadow-lg hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
              <div>
                <h3 className="text-2xl font-headline font-bold">Sarah Jenkins</h3>
                <p className="text-sm font-label text-on-surface-variant">Fleet Manager • Estate 04</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-secondary-container/20 text-secondary-fixed-dim rounded text-[10px] font-bold uppercase tracking-wider">Verified</span>
                </div>
              </div>
            </div>
            <form className="space-y-6">
              <div>
                <label className="font-headline font-bold text-xs text-on-surface-variant uppercase tracking-widest block mb-2">Email Address</label>
                <input className="w-full bg-dash-container border-0 rounded-xl py-4 px-5 text-sm font-medium focus:ring-2 focus:ring-secondary-fixed-dim/30 transition-all text-white outline-none" type="email" defaultValue="s.jenkins@ecogrow.io" />
              </div>
              <div>
                <label className="font-headline font-bold text-xs text-on-surface-variant uppercase tracking-widest block mb-2">Password</label>
                <div className="relative">
                  <input className="w-full bg-dash-container border-0 rounded-xl py-4 px-5 text-sm font-medium focus:ring-2 focus:ring-secondary-fixed-dim/30 transition-all text-white outline-none" type="password" defaultValue="••••••••••••" />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-fixed-dim font-headline font-bold text-xs uppercase tracking-wider" type="button">Change</button>
                </div>
              </div>
              <div className="pt-4 flex flex-col gap-3">
                <button className="w-full technical-gradient text-white py-4 rounded-xl font-headline font-bold shadow-xl btn-magnetic">
                  Update Account
                </button>
                <button className="w-full py-4 text-error font-headline font-bold text-sm hover:bg-error/10 rounded-xl transition-colors" type="button">
                  Deactivate Profile
                </button>
              </div>
            </form>
          </div>

          {/* Security */}
          <div className="glass-card rounded-[2rem] p-8">
            <h3 className="font-headline font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">verified_user</span>
              Security Hygiene
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dash-container/50 rounded-2xl hover:bg-dash-container/70 transition-colors cursor-default">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant">phonelink_setup</span>
                  <div>
                    <p className="text-sm font-bold">Two-Factor Auth</p>
                    <p className="text-[10px] text-on-surface-variant font-medium">Protect with SMS or App</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-secondary-fixed-dim uppercase tracking-widest bg-secondary-fixed-dim/10 px-2 py-1 rounded">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-dash-container/50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant">history</span>
                  <div>
                    <p className="text-sm font-bold">Login Activity</p>
                    <p className="text-[10px] text-on-surface-variant font-medium">Last: San Francisco, CA</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </main>
  );
}
