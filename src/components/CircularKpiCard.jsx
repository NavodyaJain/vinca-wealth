import React from "react";


// Pure UI component: receives all data via props, no local logic
export default function CircularKpiCard({ percent, label, subtext, colorFrom = "#22C55E", colorTo = "#A7F3D0", active = true }) {
  const pct = isNaN(Number(percent)) ? 0 : Math.max(0, Math.min(100, Number(percent)));
  const radius = 38;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = (pct / 100) * circumference;
  // No logic here except for rendering the circular progress
  return (
    <div className="flex flex-col items-center justify-center min-w-28">
      <svg width={radius * 2} height={radius * 2}>
        <defs>
          <linearGradient id="kpi-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colorFrom} />
            <stop offset="100%" stopColor={colorTo} />
          </linearGradient>
        </defs>
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={stroke}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="url(#kpi-gradient)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={isNaN(progress) ? 0 : circumference - progress}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(.4,2,.3,1)' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="1.25rem"
          fontWeight="600"
          fill={active ? "#059669" : "#94A3B8"}
        >
          {Math.round(pct)}%
        </text>
      </svg>
      <div className="mt-2 text-[15px] font-semibold text-slate-900 text-center">{label}</div>
      {subtext && <div className="text-xs text-slate-500 text-center mt-1">{subtext}</div>}
    </div>
  );
}
