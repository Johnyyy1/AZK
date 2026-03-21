"use client";

import Link from "next/link";
import { motion } from "motion/react";

const footerLinks: Record<string, { label: string; href: string; isLink?: boolean }[]> = {
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Case Studies", href: "/case-studies", isLink: true },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
  Support: [
    { label: "Contact Support", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Status", href: "#" },
  ],
};

const socialIcons = [
  { icon: "public", label: "Website" },
  { icon: "terminal", label: "GitHub" },
  { icon: "mail", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="w-full py-16 px-8 bg-white border-t border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
        {/* Brand Column */}
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg technical-gradient flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                water_drop
              </span>
            </div>
            <span className="font-headline font-bold text-primary text-xl">
              Aqua<span className="text-secondary">Smart</span>
            </span>
          </div>
          <p className="font-accent italic text-sm text-slate-400 mb-6 leading-relaxed">
            Sustainable precision for the modern laboratory of life.
          </p>
          <div className="flex gap-3">
            {socialIcons.map((social) => (
              <motion.a
                key={social.icon}
                href="#"
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-300"
                aria-label={social.label}
              >
                <span className="material-symbols-outlined text-lg">{social.icon}</span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Link Columns */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category} className="col-span-1">
            <h6 className="font-headline font-bold text-primary mb-5 text-sm tracking-wide">
              {category}
            </h6>
            <ul className="space-y-3">
              {links.map((link) => {
                const LinkComponent = link.isLink ? Link : "a";
                return (
                  <li key={link.label}>
                    <LinkComponent
                      className="font-body text-sm text-slate-400 hover:text-secondary transition-colors duration-300 nav-link-underline inline-block"
                      href={link.href}
                    >
                      {link.label}
                    </LinkComponent>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body text-xs text-slate-400">
          © 2024 AquaSmart Systems. All rights reserved.
        </p>
        <p className="font-accent italic text-xs text-slate-300">
          The Future of Agriculture
        </p>
      </div>
    </footer>
  );
}
