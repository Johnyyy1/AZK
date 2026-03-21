"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function TopNav() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-sm flex justify-between items-center px-8 py-4"
    >
      <Link
        href="/"
        className="text-2xl font-black text-emerald-900 tracking-tighter font-headline"
      >
        AquaSmart
      </Link>

      <div className="hidden md:flex gap-8 items-center">
        <Link
          href="/"
          className="text-emerald-700 font-bold border-b-2 border-emerald-600 pb-1 text-sm font-medium"
        >
          Solutions
        </Link>
        <Link
          href="/technology"
          className="text-slate-600 hover:text-emerald-800 transition-colors text-sm font-medium"
        >
          Technology
        </Link>
        <Link
          href="/case-studies"
          className="text-slate-600 hover:text-emerald-800 transition-colors text-sm font-medium"
        >
          Case Studies
        </Link>
        <a
          href="#"
          className="text-slate-600 hover:text-emerald-800 transition-colors text-sm font-medium"
        >
          Pricing
        </a>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/auth"
          className="text-slate-600 font-medium text-sm px-4 py-2 hover:bg-emerald-50/50 transition-all rounded-lg"
        >
          Sign In
        </Link>
        <Link
          href="/auth"
          className="technical-gradient text-on-primary px-6 py-2.5 rounded-xl text-sm font-bold active:opacity-80 transition-all"
        >
          Get Started
        </Link>
      </div>
    </motion.nav>
  );
}
