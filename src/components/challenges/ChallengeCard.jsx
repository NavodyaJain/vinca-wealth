// ChallengeCard.jsx
import React from 'react';

export default function ChallengeCard({ challenge, joined, onView, onContinue }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col w-full p-5 mb-4 transition hover:shadow-md">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-bold text-lg text-slate-900">{challenge.title}</span>
        <span className="ml-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded px-2 py-0.5">{challenge.cadence.charAt(0).toUpperCase() + challenge.cadence.slice(1)}</span>
        <span className="ml-2 bg-slate-100 text-slate-700 text-xs rounded px-2 py-0.5">{challenge.durationLabel}</span>
        <span className="ml-2 bg-slate-100 text-slate-700 text-xs rounded px-2 py-0.5">{challenge.effortLabel}</span>
      </div>
      <div className="text-slate-700 text-sm mb-2">{challenge.descriptionShort}</div>
      <div className="flex flex-wrap gap-1 mb-2">
        {challenge.bestForTags.map((tag, i) => (
          <span key={i} className="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-xs capitalize">{tag}</span>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        {!joined ? (
          <button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-3 py-2 text-sm transition"
            onClick={onView}
          >View details</button>
        ) : (
          <button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-3 py-2 text-sm transition"
            onClick={onContinue}
          >Continue</button>
        )}
      </div>
    </div>
  );
}
