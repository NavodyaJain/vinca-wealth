import { useMemo } from 'react';
import { usePremium } from '@/lib/premium';

const formatCurrency = (value) => {
  if (value === undefined || value === null || Number.isNaN(value)) return '—';
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
};

export default function PremiumOptimizationInsight({ formData, results, onUpgrade }) {
  const { isPremium } = usePremium();

  const { caseType, subtitle, bullets, title } = useMemo(() => {
    const monthlyIncome = Number(formData?.monthlyIncome) || 0;
    const monthlyExpenses = Number(formData?.monthlyExpenses) || 0;
    const currentSIP = Number(results?.currentMonthlySIP) || 0;
    const requiredSIP = Number(results?.requiredMonthlySIP);
    const retirementAge = formData?.retirementAge || results?.retirementAge || 60;
    const lifespan = formData?.lifespan || results?.lifespan || 85;

    const monthlySurplus = monthlyIncome - monthlyExpenses - currentSIP;
    const emergencyReserve = Math.max(0, monthlyExpenses * 0.2);
    const investableSurplus = Math.max(0, monthlySurplus - emergencyReserve);
    const sipIncreaseRequired = Math.max(0, (Number.isFinite(requiredSIP) ? requiredSIP : 0) - currentSIP);

    const canAfford = (Number.isFinite(requiredSIP) && (requiredSIP <= currentSIP || sipIncreaseRequired <= investableSurplus)) && investableSurplus > 0;
    const case1 = canAfford || requiredSIP <= currentSIP;

    if (!Number.isFinite(requiredSIP)) {
      return {
        caseType: 'unknown',
        title: 'Get a premium plan to optimize your retirement',
        subtitle: 'We will validate your inputs, compute surplus, and size the right SIP for you.',
        bullets: [
          'Realistic surplus-based SIP sizing',
          'Earliest achievable FIRE age and safety check'
        ]
      };
    }

    if (case1) {
      return {
        caseType: 'case1',
        title: 'You can retire at your desired age ✅',
        subtitle: `Your plan can reach the required corpus by age ${Math.round(retirementAge)} using your available investable surplus.`,
        bullets: [
          'We optimize your SIP using your real surplus (not unrealistic jumps)',
          'We calculate the earliest achievable FIRE age with safety till lifespan'
        ]
      };
    }

    return {
      caseType: 'case2',
      title: 'Your desired retirement age may not be realistic yet ⚠️',
      subtitle: `To retire by ${Math.round(retirementAge)}, the SIP needed is higher than what your monthly surplus allows.`,
      bullets: [
        'Find the earliest achievable FIRE age without over-stretching your budget',
        'See exactly how much SIP increase is realistic and safe'
      ]
    };
  }, [formData, results]);

  if (isPremium) {
    return (
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <span>🔓 Pro Unlocked</span>
            <span className="text-emerald-600">FIRE Calculator is available below.</span>
          </div>
          <p className="text-slate-700 text-sm">Scroll to the FIRE Calculator to view your optimized scenarios.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">🔒</div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-700">{subtitle}</p>
            </div>
            <button
              onClick={onUpgrade}
              className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
            >
              Upgrade to Pro
            </button>
          </div>
          <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
