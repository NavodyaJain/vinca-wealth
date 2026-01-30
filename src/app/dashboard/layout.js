"use client";
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import DashboardSidebar from '../../components/DashboardSidebar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  // Hide search bar and bell icon on perks/curations page (exact match or subroutes)
  const isPerksPage = pathname?.startsWith('/dashboard/investor-hub/perks');

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r pt-16">
        <DashboardSidebar />
      </aside>
      {/* Mobile sidebar toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 bg-white border border-slate-200 rounded-full p-2 shadow-md focus:outline-none"
        aria-label="Open sidebar"
        onClick={() => setSidebarOpen(true)}
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-emerald-600">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Mobile sidebar drawer and backdrop */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
          {/* Sidebar drawer */}
          <div className="fixed top-0 left-0 h-screen w-[280px] max-w-[82vw] bg-white z-60 shadow-xl border-r border-slate-200 overflow-y-auto px-4 py-4 lg:hidden">
            <DashboardSidebar onNav={() => setSidebarOpen(false)} />
          </div>
        </>
      )}
      {/* Main content */}
      <main className="ml-64 min-h-screen w-[calc(100%-16rem)]">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Spacer for mobile hamburger */}
          <div className="lg:hidden h-12" />
          {/* ...search bar and bell icon removed... */}
          {children}
        </div>
      </main>
    </div>
  );
}