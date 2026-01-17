'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ToolWelcomeHeader from '@/components/ToolWelcomeHeader';
import ToolStepperInputs from '@/components/ToolStepperInputs';
import FinancialReadinessStatusBanner from '@/components/financialReadiness/FinancialReadinessStatusBanner';
import { calculateFinancialReadinessResults } from '@/lib/financialReadiness/financialReadinessEngine';
import { defaultToolFormData, toolStepsConfig } from '@/lib/toolSteps';
import { useCalculator } from '@/context/CalculatorContext';

export default function FinancialReadinessToolPage() {
  const router = useRouter();
  const { setFormData: setGlobalFormData, setFinancialReadinessResults } = useCalculator();
  const [formData, setFormData] = useState(defaultToolFormData);
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const summaryRef = useRef(null);
  const storageKey = 'vinca_financial_readiness_inputs';

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const derivedYears = Math.max(1, Math.round((parsed.retirementAge ?? defaultToolFormData.retirementAge) - (parsed.currentAge ?? defaultToolFormData.currentAge)));
        const merged = { ...defaultToolFormData, ...parsed, investmentYears: parsed.investmentYears || derivedYears };
        setFormData(merged);
        setGlobalFormData?.(merged);
      }
    } catch (error) {
      console.warn('Unable to load saved financial readiness inputs', error);
    }
  }, [setGlobalFormData]);

  useEffect(() => {
    const derivedYears = Math.max(1, Math.round((formData.retirementAge || 0) - (formData.currentAge || 0)));
    if (!formData.investmentYears || formData.investmentYears <= 0) {
      setFormData((prev) => ({ ...prev, investmentYears: derivedYears }));
    }
  }, [formData.currentAge, formData.retirementAge, formData.investmentYears]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'retirementAge' || field === 'currentAge') {
        const derivedYears = Math.max(1, Math.round((updated.retirementAge || 0) - (updated.currentAge || 0)));
        updated.investmentYears = derivedYears;
      }
      return updated;
    });
  };

  const handleSubmit = () => {
    const derivedYears = Math.max(1, Math.round((formData.retirementAge || 0) - (formData.currentAge || 0)));
    const payload = { ...formData, investmentYears: derivedYears };

    const allValid = Object.values(payload).every((val) => val !== null && val !== undefined && val !== '' && !Number.isNaN(Number(val)));
    if (!allValid) {
      alert('Please complete all inputs with valid numbers before proceeding.');
      return;
    }

    try {
      setIsCalculating(true);
      const calculated = calculateFinancialReadinessResults(payload);
      setResults(calculated);
      setGlobalFormData?.(payload);
      setFinancialReadinessResults?.(calculated);
      localStorage.setItem(storageKey, JSON.stringify(payload));
      requestAnimationFrame(() => {
        if (summaryRef.current) {
          summaryRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      });
    } catch (error) {
      console.error('Unable to calculate financial readiness', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <ToolWelcomeHeader toolName="Financial Readiness" />

        <ToolStepperInputs
          steps={toolStepsConfig}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          ctaLabel="Analyze your Financial Readiness"
        />

        <div ref={summaryRef} className="space-y-4 sm:space-y-5">
          <div className="text-center bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Your Financial Readiness Summary</h2>
            <p className="text-sm text-slate-600 mt-1">We use your inputs to highlight readiness, corpus needs, and SIP actions.</p>
          </div>

          {isCalculating && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-3"></div>
              <p className="text-slate-600">Crunching your plan...</p>
            </div>
          )}

          {!isCalculating && results && (
            <>
              <FinancialReadinessStatusBanner results={results} />
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 text-center space-y-3">
                <p className="text-sm text-slate-700">Review your status preview, then continue for the full dashboard view.</p>
                <button
                  onClick={() => router.push('/signin')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  <span>✅ Get Detailed Analysis</span>
                </button>
              </div>
            </>
          )}

          {!isCalculating && !results && (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-5 sm:p-6 text-center text-slate-600">
              Complete all 3 steps and hit Analyze your Financial Readiness to see your personalized status preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
