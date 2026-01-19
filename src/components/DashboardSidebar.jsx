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

export default function DashboardSidebar() {
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
    },
    {
      id: 'blind-spot',
      label: 'Blind Spot Analysis',
      path: '/dashboard/blind-spot',
      icon: <EyeOff size={20} />
    },
    {
      id: 'top-deals',
      label: 'Top Assets Analysis',
      path: '/dashboard/top-deals',
      icon: <BarChart3 size={20} />
    }
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

  const handleNavigation = (path) => {
    router.push(path);
    setIsMobileOpen(false);
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
          className="lg:hidden fixed inset-0 z-30 bg-black/40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72
          transform transition-transform duration-300 ease-in-out
          bg-white border-r border-slate-200 shadow-lg
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0 lg:shadow-none lg:flex lg:flex-col
        `}
        aria-hidden={!isMobileOpen && typeof window !== 'undefined' && window.innerWidth < 1024}
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
              {tools.map((tool) => renderNavItem(tool))}
            </nav>

            {/* CLUBS SECTION */}
            <div className="px-4 pt-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Clubs</h3>
            </div>
            <nav className="space-y-1 px-3 pt-2">
              {joinedClubs.length > 0 ? (
                <>
                  {joinedClubs.map((club) => (
                    <button
                      key={club.id}
                      onClick={() => handleNavigation(`/dashboard/community/${club.id}/dashboard`)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center space-x-3 ${
                        isActive(`/dashboard/community/${club.id}`) 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'text-slate-700 hover:bg-slate-50 hover:text-green-600'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${club.gradient} flex items-center justify-center`}>
                        <span className="text-base">{club.icon}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium truncate">{club.name}</div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300" />
                    </button>
                  ))}
                  <button
                    onClick={() => handleNavigation('/dashboard/profile')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors flex items-center gap-2"
                  >
                    <Compass size={14} />
                    <span>Explore more clubs</span>
                  </button>
                </>
              ) : (
                <div className="px-3 py-3 text-sm text-slate-500">
                  <p className="mb-2">No clubs joined yet</p>
                  <button
                    onClick={() => handleNavigation('/dashboard/profile')}
                    className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Users size={14} />
                    <span>Discover clubs in Profile</span>
                  </button>
                </div>
              )}
            </nav>

            {/* SUPPORT SECTION */}
            <div className="px-4 pt-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Support</h3>
            </div>
            <nav className="space-y-1 px-3 pt-2">
              {supportItems.map((item) => renderNavItem(item))}
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