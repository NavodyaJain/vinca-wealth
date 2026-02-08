/**
 * ComfortLevelScale Component
 * Numeric 1-5 scale for SIP comfort level reflection
 * Used in Sprint Progress screens
 */
export default function ComfortLevelScale({ value, onChange, disabled = false }) {
  const levels = [
    { level: 1, label: "Very uncomfortable", description: "SIP felt stressful or forced" },
    { level: 2, label: "Uncomfortable", description: "Struggled to stay consistent" },
    { level: 3, label: "Neutral", description: "SIP done but with some hesitation" },
    { level: 4, label: "Comfortable", description: "SIP felt manageable" },
    { level: 5, label: "Very comfortable", description: "SIP felt natural and disciplined" },
  ];

  return (
    <div className={`flex flex-col gap-3 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex gap-2 justify-center">
        {levels.map(({ level }) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            disabled={disabled}
            className={`w-12 h-12 rounded-full font-semibold text-sm transition ${
              value === level
                ? "bg-emerald-600 text-white border-2 border-emerald-600"
                : "bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-300"
            } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {level}
          </button>
        ))}
      </div>
      {value && (
        <div className="text-center text-sm text-slate-600">
          <div className="font-medium text-slate-700">{levels[value - 1].label}</div>
          <div className="text-xs text-slate-500 mt-1">{levels[value - 1].description}</div>
        </div>
      )}
    </div>
  );
}
