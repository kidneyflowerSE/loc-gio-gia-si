import Sidebar from "./Sidebar";
import { ReactNode, useState } from "react";
// Router not needed here; sidebar overlay handles navigation internally.
import { Menu } from 'lucide-react';

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for large screens */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <>
          {/* backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          {/* drawer */}
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white shadow-sm sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold">Bảng điều khiển</h1>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
} 