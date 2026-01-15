'use client';

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatCurrency } from '@/lib/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900">{payload[0].payload.label || `Age ${label}`}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="text-sm text-gray-700">
            {entry.name}: {typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function StressTestCharts({ retirementPhaseData, lifespan, retirementAge, graphType = 'all' }) {
  // Prepare corpus survival data
  const corpusData = retirementPhaseData.map((item) => ({
    ...item,
    label: `Age ${item.age}`
  }));

  // Find depletion point
  const depletionIndex = corpusData.findIndex((item) => item.corpus === 0);
  const depletionAge = depletionIndex >= 0 ? corpusData[depletionIndex]?.age : null;

  // Prepare inflation burden data
  const inflationData = retirementPhaseData.map((item) => ({
    year: item.year,
    expense: item.yearlyExpense,
    monthlyExpense: item.monthlyExpense
  }));

  // Corpus Survival Timeline
  const corpusChart = (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-1">Corpus Survival Timeline</h3>
      <p className="text-sm text-gray-600 mb-6">
        How your retirement corpus changes over time in this scenario
      </p>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={corpusData}>
            <defs>
              <linearGradient id="corpusGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="age"
              label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis
              label={{ value: 'Corpus Balance (₹)', angle: -90, position: 'insideLeft' }}
              tick={{ fill: '#6b7280' }}
              tickFormatter={(value) => `₹${(value / 1000000).toFixed(0)}Cr`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Retirement age marker */}
            <ReferenceLine
              x={retirementAge}
              stroke="#6b7280"
              strokeDasharray="5 5"
              label={{ value: `Retirement (${retirementAge})`, position: 'top', fill: '#6b7280', fontSize: 12 }}
            />

            {/* Lifespan marker */}
            <ReferenceLine
              x={lifespan}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{ value: `Target Lifespan (${lifespan})`, position: 'top', fill: '#ef4444', fontSize: 12 }}
            />

            {/* Depletion marker */}
            {depletionAge && (
              <ReferenceLine
                x={depletionAge}
                stroke="#ef4444"
                strokeWidth={2}
                label={{
                  value: `Depletes (${Math.floor(depletionAge)})`,
                  position: 'topLeft',
                  fill: '#ef4444',
                  fontSize: 12,
                  fontWeight: 'bold'
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="corpus"
              stroke="#3b82f6"
              fill="url(#corpusGradient)"
              name="Corpus Balance"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          <span className="font-semibold">💡 Tip:</span> Switch scenarios to see how resilience changes.
        </p>
      </div>
    </div>
  );

  // Inflation Pressure on Lifestyle
  const inflationChart = (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-1">Inflation Pressure on Your Lifestyle</h3>
      <p className="text-sm text-gray-600 mb-6">
        How inflation increases your required annual withdrawals
      </p>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={inflationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              label={{ value: 'Years after Retirement', position: 'insideBottom', offset: -5 }}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis
              label={{ value: 'Annual Withdrawal (₹)', angle: -90, position: 'insideLeft' }}
              tick={{ fill: '#6b7280' }}
              tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Required Withdrawal"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          <span className="font-semibold">💡 Tip:</span> Switch scenarios to see how resilience changes.
        </p>
      </div>
    </div>
  );

  // Return based on graphType
  if (graphType === 'corpus') return corpusChart;
  if (graphType === 'inflation') return inflationChart;

  // Default: both (legacy behavior)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {corpusChart}
      {inflationChart}
    </div>
  );
}
