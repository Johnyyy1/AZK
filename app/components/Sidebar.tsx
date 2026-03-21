"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

const navItems = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "potted_plant", label: "Zones", href: "/dashboard/zones" },
  { icon: "leaderboard", label: "Analytics", href: "/dashboard/analytics" },
  { icon: "calendar_today", label: "Scheduling", href: "/dashboard/scheduling" },
  { icon: "tune", label: "Controls", href: "/dashboard/controls" },
  { icon: "settings", label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-dash-container-lowest flex flex-col p-6 z-40">
      {/* Brand */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-secondary-fixed-dim flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              water_drop
            </span>
          </div>
          <h1 className="text-lg font-black text-secondary-fixed-dim tracking-tighter font-headline">
            AquaSmart
          </h1>
        </div>
        <p className="font-accent italic text-[11px] text-on-surface-variant/50 pl-10">
          Living Laboratory
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-grow space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative block rounded-xl px-4 py-3 transition-all duration-300 group"
            >
              {/* Active background pill */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary-container rounded-xl"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              {/* Hover background (only when not active) */}
              {!isActive && (
                <span className="absolute inset-0 rounded-xl bg-dash-container-high opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}

              <span className={`relative z-10 flex items-center gap-3 ${
                isActive
                  ? "text-secondary-fixed-dim font-bold"
                  : "text-on-surface-variant group-hover:text-white"
              }`}>
                <span
                  className={`material-symbols-outlined text-xl transition-transform duration-300 ${
                    isActive ? "" : "group-hover:scale-110"
                  }`}
                  style={
                    isActive
                      ? { fontVariationSettings: "'FILL' 1" }
                      : undefined
                  }
                >
                  {item.icon}
                </span>
                <span className="font-headline text-sm">{item.label}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto space-y-4">
        <Link
          href="/dashboard/zones"
          className="group w-full bg-gradient-to-br from-secondary to-primary-container text-on-primary py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-xl btn-magnetic relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="material-symbols-outlined text-sm relative z-10">add</span>
          <span className="relative z-10">Add New Zone</span>
        </Link>
        <div className="pt-6 border-t border-on-surface-variant/10 space-y-1">
          <a
            href="#"
            className="text-on-surface-variant hover:text-secondary-fixed-dim text-[11px] font-label uppercase tracking-widest flex items-center gap-2 py-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">help</span>{" "}
            Support
          </a>
          <a
            href="#"
            className="text-on-surface-variant hover:text-secondary-fixed-dim text-[11px] font-label uppercase tracking-widest flex items-center gap-2 py-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">
              description
            </span>{" "}
            Docs
          </a>
        </div>
      </div>
    </aside>
  );
}
