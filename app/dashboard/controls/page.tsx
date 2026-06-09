import Link from "next/link";
import PumpControlCard from "@/app/components/PumpControlCard";
import { formatDateTime, getDashboardData, isAgentOnline } from "@/app/lib/dashboard-data";
import { requireSession } from "@/app/lib/session";

export default async function ControlsPage() {
  const session = await requireSession();
  const data = await getDashboardData(session.user.id);
  const plc = data.primaryPlc;
  const online = plc ? isAgentOnline(plc.lastHeartbeatAt) : false;

  return (
    <main className="px-5 py-6 md:px-8 md:py-8">
      <header className="mb-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-end">
        <div>
          <p className="eyebrow text-[9px] text-clay">Manual controls</p>
          <h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">
            Queue commands only for hardware you configured.
          </h1>
        </div>
        <div className="section-frame rounded-[1.8rem] p-5 text-sm leading-7 text-ink-soft">
          {plc
            ? `${plc.name} is ${online ? "currently online" : "waiting for its local bridge"}. Commands below are stored in Postgres and pulled by the agent.`
            : "No PLC is attached to this account yet. Add one in Settings before pump commands can be queued."}
        </div>
      </header>

      <div className="mb-8">
        <PumpControlCard />
      </div>

      <section className="grid gap-5 lg:grid-cols-3">
        {[
          ["Selected PLC", plc?.name ?? "None"],
          ["Agent heartbeat", plc ? formatDateTime(plc.lastHeartbeatAt) : "Never"],
          ["Last command", data.latestCommand ? `${data.latestCommand.enabled ? "ON" : "OFF"} · ${data.latestCommand.status}` : "None"],
        ].map(([label, value]) => (
          <div key={label} className="atlas-card rounded-[2rem] p-6 md:p-7">
            <p className="eyebrow text-[8px] text-clay">{label}</p>
            <p className="mt-3 break-words font-display text-4xl text-forest">{value}</p>
          </div>
        ))}
      </section>

      {!plc ? (
        <section className="section-frame mt-8 rounded-[2rem] p-6 md:p-7">
          <p className="eyebrow text-[8px] text-clay">Setup needed</p>
          <h2 className="mt-3 font-display text-4xl text-forest">Add your Siemens LOGO bridge first.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft">
            This screen only works against the PLC configuration owned by your account. Add the deployed LOGO bridge
            before queueing manual pump commands.
          </p>
          <Link href="/dashboard/settings" className="atlas-button mt-6 inline-flex rounded-full px-5 py-3 text-sm font-medium">
            Open settings
          </Link>
        </section>
      ) : null}
    </main>
  );
}
