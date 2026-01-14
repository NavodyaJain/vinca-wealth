'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  calculateSipGrowth, 
  calculateCorpusAtRetirement, 
  calculateWithdrawalPhase,
  calculateDepletionAge,
  calculateSipGap 
} from '../lib/calculations';

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
      investmentYears,
      expectedReturns,
      sipIncreaseRate,
      lifespan,
      inflationRate,
      withdrawalIncrease,
      retirementReturns
    } = formData;

    // Calculate SIP growth and accumulation phase
    const sipData = calculateSipGrowth({
      initialInvestment: moneySaved,
      monthlySIP,
      years: investmentYears,
      annualReturn: expectedReturns,
      sipIncreaseRate
    });

    const corpusAtRetirement = calculateCorpusAtRetirement(sipData);
    
    // Calculate withdrawal phase
    const withdrawalData = calculateWithdrawalPhase({
      initialCorpus: corpusAtRetirement,
      currentAge: retirementAge,
      lifespan,
      monthlyExpenses,
      inflationRate,
      withdrawalIncrease,
      annualReturn: retirementReturns
    });

    const depletionAge = calculateDepletionAge(withdrawalData);
    const sipGap = calculateSipGap(monthlySIP, monthlyExpenses, expectedReturns, retirementAge - currentAge);
    
    // Combine yearly data
    const yearlyData = [
      ...sipData.map(item => ({ ...item, phase: 'Accumulation' })),
      ...withdrawalData.map(item => ({ ...item, phase: 'Withdrawal' }))
    ];

    const calculatedResults = {
      freedomAge: depletionAge > lifespan ? 'Achieved' : depletionAge,
      expectedCorpus: corpusAtRetirement,
      requiredCorpus: calculateRequiredCorpus(monthlyExpenses, inflationRate, retirementAge, lifespan, retirementReturns),
      sipGap,
      depletionAge,
      yearlyData
    };

    setResults(calculatedResults);
    setDashboardData(yearlyData);
    
    // Update form data with results
    setFormData(prev => ({
      ...prev,
      ...calculatedResults,
      yearlyData
    }));

    return calculatedResults;
  }, [formData]);

  const calculateRequiredCorpus = (monthlyExpenses, inflationRate, retirementAge, lifespan, returns) => {
    const yearsInRetirement = lifespan - retirementAge;
    const monthlyWithdrawal = monthlyExpenses * Math.pow(1 + inflationRate/100, retirementAge - formData.currentAge);
    
    // Simplified required corpus calculation
    let corpus = 0;
    for (let i = 0; i < yearsInRetirement; i++) {
      const withdrawal = monthlyWithdrawal * 12 * Math.pow(1 + inflationRate/100, i);
      corpus += withdrawal / Math.pow(1 + returns/100, i + 1);
    }
    
    return corpus;
  };

  const value = {
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    calculateResults,
    results,
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