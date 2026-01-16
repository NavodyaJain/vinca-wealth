import { Activity, Stethoscope, HeartPulse } from 'lucide-react';

const cards = [
  {
    id: 'everyday',
    label: 'Common',
    title: 'Everyday Health Costs',
    description: 'Recurring OPD, medicines, diagnostics that rise every year.',
    icon: Activity,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 'planned',
    label: 'Likely',
    title: 'Planned Procedures',
    description: 'Predictable surgery or scheduled treatment during retirement.',
    icon: Stethoscope,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  {
    id: 'highImpact',
    label: 'High Risk',
    title: 'Major Hospitalization',
    description: 'Worst-case event with heavy cost + long recovery impact.',
    icon: HeartPulse,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600'
  }
];

export default function PremiumHealthCategoryPreview({ selectedScenario = 'everyday', onSelectScenario, isPremium }) {
  void onSelectScenario;
  if (isPremium) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Choose a health stress category to analyze</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(({ id, label, title, description, icon: Icon, iconBg, iconColor }) => {
          const isSelected = selectedScenario === id;
          return (
            <div
              key={id}
              className={`relative p-6 rounded-xl border-2 transition-all duration-200 pointer-events-none cursor-not-allowed select-none opacity-80 ${
                isSelected ? 'border-blue-500 bg-blue-50/60' : 'border-gray-200 bg-white'
              }`}
            >
              <div className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${
                id === 'everyday' ? 'bg-green-100 text-green-800' : id === 'planned' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
              }`}>
                {label}
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                  <Icon className={iconColor} size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{description}</p>
              <div
                className={`mt-4 text-center py-2 px-4 rounded-lg font-medium ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {isSelected ? 'Selected' : 'Locked'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-purple-200 bg-linear-to-br from-slate-50 via-purple-50 to-white p-6 shadow-sm">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-3">Premium Analysis Preview</div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Unlock personalized projections for this scenario</h3>
        <p className="text-sm text-slate-600 max-w-2xl">
          We will model medical costs, corpus impact, and survival age for your retirement plan based on the scenario you choose. Upgrade to Pro to
          interact with these scenarios and view the detailed analysis.
        </p>
      </div>
    </div>
  );
}
