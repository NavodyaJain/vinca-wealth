// src/components/eligibility/MembershipSupportCard.jsx
import { Calendar, BookOpen, Gift, FileText, UserCheck, Zap } from 'lucide-react';

const SUPPORT_ITEMS = [
  {
    icon: <Zap className="h-5 w-5 text-emerald-500" />,
    label: 'Sprints',
    description: 'Structured execution journeys. Time-bound financial readiness sprints that help users take consistent action—monthly, quarterly, or yearly—without overwhelming decisions.',
  },
  {
    icon: <BookOpen className="h-5 w-5 text-emerald-500" />,
    label: 'Footprints',
    description: 'Real experiences from real journeys. Learn from how others navigated financial readiness—their challenges, discipline, and mindset—so users don\'t feel alone.',
  },
  {
    icon: <FileText className="h-5 w-5 text-emerald-500" />,
    label: 'Learning',
    description: 'Financial awareness before financial readiness. Short, focused videos that build clarity on money, risks, and long-term planning—designed to inform decisions, not push products.',
  },
  {
    icon: <Calendar className="h-5 w-5 text-emerald-500" />,
    label: 'Community & Events',
    description: 'Learn together, grow with confidence. Expert-led sessions and discussions focused on awareness, discipline, and long-term thinking.',
  },
  {
    icon: <UserCheck className="h-5 w-5 text-emerald-500" />,
    label: 'Curations',
    description: 'Tools that make the journey easier. Handpicked books, planners, and resources to support consistency and reflection.',
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
