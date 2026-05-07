"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import Icon from "./Icon";

const navLinks = [
  { href: "/#manifesto", label: "Manifesto" },
  { href: "/#system", label: "System" },
  { href: "/#proof", label: "Proof" },
  { href: "/technology", label: "Technology" },
];

export default function TopNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const compact = scrolled || pathname !== "/";

  return (
    <>
      <motion.header
        animate={{
          paddingTop: compact ? 16 : 24,
          paddingBottom: compact ? 16 : 24,
        }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
          <motion.div
            layout
            className={`flex w-full items-center justify-between rounded-full px-5 py-3 md:px-6 ${
              compact
                ? "border border-paper/20 bg-forest-deep/80 text-paper-soft shadow-[0_18px_60px_rgba(16,37,31,0.36)] backdrop-blur-xl"
                : "border border-paper/15 bg-black/10 text-paper-soft backdrop-blur-md"
            }`}
          >
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/25 bg-paper-soft/10">
                <Icon name="water_lock" className="text-[20px]" />
              </div>
              <div className="leading-none">
                <p className="eyebrow text-[9px] text-paper-soft/70">Field Atlas</p>
                <p className="font-display text-[1.35rem] tracking-[-0.08em]">AquaSmart</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm text-paper-soft/78 transition hover:bg-paper-soft/10 hover:text-paper-soft"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/auth"
                className="rounded-full border border-paper/18 px-4 py-2 text-sm text-paper-soft/82 transition hover:bg-paper-soft/10 hover:text-paper-soft"
              >
                Client Access
              </Link>
              <Link href="/auth" className="atlas-button rounded-full px-5 py-3 text-sm font-medium">
                Book a Demo
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/18 lg:hidden"
              aria-label="Toggle navigation"
            >
              <motion.span
                animate={{ rotate: mobileOpen ? 90 : 0 }}
                className="inline-flex text-[20px]"
              >
                <Icon name={mobileOpen ? "close" : "menu"} />
              </motion.span>
            </button>
          </motion.div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed inset-x-5 top-24 z-40 rounded-[2rem] border border-paper/18 bg-forest-deep/92 p-5 text-paper-soft shadow-[0_24px_80px_rgba(16,37,31,0.44)] backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center justify-between rounded-[1.4rem] border border-paper/10 px-4 py-4 text-sm"
                  >
                    <span>{link.label}</span>
                    <Icon name="north_east" className="text-[16px]" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-5 grid grid-cols-1 gap-3">
              <Link
                href="/auth"
                className="rounded-[1.4rem] border border-paper/12 px-4 py-4 text-center text-sm"
              >
                Client Access
              </Link>
              <Link href="/auth" className="atlas-button rounded-[1.4rem] px-4 py-4 text-sm font-medium">
                Book a Demo
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
