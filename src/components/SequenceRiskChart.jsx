'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatCurrency } from '@/lib/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900">Year {label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="text-sm text-gray-700">
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SequenceRiskChart({ sequenceData }) {
  // Merge all sequences into single dataset by year
  const mergedData = [];
  const maxYears = Math.max(...sequenceData.map(s => s.data.length));

  for (let i = 0; i < maxYears; i++) {
    const point = { year: i + 1 };
    sequenceData.forEach(seq => {
      if (seq.data[i]) {
        point[seq.name] = seq.data[i].corpus;
      }
    });
    mergedData.push(point);
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-1">Sequence Risk Impact</h3>
      <p className="text-sm text-gray-600 mb-6">
        Why early market drops hurt retirement plans more than late drops
      </p>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              label={{ value: 'Years after Retirement', position: 'insideBottom', offset: -5 }}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis
              label={{ value: 'Corpus Balance (₹)', angle: -90, position: 'insideLeft' }}
              tick={{ fill: '#6b7280' }}
              tickFormatter={(value) => `₹${(value / 1000000).toFixed(0)}Cr`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {sequenceData.map((seq) => (
              <Line
                key={seq.name}
                type="monotone"
                dataKey={seq.name}
                stroke={seq.color}
                strokeWidth={2}
                dot={false}
              />
            ))}
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
}
