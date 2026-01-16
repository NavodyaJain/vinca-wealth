// src/app/dashboard/financial-readiness/page.js
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCalculator } from '@/context/CalculatorContext';
import FinancialReadinessResultsDashboard from '@/components/financialReadiness/FinancialReadinessResultsDashboard';
import FinancialEssentialsSection from '@/components/financialReadiness/FinancialEssentialsSection';
import ProfessionalGuidanceSection from '@/components/financialReadiness/ProfessionalGuidanceSection';
import InputField from '@/components/InputField';
import { calculateFinancialReadinessResults } from '@/lib/financialReadiness/financialReadinessEngine';

const DEFAULT_INPUTS = {
  currentAge: 30,
  moneySaved: 500000,
  monthlyExpenses: 50000,
  monthlyIncome: 100000,
  retirementAge: 60,
  monthlySIP: 20000,
  investmentYears: 30,
  expectedReturns: 12,
  sipIncreaseRate: 10,
  lifespan: 85,
  inflationRate: 6,
  withdrawalIncrease: 5,
  retirementReturns: 8
};

export default function FinancialReadinessPage() {
  const router = useRouter();
  const {
    formData,
    results,
    financialReadinessResults,
    updateFormData,
    setFormData,
    setFinancialReadinessResults,
    calculateResults
  } = useCalculator();
  const [calculatedResults, setCalculatedResults] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editStep, setEditStep] = useState(1);
  const [draftInputs, setDraftInputs] = useState(null);
  const [analyzeError, setAnalyzeError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    return DEFAULT_INPUTS;
  }, [financialReadinessResults, formData, results]);

  useEffect(() => {
    if (!isAuthorized) return;
    if (financialReadinessResults) {
      setCalculatedResults(financialReadinessResults);
      setDraftInputs(financialReadinessResults.inputs || baseInputs || DEFAULT_INPUTS);
      return;
    }
    if (!baseInputs) return;
    try {
      const computed = calculateFinancialReadinessResults(baseInputs);
      setCalculatedResults(computed);
      setDraftInputs(baseInputs);
    } catch (error) {
      console.error('Error calculating financial readiness results:', error);
      setCalculatedResults(null);
      setDraftInputs(baseInputs || DEFAULT_INPUTS);
    }
  }, [baseInputs, financialReadinessResults, isAuthorized]);

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

  const stepConfigs = {
    1: {
      title: 'Current situation',
      description: "Let's start with where you are today in your financial journey.",
      fields: [
        { id: 'currentAge', label: 'Current Age', type: 'number', min: 18, max: 75, suffix: 'years' },
        { id: 'moneySaved', label: 'Money Already Saved', type: 'currency', prefix: '₹' },
        { id: 'monthlyExpenses', label: 'Monthly Expenses', type: 'currency', prefix: '₹' },
        { id: 'monthlyIncome', label: 'Monthly Income', type: 'currency', prefix: '₹' },
        { id: 'retirementAge', label: 'Desired Retirement Age', type: 'number', min: 40, max: 80, suffix: 'years' }
      ]
    },
    2: {
      title: 'Investment plan',
      description: 'How are you planning to grow your wealth?',
      fields: [
        { id: 'monthlySIP', label: 'Monthly SIP Amount', type: 'currency', prefix: '₹' },
        { id: 'investmentYears', label: 'Investment Years', type: 'number', min: 5, max: 50, suffix: 'years' },
        { id: 'expectedReturns', label: 'Expected Annual Returns', type: 'percentage', min: 1, max: 30 },
        { id: 'sipIncreaseRate', label: 'Annual SIP Increase Rate', type: 'percentage', min: 0, max: 20 }
      ]
    },
    3: {
      title: 'Retirement goals',
      description: 'Define your retirement lifestyle and expectations.',
      fields: [
        { id: 'lifespan', label: 'Expected Lifespan', type: 'number', min: 70, max: 100, suffix: 'years' },
        { id: 'inflationRate', label: 'Expected Inflation Rate', type: 'percentage', min: 1, max: 15 },
        { id: 'withdrawalIncrease', label: 'Annual Withdrawal Increase', type: 'percentage', min: 0, max: 10 },
        { id: 'retirementReturns', label: 'Post-Retirement Returns', type: 'percentage', min: 4, max: 15 }
      ]
    }
  };

  const handleFieldChange = (id, value) => {
    setDraftInputs((prev) => ({ ...(prev || {}), [id]: value }));
  };

  const handleStepNav = (direction) => {
    setEditStep((prev) => {
      if (direction === 'next') return Math.min(3, prev + 1);
      if (direction === 'back') return Math.max(1, prev - 1);
      return prev;
    });
  };

  const handleAnalyze = async () => {
    if (!draftInputs) return;
    setIsAnalyzing(true);
    setAnalyzeError(null);
    try {
      const computed = calculateFinancialReadinessResults(draftInputs);
      setCalculatedResults(computed);
      if (setFinancialReadinessResults) setFinancialReadinessResults(computed);
      if (setFormData) setFormData(draftInputs);
      // Also update context incremental method for compatibility
      Object.entries(draftInputs).forEach(([key, val]) => updateFormData(key, val));
      if (calculateResults) calculateResults();
      // Persist inputs for other tools/pages
      localStorage.setItem('financialReadinessInputs', JSON.stringify(draftInputs));
      localStorage.setItem('vincaWealthData', JSON.stringify(draftInputs));
      setShowEditor(false);
      setTimeout(() => {
        const banner = document.getElementById('status-banner');
        if (banner) {
          banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    } catch (error) {
      console.error('Error analyzing financial readiness:', error);
      setAnalyzeError('Something went wrong while analyzing. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-4 py-5 sm:px-6 sm:py-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Financial Readiness Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600">Your personalized financial freedom analysis based on your inputs.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowEditor((prev) => !prev)}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 hover:bg-slate-50 shadow-sm"
          >
            {showEditor ? 'Close' : 'Edit Inputs'}
          </button>
        </div>

        {showEditor && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-6 space-y-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-gray-900">Edit your inputs</h3>
              <p className="text-sm text-gray-600">Update your assumptions and re-analyze instantly without leaving the dashboard.</p>
            </div>

            {draftInputs && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Step {editStep} of 3</div>
                    <div className="text-sm text-gray-600">{stepConfigs[editStep].title}</div>
                    <div className="text-xs text-gray-500">{stepConfigs[editStep].description}</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border ${editStep >= 1 ? 'border-emerald-400 text-emerald-600' : 'border-slate-300 text-slate-400'}`}>1</span>
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border ${editStep >= 2 ? 'border-emerald-400 text-emerald-600' : 'border-slate-300 text-slate-400'}`}>2</span>
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border ${editStep >= 3 ? 'border-emerald-400 text-emerald-600' : 'border-slate-300 text-slate-400'}`}>3</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stepConfigs[editStep].fields.map((field) => (
                    <InputField
                      key={field.id}
                      id={field.id}
                      label={field.label}
                      type={field.type}
                      value={draftInputs[field.id]}
                      onChange={(value) => handleFieldChange(field.id, value)}
                      min={field.min}
                      max={field.max}
                      prefix={field.prefix}
                      suffix={field.suffix}
                    />
                  ))}
                </div>

                {analyzeError && (
                  <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-3">
                    {analyzeError}
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleStepNav('back')}
                    className={`px-4 py-2 rounded-lg border text-sm font-semibold ${editStep === 1 ? 'border-slate-200 text-slate-300 cursor-not-allowed' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                    disabled={editStep === 1}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={editStep === 3 ? handleAnalyze : () => handleStepNav('next')}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-sm hover:bg-emerald-700"
                    disabled={isAnalyzing}
                  >
                    {editStep === 3 ? (isAnalyzing ? 'Analyzing...' : 'Analyze My Financial Readiness') : 'Next'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6 sm:space-y-8">
        <FinancialReadinessResultsDashboard 
          formData={baseInputs}
          results={calculatedResults}
        />

        <FinancialEssentialsSection />

        <ProfessionalGuidanceSection />
      </div>
    </div>
  );
}