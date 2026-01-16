"use client";

import { useEffect, useState } from "react";
import LifestyleCharts from "@/components/LifestylePlanner/LifestyleCharts";
import LifestyleSummaryMetrics from "@/components/LifestylePlanner/LifestyleSummaryMetrics";
import AffordedLifestyleCard from "@/components/LifestylePlanner/AffordedLifestyleCard";
import { deriveAffordabilityStatus, discountToToday, estimateCorpusAtRetirement, simulateRetirementTimeline } from "@/lib/lifestylePlanner";

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
  const [requiredMonthlyIncomeAtRetirement, setRequiredMonthlyIncomeAtRetirement] = useState(0);
  const [supportedMonthlyIncomeAtRetirement, setSupportedMonthlyIncomeAtRetirement] = useState(0);
  const [supportedMonthlyIncomeToday, setSupportedMonthlyIncomeToday] = useState(0);
  const [paycheckTimelineData, setPaycheckTimelineData] = useState([]);
  const [affordability, setAffordability] = useState({ status: 'Maintained', color: 'text-emerald-700', bg: 'bg-emerald-50' });
  const [sustainableTillAge, setSustainableTillAge] = useState(mockInputs.retirementAge);
  const [yearsSupported, setYearsSupported] = useState(0);
  const [totalYears, setTotalYears] = useState(Math.max(mockInputs.lifespan - mockInputs.retirementAge, 0));
  const [gapMonthlyAtFailure, setGapMonthlyAtFailure] = useState(0);
  const [failureAge, setFailureAge] = useState(null);
  const [recommendedTier, setRecommendedTier] = useState('Comfortable');

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
    const requiredIncome = inputs.monthlyExpenses * Math.pow(1 + inputs.inflationRate / 100, Math.max(inputs.retirementAge - inputs.currentAge, 0));

    const simulation = simulateRetirementTimeline({
      currentAge: inputs.currentAge,
      retirementAge: inputs.retirementAge,
      expectedLifespan: inputs.lifespan,
      startingCorpus,
      desiredMonthlyIncomeToday: inputs.monthlyExpenses,
      inflationRate: inputs.inflationRate,
      postRetirementReturnRate: inputs.retirementReturns
    });

    const status = deriveAffordabilityStatus(simulation);

    setAffordability(status);
    setRequiredMonthlyIncomeAtRetirement(requiredIncome);
    setPaycheckTimelineData(
      simulation.timeline.map((row) => ({
        age: row.age,
        requiredMonthly: row.desiredMonthly,
        supportedMonthly: row.supportedMonthly,
        gapMonthly: Math.max(row.desiredMonthly - row.supportedMonthly, 0)
      }))
    );
    setSustainableTillAge(simulation.sustainableTillAge);
    setYearsSupported(simulation.yearsSupported);
    setTotalYears(simulation.totalYears);
    setGapMonthlyAtFailure(simulation.gapMonthlyAtFailure);
    setFailureAge(simulation.failureAge);

    const firstSupported = simulation.timeline[0]?.supportedMonthly || 0;
    setSupportedMonthlyIncomeAtRetirement(firstSupported);

    const yearsToRetirement = Math.max(inputs.retirementAge - inputs.currentAge, 0);
    const supportedToday = discountToToday(firstSupported, inputs.inflationRate, yearsToRetirement);
    setSupportedMonthlyIncomeToday(supportedToday);

    const ratio = inputs.monthlyExpenses > 0 ? firstSupported / inputs.monthlyExpenses : 0;
    if (ratio < 1.2) setRecommendedTier('Basic');
    else if (ratio < 1.6) setRecommendedTier('Comfortable');
    else setRecommendedTier('Premium');
  }, [inputs]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-lg font-semibold text-slate-900 mb-2">Lifestyle your plan can afford.</p>
        <p className="text-slate-600">Inputs come from your Financial Readiness plan.</p>
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

      <div className="mb-10">
        <p className="text-slate-600 mb-6">This is the monthly income your current corpus can safely support after retirement, while accounting for inflation and post-retirement returns.</p>
        <LifestyleSummaryMetrics
          requiredMonthlyIncomeAtRetirement={requiredMonthlyIncomeAtRetirement}
          supportedMonthlyIncomeAtRetirement={supportedMonthlyIncomeAtRetirement}
          retirementAge={inputs.retirementAge}
          lifespan={inputs.lifespan}
          affordability={affordability}
          sustainableTillAge={sustainableTillAge}
          yearsSupported={yearsSupported}
          totalYears={totalYears}
          gapMonthlyAtFailure={gapMonthlyAtFailure}
          failureAge={failureAge}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-10">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-slate-900">Lifestyle you can afford</h3>
          <p className="text-slate-600 text-sm">Based on your supported monthly income at retirement.</p>
        </div>

        <AffordedLifestyleCard
          tier={recommendedTier}
          supportedMonthlyIncomeAtRetirement={supportedMonthlyIncomeAtRetirement}
          supportedMonthlyIncomeToday={supportedMonthlyIncomeToday}
        />
      </div>

      <div className="mb-10">
        <LifestyleCharts paycheckTimelineData={paycheckTimelineData} />
      </div>
    </div>
  );
}
