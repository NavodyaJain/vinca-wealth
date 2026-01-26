// RecommendedChallenges.jsx
import React from 'react';

export default function RecommendedChallenges({ recommended, onView }) {
  if (!recommended || recommended.length === 0) {
    return (
      <div className="mb-6 text-slate-500 text-sm bg-slate-50 rounded-2xl p-4 border border-gray-100">
        Run Financial Readiness to get recommendations.
      </div>
    );
  }
  return (
    <div className="mb-6">
      <div className="font-semibold text-slate-900 mb-2">Recommended for you</div>
      <div className="flex flex-col gap-2">
        {recommended.map(challenge => (
          <div key={challenge.id} className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-2">
            <div className="flex-1">
              <div className="font-bold text-emerald-700">{challenge.title}</div>
              <div className="text-xs text-slate-600">{challenge.descriptionShort}</div>
            </div>
            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-4 py-2 text-sm transition"
              onClick={() => onView(challenge)}
            >View details</button>
          </div>
        ))}
      </div>
    </div>
  );
}
