import Link from "next/link";
import Sidebar from "../components/Sidebar";
import { getDashboardData } from "../lib/dashboard-data";
import { requireSession } from "../lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const dashboardData = await getDashboardData(session.user.id);
  const needsPlcSetup = dashboardData.plcs.length === 0;

  return (
    <div className="site-shell min-h-screen bg-paper text-ink">
      <Sidebar />
      <div className="min-h-screen pt-20 lg:pl-[18rem] lg:pt-0">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(103,243,200,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent)]">
          {needsPlcSetup ? (
            <div className="sticky top-20 z-30 px-5 pt-4 md:px-8 lg:top-0">
              <div className="flex flex-col gap-4 rounded-[1.1rem] border border-gold/70 bg-[linear-gradient(135deg,rgba(255,215,108,0.94),rgba(255,244,194,0.9))] p-4 text-ink shadow-[0_16px_42px_rgba(99,75,12,0.18)] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="eyebrow text-[8px] text-forest-deep">PLC setup required</p>
                  <p className="mt-2 text-sm leading-7 text-ink">
                    No Siemens LOGO bridge is configured for this account yet. Add one in Settings before telemetry,
                    analytics, or pump commands can become live.
                  </p>
                </div>
                <Link href="/dashboard/settings" className="shrink-0 rounded-full bg-forest-deep px-5 py-3 text-sm font-medium text-paper-soft transition hover:bg-forest">
                  Set up PLC
                </Link>
              </div>
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
