// src/components/financialReadiness/FireCalculatorPremiumUI.jsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

const runFireSimulation = ({
  totalMonthlySIP,
  currentAge,
  lifespan,
  retirementAge,
  moneySaved,
  monthlyExpenses,
  expectedReturns,
  retirementReturns,
  inflationRate,
  sipIncreaseRate,
  withdrawalIncrease,
  requiredCorpusByAgeMap,
  requiredCorpusAtRetirement
}) => {
  const annualPreReturn = expectedReturns / 100;
  const annualPostReturn = retirementReturns / 100;
  const annualInflation = inflationRate / 100;
  const annualWithdrawalIncrease = withdrawalIncrease / 100;

  const startAge = Math.round(currentAge);
  const endAge = Math.round(lifespan);

  const simulatePlan = (retirementStartAge) => {
    let corpus = moneySaved;
    let sip = totalMonthlySIP;
    let yearlyWithdrawal = monthlyExpenses * 12 * Math.pow(1 + annualInflation, Math.max(0, retirementStartAge - currentAge));
    const timeline = [];
    let depletionAge = null;

    for (let age = startAge; age <= endAge; age++) {
      const required = requiredCorpusByAgeMap[Math.round(age)] ?? requiredCorpusAtRetirement ?? 0;
      if (age < retirementStartAge) {
        const startingCorpus = corpus;
        const contributionYearly = sip * 12;
        const base = startingCorpus + contributionYearly;
        const endingCorpus = base * (1 + annualPreReturn);
        const returnApplied = endingCorpus - base;

        timeline.push({
          age,
          phase: 'SIP Phase',
          isRetired: false,
          startingCorpus,
          contributionYearly,
          returnApplied,
          withdrawalYearly: 0,
          projectedCorpus: Math.max(0, endingCorpus),
          endingCorpus: Math.max(0, endingCorpus),
          requiredCorpusAtThisAge: required,
          yearlyWithdrawal: 0,
          beforeWithdrawal: null,
          afterWithdrawal: null,
          isSustainableFromThisAge: true
        });

        corpus = Math.max(0, endingCorpus);
        sip *= 1 + sipIncreaseRate / 100;
      } else {
        const startingCorpus = corpus;
        const beforeWithdrawal = startingCorpus * (1 + annualPostReturn);
        const endingCorpusRaw = beforeWithdrawal - yearlyWithdrawal;
        const endingCorpus = Math.max(0, endingCorpusRaw);
        const returnApplied = beforeWithdrawal - startingCorpus;

        timeline.push({
          age,
          phase: 'Withdrawal Phase',
          isRetired: true,
          startingCorpus,
          contributionYearly: 0,
          returnApplied,
          withdrawalYearly: yearlyWithdrawal,
          projectedCorpus: endingCorpus,
          endingCorpus,
          requiredCorpusAtThisAge: required,
          yearlyWithdrawal,
          beforeWithdrawal,
          afterWithdrawal: endingCorpus,
          isSustainableFromThisAge: endingCorpus > 0
        });

        if (endingCorpus <= 0 && depletionAge === null) {
          depletionAge = age;
        }

        corpus = endingCorpus;
        yearlyWithdrawal *= 1 + annualWithdrawalIncrease;
      }
    }

    const retirementRow = timeline.find((row) => row.isRetired) || null;
    return {
      timeline,
      depletionAge,
      projectedAtFire: retirementRow?.projectedCorpus ?? 0,
      requiredAtFire: retirementRow?.requiredCorpusAtThisAge ?? requiredCorpusAtRetirement ?? 0
    };
  };

  let fireAge = null;
  let bestSimulation = null;
  for (let age = Math.ceil(currentAge + 1); age <= endAge; age++) {
    const sim = simulatePlan(age);
    const meetsCorpusNeed = sim.projectedAtFire >= sim.requiredAtFire;
    const sustainable = sim.depletionAge === null;

    if (meetsCorpusNeed && sustainable) {
      fireAge = age;
      bestSimulation = sim;
      break;
    }
  }

  if (!bestSimulation) {
    bestSimulation = simulatePlan(retirementAge);
  }

  return {
    fireAge,
    timeline: bestSimulation.timeline,
    depletionAge: bestSimulation.depletionAge,
    projectedAtFire: bestSimulation.projectedAtFire,
    requiredAtFire: bestSimulation.requiredAtFire
  };
};

