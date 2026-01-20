import React from 'react';

export default function TrackCard({ track, members, onExplore }) {
  return (
    <div className="rounded-2xl border border-green-200 bg-green-50 p-6 flex flex-col items-center gap-3 w-full max-w-md mx-auto shadow-sm">
      <div className="text-4xl mb-2">{track.icon}</div>
      <div className="text-xl font-bold text-green-800 mb-1">{track.name}</div>
      <div className="text-sm text-slate-700 mb-2 text-center">{track.description}</div>
      <div className="flex flex-wrap gap-2 mb-2">
        {track.priorities.map((p) => (
          <span key={p} className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-medium">{p}</span>
        ))}
      </div>
      <div className="text-xs text-slate-500 mb-2">{members} people like you</div>
      <button
        className="mt-2 w-full h-10 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors"
        onClick={onExplore}
      >
        Explore discussions in this track
      </button>
    </div>
  );
}
