"use client";
import { useState, useEffect } from 'react';

const TABS = [
  { key: 'all', label: 'All Perks' },
  { key: 'literature', label: 'Literature' },
];

const mockPerks = [
  {
    id: 1,
    title: '10% off Finance Books',
    desc: 'Get 10% off select finance books.',
    type: 'literature',
    validity: 'Valid till 31 Mar',
    banner: 'https://placehold.co/400x160?text=Finance+Books',
    category: 'Literature',
  },
  {
    id: 2,
    title: '₹200 off Tax Filing',
    desc: 'Flat ₹200 off on tax filing service.',
    type: 'all',
    validity: 'Valid till 30 Apr',
    banner: 'https://placehold.co/400x160?text=Tax+Filing',
    category: 'Tax',
  },
];

export default function PerksPage() {
  const [tab, setTab] = useState('all');
  const [redeemed, setRedeemed] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const val = window.localStorage.getItem('vinca_perks_redeemed');
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('vinca_perks_redeemed', JSON.stringify(redeemed));
    }
  }, [redeemed]);
  const handleRedeem = (id) => setRedeemed((prev) => prev.includes(id) ? prev : [...prev, id]);
  return (
    <div className="max-w-5xl md:max-w-6xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl font-bold text-emerald-800 mb-6">Perks</h1>
      <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors duration-150 whitespace-nowrap ${tab === t.key ? 'border-emerald-600 text-emerald-800 bg-emerald-50' : 'border-transparent text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockPerks.filter(p => tab === 'all' || p.type === tab).map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow flex flex-col md:flex-row overflow-hidden border">
            <img src={p.banner} alt={p.title} className="w-full md:w-40 h-32 object-cover rounded-t-xl md:rounded-t-none md:rounded-l-xl" />
            <div className="flex-1 flex flex-col p-4 gap-2">
              <div className="flex gap-2 items-center text-xs text-gray-500 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">{p.category}</span>
                <span>{p.validity}</span>
              </div>
              <div className="font-semibold text-lg text-emerald-800">{p.title}</div>
              <div className="text-gray-700 text-sm mb-2">{p.desc}</div>
              <button
                className={`mt-auto px-4 py-2 rounded bg-emerald-600 text-white font-semibold transition ${redeemed.includes(p.id) ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={redeemed.includes(p.id)}
                onClick={() => handleRedeem(p.id)}
              >
                {redeemed.includes(p.id) ? 'Redeemed ' : 'Redeem'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
