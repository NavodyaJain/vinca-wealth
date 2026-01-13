"use client";

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";
import { formatNumberShort } from "@/lib/lifestylePlanner";

export default function LifestyleCharts({
  incomeComparisonData,
  paycheckTimelineData
}) {
  // Custom tooltip for currency formatting
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">₹{entry.value.toLocaleString('en-IN')}</span>
            </p>
          ))}
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
      {/* Bar Chart: Desired vs Affordable Income */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Desired vs Affordable Retirement Income
          </h3>
          <p className="text-slate-600">
            Compare your desired lifestyle with what your current plan can sustainably support
          </p>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={incomeComparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tickFormatter={formatYAxis}
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="desired" 
                name="Desired Income" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="safe" 
                name="Supported Safe Income" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="aggressive" 
                name="Supported Aggressive Income" 
                fill="#f59e0b" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart: Retirement Paycheck Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Retirement Paycheck Timeline
          </h3>
          <p className="text-slate-600">
            Projected monthly income throughout your retirement years
          </p>
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
              <Line
                type="monotone"
                dataKey="desiredIncome"
                name="Desired Lifestyle"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="supportedIncome"
                name="Supported Income (Safe)"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="text-sm text-slate-600">
            <p className="font-medium mb-2">How to read this chart:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>If the green line stays above purple, your plan supports your desired lifestyle</li>
              <li>If the green line drops below purple, you may need to adjust your plan</li>
              <li>Lines account for inflation and safe withdrawal rates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}