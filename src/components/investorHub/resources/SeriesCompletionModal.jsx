// src/components/investorHub/resources/SeriesCompletionModal.jsx
'use client';
import React from 'react';

export default function SeriesCompletionModal({
  seriesTitle,
  onCheckMaturity,
  onContinue
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in scale-95">
        {/* Checkmark Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-emerald-50 to-teal-50 flex items-center justify-center border-2 border-emerald-200">
            <span className="text-4xl text-emerald-600">✓</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Congratulations!
        </h2>

        {/* Message */}
        <p className="text-slate-700 mb-6 leading-relaxed">
          You've completed <span className="font-semibold">{seriesTitle}</span>. This strengthens your financial awareness.
        </p>

        {/* Progress Summary */}
        <div className="bg-emerald-50 rounded-lg p-4 mb-6 border border-emerald-100">
          <p className="text-sm text-emerald-900 font-medium">
            ✓ Series completed
          </p>
          <p className="text-xs text-emerald-700 mt-1">
            Your maturity level has been updated
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onCheckMaturity}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Check your maturity
          </button>
          <button
            onClick={onContinue}
            className="w-full border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium py-2.5 px-6 rounded-lg transition-colors"
          >
            Continue exploring
          </button>
        </div>

        {/* Microcopy */}
        <p className="text-xs text-slate-500 mt-6">
          This reflects your learning progress, not financial advice.
        </p>
      </div>
    </div>
  );
}
