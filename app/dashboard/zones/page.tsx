import Link from "next/link";
import { formatDateTime, getDashboardData } from "@/app/lib/dashboard-data";
import { requireSession } from "@/app/lib/session";

export default async function ZonesPage() {
  const session = await requireSession();
  const data = await getDashboardData(session.user.id);
  const plc = data.primaryPlc;

  return (
    <main className="px-5 py-6 md:px-8 md:py-8">
      <header className="mb-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-end">
        <div>
          <p className="eyebrow text-[9px] text-clay">Plant profile</p>
          <h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">
            Hardware and plant context come from the deployed LOGO setup.
          </h1>
        </div>
        <div className="section-frame rounded-[1.8rem] p-5 text-sm leading-7 text-ink-soft">
          This page reflects the PLC attached to your workspace. Plant-specific fields can be added later; for now, the
          verified source of truth is the LOGO bridge configuration and telemetry.
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="dark-frame rounded-[2rem] p-6 text-paper-soft md:p-7">
          <p className="eyebrow text-[8px] text-paper-soft/44">Current hardware</p>
          <h2 className="mt-4 font-display text-5xl">{plc ? plc.name : "No PLC configured"}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-paper-soft/72">
            {plc
              ? "This is the selected Siemens LOGO bridge for the workspace. Readings and pump commands are scoped to this device."
              : "Add a Siemens LOGO 8.4 in Settings to turn this route into a real hardware profile."}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {(plc
              ? [
                  ["Model", plc.model],
                  ["LOGO endpoint", `${plc.logoIp}:${plc.logoPort}`],
                  ["Unit ID", String(plc.unitId)],
                  ["Last heartbeat", formatDateTime(plc.lastHeartbeatAt)],
                ]
              : [
                  ["Model", "--"],
                  ["LOGO endpoint", "--"],
                  ["Unit ID", "--"],
                  ["Last heartbeat", "Never"],
                ]
            ).map(([label, value]) => (
              <div key={label} className="rounded-[1.3rem] border border-paper/10 bg-paper-soft/6 px-4 py-4">
                <p className="eyebrow text-[7px] text-paper-soft/44">{label}</p>
                <p className="mt-2 break-words text-sm text-paper-soft">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-8">
          <section className="atlas-card rounded-[2rem] p-6 md:p-7">
            <p className="eyebrow text-[8px] text-clay">Sensor and pump mapping</p>
            <div className="mt-5 space-y-4">
              {(plc
                ? [
                    ["Moisture registers", `${plc.registerOffset} offset / ${plc.registerCount} count`],
                    ["Pump write mode", plc.pumpWriteMode],
                    [
                      "Pump address",
                      String(plc.pumpWriteMode === "coil" ? plc.pumpCoilAddress ?? "missing" : plc.pumpRegisterAddress ?? "missing"),
                    ],
                  ]
                : [
                    ["Moisture registers", "Not configured"],
                    ["Pump write mode", "Not configured"],
                    ["Pump address", "Not configured"],
                  ]
              ).map(([title, copy]) => (
                <div key={title} className="rounded-[1.3rem] bg-white/70 p-4">
                  <h3 className="font-medium text-forest">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-ink-soft">{copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="section-frame rounded-[2rem] p-6 md:p-7">
            <p className="eyebrow text-[8px] text-clay">Next moves</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard/settings" className="atlas-button rounded-full px-5 py-3 text-sm font-medium">
                {plc ? "Edit bridge setup" : "Add PLC"}
              </Link>
              <Link
                href="/dashboard/controls"
                className="atlas-button-secondary rounded-full px-5 py-3 text-sm font-medium"
              >
                Open manual controls
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
