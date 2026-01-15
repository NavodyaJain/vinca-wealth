'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePremium } from '@/lib/premium';
import HealthImpactCharts from '@/components/HealthImpactCharts';
import ProSubscriptionModal from '@/components/financialReadiness/ProSubscriptionModal';
import { Shield, AlertCircle, HeartPulse, Activity, Stethoscope, TrendingUp, Lock, Info } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export default function HealthStressPage() {
  const { isPremium, upgradeToPremium } = usePremium();
  const [userInputs, setUserInputs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedHealthCategory, setSelectedHealthCategory] = useState('everyday');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isProUser, setIsProUser] = useState(isPremium);

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

  const formatInputs = (inputs) => {
    return {
      currentAge: inputs.currentAge || 35,
      retirementAge: inputs.retirementAge || 60,
      lifespan: inputs.lifespan || 90,
      monthlyExpenses: inputs.monthlyExpenses || 50000,
      monthlySIP: inputs.monthlySIP || 20000,
      moneySaved: inputs.moneySaved || 1500000,
      expectedReturns: inputs.expectedReturns || 12,
      inflationRate: inputs.inflationRate || 6,
      emergencyFund: inputs.emergencyFund || 300000,
      investmentYears: inputs.investmentYears || inputs.retirementAge - inputs.currentAge || 25,
      withdrawalIncrease: inputs.withdrawalIncrease || 0,
      retirementReturns: inputs.retirementReturns || 8
    };
  };

  const getMockInputs = () => ({
    currentAge: 35,
    retirementAge: 60,
    lifespan: 90,
    monthlyExpenses: 50000,
    monthlySIP: 20000,
    moneySaved: 1500000,
    expectedReturns: 12,
    inflationRate: 6,
    emergencyFund: 300000,
    investmentYears: 25,
    withdrawalIncrease: 0,
    retirementReturns: 8
  });

  const handleCategorySelect = (categoryId) => setSelectedHealthCategory(categoryId);

  const handleConfirmSubscription = () => {
    if (selectedPlan) {
      setIsProUser(true);
      upgradeToPremium();
      setIsPremiumModalOpen(false);
    }
  };

  const getCategoryConfig = (categoryId) => {
    const configs = {
      everyday: {
        tag: 'Common',
        title: 'Everyday Health Costs',
        desc: 'Recurring OPD, medicines, diagnostics that rise every year.',
        freeTitle: 'Everyday Health Costs & Retirement',
        freeSubtitle:
          'Small recurring costs become big over decades due to medical inflation. At 8–10% annual growth, your health expenses can triple during a 30-year retirement.',
        educationalTitle: 'How Everyday Health Costs Impact Retirement',
        educationalSubtitle: 'Regular medical expenses compound over 30+ years of retirement.',
        premiumTitle: 'Your Annual Healthcare Budget'
      },
      planned: {
        tag: 'Likely',
        title: 'Planned Procedures',
        desc: 'Predictable surgery or scheduled treatment during retirement.',
        freeTitle: 'Planned Procedures & Retirement',
        freeSubtitle:
          "Predictable events are easier to plan — but still need a dedicated health buffer so you don't force emergency withdrawals from investments.",
        educationalTitle: 'How Planned Procedures Impact Retirement',
        educationalSubtitle: 'One-time or periodic costs that can be anticipated and planned for.',
        premiumTitle: 'Your Procedure Affordability Analysis'
      },
      highImpact: {
        tag: 'High Risk',
        title: 'Major Hospitalization',
        desc: 'Worst-case event with heavy cost + long recovery impact.',
        freeTitle: 'Major Hospitalization & Retirement',
        freeSubtitle:
          'Worst-case health events can disrupt a retirement plan quickly. Without emergency protection, people often break long-term investments early or cut lifestyle suddenly.',
        educationalTitle: 'How Major Hospitalization Impacts Retirement',
        educationalSubtitle: 'Critical health events that can significantly deplete retirement corpus.',
        premiumTitle: 'Your Critical Health Scenario Analysis'
      }
    };
    return configs[categoryId] || configs.everyday;
  };

  const safeNumber = (value, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  };

  const formatINR = (value, { compact = false, suffix = '' } = {}) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return '—';
    const abs = Math.abs(num);
    if (compact) {
      if (abs >= 1e7) return `₹${(num / 1e7).toFixed(1).replace(/\.0$/, '')} Cr${suffix}`;
      if (abs >= 1e5) return `₹${(num / 1e5).toFixed(1).replace(/\.0$/, '')} L${suffix}`;
    }
    return `₹${Math.round(num).toLocaleString('en-IN')}${suffix}`;
  };

  const formatAxisINR = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return '';
    const abs = Math.abs(num);
    if (abs >= 1e7) return `${(num / 1e7).toFixed(1).replace(/\.0$/, '')}Cr`;
    if (abs >= 1e5) return `${(num / 1e5).toFixed(1).replace(/\.0$/, '')}L`;
    return `${Math.round(num / 1000)}k`;
  };

  const missingDataTooltip = 'Complete Financial Readiness inputs to unlock full premium simulation.';

  const renderINR = (value, opts) => {
    const num = Number(value);
    const finite = Number.isFinite(num);
    return <span title={finite ? '' : missingDataTooltip}>{formatINR(value, opts)}</span>;
  };

  const buildPremiumModel = () => {
    if (!userInputs) return null;

    const inflation = safeNumber(userInputs.inflationRate, 6) / 100;
    const retirementReturns = safeNumber(userInputs.retirementReturns, 8) / 100;
    const baselineMonthly = safeNumber(userInputs.monthlyExpenses, 50000);
    const emergencyFund = safeNumber(userInputs.emergencyFund, 300000);
    const retirementAge = safeNumber(userInputs.retirementAge, 60);
    const lifespan = safeNumber(userInputs.lifespan, 90);
    const years = Math.min(30, Math.max(0, lifespan - retirementAge));
    const oopRate = 0.2;

    const behaviors = {
      everyday: {
        healthMonthly: baselineMonthly * 0.2,
        healthInflation: 0.09,
        eventYear: null,
        shock: 0,
        followUpMonthly: 0
      },
      planned: {
        healthMonthly: baselineMonthly * 0.1,
        healthInflation: 0.08,
        eventYear: 5,
        shock: 300000,
        followUpMonthly: baselineMonthly * 0.05
      },
      highImpact: {
        healthMonthly: baselineMonthly * 0.15,
        healthInflation: 0.1,
        eventYear: 1,
        shock: 800000,
        followUpMonthly: baselineMonthly * 0.1
      }
    };

    const behavior = behaviors[selectedHealthCategory] || behaviors.everyday;

    const withdrawals = [];
    const corpusSeries = [];

    const initialCorpus = safeNumber(userInputs.moneySaved, 1500000);
    let baselineCorpus = initialCorpus > 0 ? initialCorpus : 0;
    let stressedCorpus = baselineCorpus;
    let baselineFailureAge = null;
    let stressedFailureAge = null;

    for (let year = 0; year <= years; year++) {
      const age = retirementAge + year;

      const baselineAnnual = baselineMonthly * 12 * Math.pow(1 + inflation, year);
      const healthAnnualFull = (behavior.healthMonthly + behavior.followUpMonthly) * 12 * Math.pow(1 + behavior.healthInflation, year);
      const healthAnnualOOP = healthAnnualFull * oopRate;
      const shockFull = behavior.eventYear !== null && year === behavior.eventYear ? behavior.shock : 0;
      const shockOOP = shockFull * oopRate;
      const stressedAnnual = baselineAnnual + healthAnnualOOP + shockOOP;

      withdrawals.push({
        year,
        baseline: Math.round(baselineAnnual / 12),
        stressed: Math.round(stressedAnnual / 12),
        delta: Math.round((stressedAnnual - baselineAnnual) / 12)
      });

      if (baselineFailureAge === null) {
        baselineCorpus = baselineCorpus * (1 + retirementReturns) - baselineAnnual;
        if (baselineCorpus <= 0) baselineFailureAge = age;
        baselineCorpus = Math.max(0, baselineCorpus);
      }

      if (stressedFailureAge === null) {
        stressedCorpus = stressedCorpus * (1 + retirementReturns) - stressedAnnual;
        if (stressedCorpus <= 0) stressedFailureAge = age;
        stressedCorpus = Math.max(0, stressedCorpus);
      }

      corpusSeries.push({
        yearIndex: year,
        age,
        baseline: Math.round(baselineCorpus),
        stressed: Math.round(stressedCorpus)
      });
    }

    const baselineEndCorpus = Number.isFinite(baselineCorpus) ? Math.max(0, baselineCorpus) : 0;
    const stressedEndCorpus = Number.isFinite(stressedCorpus) ? Math.max(0, stressedCorpus) : 0;

    const monthlyHealthLoad = safeNumber(behavior.healthMonthly + behavior.followUpMonthly, baselineMonthly * 0.1);
    const annualHealthCost = Math.max(0, monthlyHealthLoad * 12);
    const monthlyOOP = monthlyHealthLoad * oopRate;
    const annualOOP = annualHealthCost * oopRate;

    const baselineDepletionAge = baselineFailureAge || retirementAge + years;
    const healthDepletionAge = stressedFailureAge || baselineDepletionAge;
    const yearsLost = Number.isFinite(baselineDepletionAge) && Number.isFinite(healthDepletionAge)
      ? Math.max(0, baselineDepletionAge - healthDepletionAge)
      : null;

    const extraCorpusRequired = Number.isFinite(annualOOP) && annualOOP > 0 ? Math.round(annualOOP / 0.04) : null;

    const getCorpusAtAge = (age, key) => {
      const exact = corpusSeries.find((point) => Number(point.age) === age);
      if (exact && Number.isFinite(exact[key])) return Math.max(0, exact[key]);
      const prior = [...corpusSeries].reverse().find((point) => Number(point.age) <= age && Number.isFinite(point[key]));
      if (prior) return Math.max(0, prior[key]);
      return null;
    };

    const baselineAtRetirement = getCorpusAtAge(retirementAge, 'baseline');
    const healthAtRetirement = getCorpusAtAge(retirementAge, 'stressed');
    const corpusDropAtRetirement = Number.isFinite(baselineAtRetirement) && Number.isFinite(healthAtRetirement)
      ? Math.max(0, baselineAtRetirement - healthAtRetirement)
      : null;

    const premiumComputed = {
      retirementAge,
      baselineCorpus: baselineEndCorpus,
      healthAdjustedCorpus: stressedEndCorpus,
      baselineDepletionAge,
      healthDepletionAge,
      monthlyHealthLoad,
      annualHealthCost,
      monthlyOOP,
      annualOOP,
      extraCorpusRequired,
      emergencyDaysWithBuffer: monthlyHealthLoad > 0 ? Math.round((emergencyFund / monthlyHealthLoad) * 30) : null,
      emergencyDaysWithoutBuffer: monthlyHealthLoad > 0 ? Math.round((emergencyFund / monthlyHealthLoad) * 25) : null,
      corpusDrop: Number.isFinite(baselineEndCorpus) && Number.isFinite(stressedEndCorpus)
        ? Math.max(0, baselineEndCorpus - stressedEndCorpus)
        : null,
      corpusDropPct: Number.isFinite(baselineEndCorpus) && baselineEndCorpus > 0 && Number.isFinite(stressedEndCorpus)
        ? Math.min(100, Math.round(((baselineEndCorpus - stressedEndCorpus) / baselineEndCorpus) * 100))
        : null,
      yearsLost: Number.isFinite(yearsLost) ? yearsLost : null,
      baselineMonthly,
      baselineAtRetirement,
      healthAtRetirement,
      corpusDropAtRetirement
    };

    const recommendations = {
      healthBuffer: Number.isFinite(monthlyOOP) ? Math.round(monthlyOOP * 12 * 2) : null,
      insuranceGap: Math.max(0, (behavior.shock * oopRate || 0) - emergencyFund),
      withdrawalCushion: Math.round(monthlyHealthLoad * 0.6)
    };

    return {
      withdrawals,
      corpusSeries,
      baselineFailureAge,
      stressedFailureAge,
      recommendations,
      premiumComputed
    };
  };

  const premiumModel = useMemo(() => buildPremiumModel(), [userInputs, selectedHealthCategory]);

  const premiumSummary = useMemo(() => {
    if (!premiumModel?.premiumComputed) return null;
    const { yearsLost, monthlyOOP, baselineMonthly, corpusDropAtRetirement } = premiumModel.premiumComputed;
    const loadRatio = baselineMonthly ? monthlyOOP / baselineMonthly : 0;

    if (yearsLost >= 3) {
      return { tone: 'severe', message: ' Plan breaks years earlier with this out-of-pocket load — add buffer + cover now.' };
    }
    if (yearsLost >= 1 || loadRatio >= 0.25) {
      return { tone: 'warn', message: ' Retirement runway shortens; set aside a dedicated health buffer to stay on track.' };
    }
    if (corpusDropAtRetirement && corpusDropAtRetirement > 0) {
      return { tone: 'mild', message: 'ℹ Health costs nibble corpus at retirement — build a buffer so compounding stays intact.' };
    }
    return { tone: 'mild', message: ' Plan stable under 20% out-of-pocket; keep tracking costs yearly.' };
  }, [premiumModel]);

  const depletionDisplay = useMemo(() => {
    const baseline = premiumModel?.premiumComputed?.baselineDepletionAge;
    const health = premiumModel?.premiumComputed?.healthDepletionAge;

    const hasBaseline = Number.isFinite(baseline);
    const hasHealth = Number.isFinite(health);

    if (!hasBaseline && !hasHealth) return '—';
    if (hasBaseline && hasHealth) {
      return baseline === health ? `${baseline}` : `${baseline}  ${health}`;
    }
    if (hasHealth) return `${health}`;
    return `${baseline}`;
  }, [premiumModel]);

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
              <h1 className="text-3xl font-bold text-slate-900">Will your retirement plan support your health?</h1>
              <p className="mt-3 text-lg text-slate-600 max-w-3xl">
                We simulate common health scenarios to understand how medical expenses may affect long-term financial independence.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <Shield size={18} />
              <span className="text-sm font-medium">Educational tool only</span>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Choose a health stress category to analyze</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => handleCategorySelect('everyday')}
              className={`text-left p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedHealthCategory === 'everyday' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full mb-4">Common</div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Everyday Health Costs</h3>
              </div>
              <p className="text-gray-600 text-sm">Recurring OPD, medicines, diagnostics that rise every year.</p>
              <div
                className={`mt-4 text-center py-2 px-4 rounded-lg font-medium ${
                  selectedHealthCategory === 'everyday' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {selectedHealthCategory === 'everyday' ? 'Selected' : 'Select Category'}
              </div>
            </button>

            <button
              onClick={() => handleCategorySelect('planned')}
              className={`text-left p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedHealthCategory === 'planned' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full mb-4">Likely</div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Stethoscope className="text-amber-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Planned Procedures</h3>
              </div>
              <p className="text-gray-600 text-sm">Predictable surgery or scheduled treatment during retirement.</p>
              <div
                className={`mt-4 text-center py-2 px-4 rounded-lg font-medium ${
                  selectedHealthCategory === 'planned' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {selectedHealthCategory === 'planned' ? 'Selected' : 'Select Category'}
              </div>
            </button>

            <button
              onClick={() => handleCategorySelect('highImpact')}
              className={`text-left p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedHealthCategory === 'highImpact' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full mb-4">High Risk</div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <HeartPulse className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Major Hospitalization</h3>
              </div>
              <p className="text-gray-600 text-sm">Worst-case event with heavy cost + long recovery impact.</p>
              <div
                className={`mt-4 text-center py-2 px-4 rounded-lg font-medium ${
                  selectedHealthCategory === 'highImpact' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {selectedHealthCategory === 'highImpact' ? 'Selected' : 'Select Category'}
              </div>
            </button>
          </div>
        </div>

        {userInputs && (
          <div className="mb-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50 rounded-2xl border border-blue-200 shadow-md p-6 sm:p-8">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-blue-700 text-white text-xs font-semibold rounded-full mb-4">Free Educational Preview</span>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{getCategoryConfig(selectedHealthCategory).freeTitle}</h2>
              <p className="text-slate-600 text-base mb-6">{getCategoryConfig(selectedHealthCategory).freeSubtitle}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/70 rounded-lg p-4 border border-blue-100">
                  <div className="text-sm font-semibold text-blue-900 mb-1">Retirement Risk</div>
                  <div className="text-lg font-bold text-blue-700">Withdrawal Pressure</div>
                  <div className="text-xs text-slate-600 mt-2">Higher health expenses require higher annual withdrawals from your corpus</div>
                </div>
                <div className="bg-white/70 rounded-lg p-4 border border-blue-100">
                  <div className="text-sm font-semibold text-blue-900 mb-1">Savings Impact</div>
                  <div className="text-lg font-bold text-blue-700">Corpus Drain</div>
                  <div className="text-xs text-slate-600 mt-2">Unexpected costs reduce long-term compounding and shorten survival</div>
                </div>
                <div className="bg-white/70 rounded-lg p-4 border border-blue-100">
                  <div className="text-sm font-semibold text-blue-900 mb-1">Reality Check</div>
                  <div className="text-lg font-bold text-blue-700">Inflation Shock</div>
                  <div className="text-xs text-slate-600 mt-2">Medical inflation is usually 8–10% yearly, outpacing general inflation</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <HealthImpactCharts scenario={getCategoryConfig(selectedHealthCategory)} userInputs={userInputs} isPremium={false} />
              </div>
            </div>

            <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">How health stress can change retirement outcomes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                      <span className="text-green-600 text-lg font-bold"></span>
                      <div>
                        <div className="text-sm font-medium text-slate-800">Higher yearly withdrawals</div>
                        <div className="text-xs text-slate-600">Corpus may last fewer years without planning</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-600 text-lg font-bold"></span>
                      <div>
                        <div className="text-sm font-medium text-slate-800">Unexpected early costs</div>
                        <div className="text-xs text-slate-600">Sequence risk becomes worse during downturns</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-600 text-lg font-bold"></span>
                      <div>
                        <div className="text-sm font-medium text-slate-800">Without a buffer</div>
                        <div className="text-xs text-slate-600">Lifestyle cuts become unavoidable</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-600 text-lg font-bold"></span>
                      <div>
                        <div className="text-sm font-medium text-slate-800">With insurance + buffer</div>
                        <div className="text-xs text-slate-600">Retirement confidence improves significantly</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600 italic">
                      <strong>Key insight:</strong> Health planning isn't about being fearful—it's about being prepared. A small buffer + proper insurance can make the difference between a stable and stressful retirement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {userInputs && (
          <div className="mb-8 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 rounded-2xl border border-purple-200 shadow-lg p-6 sm:p-8">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-purple-700 text-white text-xs font-semibold rounded-full mb-4">Premium Insight</span>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Personalized Health Impact (Premium)</h2>
              <p className="text-slate-600 text-base">See what this health scenario does to your retirement plan — and exactly how much extra corpus you need (after insurance).</p>
              {premiumSummary && (
                <div
                  className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium ${
                    premiumSummary.tone === 'severe'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : premiumSummary.tone === 'warn'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {premiumSummary.message}
                </div>
              )}
            </div>

            {!isProUser ? (
              <div className="relative">
                <div className="opacity-40 pointer-events-none">
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Premium Analysis Preview</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <div className="text-sm text-slate-600">Health-Adjusted Retirement Corpus</div>
                          <div className="text-2xl font-bold text-slate-800">₹2.8 Cr</div>
                          <div className="text-sm text-slate-500">vs ₹3.2 Cr baseline</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <div className="text-sm text-slate-600">Depletion Age</div>
                          <div className="text-2xl font-bold text-slate-800">82 years</div>
                          <div className="text-sm text-slate-500">vs 87 years baseline</div>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-sm text-slate-600 mb-2">Hospitalization Affordability</div>
                        <div className="h-40 flex items-center justify-center text-slate-400">[Premium chart preview]</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mb-4">
                      <Lock size={28} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Unlock {getCategoryConfig(selectedHealthCategory).premiumTitle}</h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">Get detailed analysis of how this health scenario specifically impacts your retirement plan, with personalized projections and affordability metrics.</p>
                    <button
                      onClick={() => setIsPremiumModalOpen(true)}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      Upgrade to Pro
                    </button>
                    <p className="text-xs text-slate-500 mt-4">Includes all premium features across the platform</p>
                  </div>
                </div>
              </div>
            ) : !premiumModel ? (
              <div className="text-slate-600">Add your retirement inputs to see a personalized projection.</div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-8">
                {premiumModel.premiumComputed?.baselineCorpus === 0 && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                    <Info size={16} className="mt-0.5" />
                    <div>Your current corpus is ₹0 in simulation — premium insights will appear once corpus is positive.</div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-purple-50 to-white">
                    <div className="text-xs font-semibold text-purple-700 mb-2 flex items-center justify-between">
                      Out-of-Pocket Health Cost (20%)
                      <span className="px-2 py-0.5 text-[10px] rounded bg-purple-100 text-purple-700">80% insured</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{renderINR(premiumModel.premiumComputed.monthlyOOP, { compact: true, suffix: '/mo' })}</div>
                    <div className="text-xs text-slate-600 mt-1">Insurance covers 80%. You pay 20%.</div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white">
                    <div className="text-xs font-semibold text-emerald-700 mb-2">Extra Corpus Required</div>
                    <div className="text-2xl font-bold text-slate-900">{renderINR(premiumModel.premiumComputed.extraCorpusRequired, { compact: true })}</div>
                    <div className="text-xs text-slate-600 mt-1">To absorb this health stress without lifestyle cuts.</div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-rose-50 to-white">
                    <div className="text-xs font-semibold text-rose-700 mb-2">Depletion Age Impact</div>
                    <div className="text-lg font-bold text-slate-900">{depletionDisplay}</div>
                    <div className="text-xs text-slate-600 mt-1">Breaks earlier by {Number.isFinite(premiumModel.premiumComputed.yearsLost) ? `${premiumModel.premiumComputed.yearsLost} yrs` : '—'}</div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white">
                    <div className="text-xs font-semibold text-blue-700 mb-2">Corpus Drop at Retirement</div>
                    <div className="text-2xl font-bold text-slate-900">{renderINR(premiumModel.premiumComputed.corpusDropAtRetirement, { compact: true })}</div>
                    <div className="text-xs text-slate-600 mt-1">
                      Baseline {renderINR(premiumModel.premiumComputed.baselineAtRetirement, { compact: true })} vs With Health {renderINR(premiumModel.premiumComputed.healthAtRetirement, { compact: true })}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-semibold text-slate-800">Corpus Over Time (Baseline vs With Disease)</div>
                        <div className="text-xs text-slate-500">Monthly out-of-pocket included</div>
                      </div>
                      <div className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700">Runway</div>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">Read: Compare how fast your corpus falls with and without health costs. Dotted lines mark the break age.</p>
                    <div className="h-64">
                      <ResponsiveContainer>
                        <LineChart data={premiumModel.corpusSeries}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis
                            dataKey="yearIndex"
                            tickFormatter={(v) => v}
                            tick={{ fontSize: 12 }}
                            label={{ value: 'Years after retirement', position: 'insideBottom', offset: -5 }}
                          />
                          <YAxis tickFormatter={(v) => formatAxisINR(v)} tick={{ fontSize: 12 }} domain={[0, (dataMax) => (dataMax || 1) * 1.2]} />
                          <Tooltip content={({ payload, label }) => {
                            if (!payload || !payload.length) return null;
                            const baseline = payload.find((p) => p.dataKey === 'baseline')?.value;
                            const stressed = payload.find((p) => p.dataKey === 'stressed')?.value;
                            return (
                              <div className="bg-white border border-slate-200 rounded-md p-3 shadow-sm text-xs text-slate-700">
                                <div className="font-semibold text-slate-800 mb-1">Year {label}</div>
                                <div>Baseline: {formatINR(baseline)}</div>
                                <div>With health: {formatINR(stressed)}</div>
                              </div>
                            );
                          }} />
                          <Legend formatter={(value) => (value === 'stressed' ? 'With health' : 'Baseline')} />
                          {premiumModel.stressedFailureAge && (
                            <ReferenceLine
                              x={Number(premiumModel.stressedFailureAge) - premiumModel.premiumComputed.retirementAge}
                              stroke="#ef4444"
                              strokeDasharray="4 4"
                              label={{ value: 'Breaks here', position: 'top', fill: '#b91c1c', fontSize: 10 }}
                            />
                          )}
                          {premiumModel.baselineFailureAge && (
                            <ReferenceLine
                              x={Number(premiumModel.baselineFailureAge) - premiumModel.premiumComputed.retirementAge}
                              stroke="#0ea5e9"
                              strokeDasharray="4 4"
                              label={{ value: 'Baseline break', position: 'top', fill: '#0369a1', fontSize: 10 }}
                            />
                          )}
                          <Line type="monotone" dataKey="baseline" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Baseline" />
                          <Line type="monotone" dataKey="stressed" stroke="#7c3aed" strokeWidth={2} dot={false} name="With Health" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-semibold text-slate-800">Monthly Withdrawal Pressure</div>
                        <div className="text-xs text-slate-500">Includes 20% out-of-pocket health costs</div>
                      </div>
                      <div className="px-2 py-1 text-xs rounded bg-emerald-100 text-emerald-700">Flows</div>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">Read: See how monthly withdrawals rise once health expenses are added. Gap shows extra cash strain each year.</p>
                    <div className="h-64">
                      <ResponsiveContainer>
                        <LineChart data={premiumModel.withdrawals}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="year" tick={{ fontSize: 12 }} label={{ value: 'Years after retirement', position: 'insideBottom', offset: -5 }} />
                          <YAxis tickFormatter={(v) => formatAxisINR(v)} tick={{ fontSize: 12 }} />
                          <Tooltip content={({ payload, label }) => {
                            if (!payload || !payload.length) return null;
                            const baseline = payload.find((p) => p.dataKey === 'baseline')?.value;
                            const stressed = payload.find((p) => p.dataKey === 'stressed')?.value;
                            const delta = Number.isFinite(baseline) && Number.isFinite(stressed) ? stressed - baseline : null;
                            return (
                              <div className="bg-white border border-slate-200 rounded-md p-3 shadow-sm text-xs text-slate-700">
                                <div className="font-semibold text-slate-800 mb-1">Year {label}</div>
                                <div>Baseline: {formatINR(baseline)}</div>
                                <div>With health: {formatINR(stressed)}</div>
                                {delta !== null && <div className={delta >= 0 ? 'text-rose-600' : 'text-emerald-600'}>Δ {formatINR(delta)}</div>}
                              </div>
                            );
                          }} />
                          <Legend formatter={(value) => (value === 'stressed' ? 'With health' : 'Baseline')} />
                          <Line type="monotone" dataKey="baseline" stroke="#22c55e" strokeWidth={2} dot={false} name="Baseline" />
                          <Line type="monotone" dataKey="stressed" stroke="#a855f7" strokeWidth={2} dot={false} name="With Health" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-slate-200 rounded-xl bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={16} className="text-purple-600" />
                    <div className="text-sm font-semibold text-slate-800">Recommended Fix Plan</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-700">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-xs text-slate-500 mb-1">Health buffer (2 years)</div>
                      <div className="text-lg font-semibold text-slate-900">{renderINR(premiumModel.premiumComputed.monthlyOOP * 12 * 2, { compact: true })}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-xs text-slate-500 mb-1">Insurance gap (if any)</div>
                      <div className="text-lg font-semibold text-slate-900">{renderINR(premiumModel.recommendations.insuranceGap, { compact: true })}</div>
                      <div className="text-[11px] text-slate-500 mt-1">Assumes 80% cover on shocks.</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-xs text-slate-500 mb-1">Extra SIP needed</div>
                      <div className="text-lg font-semibold text-slate-900">
                        {(() => {
                          const monthsToRetirement = Math.max(1, (safeNumber(userInputs?.retirementAge, 60) - safeNumber(userInputs?.currentAge, 35)) * 12);
                          const sip = premiumModel.premiumComputed.extraCorpusRequired
                            ? Math.round(premiumModel.premiumComputed.extraCorpusRequired / monthsToRetirement)
                            : null;
                          return renderINR(sip, { compact: true, suffix: '/mo' });
                        })()}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">Simple straight-line catch-up.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
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
