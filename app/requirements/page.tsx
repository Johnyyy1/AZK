import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";
import TopNav from "../components/TopNav";

export const metadata: Metadata = {
  title: "Splnění požadavků | AquaSmart",
  description: "Kontrolní přehled splnění cílů ročníkové práce AquaSmart v kategorii webová aplikace.",
};

const categoryRequirements = [
  ["Vhodný jazyk a framework", "Next.js 16, React 19, TypeScript, Tailwind CSS v4 a Bun bridge."],
  ["Databáze a její využití", "PostgreSQL s Drizzle schématem pro uživatele, PLC, měření, tokeny a příkazy čerpadla."],
  ["Kontejnerizace", "Dockerfile pro frontend, backend/Dockerfile pro bridge a compose.yaml s PostgreSQL službou."],
  ["Responzivní design", "Marketingové stránky i dashboard používají responzivní gridy, mobilní menu a adaptivní karty."],
  ["Šifrování citlivých údajů", "Hesla spravuje Better Auth, agent tokeny se ukládají jako SHA-256 hash a tajné hodnoty zůstávají v env."],
  ["Nasazená aplikace", "Produkce běží jako standalone Next server v Dockeru, s konfigurací přes BETTER_AUTH_URL a DATABASE_URL."],
  ["Podmínky používání", "Stránka /privacy popisuje pravidla používání, uložená data a ochranu soukromí."],
];

const assignmentGoals = [
  ["Stav vlhkosti", "Dashboard a Analytics zobrazují poslední měření i historii z tabulky plc_readings."],
  ["Stav čerpadla", "Controls a Analytics ukazují poslední příkaz, stav fronty a potvrzení od bridge agenta."],
  ["Manuální ON/OFF", "PumpControlCard zapisuje příkazy přes autentizovaný endpoint /api/logo/pump."],
  ["Modbus komunikace", "Lokální Bun bridge čte LOGO přes Modbus TCP/IP a hlásí hodnoty do cloudové aplikace."],
  ["Graf nebo historie", "Analytics kreslí SVG graf vlhkosti a výpis posledních vzorků a historii příkazů čerpadla."],
  ["Přístup z více zařízení", "Aplikace je webová, responzivní a připravená pro hostování za jednou veřejnou URL."],
];

const defensePath = [
  ["/", "Veřejná prezentace systému a záměr projektu."],
  ["/auth", "Přihlášení nebo vytvoření operátora."],
  ["/dashboard/settings", "Konfigurace LOGO bridge a generování agent tokenu."],
  ["/dashboard/controls", "Manuální ovládání čerpadla ON/OFF přes web."],
  ["/dashboard/analytics", "Historie vlhkosti a příkazů čerpadla."],
  ["/privacy", "Podmínky používání a privacy policy."],
];

export default function RequirementsPage() {
  return (
    <div className="site-shell bg-paper text-ink">
      <TopNav />

      <main className="relative z-10">
        <section className="contour-paper contour-map bg-paper-soft pt-32 md:pt-40">
          <div className="mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-20">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <p className="eyebrow text-[10px] text-clay">Ročníková práce / Webová aplikace</p>
                <h1 className="display-title mt-6 text-5xl text-forest md:text-7xl">
                  Kontrolní přehled splnění cílů.
                </h1>
              </div>
              <div className="section-frame rounded-[2rem] p-6 md:p-8">
                <p className="eyebrow text-[9px] text-ink-soft/56">Rozsah hodnoceni</p>
                <p className="mt-4 text-base leading-8 text-ink-soft">
                  Projekt je připravený k obhajobě jako webová aplikace. Hardware je napojený přes bridge, ale požadavky
                  níže mapují webovou část, databázi, bezpečnost, Docker a provoz.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
          <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <section className="section-frame rounded-[2rem] p-6 md:p-7">
              <p className="eyebrow text-[8px] text-clay">Kategorie 6</p>
              <h2 className="mt-3 font-display text-4xl text-forest">Webová aplikace</h2>
              <div className="mt-6 space-y-4">
                {categoryRequirements.map(([title, body]) => (
                  <div key={title} className="rounded-[1.3rem] bg-white/70 p-4">
                    <h3 className="font-medium text-forest">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-ink-soft">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="dark-frame rounded-[2rem] p-6 text-paper-soft md:p-7">
              <p className="eyebrow text-[8px] text-paper-soft/46">Cíle ze zadávacího listu</p>
              <h2 className="mt-3 font-display text-4xl">Web, data a ruční ovládání.</h2>
              <div className="mt-6 space-y-4">
                {assignmentGoals.map(([title, body]) => (
                  <div key={title} className="rounded-[1.3rem] border border-paper/10 bg-paper-soft/6 p-4">
                    <h3 className="font-medium text-paper-soft">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-paper-soft/72">{body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-8 atlas-card rounded-[2rem] p-6 md:p-7">
            <p className="eyebrow text-[8px] text-clay">Co ukázat u obhajoby</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {defensePath.map(([href, body]) => (
                <Link key={href} href={href} className="rounded-[1.3rem] bg-white/70 p-4 transition hover:bg-white">
                  <p className="font-mono text-xs text-clay">{href}</p>
                  <p className="mt-3 text-sm leading-7 text-ink-soft">{body}</p>
                </Link>
              ))}
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}
