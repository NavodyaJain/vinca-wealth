"use client";

import { TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { formatCurrency, getLifestyleFitStatus } from "@/lib/lifestylePlanner";

export default function LifestyleSummaryMetrics({
  desiredIncomeToday,
  desiredIncomeAtRetirement,
  supportedSafeIncome,
  supportedAggressiveIncome,
  lifestyleGap,
  fitStatus
}) {
  const metrics = [
    {
      label: "Desired Retirement Income (Today)",
      value: formatCurrency(desiredIncomeToday),
      subtext: "Monthly spending target in today's value",
      icon: TrendingUp,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Inflation-adjusted at Retirement",
      value: formatCurrency(desiredIncomeAtRetirement),
      subtext: "Same lifestyle accounting for inflation",
      icon: TrendingUp,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      label: "Supported Safe Income",
      value: formatCurrency(supportedSafeIncome),
      subtext: "Based on 4% safe withdrawal rate",
      icon: CheckCircle,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      label: "Supported Aggressive Income",
      value: formatCurrency(supportedAggressiveIncome),
      subtext: "Based on 5% withdrawal rate (higher risk)",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50"
    }
  ];

  const fitStatusInfo = getLifestyleFitStatus(
    desiredIncomeAtRetirement,
    supportedSafeIncome,
    supportedAggressiveIncome
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-5 w-5 ${metric.iconColor}`} />
                </div>
                <div className="text-sm text-slate-500 font-medium">{metric.label}</div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-slate-600">{metric.subtext}</div>
            </div>
          );
        })}
      </div>

      {/* Gap and Status Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Lifestyle Affordability Status
            </h3>
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-lg ${fitStatusInfo.bgColor}`}>
                <span className={`font-semibold ${fitStatusInfo.color}`}>
                  {fitStatusInfo.status}
                </span>
              </div>
              <div className="text-slate-600">
                {fitStatusInfo.status === 'Affordable' && "Your current plan can support your desired lifestyle safely."}
                {fitStatusInfo.status === 'Tight' && "Your plan might support it, but with higher withdrawal risk."}
                {fitStatusInfo.status === 'Not Sustainable' && "Your current plan cannot support this lifestyle."}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-slate-500 mb-1">Monthly Gap</div>
            <div className={`text-2xl font-bold ${
              lifestyleGap <= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {lifestyleGap <= 0 ? 'No Gap' : `₹${Math.abs(lifestyleGap).toLocaleString('en-IN')}`}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {lifestyleGap <= 0 ? 'Desired income is affordable' : 'Additional monthly income needed'}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <Info className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Note:</span> These projections assume historical market returns and may vary. The "safe" withdrawal rate (4%) is based on the Trinity Study for 30-year retirements.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}