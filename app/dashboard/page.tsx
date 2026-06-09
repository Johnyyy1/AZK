import Link from "next/link";
import { formatDateTime, formatTime, getDashboardData, isAgentOnline } from "@/app/lib/dashboard-data";
import { requireSession } from "@/app/lib/session";

const moistureNote = (value: number | null) => {
  if (value === null) return "Waiting for first bridge report";
  if (value < 40) return "Below working range";
  if (value > 60) return "Above working range";
  return "Reading stored from LOGO bridge";
};

const commandStatusLabel = (status: string | null | undefined) => {
  if (!status) return "None";

  const labels: Record<string, string> = {
    acknowledged: "Acked",
    queued: "Queued",
    sent: "Sent",
    failed: "Failed",
  };

  return labels[status] ?? status;
};

const buildMiniTrend = (readings: Awaited<ReturnType<typeof getDashboardData>>["readings"]) => {
  const points = readings
    .slice(0, 12)
    .reverse()
    .map((reading) => reading.value);

  if (points.length < 2) return null;

  const minValue = Math.min(...points);
  const maxValue = Math.max(...points);
  const domain = Math.max(1, maxValue - minValue);
  const x = (index: number) => (index / (points.length - 1)) * 520;
  const y = (value: number) => 24 + (1 - (value - minValue) / domain) * 116;

  return points.map((value, index) => `${x(index)},${y(value)}`).join(" ");
};

export default async function DashboardPage() {
  const session = await requireSession();
  const data = await getDashboardData(session.user.id);
  const plc = data.primaryPlc;
  const latestMoisture = data.latestReading?.value ?? null;
  const online = plc ? isAgentOnline(plc.lastHeartbeatAt) : false;
  const trendLine = buildMiniTrend(data.readings);
  const trendReady = trendLine !== null;
  const heroCopy = plc
    ? online
      ? "The local bridge is online. This dashboard is showing only database records reported by your deployed LOGO setup."
      : "The PLC configuration is saved. Start or check the local bridge to refresh telemetry and command acknowledgements."
    : "Add the deployed Siemens LOGO bridge in Settings before live telemetry and pump commands can appear here.";
  const actionTitle = !plc
    ? "Set up the LOGO bridge before issuing commands."
    : online
      ? "Bridge is online and ready for queued commands."
      : "Bridge is waiting for the local agent heartbeat.";

  const plantPanels = [
    { name: "Moisture probe", value: latestMoisture === null ? "--" : `${latestMoisture}`, note: moistureNote(latestMoisture) },
    { name: "PLC bridges", value: String(data.plcs.length), note: plc ? `${plc.name} selected` : "Add hardware in Settings" },
    { name: "Agent status", value: plc ? (online ? "Online" : "Waiting") : "No PLC", note: plc ? formatDateTime(plc.lastHeartbeatAt) : "No heartbeat yet" },
    {
      name: "Last command",
      value: commandStatusLabel(data.latestCommand?.status),
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
              ["System status", plc ? (online ? "Agent online" : "Awaiting heartbeat") : "Setup needed"],
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
          <section className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-4">
            {plantPanels.map((panel) => (
              <div key={panel.name} className="atlas-card min-h-44 min-w-0 rounded-[1.8rem] p-5">
                <p className="eyebrow text-[8px] text-clay">{panel.name}</p>
                <p className="mt-4 min-w-0 whitespace-nowrap font-display text-4xl leading-none text-forest md:text-5xl">{panel.value}</p>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{panel.note}</p>
              </div>
            ))}
          </section>

          <section className="section-frame rounded-[2rem] p-6 md:p-7">
            <div className="grid gap-6 2xl:grid-cols-[0.72fr_1.28fr] 2xl:items-center">
              <div>
                <p className="eyebrow text-[8px] text-clay">Moisture trend</p>
                <h2 className="mt-2 font-display text-3xl text-forest">
                  {trendReady ? "Root-zone curve from live telemetry" : "Waiting for enough live telemetry"}
                </h2>
                <p className="mt-3 text-sm leading-7 text-ink-soft">
                  {trendReady
                    ? "The curve is drawn from the latest LOGO bridge readings stored for this workspace."
                    : "AquaSmart needs at least two stored moisture readings before it draws a production trend."}
                </p>
              </div>
              <div className="h-48 rounded-[1.5rem] border border-ink/8 bg-white/70 p-4">
                {trendReady ? (
                  <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 520 170">
                    {[42, 50, 58].map((value, index) => (
                      <g key={value}>
                        <line x1="0" y1={36 + index * 48} x2="520" y2={36 + index * 48} stroke="rgba(11,22,32,0.08)" />
                        <text x="0" y={29 + index * 48} fontSize="10" fill="#48606a">
                          {value}
                        </text>
                      </g>
                    ))}
                    <polyline
                      points={trendLine}
                      fill="none"
                      stroke="rgba(127,212,255,0.5)"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="12"
                    />
                    <polyline
                      points={trendLine}
                      fill="none"
                      stroke="#22b07d"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="5"
                    />
                  </svg>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-[1.2rem] border border-dashed border-ink/12 text-center text-sm leading-7 text-ink-soft">
                    Live chart will appear after the bridge reports more samples.
                  </div>
                )}
              </div>
            </div>
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
            <h2 className="mt-4 font-display text-4xl">{actionTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-paper-soft/72">
              {heroCopy}
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
