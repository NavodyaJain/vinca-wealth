// src/app/dashboard/financial-readiness/page.js
'use client';

import { useEffect, useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import FinancialReadinessResultsDashboard from '@/components/financialReadiness/FinancialReadinessResultsDashboard';
import { calculateFinancialReadinessResults } from '@/lib/financialReadiness/financialReadinessEngine';
import FinancialEssentialsSection from '@/components/financialReadiness/FinancialEssentialsSection';
import ProfessionalGuidanceSection from '@/components/financialReadiness/ProfessionalGuidanceSection';

export default function FinancialReadinessPage() {
  const { formData, results } = useCalculator();
  const [calculatedResults, setCalculatedResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [normalizedFormData, setNormalizedFormData] = useState(null);

  useEffect(() => {
    // Get form data from localStorage as fallback if context is empty
    if (!formData || Object.keys(formData).length === 0) {
      try {
        const savedFormData = localStorage.getItem('vinca_calculator_formData');
        if (savedFormData) {
          const parsed = JSON.parse(savedFormData);
          setNormalizedFormData(parsed);
        }
      } catch (error) {
        console.error('Error loading form data from localStorage:', error);
      }
    } else {
      setNormalizedFormData(formData);
    }
  }, [formData]);

  useEffect(() => {
    if (normalizedFormData && Object.keys(normalizedFormData).length > 0 && !calculatedResults && !isLoading) {
      setIsLoading(true);
      try {
        // Ensure all required fields have values
        const safeFormData = {
          currentAge: parseFloat(normalizedFormData.currentAge) || 30,
          moneySaved: parseFloat(normalizedFormData.moneySaved) || 500000,
          monthlyExpenses: parseFloat(normalizedFormData.monthlyExpenses) || 50000,
          monthlyIncome: parseFloat(normalizedFormData.monthlyIncome) || 150000,
          retirementAge: parseFloat(normalizedFormData.retirementAge) || 60,
          monthlySIP: parseFloat(normalizedFormData.monthlySIP) || 30000,
          investmentYears: parseFloat(normalizedFormData.investmentYears) || 30,
          expectedReturns: parseFloat(normalizedFormData.expectedReturns) || 12,
          sipIncreaseRate: parseFloat(normalizedFormData.sipIncreaseRate) || 10,
          lifespan: parseFloat(normalizedFormData.lifespan) || 85,
          inflationRate: parseFloat(normalizedFormData.inflationRate) || 6,
          withdrawalIncrease: parseFloat(normalizedFormData.withdrawalIncrease) || 0,
          retirementReturns: parseFloat(normalizedFormData.retirementReturns) || 8
        };
        
        const results = calculateFinancialReadinessResults(safeFormData);
        setCalculatedResults(results);
      } catch (error) {
        console.error('Error calculating financial readiness results:', error);
        setCalculatedResults(null);
      } finally {
        setIsLoading(false);
      }
    }
  }, [normalizedFormData, calculatedResults, isLoading]);

  if (!normalizedFormData || Object.keys(normalizedFormData).length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">
            No Financial Data Available
          </h1>
          <p className="text-gray-600">
            Please fill out the calculator form to see your financial readiness results.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating your financial readiness results...</p>
        </div>
      </div>
    );
  }

  // Ensure normalized form data has all required fields
  const safeFormData = {
    currentAge: parseFloat(normalizedFormData.currentAge) || 30,
    moneySaved: parseFloat(normalizedFormData.moneySaved) || 500000,
    monthlyExpenses: parseFloat(normalizedFormData.monthlyExpenses) || 50000,
    monthlyIncome: parseFloat(normalizedFormData.monthlyIncome) || 150000,
    retirementAge: parseFloat(normalizedFormData.retirementAge) || 60,
    monthlySIP: parseFloat(normalizedFormData.monthlySIP) || 30000,
    investmentYears: parseFloat(normalizedFormData.investmentYears) || 30,
    expectedReturns: parseFloat(normalizedFormData.expectedReturns) || 12,
    sipIncreaseRate: parseFloat(normalizedFormData.sipIncreaseRate) || 10,
    lifespan: parseFloat(normalizedFormData.lifespan) || 85,
    inflationRate: parseFloat(normalizedFormData.inflationRate) || 6,
    withdrawalIncrease: parseFloat(normalizedFormData.withdrawalIncrease) || 0,
    retirementReturns: parseFloat(normalizedFormData.retirementReturns) || 8
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Financial Readiness Dashboard
        </h1>
        <p className="text-gray-600">
          Your personalized financial freedom analysis based on your inputs
        </p>
      </div>

      <div className="space-y-8">
        <FinancialReadinessResultsDashboard 
          formData={safeFormData}
          results={calculatedResults || results?.financialReadiness}
        />

        {/* Financial Essentials Section */}
        <FinancialEssentialsSection />

        {/* Professional Guidance Section */}
        <ProfessionalGuidanceSection />
      </div>
    </div>
  );
}