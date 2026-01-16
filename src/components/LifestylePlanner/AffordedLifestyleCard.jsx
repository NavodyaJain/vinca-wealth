"use client";

import { formatCurrency } from "@/lib/lifestylePlanner";

const TIER_CONTENT = {
  Basic: {
    emoji: "📊",
    subtitle: "Same as current",
    description: "Essentials-focused retirement lifestyle with minimal discretionary spending."
  },
  Comfortable: {
    emoji: "✨",
    subtitle: "1.3x current expenses",
    description: "Balanced lifestyle including occasional travel, hobbies, and comfort upgrades."
  },
  Premium: {
    emoji: "🌟",
    subtitle: "1.7x current expenses",
    description: "High flexibility lifestyle with upgrades, experiences, and a stronger buffer."
  }
};

export default function AffordedLifestyleCard({ tier, supportedMonthlyIncomeAtRetirement, supportedMonthlyIncomeToday }) {
  const content = TIER_CONTENT[tier] || TIER_CONTENT.Comfortable;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden>{content.emoji}</span>
        <div>
          <div className="text-lg font-semibold text-slate-900">{tier}</div>
          <div className="text-sm text-slate-500">{content.subtitle}</div>
        </div>
      </div>

      <p className="text-sm text-slate-600 mt-4">{content.description}</p>

    </div>
  );
}
