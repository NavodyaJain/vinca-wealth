'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { calculateHealthImpact } from '@/lib/healthStressEngine';

export default function HealthImpactCharts({ scenario, userInputs, isPremium }) {
  const [chartData, setChartData] = useState([]);
  const [affordabilityData, setAffordabilityData] = useState([]);
  const [corpusData, setCorpusData] = useState([]);

  // Normalize scenario to support both old (id-based) and new (config-based) formats
  const getNormalizedScenario = () => {
    if (!scenario) return null;
    
    // If it's the new config format with 'freeTitle'
    if (scenario.freeTitle) {
      return {
        id: scenario.title.includes('Everyday') ? 'everyday' :
             scenario.title.includes('Planned') ? 'planned' : 'highImpact',
        title: scenario.title
      };
    }
    
    // Otherwise it's the old format with 'id'
    return scenario;
  };

  useEffect(() => {
    if (!scenario || !userInputs) return;

    const normalizedScenario = getNormalizedScenario();

    // 1. DUAL LINE: Medical Cost + Extra Withdrawal Impact
    const medicalInflationData = [];
    const currentYear = new Date().getFullYear();
    
    const baseMedicalCost = normalizedScenario.id === 'everyday' ? 30000 :
                           normalizedScenario.id === 'planned' ? 300000 :
                           1500000;

    const categoryMultiplier = {
      'everyday': { startYear: 0, impactGrowth: 0.08 },      // Slow 8% impact growth
      'planned': { startYear: 5, impactGrowth: 0.12 },       // Jumps at year 5, then 12%
      'highImpact': { startYear: 3, impactGrowth: 0.15 }     // Jumps at year 3, 15% thereafter
    };

    const impactConfig = categoryMultiplier[normalizedScenario.id];
    
    for (let i = 0; i < 20; i++) {
      const year = currentYear + i;
      
      // Medical cost at 9% annually
      const medicalCost = baseMedicalCost * Math.pow(1.09, i);
      
      // Extra withdrawal impact (varies by category)
      let extraWithdrawal = 0;
      if (i >= impactConfig.startYear) {
        const yearsActive = i - impactConfig.startYear;
        extraWithdrawal = (baseMedicalCost * 0.5) * Math.pow(1 + impactConfig.impactGrowth, yearsActive);
      }
      
      medicalInflationData.push({
        year: i.toString(),
        medicalCost: Math.round(medicalCost / 10000) * 10000,
        extraWithdrawal: Math.round(extraWithdrawal / 10000) * 10000,
        category: normalizedScenario.title
      });
    }

    setChartData(medicalInflationData);

    // 2. GROUPED BARS: Baseline Monthly vs Health Impact
    const monthlyBaseline = userInputs.monthlyExpenses || 50000;
    const costComparison = [
      {
        scenario: 'Everyday Care',
        baseline: monthlyBaseline,
        impact: normalizedScenario.id === 'everyday' ? Math.round(monthlyBaseline * 0.15) : 0
      },
      {
        scenario: 'Planned Events',
        baseline: monthlyBaseline,
        impact: normalizedScenario.id === 'planned' ? Math.round(300000 / 12) : 0
      },
      {
        scenario: 'High Impact Event',
        baseline: monthlyBaseline,
        impact: normalizedScenario.id === 'highImpact' ? Math.round(1500000 / 6) : 0
      }
    ];

    // 3. DOUBLE BAR: Emergency Readiness With/Without Buffer
    const affordability = [
      {
        scenario: 'Current Emergency Fund',
        withoutBuffer: 7,
        withBuffer: 7
      },
      {
        scenario: 'With Health Buffer',
        withoutBuffer: 7,
        withBuffer: 21
      },
      {
        scenario: 'With Insurance',
        withoutBuffer: 14,
        withBuffer: 30
      }
    ];
    
    setAffordabilityData(affordability);

    // 4. DUAL LINE: Retirement Corpus Depletion (Baseline vs Health-Stressed)
    const corpusData = [];
    const baselineCorpus = userInputs.moneySaved || 1500000;
    const monthlyWithdrawal = userInputs.monthlyExpenses || 50000;
    
    let corpusBaseline = baselineCorpus;
    let corpusStressed = baselineCorpus;
    
    for (let year = 0; year < 30; year++) {
      // Baseline: only inflation on withdrawals
      const baselineAnnualWithdrawal = monthlyWithdrawal * 12 * Math.pow(1.06, year);
      corpusBaseline -= baselineAnnualWithdrawal;
      corpusBaseline = Math.max(0, corpusBaseline * 1.08); // 8% returns
      
      // Stressed: includes health cost impact
      const healthCostAddition = (baseMedicalCost * Math.pow(1.09, year)) * (normalizedScenario.id === 'everyday' ? 0.3 : normalizedScenario.id === 'planned' ? 0.2 : 0.5);
      const stressedAnnualWithdrawal = baselineAnnualWithdrawal + healthCostAddition;
      corpusStressed -= stressedAnnualWithdrawal;
      corpusStressed = Math.max(0, corpusStressed * 1.08); // 8% returns
      
      corpusData.push({
        year: year.toString(),
        baseline: Math.round(corpusBaseline / 1000000 * 10) / 10,  // In crores
        stressed: Math.round(corpusStressed / 1000000 * 10) / 10,
        ageAtRetirement: (userInputs.retirementAge + year).toString()
      });
    }
    
    setCorpusData(corpusData);

  }, [scenario, userInputs, isPremium]);

  if (!scenario) return null;

  const normalizedScenario = getNormalizedScenario();

  return (
    <div className="space-y-8">
      {/* CHART 1: Medical Cost + Withdrawal Impact (Dual Line) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-amber-600" />
          <h4 className="text-lg font-medium text-slate-800">
            Medical Cost vs Retirement Withdrawal Pressure
          </h4>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          How health expenses translate into higher annual withdrawal needs from your retirement corpus
        </p>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="year" 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${(value).toLocaleString()}`, '']}
                  labelFormatter={(label) => `Year ${label}`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="medicalCost"
                  name="Medical Cost Trend"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="extraWithdrawal"
                  name="Extra Withdrawal Impact"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200 text-sm text-slate-700">
            <p>
              <strong>What this shows:</strong> As medical costs rise (orange line), your retirement needs additional withdrawals (red dashed line). 
              Even without major events, recurring health costs can compound into significant withdrawal pressure over decades.
            </p>
          </div>
        </div>
      </div>

      {/* CHART 2: Baseline vs Health Impact (Grouped Bars) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Info size={20} className="text-blue-600" />
          <h4 className="text-lg font-medium text-slate-800">
            One-time Health Event vs Regular Retirement Spending
          </h4>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          How {normalizedScenario.title.toLowerCase()} compares to your typical monthly retirement expenses
        </p>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                {
                  scenario: 'Everyday Care',
                  baseline: 50000,
                  impact: normalizedScenario.id === 'everyday' ? 7500 : 0
                },
                {
                  scenario: 'Planned Events',
                  baseline: 50000,
                  impact: normalizedScenario.id === 'planned' ? 25000 : 0
                },
                {
                  scenario: 'High Impact Event',
                  baseline: 50000,
                  impact: normalizedScenario.id === 'highImpact' ? 250000 : 0
                }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="scenario" 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#64748b"
                  tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${(value).toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                />
                <Bar 
                  dataKey="baseline" 
                  name="Typical Monthly Retirement Spend"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="impact" 
                  name="Health Event Impact"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-amber-50 rounded border border-amber-200 text-sm text-slate-700">
            <p>
              <strong>What this shows:</strong> A single high-impact health event (red bar) can equal many months of normal retirement spending. 
              Without planning, absorbing such a cost requires either reducing lifestyle or breaking long-term investments.
            </p>
          </div>
        </div>
      </div>

      {/* CHART 3: Emergency Readiness With/Without Buffer (Grouped Bars) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={20} className="text-rose-600" />
          <h4 className="text-lg font-medium text-slate-800">
            Emergency Readiness: With vs Without Health Buffer
          </h4>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          How many days of private hospitalization your emergency funds can cover
        </p>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={affordabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="scenario" 
                  stroke="#64748b"
                  angle={-15}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#64748b"
                  label={{ 
                    value: 'Days Covered', 
                    angle: -90, 
                    position: 'insideLeft'
                  }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} days`, '']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                />
                <Bar 
                  dataKey="withoutBuffer" 
                  name="Without Health Buffer"
                  fill="#fbbf24"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="withBuffer" 
                  name="With Health Buffer"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200 text-sm text-slate-700">
            <p>
              <strong>What this shows:</strong> Adding a dedicated health buffer (green bars) significantly extends how long emergency funds can cover hospitalization. 
              This prevents forced withdrawal of investments during market downturns.
            </p>
          </div>
        </div>
      </div>

      {/* CHART 4: Retirement Corpus Depletion (Dual Line) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-purple-600" />
          <h4 className="text-lg font-medium text-slate-800">
            Retirement Corpus Impact: Baseline vs Health-Stressed Scenario
          </h4>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          How health costs accelerate retirement corpus depletion over 30 years
        </p>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={corpusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="year" 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Years After Retirement', position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}Cr`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value.toFixed(1)}Cr`, '']}
                  labelFormatter={(label) => `Year ${label}`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  name="Baseline (No Health Stress)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="stressed"
                  name="With Health Costs"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-purple-50 rounded border border-purple-200 text-sm text-slate-700">
            <p>
              <strong>What this shows:</strong> Health costs (red line) cause your retirement corpus to deplete faster than baseline (green line). 
              The gap widens over time, showing cumulative impact. This is why planning ahead matters.
            </p>
            <p className="mt-2 text-xs text-slate-600 italic">
              <strong>Note:</strong> This is an educational simulation showing direction of impact, not personalized forecasting.
            </p>
          </div>
        </div>
      </div>

      {/* Educational Footer */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h5 className="font-medium text-blue-800 mb-1">
              How health costs affect retirement planning
            </h5>
            <p className="text-sm text-blue-700">
              Medical expenses in retirement can significantly accelerate corpus depletion. These charts show the 
              <strong> relationship</strong> between health stress and retirement safety. A small health buffer + proper insurance 
              can make a substantial difference in retirement confidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}