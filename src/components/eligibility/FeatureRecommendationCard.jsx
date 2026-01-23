// src/components/eligibility/FeatureRecommendationCard.jsx
import { useRouter } from 'next/navigation';

export default function FeatureRecommendationCard({ feature, value }) {
  const router = useRouter();
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 flex flex-col gap-2 items-start mb-4">
      <div className="font-bold text-slate-900 text-base">{feature.title}</div>
      {value && <div className="text-slate-700 text-sm">{value}</div>}
      <button
        className="mt-2 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
        onClick={() => router.push(feature.href)}
      >
        Go to {feature.title}
      </button>
    </div>
  );
}
