'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/' },
  {
    label: 'Tools',
    type: 'dropdown',
    items: [
      { label: 'Financial Readiness Calculator', path: '/tools/financial-readiness' },
      { label: 'Lifestyle Planner', path: '/tools/lifestyle-planner' },
      { label: 'Health Stress Test', path: '/tools/health-stress' }
    ]
  },
  { label: 'Services', path: '/services' },
  { label: 'Sign in', path: '/signin', style: 'primary' }
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const closeAll = () => {
    setIsMobileMenuOpen(false);
    setIsToolsOpen(false);
  };

  const navigate = (path) => {
    router.push(path);
    closeAll();
  };

  useEffect(() => {
    closeAll();
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  const renderDesktopTools = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsToolsOpen((prev) => !prev)}
        aria-expanded={isToolsOpen}
        aria-controls="desktop-tools-menu"
        className={`text-sm font-medium flex items-center gap-1 rounded-lg px-2 py-1 transition-colors ${isToolsOpen ? 'text-green-700' : 'text-slate-600 hover:text-green-600'}`}
      >
        Tools
        <ChevronDown className={`w-4 h-4 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
      </button>
      {isToolsOpen && (
        <div
          id="desktop-tools-menu"
          className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-lg py-2"
        >
          {navItems[1].items.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${isActive(item.path) ? 'bg-green-50 text-green-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderMobileMenu = () => (
    <div className="lg:hidden mt-3 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden" role="menu" aria-label="Mobile navigation">
      {navItems.map((item) => {
        if (item.type === 'dropdown') {
          return (
            <div key={item.label} className="border-t border-slate-100">
              <button
                onClick={() => setIsToolsOpen((prev) => !prev)}
                aria-expanded={isToolsOpen}
                aria-controls="mobile-tools-panel"
                className={`w-full flex items-center justify-between px-4 py-3 text-slate-700 hover:bg-slate-50 ${isToolsOpen ? 'bg-slate-50' : ''}`}
              >
                <span className="font-medium">{item.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isToolsOpen && (
                <div id="mobile-tools-panel" className="border-t border-slate-100">
                  {item.items.map((child) => (
                    <button
                      key={child.path}
                      onClick={() => navigate(child.path)}
                      className={`w-full text-left pl-8 pr-4 py-2 text-sm text-slate-600 hover:text-green-700 hover:bg-slate-50 ${isActive(child.path) ? 'bg-green-50 text-green-700 font-medium border-l-4 border-green-600' : ''}`}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        }

        if (item.style === 'primary') {
          return (
            <div key={item.path} className="border-t border-slate-100 px-4 py-3">
              <button
                onClick={() => navigate(item.path)}
                className="w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                {item.label}
              </button>
            </div>
          );
        }

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center justify-between px-4 py-3 text-slate-700 hover:bg-slate-50 ${isActive(item.path) ? 'bg-green-50 text-green-700 font-medium border-l-4 border-green-600' : ''}`}
          >
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="text-lg sm:text-xl font-semibold text-slate-900">Vinca Wealth</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className={`text-sm font-medium px-2 py-1 rounded-lg ${isActive('/') ? 'text-green-700 bg-green-50' : 'text-slate-600 hover:text-green-600'}`}
            >
              Home
            </button>
            {renderDesktopTools()}
            <button
              onClick={() => navigate('/services')}
              className={`text-sm font-medium px-2 py-1 rounded-lg ${isActive('/services') ? 'text-green-700 bg-green-50' : 'text-slate-600 hover:text-green-600'}`}
            >
              Services
            </button>
            <button
              onClick={() => navigate('/signin')}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              Sign in
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <>
            <button
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              aria-label="Close menu overlay"
              onClick={closeAll}
            />
            <div className="relative z-50 w-full">{renderMobileMenu()}</div>
          </>
        )}
      </div>
    </nav>
  );
}
