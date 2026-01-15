// src/app/dashboard/financial-readiness/page.js
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import FinancialReadinessResultsDashboard from '@/components/financialReadiness/FinancialReadinessResultsDashboard';
import { calculateFinancialReadinessResults } from '@/lib/financialReadiness/financialReadinessEngine';
import FinancialEssentialsSection from '@/components/financialReadiness/FinancialEssentialsSection';
import ProfessionalGuidanceSection from '@/components/financialReadiness/ProfessionalGuidanceSection';
import { useRouter } from 'next/navigation';

export default function FinancialReadinessPage() {
  const router = useRouter();
  const { formData, results, financialReadinessResults } = useCalculator();
  const [calculatedResults, setCalculatedResults] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const signedIn = localStorage.getItem('vinca_signed_in');
    if (signedIn === 'true') {
      setIsAuthorized(true);
      setAuthChecked(true);
    } else {
      router.replace('/signin');
      setAuthChecked(true);
    }
  }, [router]);

  const baseInputs = useMemo(() => {
    if (financialReadinessResults?.inputs) return financialReadinessResults.inputs;
    if (results?.financialReadiness?.inputs) return results.financialReadiness.inputs;
    if (formData && Object.keys(formData).length) return formData;
    return null;
  }, [financialReadinessResults, formData, results]);

  useEffect(() => {
    if (!isAuthorized) return;
    if (financialReadinessResults) {
      setCalculatedResults(financialReadinessResults);
      return;
    }
    if (!baseInputs) return;
    try {
      const computed = calculateFinancialReadinessResults(baseInputs);
      setCalculatedResults(computed);
    } catch (error) {
      console.error('Error calculating financial readiness results:', error);
      setCalculatedResults(null);
    }
  }, [baseInputs, isAuthorized]);

  if (!authChecked) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  if (!baseInputs) {
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
          formData={baseInputs}
          results={calculatedResults}
        />

        {/* Financial Essentials Section */}
        <FinancialEssentialsSection />

        {/* Professional Guidance Section */}
        <ProfessionalGuidanceSection />
      </div>
    </div>
  );
}