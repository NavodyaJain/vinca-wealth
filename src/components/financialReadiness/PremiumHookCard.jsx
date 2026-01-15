import React from 'react';

const PremiumHookCard = ({ isFeasible, isPremium = false, onUpgradeClick }) => {
  const tone = isPremium ? 'premium' : isFeasible ? 'feasible' : 'warning';

  const toneStyles = {
    premium: {
      container: 'bg-emerald-50 border-emerald-200',
      badge: 'bg-emerald-600 border-emerald-700 text-white',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white'
    },
    feasible: {
      container: 'bg-sky-50 border-sky-200',
      badge: 'bg-sky-100 border-sky-200 text-sky-800',
      button: 'bg-sky-600 hover:bg-sky-700 text-white'
    },
    warning: {
      container: 'bg-amber-50 border-amber-200',
      badge: 'bg-amber-100 border-amber-200 text-amber-800',
      button: 'bg-amber-600 hover:bg-amber-700 text-white'
    }
  };

  const message = isPremium
    ? 'Premium unlocked. Viewing your optimized/realistic retirement plan.'
    : isFeasible
    ? 'You can hit your target age. Unlock the optimized plan and early retirement age with an optimised monthly SIP (subscription required).'
    : 'Your target age is not feasible with current income. Unlock your realistic earliest retirement age with an optimised monthly SIP (subscription required).';

  const basePadding = isPremium ? 'px-5 py-4 md:px-6 md:py-5' : 'px-6 py-6 md:px-7 md:py-7';

  return (
    <div className={`border rounded-2xl shadow-sm ${basePadding} ${toneStyles[tone].container}`}>
      <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-semibold uppercase ${toneStyles[tone].badge}`}>
            Pro
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900">Premium insight</p>
            <p className="text-sm text-gray-700 leading-relaxed max-w-2xl">{message}</p>
          </div>
        </div>
        {isPremium ? (
          <div className="md:ml-auto w-full md:w-auto px-5 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-xl shadow-sm text-center">
            Premium unlocked
          </div>
        ) : (
          <button
            onClick={onUpgradeClick}
            className={`md:ml-auto w-full md:w-auto px-5 py-3 text-sm font-semibold rounded-xl shadow-sm transition-colors ${toneStyles[tone].button}`}
          >
            Upgrade to Pro
          </button>
        )}
      </div>
    </div>
  );
};

export default PremiumHookCard;
