'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatCurrency } from '../lib/formatters';
import { calculateFirePremiumResults } from '../lib/financialReadiness/firePremiumEngine';

// Custom Tooltip for improvement chart
const ImprovementTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">
          {data.label === 'Current' ? 'Current plan' : `Additional SIP: +${formatCurrency(data.additionalSIP)}`}
        </p>
        <div className="space-y-1">
          <p className="text-sm text-gray-700">
            Earliest Safe FIRE Age: <span className="font-semibold">{data.safeFireAge} years</span>
          </p>
          {data.improvement > 0 && (
            <p className="text-xs text-green-600">
              Improvement: -{data.improvement} years from current
            </p>
          )}
          <p className={`text-xs ${data.isFeasible ? 'text-green-600' : 'text-amber-600'}`}>
            {data.isFeasible ? '✓ Within your safe capacity' : '⚠ Exceeds safe capacity'}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for scenario chart
const ScenarioTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">Retirement Age: {label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">
              {entry.name}: {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function PremiumRetirementImpact({ fireData: propFireData, formData, results }) {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [computedFireData, setComputedFireData] = useState(null);

  // Compute fireData if not provided but formData and results are
  useEffect(() => {
    if (!propFireData && formData && results) {
      // Check if formData has required fields for FIRE calculation
      if (formData.monthlyIncome && formData.monthlySIP && formData.currentAge) {
        try {
          const calculated = calculateFirePremiumResults(formData, results);
          
          // Transform the data to match expected structure
          const transformedData = {
            currentMonthlySIP: calculated.currentMonthlySIP || 0,
            availableAdditionalSIP: calculated.investableSurplus || 0,
            maxPossibleSIP: (calculated.currentMonthlySIP || 0) + (calculated.investableSurplus || 0),
            safeFireAge: calculated.recommended?.fireAge || formData.retirementAge,
            recommendedAdditionalSIP: calculated.recommended?.additionalSIP || 0,
            improvementData: calculated.scenarios?.map((s, idx) => ({
              label: s.ratio === 0 ? 'Current' : `+${formatCurrency(s.additionalSIP)}`,
              additionalSIP: s.additionalSIP,
              safeFireAge: s.fireAge || formData.retirementAge,
              improvement: s.yearsEarlier || 0,
              isFeasible: s.additionalSIP <= calculated.investableSurplus
            })) || [],
            retirementScenarios: calculated.scenarios?.map(s => ({
              age: s.fireAge || formData.retirementAge,
              projectedCorpus: s.projectedCorpusAtFireAge,
              requiredCorpus: s.requiredCorpusAtFireAge,
              surplus: s.corpusGap,
              sustainability: s.corpusGap >= 0 ? 'SAFE' : 'AT_RISK'
            })) || []
          };
          
          setComputedFireData(transformedData);
        } catch (error) {
          console.error('Error calculating FIRE data:', error);
        }
      }
    }
  }, [propFireData, formData, results]);

  const fireData = propFireData || computedFireData;

  useEffect(() => {
    if (fireData?.retirementScenarios?.[0]) {
      setSelectedScenario(fireData.retirementScenarios[0]);
    }
  }, [fireData]);

  if (!fireData) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">FIRE Impact Analysis</h3>
          <p className="text-gray-600">
            {formData && !formData.monthlyIncome 
              ? 'Please provide complete financial information to see your FIRE analysis'
              : 'Calculating your retirement optimization impact...'}
          </p>
        </div>
      </div>
    );
  }

  const { 
    improvementData = [],
    retirementScenarios = [],
    currentMonthlySIP,
    availableAdditionalSIP,
    maxPossibleSIP,
    safeFireAge,
    recommendedAdditionalSIP
  } = fireData;

  const hasImprovementData = improvementData.length > 1;
  const hasScenarios = retirementScenarios.length > 0;

  const getSustainabilityColor = (status) => {
    switch(status) {
      case 'SAFE': return 'bg-green-100 text-green-800';
      case 'MODERATE': return 'bg-blue-100 text-blue-800';
      case 'AT_RISK': return 'bg-amber-100 text-amber-800';
      case 'UNSAFE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-green-600">📈</span>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">FIRE Optimization Impact</h2>
          <p className="text-gray-600">
            See how small changes today affect your safe retirement age tomorrow
          </p>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Current SIP</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(currentMonthlySIP)}</div>
            <div className="text-xs text-gray-500">Monthly investment</div>
          </div>
        </div>
        
        <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Available for Additional SIP</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(availableAdditionalSIP)}</div>
            <div className="text-xs text-gray-500">Safe monthly capacity</div>
            {availableAdditionalSIP === 0 && (
              <div className="text-xs text-amber-600 mt-2">
                Focus on income/expenses first
              </div>
            )}
          </div>
        </div>
        
        <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Max Safe SIP</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(maxPossibleSIP)}</div>
            <div className="text-xs text-gray-500">Current + Available</div>
          </div>
        </div>
      </div>

      {/* Actionable Recommendation */}
      {recommendedAdditionalSIP > 0 && (
        <div className="mb-8 p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Recommended Action</h3>
              <p className="text-amber-800">
                Add <span className="font-bold">+{formatCurrency(recommendedAdditionalSIP)}/month</span> to your SIP.
                This stays within your safe capacity while improving your FIRE timeline.
              </p>
              <p className="text-sm text-amber-700 mt-2">
                Emergency buffers remain protected. Consistency matters more than amount.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">
                  {Math.floor(recommendedAdditionalSIP / 5000)} years
                </div>
                <div className="text-sm text-amber-700">Potential FIRE age improvement</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Chart 1: FIRE Age Improvement */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Safe FIRE Age Improvement by Additional SIP</h3>
          <p className="text-sm text-gray-600 mb-6">
            See how increasing your SIP affects your earliest safe retirement age
          </p>
          
          {hasImprovementData ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={improvementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="label"
                    label={{ value: 'Additional Monthly SIP', position: 'insideBottom', offset: -5 }}
                    tick={{ fill: '#666' }}
                  />
                  <YAxis 
                    label={{ value: 'Earliest Safe FIRE Age', angle: -90, position: 'insideLeft' }}
                    tick={{ fill: '#666' }}
                    domain={['dataMin - 1', 'dataMax + 1']}
                  />
                  <Tooltip content={<ImprovementTooltip />} />
                  <Legend />
                  
                  <Line 
                    type="monotone" 
                    dataKey="safeFireAge" 
                    name="Earliest Safe FIRE Age" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      let fill = payload.isFeasible ? '#10b981' : '#ef4444';
                      let stroke = 'white';
                      let r = 6;
                      
                      if (payload.isCurrent) {
                        fill = '#3b82f6';
                        stroke = '#3b82f6';
                      } else if (payload.isRecommended) {
                        fill = '#f59e0b';
                        stroke = '#f59e0b';
                        r = 8;
                      }
                      
                      return (
                        <circle 
                          cx={cx} 
                          cy={cy} 
                          r={r}
                          fill={fill}
                          stroke={stroke}
                          strokeWidth={2}
                        />
                      );
                    }}
                  />
                  
                  {/* Reference line for current */}
                  <ReferenceLine 
                    x="Current"
                    stroke="#3b82f6"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                  
                  {/* Reference line for recommended if exists */}
                  {recommendedAdditionalSIP > 0 && (
                    <ReferenceLine 
                      x={`+${recommendedAdditionalSIP.toLocaleString()}`}
                      stroke="#f59e0b"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-500">📊</span>
                </div>
                <p className="text-gray-600">
                  {availableAdditionalSIP === 0 
                    ? "No safe capacity for additional SIP. Focus on income or expenses first."
                    : "Insufficient data for improvement chart."
                  }
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-600">Current plan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">Feasible increase</span>
            </div>
            {recommendedAdditionalSIP > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs text-gray-600">Recommended</span>
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Retirement Scenarios */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Required SIP for Different Retirement Ages</h3>
          <p className="text-sm text-gray-600 mb-6">
            Compare what's needed for early retirement vs what you can safely afford
          </p>
          
          {hasScenarios ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={retirementScenarios}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="targetAge"
                    label={{ value: 'Target Retirement Age', position: 'insideBottom', offset: -5 }}
                    tick={{ fill: '#666' }}
                  />
                  <YAxis 
                    label={{ value: 'Required Monthly SIP', angle: -90, position: 'insideLeft' }}
                    tick={{ fill: '#666' }}
                    tickFormatter={(value) => formatCurrency(value).replace('₹', '')}
                  />
                  <Tooltip content={<ScenarioTooltip />} formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  
                  <Bar 
                    dataKey="requiredSIP" 
                    name="Required SIP" 
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                  
                  {/* Reference lines */}
                  <ReferenceLine 
                    y={currentMonthlySIP}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{ value: 'Current SIP', position: 'right', fill: '#3b82f6' }}
                  />
                  
                  <ReferenceLine 
                    y={maxPossibleSIP}
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    label={{ value: 'Max Safe SIP', position: 'right', fill: '#10b981' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-500">🎯</span>
                </div>
                <p className="text-gray-600">Generating retirement scenario analysis...</p>
              </div>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-sm text-gray-700">
              Bars above the <span className="text-blue-600 font-medium">Current SIP</span> line show the gap you need to fill.
              Bars below the <span className="text-green-600 font-medium">Max Safe SIP</span> line are within your safe capacity.
            </p>
          </div>
        </div>
      </div>

      {/* Reality Check Section */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600">💡</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-3">Reality Check & Next Steps</h3>
            
            {availableAdditionalSIP > 0 ? (
              <div className="space-y-3">
                <p className="text-blue-800">
                  You have <span className="font-bold">{formatCurrency(availableAdditionalSIP)}/month</span> available for additional SIP 
                  after protecting emergency buffers. This is your <em>safe optimization space</em>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-white/70 rounded border border-blue-100">
                    <div className="text-sm font-medium text-blue-700 mb-1">1. Start Small</div>
                    <div className="text-sm text-blue-600">
                      Begin with +{formatCurrency(Math.min(2000, availableAdditionalSIP))}/month. Consistency builds habits.
                    </div>
                  </div>
                  <div className="p-3 bg-white/70 rounded border border-blue-100">
                    <div className="text-sm font-medium text-blue-700 mb-1">2. Monitor 3 Months</div>
                    <div className="text-sm text-blue-600">
                      Check if this affects your lifestyle. Adjust if needed.
                    </div>
                  </div>
                  <div className="p-3 bg-white/70 rounded border border-blue-100">
                    <div className="text-sm font-medium text-blue-700 mb-1">3. Increase Gradually</div>
                    <div className="text-sm text-blue-600">
                      Add another +₹2-5K every 6-12 months as income grows.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-blue-800">
                  Your current surplus is fully needed for safety buffers. This is normal when starting your FIRE journey.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white/70 rounded border border-blue-100">
                    <div className="text-sm font-medium text-blue-700 mb-1">Focus on Income Growth</div>
                    <div className="text-sm text-blue-600">
                      Even a ₹10,000/month income increase creates ₹7,000+ safe SIP capacity.
                    </div>
                  </div>
                  <div className="p-3 bg-white/70 rounded border border-blue-100">
                    <div className="text-sm font-medium text-blue-700 mb-1">Review Essential Expenses</div>
                    <div className="text-sm text-blue-600">
                      A ₹5,000/month expense reduction also creates SIP capacity.
                    </div>
                  </div>
                </div>
                <p className="text-sm text-blue-700 mt-3">
                  <span className="font-medium">Comforting reality:</span> You don't need to stretch your life to chase early retirement. 
                  Building the foundation first makes sustainable FIRE possible later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium CTA */}
      <div className="mt-8 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h4 className="font-semibold text-purple-900 mb-2">Stress Test Your FIRE Plan</h4>
            <p className="text-purple-700 mb-4">
              Unlock advanced simulations to see how your plan holds up in different scenarios
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white border border-purple-300 text-purple-700 rounded-full text-sm">
                Higher inflation (8%+)
              </span>
              <span className="px-3 py-1 bg-white border border-purple-300 text-purple-700 rounded-full text-sm">
                Medical emergencies
              </span>
              <span className="px-3 py-1 bg-white border border-purple-300 text-purple-700 rounded-full text-sm">
                Market corrections
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all">
              Unlock Pro Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}