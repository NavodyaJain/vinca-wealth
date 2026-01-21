

"use client";
import InvestorHubNav from '../../../components/investorHub/InvestorHubNav';
import React, { useRef, useEffect, useState } from 'react';
import '../../globals.css';
import { usePathname } from 'next/navigation';

export default function InvestorHubLayout({ children }) {
  const pathname = usePathname();
  const bannerRef = useRef(null);
  const [stickyOffset, setStickyOffset] = useState(0);
  // Hide banner only for joined group detail pages
  const hideBanner = /^\/dashboard\/investor-hub\/groups\/.+/.test(pathname);

  useEffect(() => {
    if (!hideBanner && bannerRef.current) {
      setStickyOffset(bannerRef.current.offsetHeight);
    } else {
      setStickyOffset(0);
    }
  }, [hideBanner]);

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile: nav above banner, Desktop: nav sidebar */}
      {/* Mobile: InvestorHubNav sticky at top of main content, never in sidebar */}
      <div className="block md:hidden w-full sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="pt-0 pb-1">
          <InvestorHubNav />
        </div>
      </div>
      {!hideBanner && (
        <div ref={bannerRef} className="w-full bg-green-50 border-b border-green-200 py-6 px-4 md:px-8 mt-0 md:mt-0">
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-1">Welcome to Investor Hub</h1>
          <p className="text-gray-700 mb-1">Learn, connect, and discuss retirement planning with investors like you.</p>
          <p className="text-xs text-gray-500">Educational community. No investment recommendations.</p>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-0 md:gap-6 max-w-7xl mx-auto w-full px-0 md:px-6 py-6">
        <main className="flex-1 w-full mt-4 md:mt-0">{children}</main>
        {/* Desktop: nav sidebar */}
        <div
          className="hidden md:block md:w-56 w-full md:ml-0 mt-6 md:mt-0 md:sticky md:self-start z-10"
          style={{ top: stickyOffset }}
        >
          <InvestorHubNav />
        </div>
      </div>
    </div>
  );
}
