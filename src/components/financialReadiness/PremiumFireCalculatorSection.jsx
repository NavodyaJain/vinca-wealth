// src/components/financialReadiness/PremiumFireCalculatorSection.jsx
'use client';

import { useState, useEffect } from 'react';
import ProSubscriptionModal from './ProSubscriptionModal';
import FireCalculatorPremiumUI from './FireCalculatorPremiumUI';
import { calculateFirePremiumResults } from '@/lib/financialReadiness/firePremiumEngine';

const PremiumFireCalculatorSection = ({ formData, results }) => {
  const [proUnlocked, setProUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [fireResults, setFireResults] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('vinca_pro_unlocked');
    if (saved === 'true') {
      setProUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (proUnlocked && formData && results) {
      const fireData = calculateFirePremiumResults(formData, results);
      setFireResults(fireData);
    }
  }, [proUnlocked, formData, results]);

  const handleUnlock = (planId) => {
    setProUnlocked(true);
    localStorage.setItem('vinca_pro_unlocked', 'true');
    setSelectedPlan(planId);
    setShowModal(false);
  };

  const handleResetPro = () => {
    setProUnlocked(false);
    localStorage.removeItem('vinca_pro_unlocked');
    setFireResults(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">FIRE Calculator (Premium)</h2>
          <p className="text-gray-600">
            Unlock your earliest achievable early-retirement age using realistic SIP optimization based on your income surplus.
          </p>
        </div>

        {!proUnlocked ? (
          <div className="space-y-6">
            {/* Premium Teaser Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">FIRE is not about retiring at 35</h3>
                  <p className="text-blue-700">
                    It's about retiring earlier than your plan — safely.
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                <strong>Financial Readiness Age</strong> ({results?.financialReadinessAge || '--'}) shows when you can retire with your current SIP. 
                <strong> FIRE Age</strong> shows how many years earlier you could retire by smartly using a portion of your monthly surplus.
              </p>
              
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200"
              >
                Unlock Pro to Reveal My FIRE Age
              </button>
              <p className="text-center text-sm text-gray-600 mt-3">
                See how many years earlier you can retire (realistic surplus-based plan)
              </p>
            </div>

            {/* Preview Placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 opacity-60 blur-sm">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="text-sm font-medium text-gray-500 mb-1">FIRE Age</div>
                <div className="text-2xl font-bold text-gray-400 mb-1">--</div>
                <div className="text-xs text-gray-400">Earliest safe early-retirement age</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="text-sm font-medium text-gray-500 mb-1">SIP Optimization</div>
                <div className="text-2xl font-bold text-gray-400 mb-1">+₹---/month</div>
                <div className="text-xs text-gray-400">Realistic surplus allocation</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="text-sm font-medium text-gray-500 mb-1">Corpus Impact</div>
                <div className="text-2xl font-bold text-gray-400 mb-1">₹---</div>
                <div className="text-xs text-gray-400">Projected vs Required</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="text-sm font-medium text-gray-500 mb-1">Years Earlier</div>
                <div className="text-2xl font-bold text-gray-400 mb-1">-- years</div>
                <div className="text-xs text-gray-400">Compared to your plan</div>
              </div>
            </div>
          </div>
        ) : (
          <FireCalculatorPremiumUI 
            fireResults={fireResults}
            formData={formData}
            onResetPro={handleResetPro}
          />
        )}
      </div>

      {showModal && (
        <ProSubscriptionModal
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
          onConfirm={() => handleUnlock(selectedPlan)}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default PremiumFireCalculatorSection;