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
      <ul className="flex md:flex-col flex-row md:gap-2 gap-2 md:gap-0">
        {navItems.map((item) => {
          // For Overview, match exactly or if pathname is /dashboard/investor-hub
          let isActive = false;
          if (item.label === 'Overview') {
            isActive = pathname === '/dashboard/investor-hub/overview' || pathname === '/dashboard/investor-hub';
          } else {
            isActive = pathname?.startsWith(item.href);
          }
          return (
            <li key={item.href} className="w-full">
              <Link
                href={item.href}
                className={`block px-4 py-2 rounded-xl md:rounded-l-xl md:rounded-r-none text-sm font-medium transition-all
                  ${isActive ? 'bg-green-50 border-l-4 border-green-200 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
