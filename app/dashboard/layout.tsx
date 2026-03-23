import Sidebar from "../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="site-shell min-h-screen bg-paper text-ink">
      <Sidebar />
      <div className="min-h-screen pt-20 lg:pl-[18rem] lg:pt-0">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(103,243,200,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent)]">
          {children}
        </div>
      </div>
    </div>
  );
}
