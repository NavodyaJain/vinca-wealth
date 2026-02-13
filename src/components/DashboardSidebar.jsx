'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Wrench,
  BarChart3,
  Sparkles,
  HeartPulse,
  FileSearch,
  CalendarDays,
  BookOpen,
  Gift,
  BadgePercent,
  User,
  CheckCircle,
  FastForward,
  ChevronDown,
  Timer,
  Footprints,
  MessageSquare,
  Zap,
  Globe
} from 'lucide-react';
import { usePremium } from '@/lib/premium';
import { getJoinedClubIds } from '@/lib/userJourneyStorage';
import { CLUBS } from '@/lib/retirementPersonalityEngine';



export default function DashboardSidebar({ onNav }) {
  const pathname = usePathname();
  const router = useRouter();
  const [toolsAccordionOpen, setToolsAccordionOpen] = useState(false);

  const navItems = [
    {
      id: 'tools',
      label: 'Tools',
      icon: <Wrench className="h-5 w-5" />, // Lucide Wrench
      isAccordion: true,
      children: [
        {
          id: 'financial-readiness',
          label: 'Financial Readiness',
          path: '/dashboard/financial-readiness',
          icon: <BarChart3 className="h-4 w-4" />
        },
        {
          id: 'lifestyle-planner',
          label: 'Lifestyle Planner',
          path: '/dashboard/lifestyle-planner',
          icon: <Sparkles className="h-4 w-4" />
        },
        {
          id: 'health-stress',
          label: 'Health Stress Test',
          path: '/dashboard/health-stress',
          icon: <HeartPulse className="h-4 w-4" />
        },
        // Portfolio Review removed as requested
      ]
    },
    {
      id: 'challenges',
      label: 'Sprints',
      path: '/dashboard/challenges',
      icon: <Timer className="h-5 w-5" />
    },
    {
      id: 'templates',
      label: 'Footprints',
      path: '/dashboard/reflections',
      icon: <Footprints className="h-5 w-5" />
    },
    {
      id: 'perks',
      label: 'Curations',
      path: '/dashboard/investor-hub/perks',
      icon: <Gift className="h-5 w-5" />
    },
    {
      id: 'know-your-market',
      label: 'Know Your Market',
      path: '/dashboard/know-your-market',
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: 'resources',
      label: 'Learning',
      path: '/dashboard/investor-hub/resources',
          icon: <BookOpen className="h-5 w-5" />
        },
        {
          id: 'feedback-opinions',
          label: 'Reflections',
          path: '/dashboard/feedback-opinions',
          icon: <MessageSquare className="h-5 w-5" />
        },
    {
      id: 'pricing',
      label: 'Pricing',
      path: '/dashboard/investor-hub/pricing',
      icon: <BadgePercent className="h-5 w-5" />
    },
    {
      id: 'elevate',
      label: 'Elevate',
      path: '/dashboard/investor-hub/elevate',
      icon: <Zap className="h-5 w-5" />
    }
  ];

  const isActive = (path) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const handleNavigation = (path) => {
    router.push(path);
    if (onNav) onNav();
  };

  const renderNavItem = (item) => (
    <button
      key={item.id}
      onClick={() => handleNavigation(item.path)}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
        ${isActive(item.path) ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'}`}
      style={{ minHeight: 36 }}
    >
      <span className="flex items-center justify-center h-5 w-5">{item.icon}</span>
      <span className="flex-1 text-left">{item.label}</span>
    </button>
  );

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-slate-200 flex flex-col overflow-hidden">
      {/* Zone 1: Top Header */}
      <div className="flex-none px-4 py-5 flex items-center gap-2 border-b border-slate-100">
        <div className="h-9 w-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-semibold text-lg">V</div>
        <span className="text-lg font-bold text-slate-900">Vinca</span>
      </div>
      {/* Zone 2: Main Nav */}
      <nav className="flex-1 min-h-0 overflow-hidden flex flex-col gap-1 px-2 py-3">
        {navItems.map((item) =>
          item.isAccordion ? (
            <div key={item.id}>
              <button
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  toolsAccordionOpen ? 'bg-slate-100' : ''
                }`}
                onClick={() => setToolsAccordionOpen((open) => !open)}
                aria-expanded={toolsAccordionOpen}
              >
                <span className="flex items-center justify-center h-5 w-5">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${toolsAccordionOpen ? 'rotate-180' : ''}`} />
              </button>
              {toolsAccordionOpen && (
                <div className="flex flex-col gap-1 mt-1">
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => handleNavigation(child.path)}
                      className={`w-full flex items-center gap-2 pl-10 pr-3 py-2 rounded-lg text-[13px] font-normal transition-all
                        ${isActive(child.path) ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}
                      style={{ minHeight: 32 }}
                    >
                      <span className="flex items-center justify-center h-4 w-4">{child.icon}</span>
                      <span className="flex-1 text-left">{child.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            renderNavItem(item)
          )
        )}
      </nav>
      {/* Zone 3: Bottom Fixed Area */}
      <div className="flex-none mt-auto flex flex-col gap-2 px-2 pb-4 border-t border-slate-200 pt-3">
        <button
          onClick={() => handleNavigation('/dashboard/readiness-fit')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
        >
          <CheckCircle className="h-5 w-5" />
          <span className="flex-1 text-left">Readiness Fit</span>
        </button>
        <button
          onClick={() => handleNavigation('/dashboard/profile')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
            ${isActive('/dashboard/profile') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'}`}
        >
          <User className="h-5 w-5" />
          <span className="flex-1 text-left">Your Profile</span>
        </button>
      </div>
    </aside>
  );
}