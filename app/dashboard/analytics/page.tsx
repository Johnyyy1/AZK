import { formatDateTime, getDashboardData } from "@/app/lib/dashboard-data";
import { requireSession } from "@/app/lib/session";

const buildChart = (readings: Awaited<ReturnType<typeof getDashboardData>>["readings"]) => {
  const points = readings
    .slice()
    .reverse()
    .map((reading) => ({
      label: new Intl.DateTimeFormat("cs-CZ", { hour: "2-digit", minute: "2-digit" }).format(reading.readAt),
      value: reading.value,
    }));

  if (points.length < 2) return null;

  const minValue = Math.min(...points.map((point) => point.value));
  const maxValue = Math.max(...points.map((point) => point.value));
  const padding = Math.max(4, Math.round((maxValue - minValue) * 0.12));
  const domainMin = Math.max(0, minValue - padding);
  const domainMax = maxValue + padding;
  const domain = Math.max(1, domainMax - domainMin);
  const x = (index: number) => (index / (points.length - 1)) * 900;
  const y = (value: number) => 30 + (1 - (value - domainMin) / domain) * 150;

  return {
    points,
    domainMin,
    domainMax,
    linePoints: points.map((point, index) => `${x(index)},${y(point.value)}`).join(" "),
    areaPoints: `0,190 ${points.map((point, index) => `${x(index)},${y(point.value)}`).join(" ")} 900,190`,
    y,
  };
};

const shouldShowTick = (index: number, total: number) => {
  if (total <= 8) return true;
  return index === 0 || index === total - 1 || index % Math.ceil(total / 6) === 0;
};

export default async function AnalyticsPage() {
  const session = await requireSession();
  const data = await getDashboardData(session.user.id);
  const chart = buildChart(data.readings);
  const latest = data.latestReading?.value ?? null;
  const previous = data.readings[1]?.value ?? null;
  const delta = latest !== null && previous !== null ? latest - previous : null;

  return (
    <main className="px-5 py-6 md:px-8 md:py-8">
      <header className="mb-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-end">
        <div>
          <p className="eyebrow text-[9px] text-clay">Analytics</p>
          <h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">
            Real LOGO readings and pump commands, without demo history.
          </h1>
        </div>
        <div className="section-frame rounded-[1.8rem] p-5 md:p-6">
          <p className="text-sm leading-7 text-ink-soft">
            This page stays quiet until your local bridge reports telemetry. Once readings arrive, the chart and history
            are built only from the database.
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Current moisture", latest === null ? "--" : `${latest}`, latest === null ? "No reading yet" : "Latest stored value"],
          ["Stored readings", String(data.readings.length), data.primaryPlc ? data.primaryPlc.name : "No PLC configured"],
          ["Pump commands", String(data.commands.length), data.latestCommand?.status ?? "No command history"],
          ["Last telemetry", data.latestReading ? formatDateTime(data.latestReading.readAt) : "Never", "Bridge report time"],
        ].map(([label, value, note]) => (
          <div key={label} className="atlas-card min-h-48 rounded-[1.8rem] p-5">
            <p className="eyebrow text-[8px] text-clay">{label}</p>
            <p className="mt-4 break-words font-display text-4xl leading-none text-forest md:text-5xl">{value}</p>
            <p className="mt-3 text-sm text-ink-soft">{note}</p>
          </div>
        ))}
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="section-frame rounded-[2rem] p-6 md:p-7">
          <div className="border-b border-ink/10 pb-5">
            <p className="eyebrow text-[8px] text-clay">Moisture history</p>
            <h2 className="mt-2 font-display text-3xl text-forest">Root-zone values from the bridge</h2>
            <p className="mt-3 text-sm text-ink-soft">
              {latest === null
                ? "No telemetry has been reported yet."
                : `Latest reading: ${latest}${delta === null ? "" : ` (${delta >= 0 ? "+" : ""}${delta} vs previous sample)`}`}
            </p>
          </div>

          {chart ? (
            <div className="mt-8 rounded-[1.5rem] border border-ink/8 bg-white/70 p-4">
              <div className="h-72 overflow-hidden">
                <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 900 210">
                  {[0, 1, 2, 3].map((index) => {
                    const value = chart.domainMin + ((chart.domainMax - chart.domainMin) / 3) * index;
                    const lineY = chart.y(value);

                    return (
                      <g key={index}>
                        <line x1="0" y1={lineY} x2="900" y2={lineY} stroke="rgba(11,22,32,0.08)" strokeWidth="1" />
                        <text x="0" y={lineY - 6} fontSize="10" fill="#48606a">
                          {Math.round(value).toLocaleString("cs-CZ")}
                        </text>
                      </g>
                    );
                  })}

                  <polygon points={chart.areaPoints} fill="url(#analyticsFill)" opacity="0.22" />
                  <polyline
                    points={chart.linePoints}
                    fill="none"
                    stroke="#22b07d"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {chart.points.map((point, index) => {
                    const pointX = (index / (chart.points.length - 1)) * 900;
                    const pointY = chart.y(point.value);
                    return <circle key={`${point.label}-${index}`} cx={pointX} cy={pointY} r="5" fill="#22b07d" />;
                  })}
                  <defs>
                    <linearGradient id="analyticsFill" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#7fd4ff" />
                      <stop offset="100%" stopColor="#67f3c8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-ink-soft/74">
                {chart.points.map((point, index) =>
                  shouldShowTick(index, chart.points.length) ? <span key={`${point.label}-${index}`}>{point.label}</span> : null,
                )}
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-[1.6rem] border border-ink/8 bg-white/70 p-6">
              <p className="text-sm leading-7 text-ink-soft">
                At least two readings are needed to draw a trend. Start the local bridge agent and this area will fill
                from `plc_readings`.
              </p>
            </div>
          )}

          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {data.readings.slice(0, 8).map((entry) => (
              <div key={entry.id} className="rounded-[1.2rem] border border-ink/8 bg-white/70 px-4 py-3">
                <p className="text-xs text-ink-soft/72">{formatDateTime(entry.readAt)}</p>
                <p className="mt-2 font-display text-2xl text-forest">{entry.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dark-frame rounded-[2rem] p-6 text-paper-soft md:p-7">
          <p className="eyebrow text-[8px] text-paper-soft/46">Pump command history</p>
          <div className="mt-5 space-y-4">
            {data.commands.length > 0 ? (
              data.commands.map((command) => (
                <div key={command.id} className="rounded-[1.4rem] border border-paper/10 bg-paper-soft/6 p-4">
                  <p className="text-sm text-paper-soft/62">{formatDateTime(command.requestedAt)}</p>
                  <h3 className="mt-2 font-display text-3xl">{command.enabled ? "Pump ON" : "Pump OFF"}</h3>
                  <p className="mt-2 text-sm text-paper-soft/72">
                    {command.mode} {command.address} · {command.status}
                  </p>
                  {command.agentError ? <p className="mt-3 text-sm text-clay">{command.agentError}</p> : null}
                </div>
              ))
            ) : (
              <div className="rounded-[1.4rem] border border-paper/10 bg-paper-soft/6 p-4">
                <h3 className="font-display text-3xl">No commands yet</h3>
                <p className="mt-2 text-sm leading-7 text-paper-soft/72">
                  Pump commands will appear here after you use the manual controls.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
