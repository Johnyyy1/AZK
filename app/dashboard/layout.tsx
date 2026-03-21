"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on path change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="bg-background text-on-background min-h-screen font-body flex flex-col md:flex-row">
      {/* Mobile Top Nav */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-surface-container-lowest border-b border-on-surface-variant/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-secondary-fixed-dim flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              water_drop
            </span>
          </div>
          <span className="text-lg font-black text-secondary-fixed-dim tracking-tighter font-headline">
            AquaSmart
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-surface-container rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant">menu</span>
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-grow md:ml-64 overflow-x-hidden min-h-screen">
        {children}
      </main>
    </div>
  );
}
