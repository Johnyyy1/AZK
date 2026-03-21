import Sidebar from "../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-dash-bg text-white min-h-screen font-body">
      <Sidebar />
      <div className="ml-64">{children}</div>
    </div>
  );
}
