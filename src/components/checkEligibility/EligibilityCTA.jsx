// src/components/checkEligibility/EligibilityCTA.jsx
import { useRouter } from 'next/navigation';

export default function EligibilityCTA({ fit }) {
  const router = useRouter();
  if (!fit || !fit.nextBestActionCTA) return null;
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 py-4 px-4 flex justify-center z-30 shadow-lg">
      <button
        className="px-8 py-3 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-colors shadow"
        onClick={() => router.push(fit.nextBestActionCTA.href)}
      >
        {fit.nextBestActionCTA.label}
      </button>
    </div>
  );
}
