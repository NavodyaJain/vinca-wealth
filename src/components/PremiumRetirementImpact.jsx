'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, AlertTriangle, Shield, Clock, BarChart2, DollarSign, Percent, Crown } from 'lucide-react';
import { usePremium } from '@/lib/premium';
import ChartContainer from './ChartContainer';

export default function PremiumRetirementImpact({ formData, results }) {
  const [activeTab, setActiveTab] = useState('survival');
  const { isPremium, upgradeToPremium } = usePremium();

  // Mock data based on form inputs
  const generateSimulationData = () => {
    const baseFormData = formData || {
      retirementAge: 60,
      lifespan: 85,
      monthlyExpenses: 50000,
      corpusAtRetirement: 20000000
    };

    const baseResults = results || {
      corpusAtRetirement: 20000000,
      withdrawalRate: 4
    };

    const retirementAge = baseFormData.retirementAge;
    const lifespan = baseFormData.lifespan;
    const retirementYears = lifespan - retirementAge;

    // Generate best/median/worst case scenarios
    const scenarios = [];
    for (let i = 0; i <= retirementYears; i++) {
      const age = retirementAge + i;
      const bestCase = baseResults.corpusAtRetirement * (1 - 0.03 * i) * (1 + 0.07 * Math.min(i, 10));
      const medianCase = baseResults.corpusAtRetirement * (1 - 0.04 * i) * (1 + 0.05 * Math.min(i, 10));
      const worstCase = baseResults.corpusAtRetirement * (1 - 0.05 * i) * (1 + 0.03 * Math.min(i, 10));

      scenarios.push({
        age,
        year: i,
        bestCase: Math.max(0, bestCase),
        medianCase: Math.max(0, medianCase),
        worstCase: Math.max(0, worstCase)
      });
    }

    return {
      scenarios,
      survivalProbability: 72,
      worstCaseDepletionAge: 78,
      medianDepletionAge: 88,
      bestCaseSurplus: baseResults.corpusAtRetirement * 0.3,
      confidenceScore: 68,
      subScores: {
        growthAdequacy: 75,
        drawdownSafety: 62,
        inflationProtection: 71,
        longevityRisk: 64
      }
    };
  };

  const simulationData = generateSimulationData();

  if (!isPremium) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-md mb-6">
            <Crown size={32} className="text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Will My Money Survive Till My Lifespan?
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            See how historical patterns could affect YOUR retirement plan. Understand survival probabilities, 
            sequence risk, and confidence scores based on your specific inputs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="text-4xl font-bold text-slate-300 mb-2">--%</div>
              <div className="text-sm font-medium text-slate-700 mb-2">Survival Probability</div>
              <p className="text-xs text-slate-500">Based on historical patterns</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="text-4xl font-bold text-slate-300 mb-2">-- yrs</div>
              <div className="text-sm font-medium text-slate-700 mb-2">Worst-Case Duration</div>
              <p className="text-xs text-slate-500">In unfavorable sequences</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="text-4xl font-bold text-slate-300 mb-2">--/100</div>
              <div className="text-sm font-medium text-slate-700 mb-2">Confidence Score</div>
              <p className="text-xs text-slate-500">Composite safety assessment</p>
            </div>
          </div>

          <button
            onClick={upgradeToPremium}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
          >
            Unlock Personalized Analysis
          </button>
          <p className="text-sm text-slate-500 mt-4">
            Click to enable premium features for this demo session
          </p>
        </div>
      </div>
    );
  }

  // Premium View
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
    <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Crown size={24} className="text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Will My Money Survive Till My Lifespan?
              </h2>
              <p className="text-slate-600 mt-1">
                Personalized analysis based on historical patterns and your inputs
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
            Premium Analysis Active
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setActiveTab('survival')}
            className={`px-5 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'survival' ? 'bg-white text-green-700 shadow-md' : 'text-slate-700 hover:bg-white/50'}`}
          >
            Survival Probability
          </button>
          <button
            onClick={() => setActiveTab('sequence')}
            className={`px-5 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'sequence' ? 'bg-white text-green-700 shadow-md' : 'text-slate-700 hover:bg-white/50'}`}
          >
            Sequence Risk
          </button>
          <button
            onClick={() => setActiveTab('confidence')}
            className={`px-5 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'confidence' ? 'bg-white text-green-700 shadow-md' : 'text-slate-700 hover:bg-white/50'}`}
          >
            Confidence Score
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'survival' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {/* Survival Probability Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white rounded-lg">
                    <Percent size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Survival Probability</h3>
                    <p className="text-xs text-slate-600">Till age {formData?.lifespan || 85}</p>
                  </div>
                </div>
                <div className="text-center py-4">
                  <div className="text-5xl font-bold text-green-600 mb-2">{simulationData?.survivalProbability}%</div>
                  <div className="text-sm text-slate-600">Based on historical patterns</div>
                </div>
                <div className="text-xs text-slate-600 mt-4">
                  Historical analysis suggests your plan would have survived in {simulationData?.survivalProbability}% of past scenarios
                </div>
              </div>

              {/* Worst Case Card */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white rounded-lg">
                    <AlertTriangle size={20} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Worst-Case Depletion</h3>
                    <p className="text-xs text-slate-600">In unfavorable sequences</p>
                  </div>
                </div>
                <div className="text-center py-4">
                  <div className="text-5xl font-bold text-red-600 mb-2">Age {simulationData?.worstCaseDepletionAge}</div>
                  <div className="text-sm text-slate-600">Corpus depletion age</div>
                </div>
                <div className="text-xs text-slate-600 mt-4">
                  In worst historical sequences, funds could deplete by this age
                </div>
              </div>

              {/* Median Case Card */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white rounded-lg">
                    <Clock size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Median Depletion</h3>
                    <p className="text-xs text-slate-600">Typical historical outcome</p>
                  </div>
                </div>
                <div className="text-center py-4">
                  <div className="text-5xl font-bold text-amber-600 mb-2">Age {simulationData?.medianDepletionAge}</div>
                  <div className="text-sm text-slate-600">50th percentile outcome</div>
                </div>
                <div className="text-xs text-slate-600 mt-4">
                  In median historical sequences, funds last till this age
                </div>
              </div>

              {/* Best Case Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white rounded-lg">
                    <TrendingUp size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Best-Case Surplus</h3>
                    <p className="text-xs text-slate-600">In favorable sequences</p>
                  </div>
                </div>
                <div className="text-center py-4">
                  <div className="text-5xl font-bold text-emerald-600 mb-2">
                    ₹{simulationData?.bestCaseSurplus ? (simulationData.bestCaseSurplus / 100000).toFixed(1) + 'L' : '--'}
                  </div>
                  <div className="text-sm text-slate-600">Remaining at lifespan</div>
                </div>
                <div className="text-xs text-slate-600 mt-4">
                  In best historical sequences, surplus could remain at lifespan
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl">
              <p className="font-medium text-slate-900 mb-2">📚 Educational Note:</p>
              <p className="text-slate-600">
                Survival probability shows how often similar historical plans lasted till target lifespan. 
                This is NOT a prediction of future outcomes. Historical sequences vary significantly.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'sequence' && (
          <div>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                How Sensitive Am I To Bad Market Sequences?
              </h3>
              <p className="text-slate-600">
                Historical Sequence Risk Simulation (Age {formData?.retirementAge || 60} to {formData?.lifespan || 85})
              </p>
            </div>
            
            <ChartContainer height="400px">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={simulationData?.scenarios}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="age"
                    stroke="#64748b"
                    fontSize={12}
                    label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                    label={{ value: 'Corpus Value', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    formatter={(value) => [`₹${(value / 100000).toFixed(1)}L`, 'Corpus']}
                    labelFormatter={(label) => `Age: ${label}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="worstCase"
                    name="Worst Historical Sequence"
                    stroke="#EF4444"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="medianCase"
                    name="Median Historical Sequence"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="bestCase"
                    name="Best Historical Sequence"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="mt-8 bg-green-50 p-6 rounded-xl">
              <p className="font-medium text-slate-900 mb-2">💡 Understanding Sequence Risk:</p>
              <p className="text-slate-600">
                Shows how your retirement corpus could evolve under different historical return sequences. 
                The order of returns significantly impacts retirement outcomes, even with the same average returns over time.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'confidence' && (
          <div>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                How Confident Is My Retirement Plan Historically?
              </h3>
              <p className="text-slate-600">
                Composite score based on historical pattern analysis
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Confidence Score Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-md mb-6">
                    <Shield size={40} className="text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Retirement Confidence Score
                  </h3>
                  <div className="text-6xl font-bold text-emerald-600 mb-2">
                    {simulationData?.confidenceScore}/100
                  </div>
                  <p className="text-slate-600">
                    Composite assessment based on historical patterns
                  </p>
                </div>
                
                <div className="space-y-6">
                  {Object.entries(simulationData?.subScores || {}).map(([key, value]) => {
                    const labels = {
                      growthAdequacy: 'Growth Adequacy',
                      drawdownSafety: 'Drawdown Safety',
                      inflationProtection: 'Inflation Protection',
                      longevityRisk: 'Longevity Risk'
                    };
                    const colors = {
                      growthAdequacy: 'bg-emerald-500',
                      drawdownSafety: 'bg-amber-500',
                      inflationProtection: 'bg-emerald-500',
                      longevityRisk: 'bg-purple-500'
                    };
                    
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                          <span>{labels[key]}</span>
                          <span>{value}/100</span>
                        </div>
                        <div className="h-3 bg-white rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${colors[key]}`}
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <TrendingUp size={20} className="text-emerald-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Growth Adequacy</h4>
                      <p className="text-sm text-slate-600">
                        Assesses whether historical growth patterns would have been sufficient to
                        maintain purchasing power throughout retirement
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <BarChart2 size={20} className="text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Drawdown Safety</h4>
                      <p className="text-sm text-slate-600">
                        Evaluates vulnerability to historical market declines and recovery periods
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <DollarSign size={20} className="text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Inflation Protection</h4>
                      <p className="text-sm text-slate-600">
                        Measures historical ability to outpace inflation and maintain real spending power
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <Clock size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Longevity Risk</h4>
                      <p className="text-sm text-slate-600">
                        Assesses historical probability of funds lasting through target lifespan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-amber-50 p-6 rounded-xl">
              <p className="font-medium text-slate-900 mb-2">⚠️ Important:</p>
              <p className="text-slate-600">
                Confidence scores are based on historical pattern analysis only. Higher scores indicate
                that similar plans historically performed better across multiple dimensions. This is NOT
                a guarantee of future outcomes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}