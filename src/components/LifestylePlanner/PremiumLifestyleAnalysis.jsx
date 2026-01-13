"use client";

import { useState, useEffect } from "react";
import { Lock, Unlock, Sliders, Zap, TrendingUp, BarChart2 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Area } from "recharts";
import { usePremium } from "@/lib/premium";
import { formatCurrency, formatNumberShort } from "@/lib/lifestylePlanner";

export default function PremiumLifestyleAnalysis({
  inputs,
  desiredIncomeAtRetirement,
  onDesiredIncomeChange
}) {
  const { isPremium, upgradeToPremium } = usePremium();
  const [customIncome, setCustomIncome] = useState(desiredIncomeAtRetirement);
  const [includeHealthcare, setIncludeHealthcare] = useState(true);
  const [higherInflationScenario, setHigherInflationScenario] = useState(false);
  const [tradeoffData, setTradeoffData] = useState([]);
  const [scenarioData, setScenarioData] = useState([]);

  // Initialize premium data
  useEffect(() => {
    if (isPremium) {
      // Generate tradeoff data
      const tradeoffs = [
        { scenario: 'Current Plan', sipIncrease: 0, retireLater: 0, gap: 50000 },
        { scenario: '+20% SIP', sipIncrease: 20, retireLater: 0, gap: 35000 },
        { scenario: '+2 Years Work', sipIncrease: 0, retireLater: 2, gap: 25000 },
        { scenario: 'Both Adjustments', sipIncrease: 20, retireLater: 2, gap: 5000 },
        { scenario: 'Lifestyle -10%', sipIncrease: 0, retireLater: 0, gap: -10000 },
      ];
      setTradeoffData(tradeoffs);

      // Generate scenario timeline data
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
    }
  }, [isPremium, inputs]);

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

  if (!isPremium) {
    return (
      <div className="relative">
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Lock className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">
              Premium Lifestyle Analysis
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Unlock personalized lifestyle affordability analysis with deeper projections, 
              action mapping, and stress-tested income ranges.
            </p>
          </div>

          {/* Blurred Preview */}
          <div className="relative overflow-hidden rounded-lg">
            <div className="blur-sm select-none">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sliders className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-slate-900">Interactive Lifestyle Slider</h4>
                </div>
                <div className="h-2 bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 rounded-full"></div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-slate-600">₹50K</span>
                  <span className="text-sm text-slate-600">₹5L</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-amber-600" />
                    <span className="font-medium">Advanced Scenarios</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded-full"></div>
                    <div className="h-3 bg-slate-200 rounded-full w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded-full w-1/2"></div>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart2 className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium">Tradeoff Analysis</span>
                  </div>
                  <div className="h-32 bg-gradient-to-b from-slate-100 to-slate-200 rounded"></div>
                </div>
              </div>

              <div className="h-48 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg"></div>
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent flex items-center justify-center">
              <button
                onClick={upgradeToPremium}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Upgrade to Premium - ₹499/year
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Includes: Custom lifestyle slider • Advanced scenario toggles • Tradeoff mapping • 
              Detailed action plan generator • Healthcare buffer analysis • Higher inflation scenarios
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Premium unlocked content
  return (
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
              <Sliders className="h-5 w-5 text-blue-600" />
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
                  className="w-full h-2 bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 rounded-lg appearance-none cursor-pointer"
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
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    includeHealthcare ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
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
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    higherInflationScenario ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
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
              Based on your inputs, increasing your SIP by 15-20% would be more effective 
              than working 1-2 years longer, given your current age.
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
  );
}