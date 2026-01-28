import React from "react";

/**
 * ChallengeSummaryCardRow
 * Compact, reusable summary row for all SIP challenges
 * Props:
 * - startDate: Date | string
 * - endDate: Date | string
 * - sipAmount: string | number
 * - status: "Completed" | "Current" | "In Progress"
 * - className?: string (optional)
 */
export default function ChallengeSummaryCardRow({ startDate, endDate, sipAmount, status, className = "" }) {
  // Format dates as "Jan 27, 2026"
  function fmt(d) {
    if (!d) return "-";
    const date = typeof d === "string" ? new Date(d) : d;
    const y = date.getFullYear().toString().slice(-2);
    return date.toLocaleString(undefined, { month: "short" }) + " " + date.getDate() + ", '" + y;
  }
  // Status badge
  const statusMap = {
    Completed: { color: "bg-emerald-600", label: "Completed" },
    "In Progress": { color: "bg-amber-500", label: "In Progress" },
    Current: { color: "bg-emerald-600", label: "Current" },
  };
  const stat = statusMap[status] || { color: "bg-slate-400", label: status };
  return (
    <div
      className={`flex flex-row gap-3 sm:gap-4 items-stretch w-full max-w-full mb-2 ${className}`}
      style={{ alignItems: "stretch" }}
    >
      {/* Start-End Date */}
      <div
        className="flex-1 min-w-0 max-w-[260px] bg-white border border-slate-200 rounded-lg px-[12px] py-[12px] flex flex-col justify-center"
        style={{ height: "56px" }}
      >
        <span className="text-[12px] text-slate-500 whitespace-nowrap font-normal leading-tight mb-1">Period</span>
        <span
          className="text-[16px] text-slate-900 font-medium whitespace-nowrap block"
          style={{ whiteSpace: "nowrap", minWidth: 0, overflow: "visible", textOverflow: "clip", letterSpacing: "0.01em" }}
        >
          {fmt(startDate)} → {fmt(endDate)}
        </span>
      </div>
      {/* SIP Amount */}
      <div
        className="flex-1 min-w-0 max-w-[260px] bg-white border border-slate-200 rounded-lg px-[12px] py-[12px] flex flex-col justify-center"
        style={{ height: "56px" }}
      >
        <span className="text-[12px] text-slate-500 whitespace-nowrap font-normal leading-tight mb-1">SIP Amount</span>
        <span
          className="text-[16px] text-slate-900 font-medium whitespace-nowrap block"
          style={{ whiteSpace: "nowrap", minWidth: 0, overflow: "visible", textOverflow: "clip", letterSpacing: "0.01em" }}
        >
          ₹{sipAmount}
        </span>
      </div>
      {/* Status */}
      <div
        className="flex-1 min-w-0 max-w-[260px] bg-white border border-slate-200 rounded-lg px-[12px] py-[12px] flex flex-col justify-center"
        style={{ height: "56px" }}
      >
        <span className="text-[12px] text-slate-500 whitespace-nowrap font-normal leading-tight mb-1">Status</span>
        <span className="flex items-center gap-2 text-[15px] font-medium whitespace-nowrap block">
          <span className={`inline-block w-2 h-2 rounded-full ${stat.color}`}></span>
          <span className="text-slate-900">{stat.label}</span>
        </span>
      </div>
    </div>
  );
}
