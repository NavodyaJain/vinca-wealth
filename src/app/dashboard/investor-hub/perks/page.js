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
  // Filter perks by tab
  const filteredPerks =
    tab === 'all' ? mockPerks : mockPerks.filter((p) => p.type === tab);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-lg md:text-2xl font-bold text-emerald-900">Perks</div>
        </div>
        <div className="w-full overflow-x-auto mb-6">
          <div className="flex w-max gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${tab === t.key ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-emerald-800 hover:bg-emerald-200'}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full space-y-4 mt-6">
          {filteredPerks.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No perks found.</div>
          ) : (
            filteredPerks.map((perk) => (
              <div key={perk.id} className="w-full bg-white rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col md:flex-row gap-4 border border-slate-200">
                <img src={perk.banner} alt={perk.title} className="w-full md:w-56 h-40 md:h-auto object-cover rounded-xl md:rounded-none md:rounded-l-xl" />
                <div className="flex-1 flex flex-col p-4 gap-2">
                  <div className="font-semibold text-lg text-emerald-800">{perk.title}</div>
                  <div className="text-gray-700 text-sm mb-2">{perk.desc}</div>
                  <div className="text-xs text-gray-500 mb-1">{perk.validity}</div>
                  <button
                    className={`px-4 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-xs ${redeemed.includes(perk.id) ? 'bg-emerald-100 border-emerald-400' : ''}`}
                    onClick={() => handleRedeem(perk.id)}
                    disabled={redeemed.includes(perk.id)}
                  >
                    {redeemed.includes(perk.id) ? 'Redeemed ' : 'Redeem'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
