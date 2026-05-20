import Link from "next/link";
import { formatDateTime, formatTime, getDashboardData, isAgentOnline } from "@/app/lib/dashboard-data";
import { requireSession } from "@/app/lib/session";

const moistureNote = (value: number | null) => {
  if (value === null) return "Waiting for first bridge report";
  if (value < 40) return "Below working range";
  if (value > 60) return "Above working range";
  return "Reading stored from LOGO bridge";
};

export default async function DashboardPage() {
  const session = await requireSession();
  const data = await getDashboardData(session.user.id);
  const plc = data.primaryPlc;
  const latestMoisture = data.latestReading?.value ?? null;
  const online = plc ? isAgentOnline(plc.lastHeartbeatAt) : false;

  const plantPanels = [
    { name: "Moisture probe", value: latestMoisture === null ? "--" : `${latestMoisture}`, note: moistureNote(latestMoisture) },
    { name: "PLC bridges", value: String(data.plcs.length), note: plc ? `${plc.name} selected` : "Add hardware in Settings" },
    { name: "Agent status", value: plc ? (online ? "Online" : "Waiting") : "No PLC", note: plc ? formatDateTime(plc.lastHeartbeatAt) : "No heartbeat yet" },
    {
      name: "Last command",
      value: data.latestCommand?.status ?? "None",
      note: data.latestCommand ? formatDateTime(data.latestCommand.requestedAt) : "No pump command queued",
    },
  ];

  return (
    <main className="px-5 py-6 md:px-8 md:py-8">
      <header className="mb-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-end">
        <div>
          <p className="eyebrow text-[9px] text-clay">Plant overview</p>
          <h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">
            A live operational read of your AquaSmart workspace.
          </h1>
        </div>
        <div className="section-frame rounded-[1.8rem] p-5 md:p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Workspace", data.site.name],
              ["System status", plc ? (online ? "Agent online" : "Awaiting agent") : "Setup needed"],
              ["Last sync", plc ? formatTime(plc.lastHeartbeatAt) : "Never"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.3rem] bg-white/60 p-4">
                <p className="eyebrow text-[8px] text-ink-soft/58">{label}</p>
                <p className="mt-3 font-display text-2xl text-forest">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_0.85fr]">
        <div className="space-y-8">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {plantPanels.map((panel) => (
              <div key={panel.name} className="atlas-card rounded-[1.8rem] p-5">
                <p className="eyebrow text-[8px] text-clay">{panel.name}</p>
                <p className="mt-4 break-words font-display text-5xl text-forest">{panel.value}</p>
                <p className="mt-3 text-sm text-ink-soft">{panel.note}</p>
              </div>
            ))}
          </section>

          <section className="section-frame rounded-[2rem] p-6 md:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow text-[8px] text-clay">Hardware focus</p>
                <h2 className="mt-2 font-display text-3xl text-forest">
                  {plc ? plc.name : "No Siemens LOGO has been added yet"}
                </h2>
              </div>
              <Link href="/dashboard/settings" className="text-sm text-forest transition hover:text-clay">
                Open settings
              </Link>
            </div>

            {plc ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["LOGO endpoint", `${plc.logoIp}:${plc.logoPort}`],
                  ["Modbus unit", String(plc.unitId)],
                  ["Read map", `${plc.registerOffset} / ${plc.registerCount}`],
                  ["Pump map", `${plc.pumpWriteMode} ${plc.pumpWriteMode === "coil" ? plc.pumpCoilAddress ?? "missing" : plc.pumpRegisterAddress ?? "missing"}`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.6rem] border border-ink/8 bg-white/70 p-5">
                    <p className="text-sm font-medium text-ink-soft">{label}</p>
                    <p className="mt-2 break-words font-display text-3xl text-forest">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.6rem] border border-ink/8 bg-white/70 p-5">
                <p className="text-sm leading-7 text-ink-soft">
                  Add your LOGO 8.4 in Settings, copy the generated bridge token, then start the local Bun bridge. Once it
                  reports back, readings and pump history will appear here.
                </p>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <section className="dark-frame rounded-[2rem] p-6 text-paper-soft md:p-7">
            <p className="eyebrow text-[8px] text-paper-soft/46">Current action</p>
            <h2 className="mt-4 font-display text-4xl">
              {plc ? (online ? "Bridge is ready for queued commands." : "Start the local bridge agent.") : "Finish PLC setup first."}
            </h2>
            <p className="mt-4 text-sm leading-7 text-paper-soft/72">
              {plc
                ? "AquaSmart will only show recommendations after the bridge sends real readings. Until then, manual controls queue commands for the configured PLC."
                : "There is no live hardware attached to this account yet, so the dashboard is intentionally empty."}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {[
                ["Readings stored", String(data.readings.length)],
                ["Commands stored", String(data.commands.length)],
                ["Latest reading", data.latestReading ? formatDateTime(data.latestReading.readAt) : "Never"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.2rem] border border-paper/10 bg-paper-soft/6 px-4 py-3">
                  <p className="eyebrow text-[7px] text-paper-soft/44">{label}</p>
                  <p className="mt-2 text-sm text-paper-soft">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="atlas-card rounded-[2rem] p-6 md:p-7">
            <p className="eyebrow text-[8px] text-clay">Alerts</p>
            <div className="mt-5 rounded-[1.3rem] bg-white/70 p-4">
              <h3 className="font-medium text-forest">{plc?.lastErrorMessage ? "Bridge reported an error" : "No live alerts"}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-soft">
                {plc?.lastErrorMessage ?? "AquaSmart has not received any hardware errors for this workspace."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
