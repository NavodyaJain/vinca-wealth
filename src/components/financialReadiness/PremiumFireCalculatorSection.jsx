// src/components/financialReadiness/PremiumFireCalculatorSection.jsx
'use client';

import { useState, useEffect } from 'react';
import FireCalculatorPremiumUI from './FireCalculatorPremiumUI';
import { calculateFirePremiumResults } from '@/lib/financialReadiness/firePremiumEngine';
import { usePremium } from '@/lib/premium';

const PremiumFireCalculatorSection = ({ results }) => {
  const { isPremium, downgradeToFree } = usePremium();
  const [fireResults, setFireResults] = useState(null);

  useEffect(() => {
    if (!isPremium) {
      setFireResults(null);
      return;
    }
    if (results?.inputs) {
      const fireData = calculateFirePremiumResults(results.inputs, results);
      setFireResults(fireData);
    }
  }, [isPremium, results]);

  const handleResetPro = () => {
    downgradeToFree();
    setFireResults(null);
  };

  if (!isPremium) return null;

  return (
    <div id="fire-calculator-section" className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Smart Financial Readiness Calculator</h2>
          <p className="text-gray-600">
            Know which age is optimal for you to retire.
          </p>
        </div>

        <FireCalculatorPremiumUI 
          fireResults={fireResults}
          results={results}
          onResetPro={handleResetPro}
        />
      </div>
    </div>
  );
};

export default PremiumFireCalculatorSection;