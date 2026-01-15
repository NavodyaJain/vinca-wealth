// src/components/financialReadiness/FireCalculatorPremiumUI.jsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

const FireCalculatorPremiumUI = ({ fireResults, results, onResetPro }) => {
  const [selectedRatio, setSelectedRatio] = useState(0);
  const [showEmergencyNote, setShowEmergencyNote] = useState(false);

  const inputs = results?.inputs || {};
  const retirementAge = Number(results?.retirementAge ?? inputs.retirementAge ?? 60);
  const lifespan = Number(results?.lifespan ?? inputs.lifespan ?? 85);
  const currentMonthlySIP = Number(fireResults?.currentMonthlySIP ?? results?.currentMonthlySIP ?? inputs.monthlySIP ?? 0);
  const monthlyIncome = Number(fireResults?.monthlyIncome ?? results?.monthlyIncome ?? inputs.monthlyIncome ?? 0);
  const monthlyExpenses = Number(fireResults?.monthlyExpenses ?? results?.monthlyExpenses ?? inputs.monthlyExpenses ?? 0);

  const premiumDefaultRatio = useMemo(() => {
    if (typeof fireResults?.premiumLeverPct === 'number') return fireResults.premiumLeverPct;
    if (fireResults?.premiumScenario?.ratio !== undefined) return fireResults.premiumScenario.ratio;
    if (fireResults?.baselineScenario?.ratio !== undefined) return fireResults.baselineScenario.ratio;
    return 0;
  }, [fireResults]);

  useEffect(() => {
    setSelectedRatio(premiumDefaultRatio);
  }, [premiumDefaultRatio]);

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '₹0';
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${Math.round(value / 1000)}K`;
    return `₹${Math.round(value)}`;
  };

  const formatAge = (age) => {
    return age ? `${age.toFixed(1)}` : '--';
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  const scenarioByPercent = useMemo(() => {
    const map = new Map();
    (fireResults?.scenarios || []).forEach((s) => {
      const key = Math.round(s.pct ?? s.ratio * 100);
      map.set(key, s);
    });
    return map;
  }, [fireResults]);

  const selectedPercent = Math.round(selectedRatio * 100);
  const selectedScenario = scenarioByPercent.get(selectedPercent)
    || fireResults?.premiumScenario
    || fireResults?.baselineScenario
    || {
      fireAge: retirementAge,
      newMonthlySIP: currentMonthlySIP,
      additionalSIP: 0,
      yearsEarlier: 0,
      projectedCorpusAtFireAge: results?.expectedCorpusAtRetirement || 0,
      requiredCorpusAtFireAge: results?.requiredCorpusAtRetirement || 0,
      corpusGap: (results?.expectedCorpusAtRetirement || 0) - (results?.requiredCorpusAtRetirement || 0),
      ratio: selectedRatio,
      pct: selectedPercent
    };

  const targetAge = retirementAge;
  const fireAge = Number(selectedScenario.fireAge ?? targetAge);
  const ageGap = fireAge - targetAge; // positive => later than target, negative => earlier

  const gapLabel = ageGap < 0 ? 'Years Earlier' : ageGap > 0 ? 'Waiting Years' : 'On Track';
  const gapValue = ageGap < 0 ? Math.abs(ageGap).toFixed(1) : ageGap > 0 ? ageGap.toFixed(1) : '0';
  const gapSubtitle = ageGap < 0
    ? `Compared to target ${targetAge} → ${fireAge.toFixed(1)}`
    : ageGap > 0
    ? `Target ${targetAge} is unrealistic → earliest realistic is ${fireAge.toFixed(1)}`
    : `You can retire at your target age ${targetAge}`;

  const gapBadgeClass = ageGap < 0
    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
    : ageGap > 0
    ? 'bg-amber-100 text-amber-800 border border-amber-200'
    : 'bg-blue-100 text-blue-800 border border-blue-200';

  const monthlyEmergencyLeft = Math.max(0, (fireResults?.monthlySurplus || 0) * (1 - selectedRatio));
  const allocationPercent = Math.round(selectedRatio * 100);
  const hasEmergencyBuffer = monthlyEmergencyLeft > 0;

  let bannerMessage = '';
  if (selectedRatio === 0) {
    bannerMessage = 'Retire smartly: increasing your SIP using surplus can reduce your retirement age.';
  } else if (selectedRatio === 1 && !hasEmergencyBuffer) {
    bannerMessage = `Why retire at ${fireAge.toFixed(1)} without a buffer, when 75% surplus still lets you retire early with an emergency cushion? Retire smartly.`;
  } else if (ageGap > 0) {
    bannerMessage = `Why retire at ${targetAge} which you can’t afford, when ${allocationPercent}% surplus lets you retire at ${fireAge.toFixed(1)}? Retire smartly.`;
  } else if (ageGap < 0) {
    bannerMessage = `Why retire at ${targetAge} when ${allocationPercent}% surplus lets you retire at ${fireAge.toFixed(1)}? Retire smartly.`;
  } else {
    bannerMessage = `You can retire at your target age ${targetAge}. Retire smartly.`;
  }

  // Prepare graph data with 0-100% allocations (5% step)
  const graphData = [];
  if (fireResults?.scenarios) {
    for (let percent = 0; percent <= 100; percent += 5) {
      const scenario = scenarioByPercent.get(percent);
      if (scenario) {
        graphData.push({
          percent,
          ratio: scenario.ratio,
          fireAge: scenario.fireAge || retirementAge,
          yearsEarlier: scenario.yearsEarlier,
          additionalSIP: scenario.additionalSIP,
          newMonthlySIP: scenario.newMonthlySIP,
          projectedCorpus: scenario.projectedCorpusAtFireAge || 0,
          requiredCorpus: scenario.requiredCorpusAtFireAge || 0,
          corpusGap: scenario.corpusGap || 0,
          isRecommended: Math.abs(scenario.ratio - (fireResults.premiumLeverPct ?? 0)) < 0.0001
        });
      }
    }
  }

  const getAllocationGradient = (ratio) => {
    const pct = ratio * 100;
    if (pct <= 25) return 'linear-gradient(90deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)'; // blue/cyan
    if (pct < 75) return 'linear-gradient(90deg, #dcfce7 0%, #a7f3d0 50%, #34d399 100%)'; // green
    return 'linear-gradient(90deg, #fed7aa 0%, #fb923c 50%, #f97316 75%, #ef4444 100%)'; // orange/red
  };

  if (!fireResults) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Calculating FIRE scenarios...</p>
      </div>
    );
  }

  const GraphTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-gray-900 mb-2">
            {data.percent}% of Monthly Surplus
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Additional SIP:</span>
              <span className="font-medium">{formatCurrency(data.additionalSIP)}/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total SIP:</span>
              <span className="font-medium">{formatCurrency(data.newMonthlySIP)}/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">FIRE Age:</span>
              <span className="font-medium">{data.fireAge ? `${data.fireAge} years` : '--'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Years Earlier:</span>
              <span className="font-medium">{data.yearsEarlier > 0 ? `${data.yearsEarlier.toFixed(1)} years` : '0 years'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Projected Corpus:</span>
              <span className="font-medium">{formatCurrency(data.projectedCorpus)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Required Corpus:</span>
              <span className="font-medium">{formatCurrency(data.requiredCorpus)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Corpus Gap:</span>
              <span className={`font-medium ${data.corpusGap >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(data.corpusGap))} {data.corpusGap >= 0 ? '(Surplus)' : '(Deficit)'}
              </span>
            </div>
            {data.isRecommended && (
              <p className="text-green-600 font-medium text-xs mt-2 border-t pt-2">
                ★ Recommended allocation
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const CorpusTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-semibold text-gray-900 mb-1 text-sm">{data.percent}% Allocation</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-blue-600">Projected:</span>
              <span className="font-medium">{formatCurrency(data.projectedCorpus)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-600">Required:</span>
              <span className="font-medium">{formatCurrency(data.requiredCorpus)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gap:</span>
              <span className={`font-medium ${data.corpusGap >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(data.corpusGap))} {data.corpusGap >= 0 ? 'surplus' : 'deficit'}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Surplus Breakdown at top */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Monthly Income Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white border border-gray-300 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Monthly Income</div>
            <div className="font-semibold text-gray-900">{formatCurrency(monthlyIncome)}</div>
          </div>
          <div className="text-center p-3 bg-white border border-gray-300 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Monthly Expenses</div>
            <div className="font-semibold text-gray-900">{formatCurrency(monthlyExpenses)}</div>
          </div>
          <div className="text-center p-3 bg-white border border-blue-300 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Current SIP</div>
            <div className="font-semibold text-gray-900">{formatCurrency(currentMonthlySIP)}</div>
          </div>
          <div className="text-center p-3 bg-white border border-green-300 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Monthly Surplus</div>
            <div className="font-semibold text-gray-900">{formatCurrency(fireResults.monthlySurplus)}</div>
          </div>
        </div>
      </div>

      {/* Interactive Allocation Selector */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Smart Surplus Lever</h3>
          {fireResults.requiredPctToMeetDesiredAge !== null ? (
            <p className="text-sm text-gray-700">
              Your desired age is achievable at {Math.round(fireResults.requiredPctToMeetDesiredAge * 100)}% of surplus. We picked {Math.round((fireResults.premiumLeverPct || 0) * 100)}% to unlock an earlier retirement age.
            </p>
          ) : fireResults.monthlySurplus <= 0 ? (
            <p className="text-sm text-gray-700">No monthly surplus available. Increase income or lower expenses to improve retirement age.</p>
          ) : (
            <p className="text-sm text-gray-700">Your target age is not feasible with current surplus. Using the maximum affordable SIP to find the earliest realistic age.</p>
          )}
        </div>

        {fireResults.monthlySurplus <= 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
            No monthly surplus available. Your earliest age here is based only on current SIP.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-full">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={selectedPercent}
                  onChange={(e) => setSelectedRatio(Number(e.target.value) / 100)}
                  className="w-full accent-emerald-600"
                  style={{
                    background: getAllocationGradient(selectedRatio),
                    height: '6px',
                    borderRadius: '9999px',
                    WebkitAppearance: 'none'
                  }}
                />
              </div>
              <div className="w-20 text-right text-sm font-semibold text-gray-900">{selectedPercent}%</div>
            </div>
            {fireResults.premiumLeverPct >= 1 && fireResults.safetyScenario && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-lg p-3">
                This is the earliest age possible with 100% surplus. To keep an emergency buffer, a {formatPercentage(fireResults.safetyScenario.ratio)} allocation still retires you at {formatAge(fireResults.safetyScenario.fireAge)}.
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Selected Allocation</div>
                <div className="text-xl font-semibold text-gray-900">{formatPercentage(selectedRatio)}</div>
                <div className="text-xs text-gray-500">of monthly surplus</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Additional SIP</div>
                <div className="text-xl font-semibold text-gray-900">{formatCurrency(selectedScenario.additionalSIP)}/month</div>
                <div className="text-xs text-gray-500">extra monthly investment</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total SIP</div>
                <div className="text-xl font-semibold text-gray-900">{formatCurrency(selectedScenario.newMonthlySIP)}/month</div>
                <div className="text-xs text-gray-500">including current SIP</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Monthly emergency fund left</div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xl font-semibold text-gray-900">{formatCurrency(monthlyEmergencyLeft)}/month</div>
                  {selectedRatio === 1 && (
                    <button
                      type="button"
                      onClick={() => setShowEmergencyNote((prev) => !prev)}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      aria-label="Reminder about keeping emergency fund"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 19a7 7 0 110-14 7 7 0 010 14z" />
                      </svg>
                    </button>
                  )}
                </div>
                {selectedRatio === 1 && showEmergencyNote && (
                  <div className="mt-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2">
                    Allocating 100% removes monthly buffer. Consider keeping some surplus aside.
                  </div>
                )}
                <div className="text-xs text-gray-500">after chosen allocation</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
          <div className="text-sm font-medium text-blue-800 mb-1">FIRE Age</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatAge(selectedScenario.fireAge)} years
          </div>
          <div className="text-xs text-gray-600">
            Earlier than your target of {retirementAge} years
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5">
          <div className="text-sm font-medium text-purple-800 mb-1">Projected Corpus at FIRE Age</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(selectedScenario.projectedCorpusAtFireAge)}
          </div>
          <div className="text-xs text-gray-600">
            Minimum corpus needed at age {formatAge(selectedScenario.fireAge)} to last till {lifespan}: {formatCurrency(selectedScenario.requiredCorpusAtFireAge)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="text-sm font-medium text-amber-800">{gapLabel}</div>
            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${gapBadgeClass}`}>
              {ageGap < 0 ? 'Ahead' : ageGap > 0 ? 'Later' : 'On track'}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{gapValue} years</div>
          <div className="text-xs text-gray-600">{gapSubtitle}</div>
        </div>
      </div>

      <div className="text-center text-sm font-semibold text-emerald-900 bg-gradient-to-r from-emerald-50 via-white to-blue-50 p-4 rounded-xl border border-emerald-200 shadow-sm">
        {bannerMessage}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-emerald-900">Solid corpus plan. Are you covered for health shocks?</h4>
            <p className="text-sm text-emerald-800">
              Unexpected medical events can derail early retirement. Run Vinca&apos;s Health Stress Test to see how your plan holds up against unpredictable healthcare costs.
            </p>
          </div>
          <Link
            href="/dashboard/health-stress"
            className="inline-flex items-center justify-center px-4 py-3 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-sm hover:bg-emerald-700"
          >
            Go to Health Stress Test
          </Link>
        </div>
      </div>

      {/* Reset Pro Link */}
      <div className="text-center pt-6 border-t border-gray-200">
        <button
          onClick={onResetPro}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Reset Pro (for testing)
        </button>
      </div>
    </div>
  );
};

export default FireCalculatorPremiumUI;