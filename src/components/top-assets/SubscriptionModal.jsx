'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';

const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly Pro',
    price: '₹299',
    period: '/month',
    features: [
      'Premium Asset Fit Discovery',
      'Personalized retirement insights',
      'Historical pattern analysis',
      'All educational tools',
      'Priority support'
    ]
  },
  {
    id: 'yearly',
    name: 'Yearly Pro',
    price: '₹2,999',
    period: '/year',
    badge: 'Best Value',
    savings: 'Save ₹588',
    features: [
      'Premium Asset Fit Discovery',
      'Personalized retirement insights',
      'Historical pattern analysis',
      'All educational tools',
      'Priority support',
      '2 months free'
    ]
  }
];

export default function SubscriptionModal({ isOpen, onClose, onSubscribe }) {
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  if (!isOpen) return null;

  const handleSubscribe = () => {
    onSubscribe(selectedPlan);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Unlock Premium Features</h2>
            <p className="text-gray-600 mt-1">Choose a plan to access personalized asset analysis</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Plans */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    {plan.savings && (
                      <p className="text-sm text-green-600 font-medium">{plan.savings}</p>
                    )}
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === plan.id
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedPlan === plan.id && <Check size={16} className="text-white" />}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 shrink-0 mt-1" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Subscribe Button */}
          <div className="mt-8">
            <button
              onClick={handleSubscribe}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Activate Premium Access
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Prototype mode: Premium activates immediately for demonstration
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            All features are educational tools. No investment recommendations are provided. 
            Consult a SEBI-registered advisor for personalized advice.
          </p>
        </div>
      </div>
    </div>
  );
}
