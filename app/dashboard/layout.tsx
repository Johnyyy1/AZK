import Sidebar from "../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-on-background min-h-screen font-body">
      <Sidebar />
      <div className="ml-64">{children}</div>
    </div>
  );
}
