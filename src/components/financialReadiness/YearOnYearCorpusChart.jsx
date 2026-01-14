// src/components/financialReadiness/YearOnYearCorpusChart.jsx
'use client';

import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const YearOnYearCorpusChart = ({ chartData, currentAge, retirementAge, lifespan }) => {
  const formatCurrency = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">Age: {label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center border border-gray-200 rounded-lg">
        <p className="text-gray-500">No chart data available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          Year-on-Year Corpus Analysis
        </h3>
        <p className="text-gray-600 text-sm">
          Detailed projection of your wealth growth through retirement
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-medium text-gray-800">Visual Chart</h4>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="age" 
              label={{ value: 'Age', position: 'insideBottom', offset: -10 }}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              label={{ value: 'Corpus', angle: -90, position: 'insideLeft' }}
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="corpus"
              name="Total Wealth"
              fill="#4f46e5"
              fillOpacity={0.1}
              stroke="#4f46e5"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="totalInvested"
              name="Total Invested"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Total Wealth (Corpus)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Total Invested</span>
          </div>
        </div>
        <div className="text-gray-500">
          {currentAge} - {lifespan} years
        </div>
      </div>
    </div>
  );
};

export default YearOnYearCorpusChart;