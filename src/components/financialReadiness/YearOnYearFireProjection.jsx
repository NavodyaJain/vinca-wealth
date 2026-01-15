import React, { useMemo } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import FireProjectionTable from './FireProjectionTable';

const currencyFormatter = (value) => {
  const v = Number(value) || 0;
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  return `₹${Math.round(v).toLocaleString('en-IN')}`;
};

const YearOnYearFireProjection = ({ results, fireResults, formatCurrency = currencyFormatter }) => {
  const simulation = useMemo(() => {
    if (!results) return null;

    const inputs = results.inputs || {};
    const currentAge = Number(results.currentAge ?? inputs.currentAge ?? 26);
    const desiredRetirementAge = Number(results.retirementAge ?? inputs.retirementAge ?? 60);
    const expectedLifespan = Number(results.lifespan ?? inputs.lifespan ?? 85);
    const moneySaved = Number(results.moneySaved ?? inputs.moneySaved ?? 0);
    const monthlyExpenses = Number(results.monthlyExpenses ?? inputs.monthlyExpenses ?? 0);
    const currentMonthlySIP = Number(results.currentMonthlySIP ?? inputs.monthlySIP ?? 0);
    const expectedReturnsPre = Number(results.expectedReturns ?? inputs.expectedReturns ?? 12);
    const expectedReturnsPost = Number(results.retirementReturns ?? inputs.retirementReturns ?? 9);
    const inflationRate = Number(results.inflationRate ?? inputs.inflationRate ?? 6);
    const withdrawalIncreaseRate = Number(results.withdrawalIncrease ?? inputs.withdrawalIncrease ?? 7);
    const yearlySIPIncreasePercent = Number(results.sipIncreaseRate ?? inputs.sipIncreaseRate ?? 10);
    const requiredCorpusThreshold = results.requiredCorpusAtRetirement ?? 0;
    const requiredCorpusByAgeMap = results.requiredCorpusByAgeMap || {};

    const optimizedMonthlySIP = Number(fireResults?.optimizedMonthlySIP ?? currentMonthlySIP);
    const optimizedRetirementAge = Number(fireResults?.optimizedRetirementAge ?? desiredRetirementAge);

    const annualPreReturn = expectedReturnsPre / 100;
    const annualPostReturn = expectedReturnsPost / 100;
    const annualInflation = inflationRate / 100;
    const annualWithdrawalIncrease = withdrawalIncreaseRate / 100;

    const startAge = Math.round(currentAge);
    const endAge = Math.round(expectedLifespan);

    const simulatePlan = (monthlySIP, retirementStartAge) => {
      let corpus = moneySaved;
      let sip = monthlySIP;
      let yearlyWithdrawal = monthlyExpenses * 12 * Math.pow(1 + annualInflation, Math.max(0, retirementStartAge - currentAge));
      const timeline = [];
      let depletionAge = null;

      for (let age = startAge; age <= endAge; age++) {
        const required = requiredCorpusByAgeMap[age] ?? requiredCorpusThreshold;
        if (age < retirementStartAge) {
          const startingCorpus = corpus;
          const yearlyContribution = sip * 12;
          const base = startingCorpus + yearlyContribution;
          const endingCorpus = base * (1 + annualPreReturn);
          const returnApplied = endingCorpus - base;

          timeline.push({
            age,
            phase: 'SIP Phase',
            isRetired: false,
            startingCorpus,
            contributionYearly: yearlyContribution,
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
          sip *= 1 + yearlySIPIncreasePercent / 100;
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

      return { timeline, depletionAge };
    };

    const currentPlan = simulatePlan(currentMonthlySIP, desiredRetirementAge);
    const optimizedPlan = simulatePlan(optimizedMonthlySIP, optimizedRetirementAge);

    const chartData = [];
    for (let age = startAge; age <= endAge; age++) {
      chartData.push({
        age,
        currentPlan: currentPlan.timeline.find((t) => t.age === age)?.projectedCorpus ?? 0,
        optimizedPlan: optimizedPlan.timeline.find((t) => t.age === age)?.projectedCorpus ?? 0
      });
    }

    const yMax = Math.max(
      1,
      ...chartData.map((d) => Math.max(d.currentPlan || 0, d.optimizedPlan || 0))
    ) * 1.1;

    return {
      chartData,
      startAge,
      endAge,
      desiredRetirementAge,
      optimizedRetirementAge,
      currentTimeline: currentPlan.timeline,
      optimizedTimeline: optimizedPlan.timeline,
      yMax,
      optimizedDepletionAge: optimizedPlan.depletionAge,
      isDesiredAgeFeasible: fireResults?.isDesiredAgeFeasible !== false,
      sustainable: optimizedPlan.depletionAge === null,
      depletionAge: optimizedPlan.depletionAge
    };
  }, [fireResults, results]);

  if (!simulation?.chartData || simulation.chartData.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Retirement Sustainability: Current vs {simulation.isDesiredAgeFeasible ? 'Optimized' : 'Realistic'} Plan</h3>
          <p className="text-sm text-gray-600">Compares your existing path with the plan needed to hit your target (or the earliest realistic age if target is infeasible).</p>
        </div>
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border ${simulation.sustainable ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
          {simulation.sustainable ? 'Sustainable ✅ (corpus lasts to lifespan)' : `Runs out at age ${simulation.depletionAge ?? '--'} ❌`}
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={simulation.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="age"
              type="number"
              domain={[simulation.startAge, simulation.endAge]}
              tickFormatter={(v) => `${v}`}
              allowDecimals={false}
              stroke="#9ca3af"
            />
            <YAxis yAxisId="corpus" tickFormatter={formatCurrency} stroke="#9ca3af" width={90} domain={[0, simulation.yMax]} />
            <Tooltip
              labelFormatter={(label) => `Age ${label}`}
              content={({ active, payload, label }) => {
                if (!active || !payload) return null;
                const point = payload[0]?.payload || {};
                return (
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 text-sm text-gray-800 max-w-xs">
                    <div className="font-semibold mb-2">Age {label}</div>
                    <div className="flex justify-between"><span className="text-gray-600">Current plan</span><span className="font-semibold">{formatCurrency(point.currentPlan || 0)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">{simulation.isDesiredAgeFeasible ? 'Optimized plan' : 'Realistic plan'}</span><span className="font-semibold">{formatCurrency(point.optimizedPlan || 0)}</span></div>
                  </div>
                );
              }}
            />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 8 }} formatter={(value) => {
              if (value === 'currentPlan') return 'Current Plan';
              if (value === 'optimizedPlan') return simulation.isDesiredAgeFeasible ? 'Optimized Plan' : 'Realistic Plan';
              return value;
            }} />
            <Line yAxisId="corpus" type="monotone" dataKey="currentPlan" name="Current Plan" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
            <Line yAxisId="corpus" type="monotone" dataKey="optimizedPlan" name={simulation.isDesiredAgeFeasible ? 'Optimized Plan' : 'Realistic Plan'} stroke="#10b981" strokeWidth={2.5} dot={false} />
            <ReferenceLine x={Math.round(simulation.desiredRetirementAge)} stroke="#3b82f6" strokeDasharray="4 4" label={{ value: 'Desired Retirement Age', position: 'insideBottom', fill: '#1d4ed8', fontSize: 12 }} />
            <ReferenceLine x={Math.round(simulation.optimizedRetirementAge)} stroke="#059669" strokeDasharray="6 4" label={{ value: simulation.isDesiredAgeFeasible ? 'FIRE Age' : 'Realistic Age', position: 'insideTop', fill: '#047857', fontSize: 12 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <div>
          <h4 className="text-base font-semibold text-gray-900">Detailed Retirement Timeline</h4>
          <p className="text-sm text-gray-600">Shows corpus movement year-by-year from current age to lifespan with SIP growth and withdrawals from FIRE age.</p>
        </div>
        <FireProjectionTable
          simulationData={simulation.optimizedTimeline}
          retirementStartAge={simulation.optimizedRetirementAge}
          formatCurrency={formatCurrency}
        />
      </div>

    </div>
  );
};

export default YearOnYearFireProjection;
