"use client";
import { useRouter, useParams } from 'next/navigation';
import investorHubPerks from '@/data/investorHubPerks';
import { ArrowLeft, BadgePercent } from 'lucide-react';

export default function PerkPreviewPage() {
  const router = useRouter();
  const { perkId } = useParams();
  const perk = investorHubPerks.find((p) => p.id === perkId);

  if (!perk) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <button className="mb-6 flex items-center gap-2 text-emerald-700 font-medium" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" /> Back to Perks
        </button>
        <div className="text-lg font-semibold text-red-600">Perk not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-6 flex items-center gap-2">
        <button className="flex items-center gap-2 text-emerald-700 font-medium" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" /> Back to Perks
        </button>
        <span className="ml-auto"><BadgePercent className="h-6 w-6 text-emerald-400" /></span>
      </div>
      <div className="flex flex-col md:flex-row gap-8 bg-white rounded-2xl border border-slate-200 shadow p-6">
        {/* Left: Image & Provider */}
        <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-1/3">
          <img src={perk.image} alt={perk.title} className="w-full max-w-[220px] rounded-xl border border-slate-100" />
          <div className="text-xs text-gray-500">Provider: <span className="font-semibold text-emerald-700">{perk.platform}</span></div>
          <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full border border-emerald-100">{perk.category}</span>
        </div>
        {/* Right: Details */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="font-bold text-2xl text-emerald-900 mb-1">{perk.title}</div>
          <div className="text-gray-700 text-base mb-2">{perk.description}</div>
          <div className="text-sm text-gray-600 mb-2">Validity: <span className="font-semibold text-emerald-700">{perk.validTill}</span></div>
          <div className="text-base font-semibold text-emerald-800 mt-2 mb-1">How to Use</div>
          <ul className="list-disc pl-6 text-sm text-emerald-900 mb-2">
            {perk.howToUse.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
          <div className="text-base font-semibold text-emerald-800 mt-2 mb-1">Terms & Conditions</div>
          <ul className="list-disc pl-6 text-xs text-gray-600 mb-2">
            {perk.terms.map((term, idx) => (
              <li key={idx}>{term}</li>
            ))}
          </ul>
          <div className="text-xs text-gray-400 mt-4">SEBI-safe disclaimer: This perk is for educational benefit only. No investment advice or product recommendation is provided.</div>
        </div>
      </div>
    </div>
  );
}
