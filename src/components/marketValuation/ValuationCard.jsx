'use client';

export default function ValuationCard({ asset }) {
  const getZoneLabel = (zone) => {
    if (zone === 'cheap') return 'Below Long-Term Average';
    if (zone === 'fair') return 'Near Historical Average';
    return 'Above Long-Term Average';
  };

  const getCurrentStateText = (zone) => {
    if (zone === 'cheap') return 'Currently trading below its long-term historical average';
    if (zone === 'fair') return 'Currently trading near its long-term historical average';
    return 'Currently trading above its long-term historical average';
  };

  const isPEAsset = asset.type === 'equity';
  const isMetalAsset = asset.type === 'metal';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col min-h-80 space-y-4">
      {/* Card Title */}
      <h3 className="text-lg font-semibold text-slate-900">{asset.name}</h3>

      {/* Current State Description */}
      <p className="text-sm text-slate-700 font-medium leading-snug">
        {getCurrentStateText(asset.current_zone)}
      </p>

      {/* Valuation Data - Always Visible */}
      {isPEAsset && (
        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
          <div>
            <p className="text-xs text-slate-600 font-medium mb-0.5">Current PE</p>
            <p className="text-2xl font-bold text-slate-900">{asset.current_pe}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 font-medium mb-0.5">Historical Average PE</p>
            <p className="text-sm text-slate-700 font-semibold">~{asset.historical_average_pe}</p>
          </div>
        </div>
      )}

      {isMetalAsset && (
        <div className="bg-slate-50 rounded-lg p-4 space-y-3">
          <div>
            <p className="text-xs text-slate-600 font-medium mb-0.5">Current Price</p>
            <p className="text-2xl font-bold text-slate-900">{asset.current_price}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">Change:</span>
            <span className={`text-sm font-semibold ${asset.price_change_direction === 'up' ? 'text-emerald-700' : 'text-red-700'}`}>
              {asset.price_change_direction === 'up' ? '▲' : '▼'} {Math.abs(asset.price_change_percent)}%
            </span>
          </div>
        </div>
      )}

      {/* Zone Visualization - All Zones Visible */}
      <div className="space-y-2 mt-auto">
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Valuation Range</p>
        <div className="flex gap-2">
          <div className={`flex-1 py-2 px-2 rounded-lg text-center text-xs font-semibold transition-all ${
            asset.current_zone === 'cheap'
              ? 'bg-green-600 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}>
            Below Average
          </div>
          <div className={`flex-1 py-2 px-2 rounded-lg text-center text-xs font-semibold transition-all ${
            asset.current_zone === 'fair'
              ? 'bg-green-600 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}>
            Near Average
          </div>
          <div className={`flex-1 py-2 px-2 rounded-lg text-center text-xs font-semibold transition-all ${
            asset.current_zone === 'expensive'
              ? 'bg-green-600 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}>
            Above Average
          </div>
        </div>
      </div>
    </div>
  );
}