const FireCalculatorPremiumUI = ({ fireResults, results, onResetPro }) => {
  const [selectedRatio, setSelectedRatio] = useState(0);
  const [showEmergencyNote, setShowEmergencyNote] = useState(false);

  const inputs = results?.inputs || {};
  const retirementAge = Number(results?.retirementAge ?? inputs.retirementAge ?? 60);
  const lifespan = Number(results?.lifespan ?? inputs.lifespan ?? 85);
  const currentMonthlySIP = Number(fireResults?.currentMonthlySIP ?? results?.currentMonthlySIP ?? inputs.monthlySIP ?? 0);
  const monthlyIncome = Number(fireResults?.monthlyIncome ?? results?.monthlyIncome ?? inputs.monthlyIncome ?? 0);
  const monthlyExpenses = Number(fireResults?.monthlyExpenses ?? results?.monthlyExpenses ?? inputs.monthlyExpenses ?? 50000);
  const moneySaved = Number(results?.moneySaved ?? inputs.moneySaved ?? 0);
  const expectedReturns = Number(results?.expectedReturns ?? inputs.expectedReturns ?? 12);
  const retirementReturns = Number(results?.retirementReturns ?? inputs.retirementReturns ?? 8);
  const inflationRate = Number(results?.inflationRate ?? inputs.inflationRate ?? 6);
  const sipIncreaseRate = Number(results?.sipIncreaseRate ?? inputs.sipIncreaseRate ?? 10);
  const withdrawalIncrease = Number(results?.withdrawalIncrease ?? inputs.withdrawalIncrease ?? 0);
  const requiredCorpusByAgeMap = results?.requiredCorpusByAgeMap || {};
  const requiredCorpusAtRetirement = Number(results?.requiredCorpusAtRetirement ?? 0);

  const premiumDefaultRatio = useMemo(() => {
    if (typeof fireResults?.premiumLeverPct === 'number') return fireResults.premiumLeverPct;
    if (fireResults?.premiumScenario?.ratio !== undefined) return fireResults.premiumScenario.ratio;
    if (fireResults?.baselineScenario?.ratio !== undefined) return fireResults.baselineScenario.ratio;
    return 0;
  }, [fireResults]);

  useEffect(() => {
    setSelectedRatio(premiumDefaultRatio);
  }, [premiumDefaultRatio]);

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '₹0';
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${Math.round(value / 1000)}K`;
    return `₹${Math.round(value)}`;
  };

  const formatAge = (age) => {
    return age ? `${age.toFixed(1)}` : '--';
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  const selectedPercent = Math.round(selectedRatio * 100);

  const surplusCalc = useMemo(() => {
    const monthlySurplus = monthlyIncome - monthlyExpenses;
    const investableSurplus = Math.max(0, monthlySurplus - currentMonthlySIP);
    const effectiveRatio = investableSurplus > 0 ? selectedRatio : 0;
    const additionalSIP = investableSurplus > 0
      ? Math.min(investableSurplus, Math.round(investableSurplus * effectiveRatio))
      : 0;
    const totalMonthlySIP = currentMonthlySIP + additionalSIP;
    const emergencyLeft = Math.max(0, investableSurplus - additionalSIP);

    return {
      monthlySurplus,
      investableSurplus,
      additionalSIP,
      totalMonthlySIP,
      emergencyLeft
    };
  }, [currentMonthlySIP, monthlyExpenses, monthlyIncome, selectedRatio]);

  useEffect(() => {
    if (surplusCalc.investableSurplus <= 0 && selectedRatio !== 0) {
      setSelectedRatio(0);
    }
  }, [selectedRatio, surplusCalc.investableSurplus]);

  const fireSimulation = useMemo(() => runFireSimulation({
    totalMonthlySIP: surplusCalc.totalMonthlySIP,
    currentAge: Number(results?.currentAge ?? inputs.currentAge ?? 30),
    lifespan,
    retirementAge,
    moneySaved,
    monthlyExpenses,
    expectedReturns,
    retirementReturns,
    inflationRate,
    sipIncreaseRate,
    withdrawalIncrease,
    requiredCorpusByAgeMap,
    requiredCorpusAtRetirement
  }), [
    expectedReturns,
    inflationRate,
    inputs.currentAge,
    lifespan,
    moneySaved,
    monthlyExpenses,
    requiredCorpusAtRetirement,
    requiredCorpusByAgeMap,
    retirementAge,
    retirementReturns,
    results?.currentAge,
    sipIncreaseRate,
    surplusCalc.totalMonthlySIP,
    withdrawalIncrease
  ]);

  const fireAge = fireSimulation.fireAge;
  const targetAge = retirementAge;
  const ageGap = fireAge !== null ? fireAge - targetAge : null;

  const yearsEarly = ageGap === null ? null : ageGap < 0 ? Math.abs(ageGap) : 0;
  const yearsEarlyText = yearsEarly === null ? '—' : yearsEarly.toFixed(1);

  const getAllocationGradient = (ratio) => {
    const pct = ratio * 100;
    if (pct <= 25) return 'linear-gradient(90deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)'; // blue/cyan
    if (pct < 75) return 'linear-gradient(90deg, #dcfce7 0%, #a7f3d0 50%, #34d399 100%)'; // green
    return 'linear-gradient(90deg, #fed7aa 0%, #fb923c 50%, #f97316 75%, #ef4444 100%)'; // orange/red
  };

  if (!fireResults) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Calculating FIRE scenarios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Smart Surplus Lever */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900">Adjust the smart surplus lever to know your early retirement age.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-full">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={selectedPercent}
                disabled={surplusCalc.investableSurplus <= 0}
                onChange={(e) => setSelectedRatio(Number(e.target.value) / 100)}
                className="w-full accent-emerald-600"
                style={{
                  background: getAllocationGradient(selectedRatio),
                  height: '6px',
                  borderRadius: '9999px',
                  WebkitAppearance: 'none'
                }}
              />
            </div>
            <div className="w-20 text-right text-sm font-semibold text-gray-900">{selectedPercent}%</div>
          </div>
          {surplusCalc.investableSurplus <= 0 && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
              No investable surplus after your current SIP. Allocation stays at 0% until your surplus improves.
            </div>
          )}
          {fireResults.premiumLeverPct >= 1 && fireResults.safetyScenario && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-lg p-3">
              This is the earliest age possible with 100% surplus. To keep an emergency buffer, a {formatPercentage(fireResults.safetyScenario.ratio)} allocation still retires you at {formatAge(fireResults.safetyScenario.fireAge)}.
            </div>
          )}
          {/* Allocation summary removed per latest request */}
        </div>

        {/* Quick KPI strip tied to the lever */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-2xl bg-white p-4 text-center space-y-1">
              <div className="text-sm text-slate-600">Surplus used</div>
              <div className="text-xl font-semibold text-slate-900">{formatCurrency(surplusCalc.additionalSIP)}/month</div>
            </div>
            <div className="border border-gray-200 rounded-2xl bg-white p-4 text-center space-y-1">
              <div className="text-sm text-slate-600">Total SIP</div>
              <div className="text-xl font-semibold text-slate-900">{formatCurrency(surplusCalc.totalMonthlySIP)}/month</div>
            </div>
            <div className="border border-gray-200 rounded-2xl bg-white p-4 text-center space-y-1">
              <div className="text-sm text-slate-600">Expected corpus</div>
              <div className="text-xl font-semibold text-slate-900">{formatCurrency(fireSimulation.projectedAtFire)}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 rounded-2xl p-5 text-center">
              <div className="text-sm text-emerald-700">Early retirement age</div>
              <div className="text-2xl font-bold text-emerald-900 mt-1">
                {fireAge === null ? 'Not achievable yet' : `${fireAge.toFixed(1)} years`}
              </div>
            </div>
            <div className="text-sm text-amber-700 text-center border border-amber-200 bg-amber-50 rounded-xl p-3">
              You can retire {yearsEarlyText === '—' ? '—' : `${yearsEarlyText} years`} early from your expected retirement age
            </div>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-emerald-900">What lifestyle can you actually afford with your plan?</h4>
            <p className="text-sm text-emerald-800">
              Your retirement corpus isn’t just a number — it decides your real lifestyle. Use Vinca&apos;s Lifestyle Planner to see what monthly spending you can sustain, upgrade, or adjust before retirement.
            </p>
          </div>
          <Link
            href="/dashboard/lifestyle-planner"
            className="inline-flex items-center justify-center px-4 py-3 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-sm hover:bg-emerald-700"
          >
            Go to Lifestyle Planner
          </Link>
        </div>
      </div>

      {/* Reset Pro Link */}
      <div className="text-center pt-6 border-t border-gray-200">
        <button
          onClick={onResetPro}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Reset Pro (for testing)
        </button>
      </div>
    </div>
  );
};

export default FireCalculatorPremiumUI;