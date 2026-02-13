'use client';

export default function PEHeatBar({ currentZone, zones, label }) {
  const zonePercentages = {
    cheap: 20,
    fair: 40,
    expensive: 40
  };

  const zoneInfo = {
    cheap: { label: 'Cheap', color: 'bg-emerald-500' },
    fair: { label: 'Fair', color: 'bg-slate-400' },
    expensive: { label: 'Expensive', color: 'bg-amber-500' }
  };

  // Calculate dot position based on current zone
  const getDotPosition = () => {
    if (currentZone === 'cheap') return '10%';
    if (currentZone === 'fair') return '50%';
    return '85%';
  };

  return (
    <div className="space-y-4">
      {/* Label */}
      <div>
        <h3 className="font-semibold text-slate-900 text-base mb-1">{label}</h3>
      </div>

      {/* Segmented Bar */}
      <div className="relative">
        <div className="flex h-10 rounded-full overflow-hidden shadow-sm border border-slate-200">
          {/* Cheap zone */}
          <div className="w-1/5 bg-emerald-100 flex items-center justify-center">
            <span className="text-xs font-semibold text-emerald-700">Cheap</span>
          </div>
          {/* Fair zone */}
          <div className="w-2/5 bg-slate-100 flex items-center justify-center">
            <span className="text-xs font-semibold text-slate-700">Fair</span>
          </div>
          {/* Expensive zone */}
          <div className="w-2/5 bg-amber-100 flex items-center justify-center">
            <span className="text-xs font-semibold text-amber-700">Expensive</span>
          </div>
        </div>

        {/* Current Position Indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300"
          style={{ left: getDotPosition() }}
        >
          <div className="flex flex-col items-center gap-1">
            <div className="h-4 w-4 rounded-full bg-white border-2 border-slate-900 shadow-lg flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-slate-900" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Status Text */}
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-900">
          Current market appears:{' '}
          <span className={`
            ${currentZone === 'cheap' ? 'text-emerald-600' : ''}
            ${currentZone === 'fair' ? 'text-slate-600' : ''}
            ${currentZone === 'expensive' ? 'text-amber-600' : ''}
          `}>
            {currentZone === 'cheap' && 'Cheaply Valued'}
            {currentZone === 'fair' && 'Fairly Valued'}
            {currentZone === 'expensive' && 'Expensively Valued'}
          </span>
        </p>
      </div>
    </div>
  );
}
