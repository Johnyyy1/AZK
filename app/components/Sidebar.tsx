"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
      <div className="mb-10">
        <h1 className="text-lg font-black text-secondary-fixed-dim tracking-tighter font-headline">
          AquaSmart
        </h1>
        <p className="font-label uppercase tracking-widest text-[10px] text-on-surface-variant opacity-70">
          Living Laboratory
        </p>
      </div>

      <nav className="flex-grow space-y-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-300 ${
                isActive
                  ? "bg-primary-container text-secondary-fixed-dim font-bold translate-x-1"
                  : "text-on-surface-variant hover:bg-dash-container-high"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={
                  isActive
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {item.icon}
              </span>
              <span className="font-headline text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <Link
          href="/dashboard/zones"
          className="w-full bg-gradient-to-br from-secondary to-primary-container text-on-primary py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-xl"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add New Zone
        </Link>
        <div className="pt-6 border-t border-on-surface-variant/10 space-y-1">
          <a
            href="#"
            className="text-on-surface-variant hover:text-white text-[11px] font-label uppercase tracking-widest flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">help</span>{" "}
            Support
          </a>
          <a
            href="#"
            className="text-on-surface-variant hover:text-white text-[11px] font-label uppercase tracking-widest flex items-center gap-2"
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
