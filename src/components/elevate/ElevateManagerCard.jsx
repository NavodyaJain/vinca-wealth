// src/components/elevate/ElevateManagerCard.jsx
import { UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function ElevateManagerCard({ manager }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-3">
      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
        {manager.avatar ? (
          <img src={manager.avatar} alt={manager.name} className="w-full h-full object-cover" onError={e => (e.target.style.display = 'none')} />
        ) : (
          <UserCircle className="h-10 w-10 text-emerald-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-emerald-900 text-base truncate">{manager.name}</div>
        <div className="text-xs text-emerald-700 mb-1">Wealth Manager</div>
        <div className="text-xs text-gray-500 mb-1">{manager.experience} years experience</div>
        <div className="flex flex-wrap gap-1 mb-1">
          {manager.tags.map(tag => (
            <span key={tag} className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full border border-emerald-100">{tag}</span>
          ))}
        </div>
        <div className="flex gap-1 mt-1">
          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">Retirement Planning</span>
          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">Tax + Compliance</span>
          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">Healthcare Planning</span>
        </div>
      </div>
      <div className="flex-shrink-0">
        <Link href={`/dashboard/investor-hub/elevate/book?manager=${encodeURIComponent(manager.name)}`}>
          <button className="px-4 py-2 rounded bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition">Book session</button>
        </Link>
      </div>
    </div>
  );
}
