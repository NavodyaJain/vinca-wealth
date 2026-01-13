"use client";

import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { usePremium } from "@/lib/premium";
import LifestyleTierCards from "@/components/LifestylePlanner/LifestyleTierCards";
import LifestyleSummaryMetrics from "@/components/LifestylePlanner/LifestyleSummaryMetrics";
import LifestyleCharts from "@/components/LifestylePlanner/LifestyleCharts";
import LifestyleActionPlan from "@/components/LifestylePlanner/LifestyleActionPlan";
import PremiumLifestyleAnalysis from "@/components/LifestylePlanner/PremiumLifestyleAnalysis";
import {
  getLifestyleTierIncome,
  calculateInflationAdjustedAmount,
  estimateCorpusAtRetirement,
  estimateSupportedMonthlyIncome,
  calculateSIPIncreaseNeeded,
  calculateRetirementAgeAdjustment,
  calculateLifestyleReductionNeeded,
  generatePaycheckTimeline
} from "@/lib/lifestylePlanner";

export default function LifestylePlannerPage() {
  const { isPremium } = usePremium();
  
  // Fallback mock inputs (same as Health Stress Test page)
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

  // State
  const [inputs, setInputs] = useState(mockInputs);
  const [selectedTier, setSelectedTier] = useState('comfortable');
  const [desiredIncomeToday, setDesiredIncomeToday] = useState(65000);
  const [desiredIncomeAtRetirement, setDesiredIncomeAtRetirement] = useState(0);
  const [supportedSafeIncome, setSupportedSafeIncome] = useState(0);
  const [supportedAggressiveIncome, setSupportedAggressiveIncome] = useState(0);
  const [lifestyleGap, setLifestyleGap] = useState(0);
  const [incomeComparisonData, setIncomeComparisonData] = useState([]);
  const [paycheckTimelineData, setPaycheckTimelineData] = useState([]);
  const [sipIncreaseNeeded, setSipIncreaseNeeded] = useState({ requiredIncrease: 0, newMonthlySIP: 0, percentageIncrease: 0 });
  const [retirementAgeAdjustment, setRetirementAgeAdjustment] = useState({ extraYears: 0, newRetirementAge: 60, isAchievable: true });
  const [lifestyleReduction, setLifestyleReduction] = useState({ reductionNeeded: 0, affordableIncome: 0, percentageReduction: 0 });

  // Load inputs from localStorage on component mount
  useEffect(() => {
    try {
      const storedInputs = localStorage.getItem('financialReadinessInputs') || 
                          localStorage.getItem('retirementInputs') || 
                          localStorage.getItem('calculatorInputs');
      
      if (storedInputs) {
        const parsedInputs = JSON.parse(storedInputs);
        setInputs(prev => ({ ...prev, ...parsedInputs }));
      }
    } catch (error) {
      console.log('Using default inputs for Lifestyle Planner');
    }
  }, []);

  // Calculate all metrics when inputs or selection changes
  useEffect(() => {
    // Calculate desired income based on tier
    const newDesiredIncomeToday = getLifestyleTierIncome(
      inputs.monthlyExpenses,
      selectedTier
    );
    setDesiredIncomeToday(newDesiredIncomeToday);

    // Calculate inflation-adjusted desired income at retirement
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    const newDesiredIncomeAtRetirement = calculateInflationAdjustedAmount(
      newDesiredIncomeToday,
      inputs.inflationRate,
      yearsToRetirement
    );
    setDesiredIncomeAtRetirement(newDesiredIncomeAtRetirement);

    // Calculate retirement corpus
    const corpus = estimateCorpusAtRetirement(inputs);

    // Calculate supported incomes
    const safeIncome = estimateSupportedMonthlyIncome(corpus, 4); // 4% safe withdrawal
    const aggressiveIncome = estimateSupportedMonthlyIncome(corpus, 5); // 5% aggressive withdrawal
    
    setSupportedSafeIncome(safeIncome);
    setSupportedAggressiveIncome(aggressiveIncome);
    
    // Calculate gap
    const gap = newDesiredIncomeAtRetirement - safeIncome;
    setLifestyleGap(gap);

    // Generate chart data
    setIncomeComparisonData([
      {
        name: 'Retirement Income',
        desired: newDesiredIncomeAtRetirement,
        safe: safeIncome,
        aggressive: aggressiveIncome
      }
    ]);

    // Generate paycheck timeline
    const timeline = generatePaycheckTimeline(inputs, newDesiredIncomeAtRetirement, true);
    setPaycheckTimelineData(timeline);

    // Calculate action plan scenarios
    const sipIncrease = calculateSIPIncreaseNeeded(inputs, newDesiredIncomeAtRetirement);
    setSipIncreaseNeeded(sipIncrease);

    const ageAdjustment = calculateRetirementAgeAdjustment(inputs, newDesiredIncomeAtRetirement);
    setRetirementAgeAdjustment(ageAdjustment);

    const lifestyleAdjustment = calculateLifestyleReductionNeeded(inputs, newDesiredIncomeAtRetirement);
    setLifestyleReduction(lifestyleAdjustment);

  }, [inputs, selectedTier]);

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
  };

  const handlePremiumIncomeChange = (value) => {
    setDesiredIncomeAtRetirement(value);
    // Recalculate based on new premium value
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    const todayValue = value / Math.pow(1 + inputs.inflationRate/100, yearsToRetirement);
    setDesiredIncomeToday(todayValue);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Retirement Lifestyle Planner
        </h1>
        <p className="text-lg text-slate-600 mb-6">
          Discover what retirement lifestyle your current plan can support and explore options to achieve your desired lifestyle.
        </p>
        
        {/* Disclaimer Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-700">
              <span className="font-medium">Educational Tool:</span> This planner provides estimates based on your inputs and standard financial assumptions. It is not investment advice. Actual results may vary due to market conditions, inflation changes, and personal circumstances. Consider consulting with a financial advisor for personalized advice.
            </div>
          </div>
        </div>
      </div>

      {/* Input Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Retirement Plan Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <div className="text-sm text-slate-500">Current Age</div>
            <div className="font-semibold text-slate-900">{inputs.currentAge}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Retirement Age</div>
            <div className="font-semibold text-slate-900">{inputs.retirementAge}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Monthly SIP</div>
            <div className="font-semibold text-slate-900">₹{inputs.monthlySIP.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Current Savings</div>
            <div className="font-semibold text-slate-900">₹{inputs.moneySaved.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Expected Returns</div>
            <div className="font-semibold text-slate-900">{inputs.expectedReturns}%</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-slate-600">
          <p>These inputs are loaded from your Financial Readiness calculator. 
            <a href="/dashboard/financial-readiness" className="text-indigo-600 hover:text-indigo-800 ml-1">
              Update inputs
            </a>
          </p>
        </div>
      </div>

      {/* Lifestyle Selection */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Choose Your Retirement Lifestyle</h2>
        <p className="text-slate-600 mb-6">
          Select a lifestyle tier that matches your retirement vision. Each tier represents different spending levels.
        </p>
        <LifestyleTierCards
          selectedTier={selectedTier}
          onSelectTier={handleTierSelect}
          currentMonthlyExpenses={inputs.monthlyExpenses}
        />
      </div>

      {/* Summary Metrics */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Lifestyle Affordability Analysis</h2>
        <LifestyleSummaryMetrics
          desiredIncomeToday={desiredIncomeToday}
          desiredIncomeAtRetirement={desiredIncomeAtRetirement}
          supportedSafeIncome={supportedSafeIncome}
          supportedAggressiveIncome={supportedAggressiveIncome}
          lifestyleGap={lifestyleGap}
        />
      </div>

      {/* Charts */}
      <div className="mb-10">
        <LifestyleCharts
          incomeComparisonData={incomeComparisonData}
          paycheckTimelineData={paycheckTimelineData}
        />
      </div>

      {/* Action Plan */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Explore Your Options</h2>
        <LifestyleActionPlan
          sipIncreaseNeeded={sipIncreaseNeeded}
          retirementAgeAdjustment={retirementAgeAdjustment}
          lifestyleReduction={lifestyleReduction}
          desiredIncomeAtRetirement={desiredIncomeAtRetirement}
        />
      </div>

      {/* Premium Analysis */}
      <div className="mb-10">
        <PremiumLifestyleAnalysis
          inputs={inputs}
          desiredIncomeAtRetirement={desiredIncomeAtRetirement}
          onDesiredIncomeChange={handlePremiumIncomeChange}
        />
      </div>

      {/* Final Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 mb-3">Important Considerations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
          <div>
            <div className="font-medium mb-1">Inflation Impact</div>
            <p>Remember that ₹1 today will be worth much less in retirement. Our calculations account for inflation, but actual rates may vary.</p>
          </div>
          <div>
            <div className="font-medium mb-1">Healthcare Costs</div>
            <p>Healthcare expenses typically increase with age. Consider adding a buffer for medical costs in your retirement planning.</p>
          </div>
          <div>
            <div className="font-medium mb-1">Market Volatility</div>
            <p>Investment returns are not guaranteed. Market downturns early in retirement can significantly impact portfolio sustainability.</p>
          </div>
          <div>
            <div className="font-medium mb-1">Lifestyle Changes</div>
            <p>Your spending patterns may change in retirement. Some expenses decrease (commuting), while others increase (leisure, healthcare).</p>
          </div>
        </div>
      </div>
    </div>
  );
}