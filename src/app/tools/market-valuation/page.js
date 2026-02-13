'use client';

import ValuationCard from '@/components/marketValuation/ValuationCard';
import marketValuation from '@/data/market-valuation.json';

export default function MarketValuationPage() {
  // Build asset array from valuation data
  const assets = [
    {
      name: 'Nifty 50',
      type: 'equity',
      current_pe: marketValuation.nifty_50.current_pe,
      historical_average_pe: marketValuation.nifty_50.historical_average_pe,
      current_zone: marketValuation.nifty_50.current_zone
    },
    {
      name: 'Sensex (BSE)',
      type: 'equity',
      current_pe: marketValuation.sensex.current_pe,
      historical_average_pe: marketValuation.sensex.historical_average_pe,
      current_zone: marketValuation.sensex.current_zone
    },
    {
      name: 'Gold',
      type: 'metal',
      historical_basis: marketValuation.gold.historical_basis,
      current_zone: marketValuation.gold.current_zone,
      current_price: marketValuation.gold.current_price,
      price_change_percent: marketValuation.gold.price_change_percent,
      price_change_direction: marketValuation.gold.price_change_direction
    },
    {
      name: 'Silver',
      type: 'metal',
      historical_basis: marketValuation.silver.historical_basis,
      current_zone: marketValuation.silver.current_zone,
      current_price: marketValuation.silver.current_price,
      price_change_percent: marketValuation.silver.price_change_percent,
      price_change_direction: marketValuation.silver.price_change_direction
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Market Valuation Overview
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Based on long-term historical valuation ranges. This helps you understand the market context, not timing.
          </p>
        </div>

        {/* Vertical Card Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {assets.map((asset) => (
            <ValuationCard key={asset.name} asset={asset} />
          ))}
        </div>

        {/* Main Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <p className="text-sm text-blue-900 leading-relaxed">
            <span className="font-semibold">Educational Awareness Only:</span> Valuations describe market context—what assets are priced at historically. They do not predict future returns, do not constitute investment advice, and should not drive investment decisions. Market timing is extremely difficult. This information is for understanding market context only.
          </p>
        </div>
      </div>
    </div>
  );
}
