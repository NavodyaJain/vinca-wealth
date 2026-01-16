'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isDashboard = pathname?.startsWith('/dashboard');

  useEffect(() => {
    setIsToolsOpen(false);
    setIsMobileOpen(false);
    setIsMobileToolsOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Lock body scroll while mobile menu is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isMobileOpen ? 'hidden' : 'auto';
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsToolsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsToolsOpen(false);
        setIsMobileOpen(false);
        setIsMobileToolsOpen(false);
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  const tools = [
    { label: 'Financial Readiness', href: '/tools/financial-readiness' },
    { label: 'Lifestyle Planner', href: '/tools/lifestyle-planner' },
    { label: 'Health Stress Test', href: '/tools/health-stress' },
    { label: 'Blind Spot Analysis', href: '/tools/blind-spot' },
    { label: 'Top Assets Analysis', href: '/tools/top-assets' }
  ];

  const handleDashboardDrawer = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vinca-dashboard-drawer'));
    }
    setIsMobileOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
    setIsMobileToolsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="text-lg sm:text-xl font-semibold text-slate-900">Vinca Wealth</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium ${pathname === '/' ? 'text-green-600' : 'text-slate-600 hover:text-green-600'}`}
            >
              Home
            </Link>
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsToolsOpen((prev) => !prev)}
                className="text-sm font-medium text-slate-600 hover:text-green-600 flex items-center"
              >
                Tools
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isToolsOpen && (
                <div className="absolute right-0 bg-white rounded-2xl shadow-lg border border-slate-200 mt-2 py-2 min-w-[220px]">
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {tool.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/services"
              className={`text-sm font-medium ${pathname === '/services' ? 'text-green-600' : 'text-slate-600 hover:text-green-600'}`}
            >
              Services
            </Link>

            <Link 
              href="/signin" 
              className="btn-primary h-11 px-5"
            >
              Sign In
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            {isDashboard && (
              <button
                onClick={handleDashboardDrawer}
                aria-label="Open dashboard menu"
                className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              {isMobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isMobileOpen && (
          <div
            className="fixed inset-0 z-[9999] md:hidden"
            onClick={closeMobileMenu}
          >
            <div className="absolute inset-0 bg-black/40" aria-hidden="true"></div>
            <div
              className="relative ml-auto h-full w-[85%] max-w-sm bg-white shadow-2xl border-l border-slate-200 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-semibold text-slate-900">Menu</div>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                    aria-label="Close menu"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {isDashboard && (
                  <button
                    onClick={handleDashboardDrawer}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 text-slate-800 font-medium hover:bg-slate-50"
                  >
                    Dashboard Menu
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                <Link 
                  href="/" 
                  className="block px-3 py-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>

                <div className="border border-slate-100 rounded-xl">
                  <button
                    onClick={() => setIsMobileToolsOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold text-slate-800"
                  >
                    Tools
                    <svg className={`w-4 h-4 transition-transform ${isMobileToolsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isMobileToolsOpen && (
                    <div className="border-t border-slate-100 divide-y divide-slate-100">
                      {tools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={closeMobileMenu}
                        >
                          {tool.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link 
                  href="/services"
                  className="block px-3 py-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  onClick={closeMobileMenu}
                >
                  Services
                </Link>

                <Link 
                  href="/signin" 
                  className="block w-full text-center h-11 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}