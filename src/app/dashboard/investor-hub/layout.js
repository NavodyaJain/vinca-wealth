

"use client";
// InvestorHubNav import removed (component deleted)
import InvestorHubHeader from '../../../components/investorHub/shared/InvestorHubHeader';
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

  // Only show search bar on events and resources pages
  const showHeader = [
    '/dashboard/investor-hub/events',
    '/dashboard/investor-hub/resources'
  ].includes(pathname);
  return (
    <div className="min-h-screen bg-white w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Mobile: nav above banner, Desktop: nav sidebar */}
      <div className="block md:hidden w-full h-4" />
      {showHeader && <InvestorHubHeader />}
      <div className="mx-auto w-full max-w-7xl">
        <main className="flex-1 w-full">{children}</main>
      </div>
    </div>
  );
}
