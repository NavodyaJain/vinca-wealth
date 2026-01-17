"use client";

import { useEffect, useMemo, useState } from "react";
import LifestyleCharts from "@/components/LifestylePlanner/LifestyleCharts";
import HealthStressCTA from "@/components/LifestylePlanner/HealthStressCTA";
import ProfessionalGuidanceSection from "@/components/financialReadiness/ProfessionalGuidanceSection";
import { formatCurrency } from "@/lib/formatter";
import { estimateCorpusAtRetirement, simulateRetirementTimeline } from "@/lib/lifestylePlanner";

export default function LifestylePlannerPage() {
  const mockInputs = {
    currentAge: 30,
    retirementAge: 60,
    lifespan: 90,
    monthlyExpenses: 50000,
    monthlySIP: 20000,
    moneySaved: 1500000,
    expectedReturns: 12,
    inflationRate: 6,
    emergencyFund: 300000,
    retirementReturns: 8
  };

  const [inputs, setInputs] = useState(mockInputs);
  const [supportedMonthlyIncomeAtRetirement, setSupportedMonthlyIncomeAtRetirement] = useState(0);
  const [paycheckTimelineData, setPaycheckTimelineData] = useState([]);
  const [lifestyleShift, setLifestyleShift] = useState(0); // percent delta relative to base expenses

  useEffect(() => {
    try {
      const storedInputs = localStorage.getItem('financialReadinessInputs') || localStorage.getItem('retirementInputs') || localStorage.getItem('calculatorInputs');
      if (storedInputs) {
        const parsedInputs = JSON.parse(storedInputs);
        setInputs((prev) => ({ ...prev, ...parsedInputs }));
      }
    } catch (error) {
      console.log('Using default inputs for Lifestyle Planner');
    }
  }, []);

  useEffect(() => {
    const startingCorpus = estimateCorpusAtRetirement(inputs);

    const simulation = simulateRetirementTimeline({
      currentAge: inputs.currentAge,
      retirementAge: inputs.retirementAge,
      expectedLifespan: inputs.lifespan,
      startingCorpus,
      desiredMonthlyIncomeToday: inputs.monthlyExpenses,
      inflationRate: inputs.inflationRate,
      postRetirementReturnRate: inputs.retirementReturns
    });
    setPaycheckTimelineData(
      simulation.timeline.map((row) => ({
        age: row.age,
        requiredMonthly: row.desiredMonthly,
        supportedMonthly: row.supportedMonthly,
        gapMonthly: Math.max(row.desiredMonthly - row.supportedMonthly, 0)
      }))
    );

    const firstSupported = simulation.timeline[0]?.supportedMonthly || 0;
    setSupportedMonthlyIncomeAtRetirement(firstSupported);
  }, [inputs]);

  const safeNumber = (value, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  };

  const formatINR = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return '—';
    return formatCurrency(num);
  };

  const hasValidPremiumInputs = useMemo(() => {
    const currentAge = safeNumber(inputs.currentAge, null);
    const retirementAge = safeNumber(inputs.retirementAge, null);
    const lifespan = safeNumber(inputs.lifespan, null);
    const monthlyExpenses = safeNumber(inputs.monthlyExpenses, 50000);
    const monthlySIP = safeNumber(inputs.monthlySIP, 0);
    const expectedReturns = safeNumber(inputs.expectedReturns, null);
    const inflationRate = safeNumber(inputs.inflationRate, null);
    const retirementReturns = safeNumber(inputs.retirementReturns, null);

    if ([currentAge, retirementAge, lifespan, expectedReturns, inflationRate, retirementReturns].some((v) => v === null)) return false;
    if (retirementAge <= currentAge) return false;
    if (lifespan <= retirementAge) return false;
    if (monthlyExpenses <= 0) return false;
    if (monthlySIP < 0) return false;
    if (expectedReturns < 0 || inflationRate < 0 || retirementReturns < 0) return false;
    return true;
  }, [inputs]);

  const premiumData = useMemo(() => {
    if (!hasValidPremiumInputs) return { valid: false };

    const currentAge = safeNumber(inputs.currentAge, 0);
    const retirementAge = safeNumber(inputs.retirementAge, 0);
    const lifespan = safeNumber(inputs.lifespan, 90);
    const baseMonthlyExpense = Math.max(0, safeNumber(inputs.monthlyExpenses, 50000));
    const inflationRate = Math.max(0, safeNumber(inputs.inflationRate, 0));
    const retirementReturns = safeNumber(inputs.retirementReturns, 0);
    const supportedMonthlyPlan = Math.max(0, safeNumber(supportedMonthlyIncomeAtRetirement, 0));

    const clampedShift = Math.min(100, Math.max(-50, lifestyleShift));
    const multiplier = 1 + clampedShift / 100;
    const targetMonthlyToday = Math.max(0, baseMonthlyExpense * multiplier);
    const yearsToRetirement = Math.max(retirementAge - currentAge, 0);
    const requiredMonthlyAtRetirement = targetMonthlyToday * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    const safeWithdrawalRate = 0.04;
    const requiredCorpus = safeWithdrawalRate > 0 ? (requiredMonthlyAtRetirement * 12) / safeWithdrawalRate : Infinity;

    const startingCorpus = Math.max(0, safeNumber(estimateCorpusAtRetirement(inputs), 0));

    const sustainabilitySimulation = simulateRetirementTimeline({
      currentAge,
      retirementAge,
      expectedLifespan: lifespan,
      startingCorpus,
      desiredMonthlyIncomeToday: targetMonthlyToday,
      inflationRate,
      postRetirementReturnRate: retirementReturns
    });

    const retirementDuration = Math.max(lifespan - retirementAge, 0);
    const yearsSupportedLifestyle = sustainabilitySimulation.yearsSupported;
    const failureAgeLifestyle = sustainabilitySimulation.failureAge;
    const firstShortfallMonthlyGap = sustainabilitySimulation.gapMonthlyAtFailure;

    let sustainabilityLevel = 'Affordable';
    let sustainabilityTone = { bg: 'bg-emerald-50', text: 'text-emerald-700' };
    if (yearsSupportedLifestyle < retirementDuration) {
      if (yearsSupportedLifestyle >= retirementDuration * 0.6) {
        sustainabilityLevel = 'Tight';
        sustainabilityTone = { bg: 'bg-amber-50', text: 'text-amber-700' };
      } else {
        sustainabilityLevel = 'Unaffordable';
        sustainabilityTone = { bg: 'bg-rose-50', text: 'text-rose-700' };
      }
    }

    const monthlyGap = requiredMonthlyAtRetirement - supportedMonthlyPlan;

    const tier = multiplier <= 1.0 ? 'Essentials' : multiplier <= 1.5 ? 'Comfortable' : 'Premium';

    const findRetireLaterSolution = () => {
      if (yearsSupportedLifestyle >= retirementDuration) {
        return { found: true, extraYears: 0, newRetirementAge: retirementAge, label: 'Already sustainable at current retirement age ✅' };
      }
      for (let extra = 1; extra <= 15; extra += 1) {
        const candidateAge = retirementAge + extra;
        const candidateInputs = { ...inputs, retirementAge: candidateAge };
        const candidateCorpus = Math.max(0, safeNumber(estimateCorpusAtRetirement(candidateInputs), 0));
        const sim = simulateRetirementTimeline({
          currentAge,
          retirementAge: candidateAge,
          expectedLifespan: lifespan,
          startingCorpus: candidateCorpus,
          desiredMonthlyIncomeToday: targetMonthlyToday,
          inflationRate,
          postRetirementReturnRate: retirementReturns
        });
        const duration = Math.max(lifespan - candidateAge, 0);
        if (sim.yearsSupported >= duration) {
          return {
            found: true,
            extraYears: extra,
            newRetirementAge: candidateAge,
            label: `Retire later by ${extra} year${extra > 1 ? 's' : ''}`,
            sustainableTillAge: sim.sustainableTillAge
          };
        }
      }
      return { found: false };
    };

    const findSipIncreaseSolution = () => {
      if (yearsSupportedLifestyle >= retirementDuration) {
        return { found: true, increase: 0, newSip: inputs.monthlySIP, label: 'SIP increase not required ✅' };
      }
      const step = 1000;
      const maxIncrease = 100000;
      for (let inc = step; inc <= maxIncrease; inc += step) {
        const candidateSip = Math.max(0, safeNumber(inputs.monthlySIP, 0) + inc);
        const candidateInputs = { ...inputs, monthlySIP: candidateSip };
        const candidateCorpus = Math.max(0, safeNumber(estimateCorpusAtRetirement(candidateInputs), 0));
        const sim = simulateRetirementTimeline({
          currentAge,
          retirementAge,
          expectedLifespan: lifespan,
          startingCorpus: candidateCorpus,
          desiredMonthlyIncomeToday: targetMonthlyToday,
          inflationRate,
          postRetirementReturnRate: retirementReturns
        });
        if (sim.yearsSupported >= retirementDuration) {
          return {
            found: true,
            increase: inc,
            newSip: candidateSip,
            label: `Increase SIP by ₹${inc.toLocaleString('en-IN')}/month`
          };
        }
      }
      return { found: false };
    };

    return {
      valid: true,
      multiplier,
      targetMonthlyToday,
      requiredMonthlyAtRetirement,
      requiredCorpus,
      monthlyGap,
      supportedMonthlyPlan,
      sustainabilityLevel,
      sustainabilityTone,
      yearsSupportedLifestyle,
      retirementDuration,
      failureAgeLifestyle,
      firstShortfallMonthlyGap,
      tier,
      retireLaterSolution: findRetireLaterSolution(),
      sipIncreaseSolution: findSipIncreaseSolution()
    };
  }, [hasValidPremiumInputs, inputs, lifestyleShift, supportedMonthlyIncomeAtRetirement]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-lg font-semibold text-slate-900 mb-2">Lifestyle your plan can afford.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Retirement Plan Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
            <div className="text-sm text-slate-500">Current Age</div>
            <div className="font-semibold text-slate-900">{inputs.currentAge}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
            <div className="text-sm text-slate-500">Retirement Age</div>
            <div className="font-semibold text-slate-900">{inputs.retirementAge}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
            <div className="text-sm text-slate-500">Monthly SIP</div>
            <div className="font-semibold text-slate-900">₹{inputs.monthlySIP.toLocaleString('en-IN')}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
            <div className="text-sm text-slate-500">Current Savings</div>
            <div className="font-semibold text-slate-900">₹{inputs.moneySaved.toLocaleString('en-IN')}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white/70 p-3">
            <div className="text-sm text-slate-500">Expected Returns</div>
            <div className="font-semibold text-slate-900">{inputs.expectedReturns}%</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-slate-600 flex items-center gap-2">
          <p className="m-0">Inputs pulled from Financial Readiness.</p>
          <a href="/dashboard/financial-readiness" className="text-indigo-600 hover:text-indigo-800 font-medium">Update inputs</a>
        </div>
      </div>

      {/* Summary and affordability card removed per request; calculations remain for downstream sections. */}

      <div className="mb-10">
        <div className="bg-white rounded-2xl border border-purple-200 shadow-lg p-6 sm:p-8">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-slate-900">Plan your retirement for your desired lifestyle</h3>
            <p className="text-slate-600 text-sm">Choose a spending level at retirement and see the corpus, income, and fixes needed to sustain it.</p>
          </div>

          {!hasValidPremiumInputs ? (
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-slate-700 text-sm">
              <div className="font-semibold text-slate-900 mb-1">Complete your Financial Readiness plan first</div>
              <div>We need your retirement age, expenses, SIP, and corpus estimate to run Lifestyle Planning.</div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-slate-50 to-amber-50 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                  <div className="text-sm font-semibold text-slate-800">Selected lifestyle: {lifestyleShift >= 0 ? `+${lifestyleShift}%` : `${lifestyleShift}%`}</div>
                  <div className="text-sm text-slate-700">Selected Monthly Expense: {formatINR(premiumData.targetMonthlyToday)} / month</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">-50%</span>
                  <div className="flex-1">
                    <div className="relative w-full h-2 rounded-full overflow-hidden" style={{ background: 'linear-gradient(90deg, #bbf7d0 0%, #e2e8f0 50%, #fecdd3 100%)' }}>
                      <input
                        type="range"
                        min={-50}
                        max={100}
                        step={5}
                        value={lifestyleShift}
                        onChange={(e) => setLifestyleShift(Number(e.target.value))}
                        disabled={!hasValidPremiumInputs}
                        className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                      />
                      <div
                        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full border border-white shadow flex items-center justify-center"
                        style={{ left: `${((lifestyleShift + 50) / 150) * 100}%`, background: '#10b981' }}
                      >
                        <span className="text-[9px] text-white leading-none">⇆</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">+100%</span>
                </div>
                <div className="text-xs text-slate-500 mt-2">Adjust spending relative to your current expenses.</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{premiumData.tier === 'Essentials' ? '📊' : premiumData.tier === 'Comfortable' ? '✨' : '🌟'}</div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{premiumData.tier} Lifestyle</div>
                    <div className="text-xs text-slate-600 mb-1">
                      {premiumData.tier === 'Essentials' && 'Calm, needs-focused living with lean buffer.'}
                      {premiumData.tier === 'Comfortable' && 'Comfort upgrades and hobbies with flexibility.'}
                      {premiumData.tier === 'Premium' && 'Experiences, travel, and higher flexibility.'}
                    </div>
                    <div className="text-sm text-slate-700">Selected Monthly Expense: <span className="font-semibold text-slate-900">{formatINR(premiumData.targetMonthlyToday)}</span></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-linear-to-br from-slate-50 to-white">
                  <div className="text-xs font-semibold text-slate-700 mb-1">Required Monthly Income at Retirement</div>
                  <div className="text-2xl font-bold text-slate-900">{formatINR(premiumData.requiredMonthlyAtRetirement)} / month</div>
                  <div className="text-xs text-slate-600">Inflation-adjusted to your retirement age.</div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-linear-to-br from-purple-50 to-white">
                  <div className="text-xs font-semibold text-purple-700 mb-1">Required Corpus for this Lifestyle</div>
                  <div className="text-2xl font-bold text-slate-900">{formatINR(premiumData.requiredCorpus)}</div>
                  <div className="text-xs text-slate-600">Based on 4% safe withdrawal.</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap items-center gap-2 text-sm text-slate-800">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${premiumData.monthlyGap <= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {premiumData.monthlyGap <= 0 ? 'No gap' : `Gap ${formatINR(premiumData.monthlyGap)} / month`}
                </span>
                <span>Your current plan supports {formatINR(premiumData.supportedMonthlyPlan)} / month, but this lifestyle needs {formatINR(premiumData.requiredMonthlyAtRetirement)} / month.</span>
              </div>

              <div className={`p-4 rounded-xl border ${premiumData.sustainabilityTone.bg} ${premiumData.sustainabilityTone.text} border-current/20`}>
                <div className="text-sm font-semibold">{premiumData.sustainabilityLevel === 'Affordable' ? `Sustainable till age ${inputs.lifespan}` : premiumData.sustainabilityLevel === 'Tight' ? `Sustainable till age ${inputs.retirementAge + premiumData.yearsSupportedLifestyle} (tight)` : `Runs out around age ${premiumData.failureAgeLifestyle || inputs.retirementAge + premiumData.yearsSupportedLifestyle}`}</div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold text-slate-900">To afford this lifestyle you can either</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                    {premiumData.retireLaterSolution.found ? (
                      <>
                        <div className="text-sm text-slate-700">{premiumData.retireLaterSolution.label}</div>
                        <div className="text-xs text-slate-600 mt-1">New retirement age: {premiumData.retireLaterSolution.newRetirementAge}</div>
                      </>
                    ) : (
                      <div className="text-sm text-rose-700">This lifestyle may be unrealistic under current constraints.</div>
                    )}
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                    {premiumData.sipIncreaseSolution.found ? (
                      <>
                        <div className="text-sm text-slate-700">{premiumData.sipIncreaseSolution.label}</div>
                        <div className="text-xs text-slate-600 mt-1">Total SIP becomes {formatINR(premiumData.sipIncreaseSolution.newSip)} / month</div>
                      </>
                    ) : (
                      <div className="text-sm text-rose-700">This lifestyle may be unrealistic under current constraints.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-10">
        <LifestyleCharts paycheckTimelineData={paycheckTimelineData} />
      </div>

      <div className="mb-10">
        <HealthStressCTA />
      </div>

      <ProfessionalGuidanceSection />
    </div>
  );
}
