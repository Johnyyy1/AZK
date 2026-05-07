"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Icon, { type IconName } from "./Icon";

const navItems = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "potted_plant", label: "Zones", href: "/dashboard/zones" },
  { icon: "leaderboard", label: "Analytics", href: "/dashboard/analytics" },
  { icon: "calendar_today", label: "Scheduling", href: "/dashboard/scheduling" },
  { icon: "tune", label: "Controls", href: "/dashboard/controls" },
  { icon: "settings", label: "Settings", href: "/dashboard/settings" },
] satisfies Array<{ icon: IconName; label: string; href: string }>;

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="nature-tech-gradient flex h-11 w-11 items-center justify-center rounded-full">
        <Icon name="water_lock" className="text-[18px] text-forest-deep" />
      </div>
      <div className="leading-none">
        <p className="eyebrow text-[8px] text-ink-soft/44">Dashboard</p>
        <p className="font-display text-[1.3rem] tracking-[-0.07em] text-forest">AquaSmart</p>
      </div>
    </Link>
  );
}

function NavList({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center justify-between rounded-[1.4rem] px-4 py-3 transition ${
              isActive
                ? "bg-[linear-gradient(135deg,rgba(103,243,200,0.28),rgba(127,212,255,0.22))] text-forest"
                : "text-ink-soft hover:bg-white/70 hover:text-forest"
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon name={item.icon} className="text-[20px]" />
              <span className="text-sm font-medium">{item.label}</span>
            </span>
            {isActive ? <Icon name="east" className="text-[16px] text-moss" /> : null}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 border-b border-ink/8 bg-paper-soft/90 px-5 py-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <Brand />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 text-forest"
            aria-label="Toggle dashboard navigation"
          >
            <Icon name={mobileOpen ? "close" : "menu"} className="text-[20px]" />
          </button>
        </div>
      </div>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[18rem] border-r border-ink/8 bg-[linear-gradient(180deg,#f8fffc,#edf8f3)] lg:flex">
        <div className="flex w-full flex-col p-6">
          <Brand />
          <div className="mt-10">
            <p className="eyebrow mb-4 text-[8px] text-ink-soft/44">Navigation</p>
            <NavList pathname={pathname} />
          </div>

          <div className="mt-auto space-y-4">
            <Link href="/dashboard/zones" className="atlas-button flex w-full rounded-full px-5 py-3 text-sm font-medium">
              Add a zone
            </Link>
            <div className="rounded-[1.6rem] border border-ink/8 bg-white/70 p-4 text-ink-soft">
              <p className="eyebrow text-[8px] text-ink-soft/44">Live mode</p>
              <p className="mt-3 text-sm leading-7">
                Responsive dashboard shell aligned with the public site’s nature-tech visual system.
              </p>
            </div>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-forest-deep/18 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-[18rem] border-r border-ink/8 bg-[linear-gradient(180deg,#f8fffc,#edf8f3)] p-5 text-ink lg:hidden"
            >
              <Brand />
              <div className="mt-8">
                <p className="eyebrow mb-4 text-[8px] text-ink-soft/44">Navigation</p>
                <NavList pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
