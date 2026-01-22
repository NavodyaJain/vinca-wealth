'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Calculator,
  EyeOff,
  BarChart3,
  MessageCircle,
  User,
  X,
  ChevronRight,
  HeartPulse,
  TrendingUp,
  Users,
  Compass,
  HelpCircle
} from 'lucide-react';
import { usePremium } from '@/lib/premium';
import { getJoinedClubIds } from '@/lib/userJourneyStorage';
import { CLUBS } from '@/lib/retirementPersonalityEngine';

export default function DashboardSidebar({ onNav }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const pathname = usePathname();
  const router = useRouter();
  const { isPremium, upgradeToPremium } = usePremium();

  // Load joined clubs on mount
  useEffect(() => {
    const loadJoinedClubs = () => {
      const joinedIds = getJoinedClubIds();
      const clubs = joinedIds
        .map(id => Object.values(CLUBS).find(c => c.id === id))
        .filter(Boolean);
      setJoinedClubs(clubs);
    };
    
    loadJoinedClubs();
    
    // Re-check when storage changes
    const handleStorageChange = () => loadJoinedClubs();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Tools section
  const tools = [
    {
      id: 'financial-readiness',
      label: 'Financial Readiness',
      path: '/dashboard/financial-readiness',
      icon: <Calculator size={20} />
    },
    {
      id: 'lifestyle-planner',
      label: 'Lifestyle Planner',
      path: '/dashboard/lifestyle-planner',
      icon: <TrendingUp size={20} />
    },
    {
      id: 'health-stress',
      label: 'Health Stress Test',
      path: '/dashboard/health-stress',
      icon: <HeartPulse size={20} />
    }
  ];

  // Community section with Investor Hub drawer
  // (declaration moved below isActive)
  const investorHubItems = [
  { id: 'ih-events', label: 'Events', path: '/dashboard/investor-hub/events' },
  { id: 'ih-resources', label: 'Resources', path: '/dashboard/investor-hub/resources' },
  { id: 'ih-perks', label: 'Perks', path: '/dashboard/investor-hub/perks' },
  { id: 'ih-pricing', label: 'Pricing', path: '/dashboard/investor-hub/pricing' },
  { id: 'ih-portfolio', label: 'Portfolio Review', path: '/dashboard/investor-hub/portfolio-review' },
  ];

  // Support section
  const supportItems = [
    {
      id: 'talk-to-manager',
      label: 'Talk to Advisor',
      path: '/dashboard/talk-to-manager',
      icon: <MessageCircle size={20} />
    }
  ];

  const isActive = (path) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  // Community section with Investor Hub drawer
  const [investorHubOpen, setInvestorHubOpen] = useState(isActive('/dashboard/investor-hub'));

  const handleNavigation = (path) => {
    router.push(path);
    setIsMobileOpen(false);
    if (onNav) onNav();
  };

  useEffect(() => {
    const openDrawer = () => setIsMobileOpen(true);
    window.addEventListener('vinca-dashboard-drawer', openDrawer);
    return () => window.removeEventListener('vinca-dashboard-drawer', openDrawer);
  }, []);

  const renderNavItem = (item, showDescription = false) => (
    <button
      key={item.id}
      onClick={() => handleNavigation(item.path)}
      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center space-x-3 ${
        isActive(item.path) 
          ? 'bg-green-50 text-green-700 border border-green-200' 
          : 'text-slate-700 hover:bg-slate-50 hover:text-green-600'
      }`}
    >
      <div className={isActive(item.path) ? 'text-green-600' : 'text-slate-500'}>
        {item.icon}
      </div>
      <div className="flex-1 text-left">
        <div className="text-sm font-medium">{item.label}</div>
        {showDescription && item.description && (
          <div className="text-xs text-slate-500">{item.description}</div>
        )}
      </div>
      <ChevronRight size={16} className="text-slate-300" />
    </button>
  );

  return (
    <>
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          h-full flex flex-col
          w-full
          bg-white border-r border-slate-200 shadow-lg
          lg:static lg:shadow-none lg:flex lg:flex-col lg:w-72 lg:max-w-none
        `}
        aria-hidden={!isMobileOpen}
      >
        <div className="h-full flex flex-col">
          {/* Mobile header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-green-600 text-white flex items-center justify-center font-semibold">V</div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Vinca Dashboard</p>
                <p className="text-xs text-slate-500">Navigate tools</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-4">
            {/* PROFILE SECTION */}
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Profile</h3>
              <button
                onClick={() => handleNavigation('/dashboard/profile')}
                className={`w-full text-left px-3 py-3 rounded-xl transition-all flex items-center justify-between ${
                  isActive('/dashboard/profile') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive('/dashboard/profile') ? 'bg-green-100' : 'bg-slate-100'
                  }`}>
                    <User size={20} className={isActive('/dashboard/profile') ? 'text-green-600' : 'text-slate-600'} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Your Profile</div>
                    <div className="text-xs text-slate-500">Personality & readings</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
            </div>

            {/* TOOLS SECTION */}
            <div className="px-4 pt-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tools</h3>
            </div>
            <nav className="space-y-1 px-3 pt-2">
              {tools.length > 0 ? tools.map((tool) => renderNavItem(tool)) : <div className="text-xs text-red-500">No tools found</div>}
            </nav>

            {/* COMMUNITY SECTION */}
            <div className="px-4 pt-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Community</h3>
            </div>
            <nav className="space-y-1 px-3 pt-2">
              {/* Investor Hub Drawer */}
              <div>
                <button
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center space-x-3 ${
                    isActive('/dashboard/investor-hub')
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-green-600'
                  }`}
                  onClick={() => setInvestorHubOpen((open) => !open)}
                  aria-expanded={investorHubOpen}
                  aria-controls="investor-hub-drawer"
                >
                  <div className={isActive('/dashboard/investor-hub') ? 'text-green-600' : 'text-slate-500'}>
                    <Users size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">Investor Hub</div>
                  </div>
                  <ChevronRight size={16} className={`text-slate-300 transition-transform ${investorHubOpen ? 'rotate-90' : ''}`} />
                </button>
                {investorHubOpen && (
                  <div id="investor-hub-drawer" className="ml-7 mt-1 space-y-1">
                    {investorHubItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.path)}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center text-sm transition-all ${
                          isActive(item.path)
                            ? 'bg-green-100 text-green-800 font-semibold'
                            : 'text-slate-700 hover:bg-green-50 hover:text-green-700'
                        }`}
                        style={{ marginBottom: 2 }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* SUPPORT SECTION */}
            <div className="px-4 pt-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Support</h3>
            </div>
            <nav className="space-y-1 px-3 pt-2">
              {supportItems.length > 0 ? supportItems.map((item) => renderNavItem(item)) : <div className="text-xs text-red-500">No support items</div>}
            </nav>
          </div>

          {/* Footer with upgrade and home */}
          <div className="space-y-3 p-4 border-t border-slate-200">
            {!isPremium && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-900">Upgrade to Premium</p>
                <p className="text-xs text-emerald-700 mt-1">Unlock optimized plans and earliest retirement age.</p>
                <button
                  onClick={() => {
                    upgradeToPremium();
                    setIsMobileOpen(false);
                  }}
                  className="mt-3 w-full h-10 rounded-lg bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors"
                >
                  Upgrade
                </button>
              </div>
            )}

            <button
              onClick={() => handleNavigation('/dashboard')}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center space-x-3 ${
                pathname === '/dashboard' 
                  ? 'bg-slate-100 text-slate-900' 
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home size={20} className="text-slate-500" />
              <span className="text-sm font-medium">Dashboard Home</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}