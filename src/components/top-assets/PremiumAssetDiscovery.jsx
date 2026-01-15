'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import { TrendingUp, Shield, Activity, AlertTriangle } from 'lucide-react';

// Historical asset behavior patterns (educational simulation data)
const ASSET_PATTERNS = {
  equity: {
    name: 'Equity',
    avgReturn: 12,
    volatility: 18,
    maxDrawdown: -40,
    inflationBeat: 8,
    recoveryYears: 4,
    color: '#3b82f6'
  },
  debt: {
    name: 'Debt',
    avgReturn: 7,
    volatility: 5,
    maxDrawdown: -8,
    inflationBeat: 2,
    recoveryYears: 1,
    color: '#10b981'
  },
  gold: {
    name: 'Gold',
    avgReturn: 9,
    volatility: 12,
    maxDrawdown: -25,
    inflationBeat: 4,
    recoveryYears: 3,
    color: '#f59e0b'
  },
  balanced: {
    name: 'Balanced Mix',
    avgReturn: 10,
    volatility: 10,
    maxDrawdown: -20,
    inflationBeat: 5,
    recoveryYears: 2,
    color: '#8b5cf6'
  }
};

function calculateAssetScores(formData) {
  const inflationRate = parseFloat(formData.inflationRate) || 6;
  const retirementYears = (parseFloat(formData.lifespan) || 85) - (parseFloat(formData.retirementAge) || 60);
  
  // Inflation Shield Score: How well assets historically beat inflation
  const inflationShieldScore = Math.round(
    ((ASSET_PATTERNS.equity.inflationBeat / inflationRate) * 40 +
    (ASSET_PATTERNS.balanced.inflationBeat / inflationRate) * 30 +
    (ASSET_PATTERNS.gold.inflationBeat / inflationRate) * 20 +
    (ASSET_PATTERNS.debt.inflationBeat / inflationRate) * 10) / 100 * 100
  );
  
  // Drawdown Risk Score: Severity of historical crashes
  const avgDrawdown = (
    Math.abs(ASSET_PATTERNS.equity.maxDrawdown) * 0.4 +
    Math.abs(ASSET_PATTERNS.balanced.maxDrawdown) * 0.3 +
    Math.abs(ASSET_PATTERNS.gold.maxDrawdown) * 0.2 +
    Math.abs(ASSET_PATTERNS.debt.maxDrawdown) * 0.1
  );
  const drawdownRiskScore = Math.max(0, Math.min(100, 100 - avgDrawdown * 2));
  
  // Consistency Score: Lower volatility = higher consistency
  const avgVolatility = (
    ASSET_PATTERNS.equity.volatility * 0.4 +
    ASSET_PATTERNS.balanced.volatility * 0.3 +
    ASSET_PATTERNS.gold.volatility * 0.2 +
    ASSET_PATTERNS.debt.volatility * 0.1
  );
  const consistencyScore = Math.max(0, Math.min(100, 100 - avgVolatility * 4));
  
  return {
    inflationShieldScore: Math.round(inflationShieldScore),
    drawdownRiskScore: Math.round(drawdownRiskScore),
    consistencyScore: Math.round(consistencyScore),
    retirementYears
  };
}

function generateGrowthVsInflationData(formData) {
  const years = 25; // Typical retirement period
  const inflationRate = parseFloat(formData.inflationRate) || 6;
  const data = [];
  
  for (let year = 0; year <= years; year++) {
    const inflationImpact = Math.pow(1 + inflationRate / 100, year) * 100;
    
    data.push({
      year,
      inflation: Math.round(inflationImpact),
      equity: Math.round(Math.pow(1 + ASSET_PATTERNS.equity.avgReturn / 100, year) * 100),
      balanced: Math.round(Math.pow(1 + ASSET_PATTERNS.balanced.avgReturn / 100, year) * 100),
      gold: Math.round(Math.pow(1 + ASSET_PATTERNS.gold.avgReturn / 100, year) * 100),
      debt: Math.round(Math.pow(1 + ASSET_PATTERNS.debt.avgReturn / 100, year) * 100)
    });
  }
  
  return data;
}

function generateDrawdownPatternData() {
  return [
    { category: 'Equity', maxDrawdown: Math.abs(ASSET_PATTERNS.equity.maxDrawdown), recoveryYears: ASSET_PATTERNS.equity.recoveryYears },
    { category: 'Balanced Mix', maxDrawdown: Math.abs(ASSET_PATTERNS.balanced.maxDrawdown), recoveryYears: ASSET_PATTERNS.balanced.recoveryYears },
    { category: 'Gold', maxDrawdown: Math.abs(ASSET_PATTERNS.gold.maxDrawdown), recoveryYears: ASSET_PATTERNS.gold.recoveryYears },
    { category: 'Debt', maxDrawdown: Math.abs(ASSET_PATTERNS.debt.maxDrawdown), recoveryYears: ASSET_PATTERNS.debt.recoveryYears }
  ];
}

