// src/components/eligibility/MembershipSupportCard.jsx
import { Calendar, BookOpen, Gift, FileText, UserCheck } from 'lucide-react';

const SUPPORT_ITEMS = [
  {
    icon: <Calendar className="h-5 w-5 text-emerald-500" />,
    label: 'Events',
    description: 'Live educational sessions & archived events',
  },
  {
    icon: <BookOpen className="h-5 w-5 text-emerald-500" />,
    label: 'Resources',
    description: 'Curated blogs + video series in modules (Udemy style)',
  },
  {
    icon: <Gift className="h-5 w-5 text-emerald-500" />,
    label: 'Perks',
    description: 'Partner discounts & redeemable coupons',
  },
  {
    icon: <UserCheck className="h-5 w-5 text-emerald-500" />,
    label: 'Elevate',
    description: '1:1 wealth manager session booking (education-only)',
  },
  {
    icon: <FileText className="h-5 w-5 text-emerald-500" />,
    label: 'Portfolio Review',
    description: 'Upload portfolio for structured review workflow',
  },
];

export default function MembershipSupportCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
      <div className="text-xl font-bold text-emerald-800 mb-4">How membership supports you</div>
      <ul className="space-y-4">
        {SUPPORT_ITEMS.map((item, i) => (
          <li key={i} className="flex items-center gap-4 text-gray-800 text-base">
            {item.icon}
            <div>
              <div className="font-semibold">{item.label}</div>
              <div className="text-sm text-slate-600">{item.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
