'use client';

import { ChevronRight, Clock, AlertTriangle, Target } from 'lucide-react';

export default function ProductCard({ product, onDetailsClick }) {
  const categoryColors = {
    'Long-term Wealth': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Regular Income': 'bg-blue-50 text-blue-700 border-blue-200',
    'Tax Saving': 'bg-purple-50 text-purple-700 border-purple-200',
    'High Growth': 'bg-orange-50 text-orange-700 border-orange-200',
    'Capital Protection': 'bg-slate-50 text-slate-700 border-slate-200',
    'Global Exposure': 'bg-indigo-50 text-indigo-700 border-indigo-200'
  };

  const categoryColor = categoryColors[product.category] || categoryColors['Capital Protection'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col">
      {/* Category Pill */}
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${categoryColor}`}>
          {product.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 mb-2">{product.product_group}</h3>

      {/* Description - Single line max */}
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{product.description}</p>

      {/* Snapshot Row - Icons + Text */}
      <div className="space-y-3 mb-4 py-3 border-y border-slate-100">
        <div className="flex items-start gap-3">
          <Clock className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
          <span className="text-sm text-slate-700 font-medium">{product.time_horizon}</span>
        </div>
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
          <span className="text-sm text-slate-700 font-medium">{product.risk_level} Risk</span>
        </div>
        <div className="flex items-start gap-3">
          <Target className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
          <span className="text-sm text-slate-700 font-medium">{product.purpose}</span>
        </div>
      </div>

      {/* Return Hint - Muted text */}
      <p className="text-xs text-slate-500 mb-4">
        Typical long-term expectation: {product.return_hint}
      </p>

      {/* View Details Action */}
      <button
        onClick={() => onDetailsClick(product)}
        className="mt-auto flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition-colors group"
      >
        View details
        <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
