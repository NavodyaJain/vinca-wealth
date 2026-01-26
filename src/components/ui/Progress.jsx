// src/components/ui/Progress.jsx
// Simple progress bar for fintech UI

import React from "react";

export function Progress({ value = 0, max = 100, className = "" }) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`w-full h-3 bg-slate-100 rounded-full overflow-hidden ${className}`} role="progressbar" aria-valuenow={value} aria-valuemax={max} aria-valuemin={0}>
      <div
        className="h-full bg-emerald-500 transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
