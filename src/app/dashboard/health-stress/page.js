'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePremium } from '@/lib/premium';
import ProSubscriptionModal from '@/components/financialReadiness/ProSubscriptionModal';
import PremiumBlurGate from '@/components/shared/PremiumBlurGate';
import HealthPremiumImpactAnalysis from '@/components/healthStress/HealthPremiumImpactAnalysis';
import PremiumHealthCategoryPreview from '@/components/healthStress/PremiumHealthCategoryPreview';
import JourneyUnlockBanner from '@/components/profile/JourneyUnlockBanner';
import SaveReadingCTA from '@/components/shared/SaveReadingCTA';
import { formatCurrency } from '@/lib/formatter';
import { computeHealthPremiumImpact } from '@/lib/healthStressPremium';
import { 
  saveUserReading, 
  getToolsCompletionStatus, 
  areAllToolsCompleted,
  unlockPersonalityIfEligible,
  isToolCompleted
} from '@/lib/userJourneyStorage';

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
  const router = useRouter();
  const { isPremium, upgradeToPremium } = usePremium();
  const [userInputs, setUserInputs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedHealthCategory, setSelectedHealthCategory] = useState('everyday');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isProUser, setIsProUser] = useState(isPremium);
  const [completionStatus, setCompletionStatus] = useState(null);
  const [showUnlockBanner, setShowUnlockBanner] = useState(false);
  const [personalityUnlocked, setPersonalityUnlocked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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
    
    // Check completion status on load
    const status = getToolsCompletionStatus();
    setCompletionStatus(status);
    
    // Check if already saved
    const alreadySaved = isToolCompleted('healthStress');
    setIsSaved(alreadySaved);
    
    // Show unlock banner only if already saved and all tools complete
    if (alreadySaved && areAllToolsCompleted()) {
      setShowUnlockBanner(true);
    }
  }, []);

  const premiumAnalysis = useMemo(() => computeHealthPremiumImpact(userInputs, selectedHealthCategory), [userInputs, selectedHealthCategory]);

  // Handler for explicit save
  const handleSaveReading = useCallback(() => {
    if (!userInputs || !isProUser) return;
    
    // Map category to expected format
    const categoryMap = {
      'everyday': 'Everyday',
      'planned': 'Planned',
      'hospitalization': 'Hospitalization'
    };
    
    const chosenCategory = categoryMap[selectedHealthCategory] || 'Everyday';
    const analysis = computeHealthPremiumImpact(userInputs, selectedHealthCategory);
    
    // Save the reading
    saveUserReading('healthStress', {
      chosenCategory,
      healthAdjustedCorpus: analysis?.adjustedCorpus || 0,
      sustainabilityTillAge: analysis?.sustainableTillAge || 85
    });
    
    setIsSaved(true);
    
    // Update completion status
    const status = getToolsCompletionStatus();
    setCompletionStatus(status);
    
    // Show unlock banner after saving
    setShowUnlockBanner(true);
    
    // Try to unlock personality if all tools completed
    if (areAllToolsCompleted()) {
      const personality = unlockPersonalityIfEligible();
      if (personality) {
        setPersonalityUnlocked(true);
      }
    }
  }, [userInputs, selectedHealthCategory, isProUser]);

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

        {/* Save Reading Button - After health analysis */}

        {isProUser && userInputs && (
          <>
            <div className="mb-6 flex justify-end">
              <SaveReadingCTA
                onSave={handleSaveReading}
                isSaved={isSaved}
              />
            </div>
            {/* Elevate CTA Card */}
            <div className="mb-8">
              <div className="rounded-2xl border bg-emerald-50 shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100">
                    {/* Icon: Sparkles from lucide-react */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M19 21v-4m2 2h-4M12 8v8m-4-4h8" /></svg>
                  </span>
                  <div>
                    <div className="text-base md:text-lg font-semibold text-emerald-900 mb-1">Elevate your retirement planning</div>
                    <div className="text-slate-600 text-sm mb-1">Get clarity on your plan with a 1:1 educational session with our Wealth Manager.</div>
                    <div className="text-xs text-slate-500">Educational guidance only. No stock tips or recommendations.</div>
                  </div>
                </div>
                <div className="shrink-0 md:ml-4">
                  <button
                    className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-base hover:bg-emerald-700 transition"
                    onClick={() => router.push('/dashboard/investor-hub/elevate')}
                  >
                    Book a 1:1 session
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Journey Unlock Banner removed as requested */}
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
