"use client";

import { Check } from "lucide-react";

export default function LifestyleTierCards({ selectedTier, onSelectTier, currentMonthlyExpenses }) {
  const tiers = [
    {
      id: 'basic',
      label: 'Basic',
      multiplier: 1.0,
      description: 'Essentials-focused retirement lifestyle with minimal discretionary spending.',
      color: 'border-slate-300 hover:border-slate-400',
      selectedColor: 'border-indigo-500 ring-2 ring-indigo-200',
      icon: '📊'
    },
    {
      id: 'comfortable',
      label: 'Comfortable',
      multiplier: 1.3,
      description: 'Balanced lifestyle including occasional travel, hobbies, and comfort upgrades.',
      color: 'border-blue-300 hover:border-blue-400',
      selectedColor: 'border-blue-500 ring-2 ring-blue-200',
      icon: '✨'
    },
    {
      id: 'premium',
      label: 'Premium',
      multiplier: 1.7,
      description: 'High flexibility lifestyle with higher healthcare buffer and more experiences.',
      color: 'border-emerald-300 hover:border-emerald-400',
      selectedColor: 'border-emerald-500 ring-2 ring-emerald-200',
      icon: '🌟'
    },
    // custom tier removed — use Basic / Comfortable / Premium only
  ];

  const calculateIncome = (tier) => {
    return Math.round(currentMonthlyExpenses * tier.multiplier);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const isSelected = selectedTier === tier.id;
          const income = calculateIncome(tier);

          return (
            <button
              key={tier.id}
              onClick={() => onSelectTier(tier.id)}
              className={`bg-white rounded-xl border p-5 text-left transition-all duration-200 h-full flex flex-col justify-between ${
                isSelected ? tier.selectedColor : tier.color
              } hover:shadow-md`}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{tier.icon}</span>
                  <h3 className="font-semibold text-slate-900 text-lg">{tier.label}</h3>
                </div>
                {tier.multiplier && (
                  <p className="text-sm text-slate-600 mb-3">
                    {tier.multiplier === 1.0 ? 'Same as current' : `${tier.multiplier}x current expenses`}
                  </p>
                )}

                <p className="text-sm text-slate-600">{tier.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="text-sm text-slate-500">Monthly retirement income</div>
                <div className="text-xl font-semibold text-slate-900">
                  ₹{income.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-500 mt-1">in today's value</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* custom input removed — keep UI simple with three preset tiers */}
    </div>
  );
}