'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
// Legacy imports retained elsewhere removed; calculations now done inline with monthly compounding.

const CalculatorContext = createContext();

const DEFAULT_DATA = {
  // Step 1: Current Situation
  currentAge: 30,
  moneySaved: 500000,
  monthlyExpenses: 50000,
  monthlyIncome: 100000,
  retirementAge: 60,
  
  // Step 2: Investment Plan
  monthlySIP: 20000,
  investmentYears: 30,
  expectedReturns: 12,
  sipIncreaseRate: 10,
  
  // Step 3: Retirement Goals
  lifespan: 85,
  inflationRate: 6,
  withdrawalIncrease: 5,
  retirementReturns: 8,
  
  // Results
  freedomAge: null,
  expectedCorpus: null,
  requiredCorpus: null,
  sipGap: null,
  depletionAge: null,
  yearlyData: [],
  
  // User Info
  email: '',
  name: '',
};

export function CalculatorProvider({ children }) {
  const [formData, setFormData] = useState(DEFAULT_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const [results, setResults] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [financialReadinessResults, setFinancialReadinessResults] = useState(null);

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('vincaWealthData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('vincaWealthData', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: Number(value) || value }));
  }, []);

  const calculateResults = useCallback(() => {
    const {
      currentAge,
      moneySaved,
      monthlyExpenses,
      retirementAge,
      monthlySIP,
      expectedReturns,
      sipIncreaseRate,
      lifespan,
      inflationRate,
      withdrawalIncrease,
      retirementReturns
    } = formData;

    // Use monthly compounding; convert annual % to monthly via (1+r)^(1/12)-1
    const monthlyAccumRate = Math.pow(1 + expectedReturns / 100, 1 / 12) - 1;
    const monthlyRetRate = Math.pow(1 + retirementReturns / 100, 1 / 12) - 1;

    const monthsToRetire = Math.max(0, Math.round((retirementAge - currentAge) * 12));

    // Accumulation simulation with annual SIP step-up
    let corpus = moneySaved;
    const accumulation = [];
    for (let m = 0; m < monthsToRetire; m++) {
      const yearsElapsed = Math.floor(m / 12);
      const sipThisMonth = monthlySIP * Math.pow(1 + sipIncreaseRate / 100, yearsElapsed);
      corpus += sipThisMonth;
      corpus *= 1 + monthlyAccumRate;
      if ((m + 1) % 12 === 0) {
        accumulation.push({
          age: currentAge + (m + 1) / 12,
          corpus,
          phase: 'Accumulation'
        });
      }
    }

    const expectedCorpus = corpus;

    // Retirement simulation to find depletion age
    let withdrawal = monthlyExpenses * Math.pow(1 + inflationRate / 100, Math.max(0, retirementAge - currentAge));
    let depletionAge = null;
    const monthsRetirement = Math.max(0, Math.round((lifespan - retirementAge) * 12));
    const withdrawalData = [];
    for (let m = 0; m < monthsRetirement; m++) {
      corpus *= 1 + monthlyRetRate;
      corpus -= withdrawal;
      if (corpus <= 0 && depletionAge === null) {
        depletionAge = retirementAge + (m + 1) / 12;
        corpus = 0;
      }
      if ((m + 1) % 12 === 0) {
        withdrawalData.push({
          age: retirementAge + (m + 1) / 12,
          corpus,
          phase: 'Withdrawal'
        });
        withdrawal *= 1 + withdrawalIncrease / 100;
      }
      if (corpus <= 0) break;
    }

    const yearlyData = [...accumulation, ...withdrawalData];

    const calculatedResults = {
      freedomAge: depletionAge || lifespan,
      expectedCorpus,
      requiredCorpus: calculateRequiredCorpus(monthlyExpenses, inflationRate, retirementAge, lifespan, retirementReturns),
      sipGap: 0,
      depletionAge,
      yearlyData
    };

    setResults(calculatedResults);
    setDashboardData(yearlyData);
    setFormData((prev) => ({ ...prev, ...calculatedResults, yearlyData }));

    return calculatedResults;
  }, [formData]);

  const calculateRequiredCorpus = (monthlyExpenses, inflationRate, retirementAge, lifespan, returns) => {
    const monthlyRate = Math.pow(1 + returns / 100, 1 / 12) - 1;
    const startWithdrawal = monthlyExpenses * Math.pow(1 + inflationRate / 100, retirementAge - formData.currentAge);
    const months = Math.max(1, Math.round((lifespan - retirementAge) * 12));

    const survives = (startCorpus) => {
      let corpus = startCorpus;
      let withdrawal = startWithdrawal;
      for (let m = 0; m < months; m++) {
        corpus *= 1 + monthlyRate;
        corpus -= withdrawal;
        if (corpus <= 0) return false;
        if ((m + 1) % 12 === 0) withdrawal *= 1 + inflationRate / 100;
      }
      return corpus > 0;
    };

    let low = 0;
    let high = startWithdrawal * months * 2;
    for (let i = 0; i < 40; i++) {
      const mid = (low + high) / 2;
      if (survives(mid)) {
        high = mid;
      } else {
        low = mid;
      }
    }
    return (low + high) / 2;
  };

  const value = {
    formData,
    setFormData,
    updateFormData,
    currentStep,
    setCurrentStep,
    calculateResults,
    results,
    financialReadinessResults,
    setFinancialReadinessResults,
    dashboardData,
    setDashboardData
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within CalculatorProvider');
  }
  return context;
};