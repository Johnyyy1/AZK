import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";
import TopNav from "../components/TopNav";

export const metadata: Metadata = {
  title: "Podmínky a soukromí | AquaSmart",
  description: "Podmínky používání a ochrana osobních údajů pro webovou aplikaci AquaSmart.",
};

const privacySections = [
  {
    title: "Účel aplikace",
    body: "AquaSmart slouží k přihlášení operátora, konfiguraci Siemens LOGO bridge, zobrazení vlhkosti půdy, historii měření a ručnímu zapínání nebo vypínání čerpadla přes webové rozhraní.",
  },
  {
    title: "Ukládaná data",
    body: "Aplikace ukládá uživatelský účet, relace přihlášení, konfiguraci PLC, hash agent tokenu, naměřené hodnoty vlhkosti a historii příkazů čerpadla. Data jsou ukládána do PostgreSQL databáze.",
  },
  {
    title: "Citlivé údaje",
    body: "Hesla spravuje Better Auth a bridge tokeny se v databázi ukládají pouze jako SHA-256 hash s krátkým prefixem pro rozpoznání. Veřejné stránky nezobrazují tajné hodnoty ani obsah .env souborů.",
  },
  {
    title: "Přístup k hardwaru",
    body: "Webová aplikace nepřistupuje přímo k PLC z prohlížeče. Příkazy se ukládají do fronty a lokální Bun bridge je načítá přes ověřený agent token, aby PLC nemuselo být vystavené internetu.",
  },
  {
    title: "Odpovědnost operátora",
    body: "Operátor zodpovídá za správné nastavení PLC adres, síťové dostupnosti, připojení čerpadla a bezpečné provozní podmínky. Manuální příkazy v dashboardu mají být používány jen při kontrolovaném provozu.",
  },
  {
    title: "Archivace a provoz",
    body: "Projekt je připravený pro spuštění v Dockeru a má zůstat dostupný pro školní archivaci. Při veřejném nasazení má být použit HTTPS, silný BETTER_AUTH_SECRET a produkční databázové heslo.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="site-shell bg-paper text-ink">
      <TopNav />

      <main className="relative z-10">
        <section className="contour-paper contour-map bg-paper-soft pt-32 md:pt-40">
          <div className="mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-20">
            <div className="max-w-4xl">
              <p className="eyebrow text-[10px] text-clay">AquaSmart / Legal</p>
              <h1 className="display-title mt-6 text-5xl text-forest md:text-7xl">
                Podmínky používání a ochrana soukromí.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-ink-soft md:text-lg">
                Tato stránka popisuje, jaká data webová aplikace zpracovává, jak chrání přístup k účtu a jak odděluje
                veřejnou webovou část od lokálního PLC bridge.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
          <div className="grid gap-5 md:grid-cols-2">
            {privacySections.map((section) => (
              <article key={section.title} className="atlas-card rounded-[2rem] p-6 md:p-7">
                <p className="eyebrow text-[8px] text-clay">{section.title}</p>
                <p className="mt-4 text-sm leading-7 text-ink-soft">{section.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-[2.2rem] bg-forest-deep p-7 text-paper-soft md:p-10">
            <p className="eyebrow text-[9px] text-paper-soft/50">Školní projekt</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">Hodnocená část je webová aplikace.</h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-paper-soft/74">
              Hardware zůstává součástí celého systému, ale tato aplikace prokazuje požadavky kategorie webová aplikace:
              přihlášení, databázi, Docker, responzivní rozhraní, zpracování citlivých údajů, nasazení a podmínky
              používání.
            </p>
            <Link href="/requirements" className="atlas-button mt-7 inline-flex rounded-full px-5 py-3 text-sm font-medium">
              Otevřít splnění požadavků
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
