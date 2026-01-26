// ChallengeProgressBar.jsx
import React from 'react';

export default function ChallengeProgressBar({ value, max }) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-2 bg-emerald-500 rounded-full transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
