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
        <div className="bg-white p-3 sm:p-4 border border-gray-200 rounded-lg shadow-lg max-w-[90vw] sm:max-w-xs break-words">
          <p className="font-semibold text-gray-900 mb-2 text-xs sm:text-sm">Age: {label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs sm:text-sm" style={{ color: entry.color }}>
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
      <div className="h-64 sm:h-72 flex items-center justify-center border border-gray-200 rounded-xl">
        <p className="text-gray-500">No chart data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart container: min height 260px mobile, 340px+ desktop */}
      <div className="min-h-[260px] sm:min-h-[300px] lg:min-h-[340px] h-[260px] sm:h-[300px] lg:h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="age" 
              tick={{ fill: '#6b7280', fontSize: 11 }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              tick={{ fill: '#6b7280', fontSize: 11 }}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="corpus"
              name="Total Wealth"
              fill="#4f46e5"
              fillOpacity={0.12}
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-600">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Total Wealth (Corpus)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Total Invested</span>
          </div>
        </div>
        <div className="text-gray-500 text-[10px] sm:text-xs">
          Ages {currentAge} - {lifespan}
        </div>
      </div>
    </div>
  );
};

export default YearOnYearCorpusChart;