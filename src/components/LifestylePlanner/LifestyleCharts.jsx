"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function LifestyleCharts({ paycheckTimelineData }) {
  // Custom tooltip for currency formatting
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const required = payload.find((p) => p.dataKey === 'requiredMonthly')?.value || 0;
      const supported = payload.find((p) => p.dataKey === 'supportedMonthly')?.value || 0;
      const gap = Math.max(required - supported, 0);
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900 mb-2">{label}</p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            Required: <span className="font-semibold">₹{required.toLocaleString('en-IN')}</span>
          </p>
          <p className="text-sm" style={{ color: payload[1]?.color || '#10b981' }}>
            Supported: <span className="font-semibold">₹{supported.toLocaleString('en-IN')}</span>
          </p>
          <p className="text-sm text-rose-600">
            Gap: <span className="font-semibold">₹{gap.toLocaleString('en-IN')}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis ticks
  const formatYAxis = (value) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Gap between required and expected monthly income for your desired lifestyle</h3>
          <p className="text-slate-600">Required vs. supported monthly income across retirement (inflation-adjusted).</p>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={paycheckTimelineData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="age" 
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                label={{ 
                  value: 'Age', 
                  position: 'insideBottom', 
                  offset: -10,
                  fill: '#64748b'
                }}
              />
              <YAxis 
                tickFormatter={formatYAxis}
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                label={{ 
                  value: 'Monthly Income (₹)', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: 10,
                  fill: '#64748b'
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="requiredMonthly" name="Required Monthly Income" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="supportedMonthly" name="Supported Monthly Income (Safe)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="text-sm text-slate-600">
            <p className="font-medium mb-2">How to read this chart:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>If supported income (green) stays above required income (purple), purchasing power is maintained.</li>
              <li>Where green drops below purple, purchasing power is not fully maintained.</li>
              <li>Both lines are monthly and inflation-adjusted.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}