import Link from "next/link";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Manifesto", href: "/#manifesto" },
      { label: "System", href: "/#system" },
      { label: "Technology", href: "/technology" },
    ],
  },
  {
    title: "Operate",
    links: [
      { label: "Client Access", href: "/auth" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Zones", href: "/dashboard/zones" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Schedule a Demo", href: "/auth" },
      { label: "Support Desk", href: "/auth" },
      { label: "Field Notes", href: "/technology" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-ink/10 bg-forest-deep text-paper-soft">
      <div className="contour-map grain absolute inset-0 opacity-70" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5 text-[10px] text-paper-soft/60">AquaSmart / Field Atlas</p>
            <h2 className="display-title text-5xl text-paper-soft md:text-7xl">
              The irrigation platform people remember because it feels mapped, not marketed.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-paper-soft/72 md:text-lg">
              We turn every zone, valve, and forecast into one legible landscape. The contour lines are not decoration.
              They are the visual promise of precision.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="eyebrow mb-4 text-[10px] text-paper-soft/50">{group.title}</p>
                <div className="flex flex-col gap-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      className="text-sm text-paper-soft/76 transition hover:text-paper-soft"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-paper/10 pt-6 text-xs text-paper-soft/46 md:flex-row md:items-center md:justify-between">
          <p>2026 AquaSmart Systems. Precision watering for cultivated landscapes.</p>
          <p className="eyebrow text-[9px]">Prague / Brezen / Remote Control Ready</p>
        </div>
      </div>
    </footer>
  );
}
