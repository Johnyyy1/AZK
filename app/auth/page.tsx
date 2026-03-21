"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";

type AuthState = "login" | "register" | "reset" | "reset-sent";

export default function AuthPage() {
  const [state, setState] = useState<AuthState>("login");

  return (
    <div className="bg-background font-body text-on-background min-h-screen">
      <main className="flex min-h-screen">
        {/* Left Side: Visual Anchor */}
        <section className="hidden lg:flex w-1/2 technical-gradient relative overflow-hidden items-center justify-center p-16">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg className="w-full h-full fill-secondary-fixed-dim/20" viewBox="0 0 100 100">
              <circle cx="20" cy="20" r="15" />
              <circle cx="80" cy="70" r="25" />
              <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-lg"
          >
            <div className="mb-12">
              <span className="text-secondary-fixed font-headline font-bold tracking-widest uppercase text-xs mb-4 block">
                The Living Laboratory
              </span>
              <h1 className="text-white font-headline text-6xl font-bold tracking-tighter leading-none mb-6">
                AquaSmart
              </h1>
              <p className="text-primary-fixed text-xl font-light leading-relaxed">
                Precision irrigation meets natural intelligence. Monitor, automate,
                and sustain your ecosystem with bioluminescent data clarity.
              </p>
            </div>
            {/* Featured Metric */}
            <div className="glass-panel rounded-xl p-8 border-l-4 border-secondary shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <span className="material-symbols-outlined text-secondary-fixed text-3xl">
                  water_drop
                </span>
                <div>
                  <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
                    Global Hydration
                  </p>
                  <h3 className="text-primary font-headline text-2xl font-bold">
                    84.2% Optimal
                  </h3>
                </div>
              </div>
              <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "84%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-secondary-fixed-dim"
                />
              </div>
            </div>
          </motion.div>
          {/* Background image */}
          <div className="absolute bottom-[-10%] right-[-5%] w-2/3 h-2/3 opacity-30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Vibrant green plant leaves with water drops"
              className="w-full h-full object-cover rounded-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAou88SoxQzsg3Lt2dc-NFxMlPuL8hAvrW4UbLvK4t1e38SIHSrleKpdCFgoKIdrZa3jW54330vKiJVHD_Be3A7RwN14rmN2n8XKSKU06hDjy7Lh5tR9eA83vEQbkrhFXVkayRIdNi7n3i8Qt_4lyab0vaf0L9ghx9jRKzzVNgC-uQXcZ4TwiUsJb6jmUH0aerYSda5L56ewl50Ym7PJmI1jYiPZQOPfUpWXK2J83ZJluK1ezDN5XL630Yzu5tMu3JTe-vbiemnCqQ"
            />
          </div>
        </section>

        {/* Right Side: Forms */}
        <section className="w-full lg:w-1/2 flex flex-col bg-surface-bright p-8 md:p-16 lg:p-24 justify-center">
          {/* Logo for Mobile */}
          <div className="lg:hidden mb-12 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-4xl">
              energy_savings_leaf
            </span>
            <span className="font-headline font-black text-2xl tracking-tighter text-primary">
              AquaSmart
            </span>
          </div>

          {/* LOGIN STATE */}
          {state === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md mx-auto"
            >
              <header className="mb-10">
                <h2 className="font-headline text-4xl font-bold text-primary mb-2">
                  Welcome Back
                </h2>
                <p className="text-on-surface-variant">
                  Enter your credentials to access the laboratory.
                </p>
              </header>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-1">
                    Laboratory Email
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary-fixed rounded-xl px-4 py-4 text-on-surface placeholder-outline-variant transition-all outline-none"
                    placeholder="name@domain.com"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      Security Key
                    </label>
                    <button
                      type="button"
                      onClick={() => setState("reset")}
                      className="text-[10px] uppercase tracking-widest font-bold text-secondary hover:text-on-secondary-container transition-colors"
                    >
                      Lost Access?
                    </button>
                  </div>
                  <input
                    className="w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary-fixed rounded-xl px-4 py-4 text-on-surface placeholder-outline-variant transition-all outline-none"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
                <div className="flex items-center gap-3 px-1">
                  <input
                    className="w-5 h-5 rounded-lg border-outline-variant text-secondary focus:ring-secondary-fixed-dim bg-surface-container-low"
                    type="checkbox"
                    id="remember"
                  />
                  <label className="text-sm text-on-surface-variant font-medium" htmlFor="remember">
                    Keep session active
                  </label>
                </div>
                <Link
                  href="/dashboard"
                  className="w-full block text-center bg-primary py-5 rounded-xl text-white font-headline font-bold text-lg tracking-tight hover:opacity-90 active:scale-[0.98] transition-all technical-gradient shadow-lg"
                >
                  Initiate Session
                </Link>
                <div className="pt-6 text-center">
                  <p className="text-on-surface-variant text-sm">
                    New to the system?{" "}
                    <button
                      type="button"
                      onClick={() => setState("register")}
                      className="text-secondary font-bold hover:underline underline-offset-4 ml-1"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              </form>
            </motion.div>
          )}

          {/* REGISTER STATE */}
          {state === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md mx-auto"
            >
              <header className="mb-10">
                <h2 className="font-headline text-4xl font-bold text-primary mb-2">
                  Join Lab
                </h2>
                <p className="text-on-surface-variant">
                  Start monitoring your irrigation ecosystem today.
                </p>
              </header>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-1">
                    Full Name
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary-fixed rounded-xl px-4 py-3 outline-none"
                    placeholder="Dr. Jane Smith"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-1">
                    Email Address
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary-fixed rounded-xl px-4 py-3 outline-none"
                    placeholder="jane@aquasmart.io"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-1">
                    Secure Password
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary-fixed rounded-xl px-4 py-3 outline-none"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-1">
                    Confirm Password
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary-fixed rounded-xl px-4 py-3 outline-none"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
                <Link
                  href="/dashboard"
                  className="w-full block text-center bg-primary mt-4 py-5 rounded-xl text-white font-headline font-bold text-lg tracking-tight technical-gradient shadow-lg"
                >
                  Register Ecosystem
                </Link>
                <div className="pt-6 text-center">
                  <p className="text-on-surface-variant text-sm">
                    Already registered?{" "}
                    <button
                      type="button"
                      onClick={() => setState("login")}
                      className="text-secondary font-bold hover:underline ml-1"
                    >
                      Log in here
                    </button>
                  </p>
                </div>
              </form>
            </motion.div>
          )}

          {/* RESET STATE */}
          {state === "reset" && (
            <motion.div
              key="reset"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md mx-auto"
            >
              <header className="mb-10">
                <h2 className="font-headline text-4xl font-bold text-primary mb-2">
                  Reset Key
                </h2>
                <p className="text-on-surface-variant">
                  Recover access to your AquaSmart dashboard.
                </p>
              </header>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setState("reset-sent"); }}>
                <div className="space-y-2">
                  <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold px-1">
                    Verified Email
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary-fixed rounded-xl px-4 py-4 text-on-surface placeholder-outline-variant outline-none"
                    placeholder="name@domain.com"
                    type="email"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary py-5 rounded-xl text-white font-headline font-bold text-lg tracking-tight technical-gradient shadow-lg"
                >
                  Send Recovery Link
                </button>
                <div className="pt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setState("login")}
                    className="text-on-surface-variant text-sm font-medium hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto"
                  >
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                    Return to security gate
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* RESET SENT STATE */}
          {state === "reset-sent" && (
            <motion.div
              key="reset-sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md mx-auto"
            >
              <div className="bg-secondary-container/20 p-8 rounded-xl flex flex-col items-center text-center mb-10">
                <div className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-4">
                  <span
                    className="material-symbols-outlined text-4xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-primary">
                  Instructions Sent
                </h3>
                <p className="text-on-surface-variant mt-2">
                  Verification link has been dispatched to your laboratory email address.
                </p>
              </div>
              <button
                onClick={() => setState("login")}
                className="w-full bg-surface-container-highest py-4 rounded-xl text-primary font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back to Login
              </button>
            </motion.div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full p-8 hidden lg:block pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div className="pointer-events-auto">
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-label">
              © 2024 AquaSmart Systems / Living Laboratory v2.4.1
            </p>
          </div>
          <div className="flex gap-6 pointer-events-auto">
            <a className="text-white/60 hover:text-white text-xs font-medium transition-colors" href="#">
              Privacy Architecture
            </a>
            <a className="text-white/60 hover:text-white text-xs font-medium transition-colors" href="#">
              System Protocols
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
