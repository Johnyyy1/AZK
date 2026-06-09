import type { Metadata } from "next";
import Footer from "../components/Footer";
import TopNav from "../components/TopNav";

export const metadata: Metadata = {
  title: "Privacy & Terms | AquaSmart",
  description: "Privacy policy and terms of use for the AquaSmart web application.",
};

const privacySections = [
  {
    title: "Application purpose",
    body: "AquaSmart lets an operator sign in, configure a Siemens LOGO bridge, view soil-moisture telemetry, inspect measurement history, and manually queue pump on/off commands from the web dashboard.",
  },
  {
    title: "Data we store",
    body: "The application stores user accounts, authentication sessions, PLC configuration, a hashed agent token, moisture readings, and pump command history. Operational data is stored in the PostgreSQL database used by the deployment.",
  },
  {
    title: "Sensitive values",
    body: "Passwords are handled by Better Auth. Bridge tokens are stored only as SHA-256 hashes with a short prefix for recognition. Public pages do not expose secret values, environment variables, or full agent tokens.",
  },
  {
    title: "Hardware access",
    body: "The browser does not talk directly to the PLC. Pump commands are queued in AquaSmart, then the local Bun bridge pulls them with an authenticated agent token and writes to the configured LOGO marker or register.",
  },
  {
    title: "Operator responsibility",
    body: "The operator is responsible for correct PLC addresses, network reachability, pump wiring, safe operating conditions, and any physical irrigation effect caused by queued commands. Manual controls should only be used during supervised operation.",
  },
  {
    title: "Operations and retention",
    body: "The project is prepared for Docker-based deployment and can be archived as a school web application project. Public deployments should use HTTPS, a strong BETTER_AUTH_SECRET, production database credentials, and restricted access to local hardware networks.",
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
                Privacy policy and terms of use.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-ink-soft md:text-lg">
                This page explains what the AquaSmart web application processes, how account and bridge access are
                protected, and how the public web surface stays separated from the local PLC bridge.
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
            <p className="eyebrow text-[9px] text-paper-soft/50">School project</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">The assessed deliverable is the web application.</h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-paper-soft/74">
              Hardware is part of the complete AquaSmart system, while this application demonstrates the web application
              requirements: authentication, database-backed state, Docker deployment, responsive UI, sensitive-data
              handling, production deployment, and terms of use.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
