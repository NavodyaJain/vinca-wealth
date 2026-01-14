// src/components/financialReadiness/FireCalculatorPremiumUI.jsx
'use client';

import { useState, useEffect } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';

const FireCalculatorPremiumUI = ({ fireResults, formData, onResetPro }) => {
  const [selectedRatio, setSelectedRatio] = useState(0);

  useEffect(() => {
    if (fireResults?.recommended) {
      setSelectedRatio(fireResults.recommended.ratio);
    }
  }, [fireResults]);

  if (!fireResults) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Calculating FIRE scenarios...</p>
      </div>
    );
  }

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

  const selectedScenario = fireResults.scenarios.find(s => s.ratio === selectedRatio) || fireResults.baselineScenario;
  const financialReadinessAge = fireResults.financialReadinessAge;

  // Prepare graph data with 0-100% allocations
  const graphData = [];
  for (let percent = 0; percent <= 100; percent += 10) {
    const ratio = percent / 100;
    const scenario = fireResults.scenarios.find(s => Math.abs(s.ratio - ratio) < 0.01);
    if (scenario) {
      graphData.push({
        percent,
        ratio,
        fireAge: scenario.fireAge || financialReadinessAge,
        yearsEarlier: scenario.yearsEarlier,
        additionalSIP: scenario.additionalSIP,
        newMonthlySIP: scenario.newMonthlySIP,
        projectedCorpus: scenario.projectedCorpusAtFireAge || 0,
        requiredCorpus: scenario.requiredCorpusAtFireAge || 0,
        corpusGap: scenario.corpusGap || 0,
        isRecommended: scenario.ratio === fireResults.recommended.ratio
      });
    }
  }

  const GraphTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-gray-900 mb-2">
            {data.percent}% of Investable Surplus
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
      {/* Top Row - 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
          <div className="text-sm font-medium text-blue-800 mb-1">FIRE Age</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatAge(selectedScenario.fireAge)} years
          </div>
          <div className="text-xs text-gray-600">
            Earliest age to retire before {formData.retirementAge || 60}
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-5">
          <div className="text-sm font-medium text-emerald-800 mb-1">Recommended SIP Increase</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            +{formatCurrency(selectedScenario.additionalSIP)}/month
          </div>
          <div className="text-xs text-gray-600">
            New SIP: {formatCurrency(selectedScenario.newMonthlySIP)}/month
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5">
          <div className="text-sm font-medium text-purple-800 mb-1">Corpus at FIRE Age</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(selectedScenario.projectedCorpusAtFireAge)}
          </div>
          <div className="text-xs text-gray-600">
            Required: {formatCurrency(selectedScenario.requiredCorpusAtFireAge)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5">
          <div className="text-sm font-medium text-amber-800 mb-1">Years Earlier</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {selectedScenario.yearsEarlier > 0 ? `${selectedScenario.yearsEarlier.toFixed(1)}` : '0'} years
          </div>
          <div className="text-xs text-gray-600">
            Compared to {formData.retirementAge || 60} → {selectedScenario.fireAge || formData.retirementAge || 60}
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
        If your plan retires at {formData.retirementAge || 60}, FIRE means retiring at {selectedScenario.fireAge || formData.retirementAge || 60} with enough corpus to last till {formData.lifespan || 85}.
      </div>

      {/* Surplus Breakdown */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Surplus Breakdown (Realistic)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-3 bg-white border border-gray-300 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Monthly Income</div>
            <div className="font-semibold text-gray-900">{formatCurrency(fireResults.monthlyIncome)}</div>
          </div>
          <div className="text-center p-3 bg-white border border-gray-300 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Monthly Expenses</div>
            <div className="font-semibold text-gray-900">{formatCurrency(fireResults.monthlyExpenses)}</div>
          </div>
          <div className="text-center p-3 bg-white border border-blue-300 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Current SIP</div>
            <div className="font-semibold text-gray-900">{formatCurrency(fireResults.currentMonthlySIP)}</div>
          </div>
          <div className="text-center p-3 bg-white border border-green-300 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Monthly Surplus</div>
            <div className="font-semibold text-gray-900">{formatCurrency(fireResults.monthlySurplus)}</div>
          </div>
          <div className="text-center p-3 bg-white border border-yellow-300 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Emergency Reserve</div>
            <div className="font-semibold text-gray-900">{formatCurrency(fireResults.emergencyReserveMonthly)}</div>
          </div>
          <div className="text-center p-3 bg-white border border-purple-300 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Investable Surplus</div>
            <div className="font-semibold text-gray-900">{formatCurrency(fireResults.investableSurplus)}</div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Monthly surplus is calculated after subtracting expenses AND your current SIP. We keep {formatCurrency(fireResults.emergencyReserveMonthly)} (20% of expenses) as a safety buffer. The remaining {formatCurrency(fireResults.investableSurplus)} is available for additional SIP.
        </p>
      </div>

      {/* Interactive Allocation Selector */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Try Different Surplus Allocations</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <button
                key={ratio}
                onClick={() => setSelectedRatio(ratio)}
                disabled={fireResults.investableSurplus <= 0 && ratio > 0}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedRatio === ratio
                    ? 'bg-blue-600 text-white shadow-sm'
                    : fireResults.investableSurplus <= 0 && ratio > 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {formatPercentage(ratio)}
                {ratio === fireResults.recommended?.ratio && ' ★'}
              </button>
            ))}
            <button
              onClick={() => setSelectedRatio(fireResults.recommended?.ratio || 0)}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Reset to Recommended
            </button>
          </div>
          
          {fireResults.investableSurplus <= 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                Your investable surplus is currently ₹0 after expenses, SIP and emergency reserve. FIRE optimization is limited right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Selected Allocation</div>
                <div className="text-xl font-semibold text-gray-900">{formatPercentage(selectedRatio)}</div>
                <div className="text-xs text-gray-500">of investable surplus</div>
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
            </div>
          )}
        </div>
      </div>

      {/* Graph 1: FIRE Age Improvement */}
      <div className="border border-gray-200 rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Early Retirement Improvement by Using Investable Surplus
          </h3>
          <p className="text-gray-600">
            See how allocating 0%–100% of your investable surplus into SIP changes your FIRE age
          </p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={graphData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="percent" 
                label={{ value: '% of Investable Surplus Allocated to Additional SIP', position: 'insideBottom', offset: -10 }}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                yAxisId="left"
                label={{ value: 'FIRE Age (years)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                label={{ value: 'Years Earlier', angle: 90, position: 'insideRight' }}
              />
              <Tooltip content={<GraphTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="fireAge"
                name="FIRE Age"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="yearsEarlier"
                name="Years Earlier"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              {graphData.filter(d => d.isRecommended).map((point, index) => (
                <ReferenceLine
                  key={index}
                  x={point.percent}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graph 2: Corpus Analysis */}
      <div className="border border-gray-200 rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Corpus at FIRE Age vs Required Corpus
          </h3>
          <p className="text-gray-600">
            Shows whether your corpus is enough at the FIRE age for each surplus allocation scenario
          </p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={graphData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="percent" 
                label={{ value: '% of Investable Surplus Allocated', position: 'insideBottom', offset: -10 }}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                label={{ value: 'Corpus Amount', angle: -90, position: 'insideLeft' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CorpusTooltip />} />
              <Legend />
              <Bar
                dataKey="projectedCorpus"
                name="Projected Corpus at FIRE Age"
                fill="#3b82f6"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="requiredCorpus"
                name="Required Corpus at FIRE Age"
                fill="#10b981"
                radius={[2, 2, 0, 0]}
              />
              {graphData.filter(d => d.isRecommended).map((point, index) => (
                <ReferenceLine
                  key={index}
                  x={point.percent}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
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