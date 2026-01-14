// src/components/financialReadiness/ProSubscriptionModal.jsx
'use client';

import { useState } from 'react';

const ProSubscriptionModal = ({ selectedPlan, onSelectPlan, onConfirm, onClose }) => {
  const plans = [
    {
      id: 'monthly',
      title: 'Monthly',
      price: '₹199/month',
      bestFor: 'Trying it out',
      features: [
        'FIRE Age calculator',
        'Surplus-based SIP optimization',
        'Scenario graph: retire earlier with realistic SIP increase'
      ]
    },
    {
      id: 'yearly',
      title: 'Yearly',
      price: '₹999/year',
      tag: 'Best Value',
      bestFor: 'Serious planning',
      features: [
        'Everything in Monthly',
        'Priority scenario insights',
        'More scenario steps'
      ]
    },
    {
      id: 'lifetime',
      title: 'Lifetime',
      price: '₹1999 one-time',
      tag: 'Most Popular',
      bestFor: 'Long-term users',
      features: [
        'Everything in Pro forever',
        'No recurring payments'
      ]
    }
  ];

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upgrade to Pro</h2>
              <p className="text-gray-600 mt-2">
                Unlock FIRE Calculator + early-retirement optimization based on your real monthly surplus.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  selectedPlan === plan.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => onSelectPlan(plan.id)}
              >
                {plan.tag && (
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-4">
                    {plan.tag}
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                <div className="text-2xl font-bold text-gray-900 mb-2">{plan.price}</div>
                <p className="text-gray-600 text-sm mb-4">Best for: {plan.bestFor}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className={`text-center py-2 px-4 rounded-lg font-medium ${
                  selectedPlan === plan.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900"
            >
              Maybe later
            </button>
            <button
              onClick={onConfirm}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200"
            >
              Get Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProSubscriptionModal;