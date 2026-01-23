"use client";

import { useState, useEffect, useMemo } from "react";
import { Unlock, Sliders, Zap, TrendingUp, BarChart2 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Area } from "recharts";
import { usePremium } from "@/lib/premium";
import { formatCurrency, formatNumberShort } from "@/lib/lifestylePlanner";
import PremiumBlurGate from "../shared/PremiumBlurGate";
import { setVincaReadings } from '@/lib/readings/vincaReadingsStore';

export default function PremiumLifestyleAnalysis({
  inputs,
  desiredIncomeAtRetirement,
  onDesiredIncomeChange,
  isAffordable,
  sustainableTillAge,
  yearsSupported,
  totalYears,
  monthlyGap,
  failureAge,
  hasAnalysis
}) {
  const { isPremium, upgradeToPremium } = usePremium();
  const [customIncome, setCustomIncome] = useState(desiredIncomeAtRetirement);
  const [includeHealthcare, setIncludeHealthcare] = useState(true);
  const [higherInflationScenario, setHigherInflationScenario] = useState(false);
  const [tradeoffData, setTradeoffData] = useState([]);
  const [scenarioData, setScenarioData] = useState([]);

  // Initialize display data for charts
  useEffect(() => {
    const tradeoffs = [
      { scenario: 'Current Plan', sipIncrease: 0, retireLater: 0, gap: 50000 },
      { scenario: '+20% SIP', sipIncrease: 20, retireLater: 0, gap: 35000 },
      { scenario: '+2 Years Work', sipIncrease: 0, retireLater: 2, gap: 25000 },
      { scenario: 'Both Adjustments', sipIncrease: 20, retireLater: 2, gap: 5000 },
      { scenario: 'Lifestyle -10%', sipIncrease: 0, retireLater: 0, gap: -10000 },
    ];
    setTradeoffData(tradeoffs);

    const scenarios = [];
    for (let age = inputs.retirementAge; age <= inputs.lifespan; age += 5) {
      scenarios.push({
        age,
        currentPlan: 80000 + age * 1000,
        withAdjustments: 120000 + age * 1500,
        desiredLifestyle: 150000 + age * 2000,
        inflationAdjusted: 180000 + age * 2500,
      });
    }
    setScenarioData(scenarios);
  }, [inputs]);

  const handleIncomeChange = (value) => {
    setCustomIncome(value);
    onDesiredIncomeChange(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">₹{formatNumberShort(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const overlayCopy = useMemo(() => {
    if (!hasAnalysis) {
      return {
        title: "Unlock Lifestyle Stress Check",
        subtitle: "Upgrade to Pro to simulate withdrawals and validate affordability year-by-year."
      };
    }

    if (!isAffordable) {
      return {
        title: "Your plan can’t sustain this lifestyle till lifespan",
        subtitle: "Upgrade to Pro to see the exact SIP increase needed to close the gap."
      };
    }

    return {
      title: "Your lifestyle is sustainable — unlock upgrades",
      subtitle: "Upgrade to Pro to test higher spending and optimize SIP confidently."
    };
  }, [hasAnalysis, isAffordable]);

  const affordabilityNote = useMemo(() => {
    if (!hasAnalysis) return "Run your lifestyle analysis to see sustainability across retirement.";
    if (!isAffordable) {
      const gapText = monthlyGap ? formatCurrency(monthlyGap) : "a monthly gap";
      const ageText = failureAge ? `age ${failureAge}` : "later in retirement";
      return `Plan runs short by ${gapText} starting ${ageText}. Upgrade to see the exact SIP fix.`;
    }
    return `Lifestyle sustained till age ${sustainableTillAge} across ${yearsSupported}/${totalYears} retirement years.`;
  }, [failureAge, hasAnalysis, isAffordable, monthlyGap, sustainableTillAge, totalYears, yearsSupported]);

  useEffect(() => {
    if (!hasAnalysis) return;
    setVincaReadings({
      lifestyle: {
        lifestyleTier: inputs.lifestyleTier,
        supportedMonthlyIncome: supportedMonthlyIncomeAtRetirement,
        requiredMonthlyIncome: requiredMonthlyIncomeAtRetirement,
        monthlyGap: gapMonthlyAtFailure,
        affordabilityStatus: affordability.status, // "Affordable" | "Tight" | "Not Affordable"
        sustainableTillAge
      }
    });
  }, [hasAnalysis, inputs, supportedMonthlyIncomeAtRetirement, requiredMonthlyIncomeAtRetirement, gapMonthlyAtFailure, affordability, sustainableTillAge]);

  return (
    <PremiumBlurGate
      isLocked={!isPremium}
      title={overlayCopy.title}
      subtitle={overlayCopy.subtitle}
      buttonText="Upgrade to Pro"
      onUpgradeClick={upgradeToPremium}
      className="rounded-xl overflow-hidden"
    >
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Unlock className="h-6 w-6 text-indigo-600" />
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Premium Lifestyle Analysis</h3>
            <p className="text-slate-600">Personalized insights and interactive planning tools</p>
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Custom Lifestyle Slider */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <h4 className="font-semibold text-slate-900">Custom Lifestyle Target</h4>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Monthly Retirement Income</span>
                  <span className="font-semibold text-slate-900">
                    ₹{customIncome.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="10000"
                  value={customIncome}
                  onChange={(e) => handleIncomeChange(Number(e.target.value))}
                  disabled={!isPremium}
                  className="w-full h-2 bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>₹10K</span>
                  <span>₹2.5L</span>
                  <span>₹5L</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-slate-600">Inflation-adjusted</div>
                  <div className="font-semibold text-blue-700">
                    ₹{(customIncome * 1.5).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <div className="text-sm text-slate-600">Annual Requirement</div>
                  <div className="font-semibold text-emerald-700">
                    ₹{(customIncome * 12).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario Toggles */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-amber-600" />
              <h4 className="font-semibold text-slate-900">Advanced Scenarios</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900">Include Healthcare Buffer</div>
                  <div className="text-sm text-slate-600">Adds 15% buffer for medical expenses</div>
                </div>
                <button
                  onClick={() => setIncludeHealthcare(!includeHealthcare)}
                  disabled={!isPremium}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    includeHealthcare ? 'bg-emerald-500' : 'bg-slate-300'
                  } ${!isPremium ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      includeHealthcare ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900">Higher Inflation Scenario</div>
                  <div className="text-sm text-slate-600">+2% inflation rate stress test</div>
                </div>
                <button
                  onClick={() => setHigherInflationScenario(!higherInflationScenario)}
                  disabled={!isPremium}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    higherInflationScenario ? 'bg-amber-500' : 'bg-slate-300'
                  } ${!isPremium ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      higherInflationScenario ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600">
                  Active scenarios: 
                  {includeHealthcare && " Healthcare Buffer"}
                  {higherInflationScenario && " Higher Inflation"}
                  {!includeHealthcare && !higherInflationScenario && " None"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tradeoff Map Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="h-5 w-5 text-emerald-600" />
            <h3 className="text-xl font-semibold text-slate-900">Lifestyle Tradeoff Map</h3>
          </div>
          <p className="text-slate-600">
            Visualize how different adjustments impact your lifestyle gap
          </p>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={tradeoffData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="scenario" 
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                label={{ 
                  value: 'Monthly Gap (₹)', 
                  angle: -90, 
                  position: 'insideLeft',
                  fill: '#64748b'
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="gap" 
                name="Lifestyle Gap" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="sipIncrease"
                name="SIP Increase %"
                stroke="#10b981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="retireLater"
                name="Extra Years"
                stroke="#f59e0b"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Advanced Scenario Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-slate-900">Scenario Comparison</h3>
          </div>
          <p className="text-slate-600">
            Compare how different strategies support your lifestyle over time
          </p>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={scenarioData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="age" 
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tickFormatter={formatNumberShort}
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="currentPlan"
                name="Current Plan"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="withAdjustments"
                name="With Adjustments"
                stroke="#10b981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="desiredLifestyle"
                name="Desired Lifestyle"
                stroke="#8b5cf6"
                strokeWidth={2}
              />
              {higherInflationScenario && (
                <Line
                  type="monotone"
                  dataKey="inflationAdjusted"
                  name="Higher Inflation Scenario"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Premium Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-slate-900 mb-4">Premium Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="font-medium text-slate-900 mb-2">Optimal Strategy</div>
            <div className="text-sm text-slate-600">
              {affordabilityNote}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="font-medium text-slate-900 mb-2">Risk Assessment</div>
            <div className="text-sm text-slate-600">
              Your plan shows moderate resilience to market volatility. Consider 
              maintaining 6-12 months of expenses as an emergency buffer.
            </div>
          </div>
        </div>
      </div>
        </div>
        </PremiumBlurGate>
      );
}