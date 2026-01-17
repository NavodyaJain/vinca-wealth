'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePremium } from '@/lib/premium';
import ProSubscriptionModal from '@/components/financialReadiness/ProSubscriptionModal';
import PremiumBlurGate from '@/components/shared/PremiumBlurGate';
import HealthPremiumImpactAnalysis from '@/components/healthStress/HealthPremiumImpactAnalysis';
import PremiumHealthCategoryPreview from '@/components/healthStress/PremiumHealthCategoryPreview';
import { formatCurrency } from '@/lib/formatter';
import { computeHealthPremiumImpact } from '@/lib/healthStressPremium';

const safeNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const formatINR = (value, { compact = false, allowZero = false } = {}) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return '—';
  if (num === 0 && !allowZero) return '—';

  const abs = Math.abs(num);
  if (compact) {
    if (abs >= 1e7) return `₹${(num / 1e7).toFixed(1)} Cr`;
    if (abs >= 1e5) return `₹${(num / 1e5).toFixed(1)} L`;
    return `₹${Math.round(num).toLocaleString('en-IN')}`;
  }

  return formatCurrency(num);
};

const renderINR = (value, opts = {}) => formatINR(value, opts);
const formatAxisINR = (value) => formatINR(value, { compact: true, allowZero: true });

const formatInputs = (raw = {}) => {
  return {
    currentAge: safeNumber(raw.currentAge ?? raw.current_age ?? raw.age, 35),
    retirementAge: safeNumber(raw.retirementAge ?? raw.retirement_age, 60),
    lifespan: safeNumber(raw.lifespan ?? raw.lifeExpectancy ?? raw.life_expectancy, 85),
    monthlyExpenses: safeNumber(raw.monthlyExpenses ?? raw.expenses ?? raw.expense, 50000),
    monthlySIP: safeNumber(raw.monthlySIP ?? raw.sip ?? raw.monthlySip, 20000),
    moneySaved: safeNumber(raw.moneySaved ?? raw.currentCorpus ?? raw.corpus, 1500000),
    expectedReturns: safeNumber(raw.expectedReturns ?? raw.expected_returns, 10),
    inflationRate: safeNumber(raw.inflationRate ?? raw.inflation ?? raw.inflation_rate, 6),
    retirementReturns: safeNumber(raw.retirementReturns ?? raw.retirement_returns, 7),
    emergencyFund: safeNumber(raw.emergencyFund ?? raw.emergency_fund, 200000)
  };
};

const getMockInputs = () => ({
  currentAge: 35,
  retirementAge: 60,
  lifespan: 85,
  monthlyExpenses: 60000,
  monthlySIP: 25000,
  moneySaved: 2000000,
  expectedReturns: 11,
  inflationRate: 6,
  retirementReturns: 7,
  emergencyFund: 300000
});

export default function HealthStressPage() {
  const { isPremium, upgradeToPremium } = usePremium();
  const [userInputs, setUserInputs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedHealthCategory, setSelectedHealthCategory] = useState('everyday');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isProUser, setIsProUser] = useState(isPremium);

  const handleConfirmSubscription = () => {
    upgradeToPremium();
    setIsProUser(true);
    setIsPremiumModalOpen(false);
  };

  useEffect(() => {
    setIsProUser(isPremium);
  }, [isPremium]);

  useEffect(() => {
    const loadUserInputs = () => {
      try {
        const savedInputs =
          localStorage.getItem('financialReadinessInputs') ||
          localStorage.getItem('retirementInputs') ||
          localStorage.getItem('calculatorInputs');
        if (savedInputs) {
          const parsedInputs = JSON.parse(savedInputs);
          setUserInputs(formatInputs(parsedInputs));
        } else {
          setUserInputs(getMockInputs());
        }
      } catch (error) {
        console.error('Error loading user inputs:', error);
        setUserInputs(getMockInputs());
      } finally {
        setLoading(false);
      }
    };

    loadUserInputs();
  }, []);

  const premiumAnalysis = useMemo(() => computeHealthPremiumImpact(userInputs, selectedHealthCategory), [userInputs, selectedHealthCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your retirement data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Analyze how different health scenarios affect your retirement</h1>
            </div>
          </div>
        </div>

        {userInputs && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Retirement Plan Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
                <div className="text-sm text-slate-500">Current Age</div>
                <div className="font-semibold text-slate-900">{userInputs.currentAge}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
                <div className="text-sm text-slate-500">Retirement Age</div>
                <div className="font-semibold text-slate-900">{userInputs.retirementAge}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
                <div className="text-sm text-slate-500">Monthly SIP</div>
                <div className="font-semibold text-slate-900">{formatINR(userInputs.monthlySIP)}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
                <div className="text-sm text-slate-500">Current Savings</div>
                <div className="font-semibold text-slate-900">{formatINR(userInputs.moneySaved)}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
                <div className="text-sm text-slate-500">Expected Returns</div>
                <div className="font-semibold text-slate-900">{userInputs.expectedReturns}%</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-600 flex items-center gap-2">
              <p className="m-0">Inputs pulled from Financial Readiness.</p>
              <a href="/dashboard/financial-readiness" className="text-indigo-600 hover:text-indigo-800 font-medium">Update inputs</a>
            </div>
          </div>
        )}

        <div className="mb-10">
          <PremiumBlurGate
            isLocked={!isProUser}
            title="Unlock Personalized Health Stress Test"
            subtitle="Choose a scenario and see how it impacts your retirement plan sustainability."
            onUpgradeClick={() => setIsPremiumModalOpen(true)}
          >
            {!isProUser && (
              <PremiumHealthCategoryPreview
                selectedScenario={selectedHealthCategory}
                isPremium={isProUser}
              />
            )}

            <HealthPremiumImpactAnalysis
              analysis={premiumAnalysis}
              isLocked={!isProUser}
              selectedCategory={selectedHealthCategory}
              onSelectCategory={setSelectedHealthCategory}
            />
          </PremiumBlurGate>
        </div>
      </div>

      {isPremiumModalOpen && (
        <ProSubscriptionModal
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
          onConfirm={handleConfirmSubscription}
          onClose={() => setIsPremiumModalOpen(false)}
        />
      )}
    </div>
  );
}
