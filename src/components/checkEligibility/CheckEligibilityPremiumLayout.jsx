// src/components/checkEligibility/CheckEligibilityPremiumLayout.jsx
import { EXISTING_FEATURES } from '@/lib/eligibility/existingFeatures';
import FitScoreCard from '@/components/eligibility/FitScoreCard';
import SignalCard from '@/components/eligibility/SignalCard';
import FeatureRecommendationCard from '@/components/eligibility/FeatureRecommendationCard';

export default function CheckEligibilityPremiumLayout({ fit, updatedAt }) {
  // Map feature ids to feature objects
  const getFeature = (id) => EXISTING_FEATURES.find(f => f.id === id);

  return (
    <div className="w-full min-h-screen bg-slate-50 pb-32">
      {/* Top Header Bar */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between bg-white border-b border-slate-200 px-6 py-6 mb-8 rounded-b-2xl shadow-sm">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-1">Membership Fit Analysis</h1>
          <p className="text-slate-700 text-base md:text-lg max-w-2xl">Personalized insights based on your latest retirement tool readings (educational only).</p>
        </div>
        <div className="shrink-0 mt-6 md:mt-0">
          <FitScoreCard score={fit.score} verdict={fit.verdict} updatedAt={updatedAt} />
        </div>
      </div>
      {/* Main Content 2-column */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* Left: Signals */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">Your current signals</h2>
          {fit.reasons && fit.reasons.length > 0 ? fit.reasons.map((r, i) => (
            <SignalCard key={i} title={r.title} description={r.description} evidence={r.evidence} />
          )) : (
            <div className="text-slate-500 mb-4">No specific signals detected yet. Complete more tools for deeper analysis.</div>
          )}
        </div>
        {/* Right: What Vinca can do next */}
        <div className="md:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">How Vinca can help next</h2>
          {fit.nextActionFeatureIds && fit.nextActionFeatureIds.length > 0 ? fit.nextActionFeatureIds.map((id) => {
            const feature = getFeature(id);
            if (!feature) return null;
            return <FeatureRecommendationCard key={id} feature={feature} value={null} />;
          }) : (
            <div className="text-slate-500">No next actions detected.</div>
          )}
        </div>
      </div>
      {/* Bottom: Recommended next steps */}
      <div className="max-w-6xl mx-auto mt-12 px-4">
        <h2 className="text-xl font-semibold mb-4 text-slate-900">Recommended next steps for you</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {fit.recommendedFeatureIds && fit.recommendedFeatureIds.length > 0 ? fit.recommendedFeatureIds.map((id) => {
            const feature = getFeature(id);
            if (!feature) return null;
            return <FeatureRecommendationCard key={id} feature={feature} value={null} />;
          }) : (
            <div className="col-span-3 text-slate-500">No recommendations yet. Complete more tools for personalized suggestions.</div>
          )}
        </div>
      </div>
    </div>
  );
}
