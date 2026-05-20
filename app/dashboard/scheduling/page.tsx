import Link from "next/link";
import { formatDateTime, getDashboardData } from "@/app/lib/dashboard-data";
import { requireSession } from "@/app/lib/session";

export default async function SchedulingPage() {
  const session = await requireSession();
  const data = await getDashboardData(session.user.id);
  const plc = data.primaryPlc;

  return (
    <main className="px-5 py-6 md:px-8 md:py-8">
      <header className="mb-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-end">
        <div>
          <p className="eyebrow text-[9px] text-clay">Scheduling</p>
          <h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">
            Automation rules will stay empty until they are real.
          </h1>
        </div>
        <div className="section-frame rounded-[1.8rem] p-5 text-sm leading-7 text-ink-soft">
          AquaSmart currently supports authenticated manual pump commands and bridge telemetry. Timed schedules and smart
          rules need their own database model before this page should show active automation.
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <section className="section-frame rounded-[2rem] p-6 md:p-7">
          <p className="eyebrow text-[8px] text-clay">Automation status</p>
          <h2 className="mt-4 font-display text-4xl text-forest">No schedule rules configured.</h2>
          <p className="mt-4 text-sm leading-7 text-ink-soft">
            There is no `schedules` table yet, so this page intentionally avoids fake weekly calendars. Commands are
            created only from the manual controls and then pulled by the bridge.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["Selected PLC", plc?.name ?? "No PLC"],
              ["Last command", data.latestCommand ? formatDateTime(data.latestCommand.requestedAt) : "Never"],
              ["Command status", data.latestCommand?.status ?? "None"],
              ["Telemetry samples", String(data.readings.length)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] bg-white/70 p-4">
                <p className="eyebrow text-[7px] text-ink-soft/58">{label}</p>
                <p className="mt-2 break-words text-sm text-forest">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dark-frame rounded-[2rem] p-6 text-paper-soft md:p-7">
          <p className="eyebrow text-[8px] text-paper-soft/46">Next implementation step</p>
          <h2 className="mt-4 font-display text-4xl">Add a scheduling schema before enabling automation.</h2>
          <p className="mt-4 text-sm leading-7 text-paper-soft/72">
            A safe version should store rule ownership, PLC scope, windows, dry-run preview, and command generation
            history before it ever writes to real hardware.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard/controls" className="atlas-button rounded-full px-5 py-3 text-sm font-medium">
              Use manual controls
            </Link>
            <Link
              href="/dashboard/settings"
              className="rounded-full border border-paper-soft/18 bg-paper-soft/8 px-5 py-3 text-sm text-paper-soft"
            >
              Check bridge setup
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
