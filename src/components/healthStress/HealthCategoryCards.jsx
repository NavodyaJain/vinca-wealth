import { Activity, Stethoscope, HeartPulse } from 'lucide-react';

const CARDS = [
  {
    id: 'everyday',
    label: 'Common',
    title: 'Everyday Health Costs',
    description: 'Recurring OPD, medicines, diagnostics rising each year.',
    icon: Activity,
    badgeClass: 'bg-green-100 text-green-800',
    iconWrap: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 'planned',
    label: 'Likely',
    title: 'Planned Procedures',
    description: 'Predictable surgery or scheduled treatment.',
    icon: Stethoscope,
    badgeClass: 'bg-amber-100 text-amber-800',
    iconWrap: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  {
    id: 'high-impact',
    label: 'High Risk',
    title: 'Major Hospitalization',
    description: 'Worst-case with heavy cost and long recovery.',
    icon: HeartPulse,
    badgeClass: 'bg-red-100 text-red-800',
    iconWrap: 'bg-red-100',
    iconColor: 'text-red-600'
  }
];

export default function HealthCategoryCards({ selectedId = 'everyday', onSelect, disabled = false }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {CARDS.map((card) => {
        const isSelected = selectedId === card.id;
        const Icon = card.icon;
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => !disabled && onSelect && onSelect(card.id)}
            className={`text-left p-5 rounded-xl border-2 transition-all duration-200 ${
              isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'
            } ${disabled ? 'cursor-not-allowed pointer-events-none opacity-70' : 'hover:border-blue-300'} shadow-sm`}
          >
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3 ${card.badgeClass}`}>{card.label}</div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${card.iconWrap}`}>
                <Icon className={card.iconColor} size={22} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
            </div>
            <p className="text-sm text-slate-600">{card.description}</p>
            <div
              className={`mt-4 inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${
                isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {isSelected ? 'Selected' : disabled ? 'Locked' : 'Select'}
            </div>
          </button>
        );
      })}
    </div>
  );
}
