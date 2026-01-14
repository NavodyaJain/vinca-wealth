// src/app/dashboard/financial-readiness/components/FinancialEssentialsSection.jsx
'use client';

import { Shield, HeartPulse, Wallet, TrendingUp } from 'lucide-react';

const FinancialEssentialsSection = () => {
  const essentials = [
    {
      title: 'Life Insurance',
      description: 'Protects your loved ones financially in case of unforeseen events',
      highlightLabel: 'Recommended Cover',
      highlightValue: '10x Annual Income',
      icon: Shield,
      accent: 'blue'
    },
    {
      title: 'Health Insurance',
      description: 'Comprehensive health coverage for medical emergencies',
      highlightLabel: 'Suggested Coverage',
      highlightValue: 'Coverage of 50% of Annual Income',
      icon: HeartPulse,
      accent: 'green'
    },
    {
      title: 'Emergency Fund',
      description: '6-12 months of expenses as a financial safety net',
      highlightLabel: 'Target Buffer',
      highlightValue: '₹6,00,000',
      icon: Wallet,
      accent: 'amber'
    },
    {
      title: 'Required Monthly SIP',
      description: 'Systematic investment for long-term wealth creation',
      highlightLabel: 'SIP Target',
      highlightValue: '₹35K/month',
      icon: TrendingUp,
      accent: 'purple'
    }
  ];

  const getAccentClasses = (accent) => {
    switch (accent) {
      case 'blue':
        return 'bg-blue-50 border-blue-100 text-blue-600';
      case 'green':
        return 'bg-emerald-50 border-emerald-100 text-emerald-600';
      case 'amber':
        return 'bg-amber-50 border-amber-100 text-amber-600';
      case 'purple':
        return 'bg-purple-50 border-purple-100 text-purple-600';
      default:
        return 'bg-gray-50 border-gray-100 text-gray-600';
    }
  };

  return (
    <div className="rounded-2xl shadow-sm p-6 bg-white border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-2xl">🛡️</span> Are You Covered with Financial Essentials?
        </h2>
        <p className="text-gray-600">
          Before building wealth, ensure your foundation is solid. These essentials protect you and your family from unexpected events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {essentials.map((item, index) => (
          <div 
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${getAccentClasses(item.accent)}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">{item.highlightLabel}</div>
                  <div className="text-xl font-bold text-gray-900">{item.highlightValue}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialEssentialsSection;