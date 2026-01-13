"use client";

import { TrendingUp, Calendar, Target, ArrowRight, Info } from "lucide-react";
import { formatCurrency } from "@/lib/lifestylePlanner";

export default function LifestyleActionPlan({
  sipIncreaseNeeded,
  retirementAgeAdjustment,
  lifestyleReduction,
  desiredIncomeAtRetirement
}) {
  const actions = [
    {
      id: 'increase-sip',
      title: 'Increase Monthly SIP',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Boost your investment contributions to reach your desired lifestyle',
      details: sipIncreaseNeeded.requiredIncrease > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Additional monthly investment needed:</span>
            <span className="font-semibold text-blue-700">
              ₹{Math.round(sipIncreaseNeeded.requiredIncrease).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">New total monthly SIP:</span>
            <span className="font-semibold text-slate-900">
              ₹{Math.round(sipIncreaseNeeded.newMonthlySIP).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Percentage increase:</span>
            <span className="font-semibold text-slate-900">
              {Math.round(sipIncreaseNeeded.percentageIncrease)}%
            </span>
          </div>
        </div>
      ) : (
        <div className="text-emerald-600 font-medium">
          Your current SIP is sufficient to support this lifestyle.
        </div>
      )
    },
    {
      id: 'retire-later',
      title: 'Retire Later',
      icon: Calendar,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'Extend your working years to grow your retirement corpus',
      details: retirementAgeAdjustment.extraYears > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Additional working years needed:</span>
            <span className="font-semibold text-amber-700">
              {retirementAgeAdjustment.extraYears} years
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">New retirement age:</span>
            <span className="font-semibold text-slate-900">
              {retirementAgeAdjustment.newRetirementAge}
            </span>
          </div>
          <div className="text-sm text-slate-600 mt-2">
            Each extra year allows your investments more time to compound.
          </div>
        </div>
      ) : (
        <div className="text-emerald-600 font-medium">
          You can retire at your planned age with this lifestyle.
        </div>
      )
    },
    {
      id: 'adjust-lifestyle',
      title: 'Adjust Lifestyle Target',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Modify your retirement spending expectations to match your plan',
      details: lifestyleReduction.reductionNeeded > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Recommended reduction:</span>
            <span className="font-semibold text-purple-700">
              ₹{Math.round(lifestyleReduction.reductionNeeded).toLocaleString('en-IN')}/month
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Affordable lifestyle:</span>
            <span className="font-semibold text-slate-900">
              ₹{Math.round(lifestyleReduction.affordableIncome).toLocaleString('en-IN')}/month
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Percentage reduction:</span>
            <span className="font-semibold text-slate-900">
              {Math.round(lifestyleReduction.percentageReduction)}%
            </span>
          </div>
        </div>
      ) : (
        <div className="text-emerald-600 font-medium">
          Your desired lifestyle matches what your plan can support.
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Action Plan Options
        </h3>
        <p className="text-slate-600">
          Explore different paths to achieve your desired retirement lifestyle. Choose what works best for your situation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div key={action.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${action.bgColor}`}>
                  <Icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{action.title}</h4>
                  <p className="text-sm text-slate-600">{action.description}</p>
                </div>
              </div>
              
              <div className="mb-4">
                {action.details}
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Info className="h-4 w-4 text-slate-400" />
                  <span>
                    {action.id === 'increase-sip' && "Increasing SIP early has the most compounding impact."}
                    {action.id === 'retire-later' && "Each extra year of work adds both savings and compounding time."}
                    {action.id === 'adjust-lifestyle' && "Small adjustments to spending can make big differences over time."}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-100">
            <ArrowRight className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h4 className="font-medium text-slate-900 mb-2">Next Steps</h4>
            <p className="text-slate-600 text-sm">
              Review these options and consider what fits your priorities. You can combine approaches -
              for example, increasing your SIP slightly while also considering working a year longer.
              Remember that these are projections, not guarantees. Market conditions, inflation, and
              personal circumstances may vary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
