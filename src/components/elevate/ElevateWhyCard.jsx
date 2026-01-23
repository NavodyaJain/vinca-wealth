// src/components/elevate/ElevateWhyCard.jsx
import { Map, TrendingUp, ShieldCheck, MessageCircle, BookOpen } from 'lucide-react';

const WHY_ITEMS = [
  { icon: <Map className="h-5 w-5 text-emerald-500" />, label: 'Personalized retirement roadmap' },
  { icon: <TrendingUp className="h-5 w-5 text-emerald-500" />, label: 'SIP + lifestyle alignment check' },
  { icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />, label: 'Risk awareness (health + inflation)' },
  { icon: <MessageCircle className="h-5 w-5 text-emerald-500" />, label: 'Q&A with an expert' },
  { icon: <BookOpen className="h-5 w-5 text-emerald-500" />, label: 'SEBI-safe educational guidance' },
];

export default function ElevateWhyCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
      <div className="text-xl font-bold text-emerald-800 mb-4">What you’ll get from Elevate</div>
      <ul className="space-y-4">
        {WHY_ITEMS.map((item, i) => (
          <li key={i} className="flex items-center gap-4 text-gray-800 text-base">
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
