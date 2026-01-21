"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Overview', href: '/dashboard/investor-hub/overview' },
  { label: 'Events', href: '/dashboard/investor-hub/events' },
  { label: 'Resources', href: '/dashboard/investor-hub/resources' },
  { label: 'Groups', href: '/dashboard/investor-hub/groups' },
];

export default function InvestorHubNav() {
  const pathname = usePathname();
  return (
    <nav className="w-full md:sticky md:top-6 md:z-30">
      {/* Mobile: horizontal scrollable tab bar, Desktop: vertical nav */}
      <ul
        className="flex flex-row md:flex-col gap-2 md:gap-0 overflow-x-auto md:overflow-visible no-scrollbar scrollbar-hide max-w-full bg-white rounded-t-2xl md:rounded-t-none border-b md:border-b-0 border-slate-200"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {navItems.map((item) => {
          let isActive = false;
          if (item.label === 'Overview') {
            isActive = pathname === '/dashboard/investor-hub/overview' || pathname === '/dashboard/investor-hub';
          } else {
            isActive = pathname?.startsWith(item.href);
          }
          return (
            <li key={item.href} className="min-w-[110px] md:w-full flex-shrink-0 md:flex-shrink md:min-w-0">
              <Link
                href={item.href}
                className={`block px-4 py-3 md:py-2 text-center rounded-xl md:rounded-l-xl md:rounded-r-none text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-green-50 md:bg-green-50 border-b-2 md:border-b-0 md:border-l-4 border-green-600 text-green-700'
                    : 'text-slate-700 hover:bg-slate-50'}
                `}
                tabIndex={0}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
}
