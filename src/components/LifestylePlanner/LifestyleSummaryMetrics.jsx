"use client";

import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/lifestylePlanner";

export default function LifestyleSummaryMetrics({
  requiredMonthlyIncomeAtRetirement,
  supportedMonthlyIncomeAtRetirement,
  retirementAge,
  lifespan,
  affordability,
  sustainableTillAge,
  yearsSupported,
  totalYears,
  gapMonthlyAtFailure,
  failureAge
}) {
  const StatusIcon = affordability.status === 'Maintained' ? CheckCircle : affordability.status === 'Tight' ? AlertTriangle : XCircle;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-sm text-slate-500 font-medium mb-2">Supported Monthly Income</div>
          <div className="text-3xl font-bold text-slate-900">{formatCurrency(supportedMonthlyIncomeAtRetirement)}</div>
          <div className="text-sm text-slate-600 mt-1">Based on corpus sustainability simulation.</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-sm text-slate-500 font-medium mb-2">Income Needed to Maintain Today’s Lifestyle</div>
          <div className="text-3xl font-bold text-slate-900">{formatCurrency(requiredMonthlyIncomeAtRetirement)}</div>
          <div className="text-sm text-slate-600 mt-1">Your current monthly expenses adjusted for inflation to retirement age.</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col items-center text-center gap-2">
          <div className={`text-lg font-semibold ${affordability.color}`}>{affordability.status}</div>
          <div className="text-sm text-slate-600">Purchasing power maintained till</div>
          <div className="text-3xl font-bold text-slate-900">Age {sustainableTillAge}</div>
        </div>
      </div>
    </div>
  );
}