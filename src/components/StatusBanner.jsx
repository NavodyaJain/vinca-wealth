'use client';

import { formatCurrency } from '../lib/formatters';
import { calculateRetirementMetrics } from '../lib/retirementPlanner';
import { useMemo } from 'react';

export default function StatusBanner({ formData }) {
  if (!formData || Object.keys(formData).length === 0) {
    return null;
  }

  const metrics = useMemo(() => {
    try {
      return calculateRetirementMetrics(formData);
    } catch (error) {
      console.error('Calculation error:', error);
      return {
        financialReadinessAge: null,
        expectedCorpus: 0,
        requiredCorpus: 0,
        depletionAge: null,
        currentSIP: 0,
        requiredSIP: 0,
        sipGap: 0,
        isSustainable: false
      };
    }
  }, [formData]);

  const {
    financialReadinessAge,
    expectedCorpus,
    requiredCorpus,
    depletionAge,
    currentSIP,
    requiredSIP,
    sipGap,
    isSustainable
  } = metrics;

  const corpusGap = requiredCorpus - expectedCorpus;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-8">
      {/* Top Section: 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Financial Readiness Age Card */}
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-2">Financial Readiness Age</div>
          <div className="text-2xl font-bold text-slate-900">
            {financialReadinessAge ? `${financialReadinessAge}` : '—'}
          </div>
          <div className="text-xs text-slate-600 mt-1">
            {financialReadinessAge 
              ? `Earliest sustainable retirement age`
              : 'Not achieved under current plan'}
          </div>
        </div>

        {/* Expected Corpus Card */}
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-2">Expected Corpus</div>
          <div className="text-2xl font-bold text-slate-900">
            {expectedCorpus ? formatCurrency(expectedCorpus) : '—'}
          </div>
          <div className="text-xs text-slate-600 mt-1">
            At age {formData.retirementAge || 60}
          </div>
        </div>

        {/* Required Corpus Card */}
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-2">Required Corpus</div>
          <div className="text-2xl font-bold text-slate-900">
            {requiredCorpus ? formatCurrency(requiredCorpus) : '—'}
          </div>
          <div className="text-xs text-slate-600 mt-1">
            To sustain till age {formData.lifespan || 85}
          </div>
        </div>
      </div>

      {/* Action Required Section */}
      {!isSustainable && (
        <div className="mt-6 p-5 rounded-xl border border-amber-200 bg-amber-50">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">⚠️</span>
            <h3 className="text-sm font-semibold text-amber-900">Action Required</h3>
          </div>

          {/* Subtitle */}
          <div className="mb-4">
            <p className="text-xs font-medium text-amber-900">SIP Adjustment Required</p>
          </div>

          {/* Depletion Age Row */}
          <div className="mb-4 p-3 bg-white/60 rounded-lg border border-amber-100">
            <p className="text-xs text-amber-800">
              Your corpus will deplete by age{' '}
              <span className="font-semibold">
                {depletionAge ? Math.round(depletionAge) : 'unknown'}
              </span>
              {!depletionAge && ' (Safe till lifespan)'}
            </p>
          </div>

          {/* Mini Cards: Current vs Required SIP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Current SIP */}
            <div className="rounded-lg bg-white p-4 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">Current Monthly SIP</span>
                <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                  Insufficient
                </span>
              </div>
              <div className="text-xl font-bold text-slate-900">
                {currentSIP ? formatCurrency(currentSIP) : '—'}
              </div>
            </div>

            {/* Required SIP */}
            <div className="rounded-lg bg-white p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">Required Monthly SIP</span>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  Secure
                </span>
              </div>
              <div className="text-xl font-bold text-slate-900">
                {requiredSIP ? formatCurrency(requiredSIP) : '—'}
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="p-3 bg-white/60 rounded-lg border border-amber-100">
            <p className="text-sm text-amber-900">
              Increase your SIP by{' '}
              <span className="font-bold">{sipGap ? formatCurrency(sipGap) : '—'}</span>
              {' '}/ month to make your Expected Corpus ≥ Required Corpus and ensure your plan is sustainable.
            </p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {isSustainable && (
        <div className="mt-6 p-5 rounded-xl border border-green-200 bg-green-50">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <p className="text-sm font-medium text-green-800">
              Your current plan is sustainable! Your expected corpus is sufficient to sustain till age {formData.lifespan || 85}.
            </p>
          </div>
        </div>
      )}

      {/* Compliance Footer */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          Educational estimate only. This is not investment advice. Actual returns may vary.
        </p>
      </div>
    </div>
  );
}