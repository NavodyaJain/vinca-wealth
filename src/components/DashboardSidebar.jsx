'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Calculator,
  EyeOff,
  BarChart3,
  MessageCircle,
  User,
  Menu,
  X,
  ChevronRight,
  HeartPulse,
  TrendingUp
} from 'lucide-react';
import { usePremium } from '@/lib/premium';

export default function DashboardSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isPremium, upgradeToPremium } = usePremium();

  const features = [
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
      icon: <TrendingUp size={20} />,
      description: 'Plan your retirement lifestyle'
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
    },
    {
      id: 'talk-to-manager',
      label: 'Talk to Manager',
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

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-green-600 text-white rounded-lg"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 z-40
        h-screen
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 lg:w-72
      `}>
        <div className="h-full flex flex-col bg-white border-r border-slate-200">
          {/* Close button for mobile */}
          <div className="lg:hidden flex justify-end p-4 border-b border-slate-200">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-slate-200">
            <button
              onClick={() => handleNavigation('/dashboard/profile')}
              className={`w-full text-left px-3 py-3 rounded-lg transition-all flex items-center justify-between ${isActive('/dashboard/profile') ? 'bg-green-50 text-green-700 border border-green-200' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-slate-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Your Profile</div>
                  <div className="text-xs text-slate-500">View account details</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>

          {/* Features Section */}
          <div className="flex-1 py-4">
            <div className="px-4 mb-3">
              <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">TOOLS</h3>
            </div>
            <nav className="space-y-1 px-3">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => handleNavigation(feature.path)}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-all flex items-center space-x-3 ${isActive(feature.path) ? 'bg-green-50 text-green-700 border border-green-200' : 'text-slate-700 hover:bg-slate-50 hover:text-green-600'}`}
                >
                  <div className={isActive(feature.path) ? 'text-green-600' : 'text-slate-500'}>
                    {feature.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{feature.label}</div>
                    {feature.description && (
                      <div className="text-xs text-slate-500">{feature.description}</div>
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Dashboard Home Link */}
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={() => handleNavigation('/dashboard')}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center space-x-3 ${isActive('/dashboard') && !isActive('/dashboard/profile') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Home size={20} className="text-slate-500" />
              <span className="text-sm">Dashboard Home</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}