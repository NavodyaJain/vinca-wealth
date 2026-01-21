// src/components/financialReadiness/PremiumFireCalculatorSection.jsx
'use client';

import { useState, useEffect } from 'react';
import FireCalculatorPremiumUI from './FireCalculatorPremiumUI';
import { calculateFirePremiumResults } from '@/lib/financialReadiness/firePremiumEngine';
import { usePremium } from '@/lib/premium';
import { saveUserReading } from '@/lib/userJourneyStorage';

const PremiumFireCalculatorSection = ({ results, onUpgradeClick, onSave, isSaved }) => {
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
      
      // Save Early Retirement reading when FIRE results are calculated
      if (fireData) {
        const currentAge = Number(results?.inputs?.currentAge) || 30;
        const standardRetirementAge = Number(results?.inputs?.retirementAge) || 60;
        const fireAge = fireData?.fireAge || fireData?.premiumScenario?.fireAge || standardRetirementAge;
        const yearsEarly = Math.max(0, standardRetirementAge - fireAge);
        
        // Determine optimizer style based on years early
        let optimizerStyle = 'Curious';
        if (yearsEarly >= 8) {
          optimizerStyle = 'Maximizer';
        } else if (yearsEarly >= 3) {
          optimizerStyle = 'Serious';
        }
        
        saveUserReading('earlyRetirement', {
          earlyRetirementAge: fireAge,
          yearsEarly,
          optimizerStyle
        });
      }
    }
  }, [isPremium, results]);

  const handleResetPro = () => {
    downgradeToFree();
    setFireResults(null);
  };

  return (
    <div id="fire-calculator-section" className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden w-full">
      <div className="p-4 sm:p-6">
        <FireCalculatorPremiumUI 
          fireResults={fireResults}
          results={results}
          onResetPro={handleResetPro}
          isPremium={isPremium}
          onUpgradeClick={onUpgradeClick}
          onSave={onSave}
          isSaved={isSaved}
        />
      </div>
    </div>
  );
};

export default PremiumFireCalculatorSection;