
"use client";
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search } from 'lucide-react';

import investorHubPerks from '@/data/investorHubPerks';
import PerkCard from '@/components/investorHub/PerkCard';
import PerksCategoryTabs from '@/components/investorHub/PerksCategoryTabs';


export default function PerksPage() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [redeemed, setRedeemed] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const val = window.localStorage.getItem('vinca_perks_redeemed');
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('vinca_perks_redeemed', JSON.stringify(redeemed));
    }
  }, [redeemed]);

  // Search + filter logic
  const filteredPerks = useMemo(() => {
    let perks = investorHubPerks;
    if (category !== 'All') {
      perks = perks.filter((p) => p.category === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      perks = perks.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return perks;
  }, [category, search]);

  // Card click handler
  const handleCardClick = (perk) => {
    router.push(`/dashboard/investor-hub/perks/${perk.id}`);
  };

  return (
    <div className="w-full px-2 sm:px-4 lg:px-8 py-6 overflow-x-hidden">
      <div className="mx-auto w-full max-w-6xl">
        {/* Categories */}
        <div className="w-full overflow-x-auto no-scrollbar mb-2">
          <PerksCategoryTabs selected={category} onSelect={setCategory} />
        </div>
        {/* Perks Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {filteredPerks.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">No perks found. Try another keyword.</div>
          ) : (
            filteredPerks.map((perk) => (
              <PerkCard
                key={perk.id}
                perk={perk}
                onClick={() => handleCardClick(perk)}
                redeemed={redeemed.includes(perk.id)}
                grid
              />
            ))
          )}
        </div>
      </div>
      {/* Hide horizontal scrollbar for category tabs only */}
      <style jsx global>{`
        .no-scrollbar {
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