function getScoreColor(score) {
  if (score >= 75) return 'text-green-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}

function getScoreBgColor(score) {
  if (score >= 75) return 'bg-green-50';
  if (score >= 50) return 'bg-amber-50';
  return 'bg-red-50';
}

export default function PremiumAssetDiscovery({ formData }) {
  const scores = useMemo(() => calculateAssetScores(formData), [formData]);
  const growthData = useMemo(() => generateGrowthVsInflationData(formData), [formData]);
  const drawdownData = useMemo(() => generateDrawdownPatternData(), []);
  
  const inflationRate = parseFloat(formData.inflationRate) || 6;
  const monthlyExpenses = parseFloat(formData.monthlyExpenses) || 50000;
  const retirementYears = scores.retirementYears;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
          <Activity className="text-indigo-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Premium Asset Fit Discovery</h2>
          <p className="text-gray-600 text-sm mt-1">
            Historical behavior patterns across retirement time horizons • Educational only
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Inflation Shield Score */}
        <div className={`p-6 rounded-xl border-2 ${getScoreBgColor(scores.inflationShieldScore)} border-gray-200`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <Shield className="text-indigo-600" size={20} />
            </div>
            <h3 className="font-semibold text-gray-900">Inflation Shield Score</h3>
          </div>
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(scores.inflationShieldScore)}`}>
            {scores.inflationShieldScore}
          </div>
          <p className="text-sm text-gray-600">
            Historical ability to beat {inflationRate}% inflation over time
          </p>
        </div>

        {/* Drawdown Risk Score */}
        <div className={`p-6 rounded-xl border-2 ${getScoreBgColor(scores.drawdownRiskScore)} border-gray-200`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <AlertTriangle className="text-amber-600" size={20} />
            </div>
            <h3 className="font-semibold text-gray-900">Drawdown Risk Score</h3>
          </div>
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(scores.drawdownRiskScore)}`}>
            {scores.drawdownRiskScore}
          </div>
          <p className="text-sm text-gray-600">
            Historical crash severity patterns during market downturns
          </p>
        </div>

        {/* Consistency Score */}
        <div className={`p-6 rounded-xl border-2 ${getScoreBgColor(scores.consistencyScore)} border-gray-200`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <h3 className="font-semibold text-gray-900">Consistency Score</h3>
          </div>
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(scores.consistencyScore)}`}>
            {scores.consistencyScore}
          </div>
          <p className="text-sm text-gray-600">
            Historical stability vs volatility patterns over time
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-8">
        {/* Chart 1: Growth vs Inflation */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Growth vs Inflation Comparison</h3>
          <p className="text-sm text-gray-600 mb-6">
            Historical patterns showing how different asset categories performed relative to inflation over {retirementYears}-year retirement horizons
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="year" 
                  label={{ value: 'Years in Retirement', position: 'insideBottom', offset: -5 }}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  label={{ value: 'Indexed Value (Year 0 = 100)', angle: -90, position: 'insideLeft' }}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="inflation" stroke="#ef4444" strokeWidth={2} name="Inflation Impact" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="equity" stroke={ASSET_PATTERNS.equity.color} strokeWidth={2} name="Equity Pattern" />
                <Line type="monotone" dataKey="balanced" stroke={ASSET_PATTERNS.balanced.color} strokeWidth={2} name="Balanced Pattern" />
                <Line type="monotone" dataKey="gold" stroke={ASSET_PATTERNS.gold.color} strokeWidth={2} name="Gold Pattern" />
                <Line type="monotone" dataKey="debt" stroke={ASSET_PATTERNS.debt.color} strokeWidth={2} name="Debt Pattern" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Drawdown Patterns */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Drawdown Pattern Comparison</h3>
          <p className="text-sm text-gray-600 mb-6">
            Historical maximum decline severity and typical recovery periods for different asset categories
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={drawdownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="category"
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  label={{ value: 'Maximum Historical Drawdown (%)', angle: -90, position: 'insideLeft' }}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value, name) => {
                    if (name === 'maxDrawdown') return [`${value}%`, 'Max Drawdown'];
                    if (name === 'recoveryYears') return [`${value} years`, 'Avg Recovery'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar dataKey="maxDrawdown" fill="#ef4444" name="Max Drawdown %" />
                <Bar dataKey="recoveryYears" fill="#3b82f6" name="Recovery Years" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Personalized Interpretation */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-xl">💡</span>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-blue-900">Personalized Context (Based on Your Inputs)</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>
                <strong>Your retirement horizon:</strong> {retirementYears} years from retirement to age {formData.lifespan}. 
                Historical patterns suggest longer time horizons may absorb volatility differently than shorter ones.
              </p>
              <p>
                <strong>Your inflation assumption:</strong> {inflationRate}%. 
                If inflation stays elevated, asset categories with stronger historical inflation-beating patterns may be worth understanding, 
                though stability alone may not always protect purchasing power over decades.
              </p>
              <p>
                <strong>Your monthly expenses:</strong> {formatCurrency(monthlyExpenses)}. 
                Large historical drawdowns matter more if retirement withdrawals need to start during a market decline. 
                Understanding sequence-of-returns risk patterns can inform retirement planning conversations.
              </p>
              <p className="pt-2 border-t border-blue-300">
                <strong>Educational Note:</strong> These patterns are historical simulations, not predictions or recommendations. 
                Actual future behavior may differ. Use this analysis to understand trade-offs and inform discussions with your SEBI-registered financial advisor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-100 rounded-lg p-4 text-xs text-gray-600">
        <p className="font-medium text-gray-900 mb-2">⚠️ Educational Disclosure</p>
        <p>
          This module is educational and does not provide investment recommendations. All data represents historical patterns 
          for educational purposes only. Past performance does not guarantee future results. Different asset categories may 
          behave differently in various economic conditions. No asset class or investment is being recommended or endorsed. 
          Consult with a SEBI-registered investment advisor before making any investment decisions.
        </p>
      </div>
    </div>
  );
}
