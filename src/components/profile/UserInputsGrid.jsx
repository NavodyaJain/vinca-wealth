// src/components/profile/UserInputsGrid.jsx
'use client';

import { formatCurrency } from '@/lib/formatter';

export default function UserInputsGrid({ userInputs }) {
  if (!userInputs) return null;

  const inputGroups = [
    {
      title: 'Personal Details',
      inputs: [
        { key: 'currentAge', label: 'Current Age', format: (v) => `${v} years` },
        { key: 'retirementAge', label: 'Retirement Age', format: (v) => `${v} years` },
        { key: 'lifeExpectancy', label: 'Life Expectancy', format: (v) => v ? `${v} years` : null }
      ]
    },
    {
      title: 'Income & Expenses',
      inputs: [
        { key: 'monthlyIncome', label: 'Monthly Income', format: (v) => formatCurrency(v) },
        { key: 'monthlyExpenses', label: 'Monthly Expenses', format: (v) => formatCurrency(v) },
        { key: 'surplus', label: 'Monthly Surplus', format: (v) => formatCurrency(v) }
      ]
    },
    {
      title: 'Savings & Investment',
      inputs: [
        { key: 'currentSavings', label: 'Current Savings', format: (v) => formatCurrency(v) },
        { key: 'monthlySIP', label: 'Monthly SIP', format: (v) => formatCurrency(v) }
      ]
    },
    {
      title: 'Assumptions',
      inputs: [
        { key: 'expectedReturns', label: 'Expected Returns', format: (v) => `${v}%` },
        { key: 'inflation', label: 'Inflation Rate', format: (v) => v ? `${v}%` : null }
      ]
    }
  ];

  // Filter out groups with no valid values
  const validGroups = inputGroups.map(group => ({
    ...group,
    inputs: group.inputs.filter(input => {
      const value = userInputs[input.key];
      return value !== null && value !== undefined && value !== 0;
    })
  })).filter(group => group.inputs.length > 0);

  if (validGroups.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center">
        <p className="text-slate-500">No saved inputs yet. Complete the calculator to save your profile.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {validGroups.map((group, groupIndex) => (
        <div 
          key={groupIndex}
          className="p-4 rounded-xl border border-slate-200 bg-white"
        >
          <h4 className="text-sm font-medium text-slate-500 mb-3">{group.title}</h4>
          <div className="space-y-2">
            {group.inputs.map((input, inputIndex) => {
              const value = userInputs[input.key];
              const formattedValue = input.format(value);
              
              if (!formattedValue) return null;
              
              return (
                <div key={inputIndex} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{input.label}</span>
                  <span className="text-sm font-medium text-slate-900">{formattedValue}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
