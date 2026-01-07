'use client';

import { useState } from 'react';
import { useCalculator } from '../../../context/CalculatorContext';
import { useRouter } from 'next/navigation';
import CorpusChart from '../../../components/CorpusChart';
import CorpusTable from '../../../components/CorpusTable';
import CTASection from '../../../components/CTASection';
import StatCard from '../../../components/StatCard';
import StatusBanner from '../../../components/StatusBanner';
import RealisticRetirementOptimizer from '../../../components/RealisticRetirementOptimizer';
import { formatCurrency } from '../../../lib/formatters';

// =============== COMPONENT STYLES ===============
const containerStyles = {
  wrapper: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  sectionSpacing: "space-y-8"
};

const sectionStyles = {
  wrapper: "bg-white rounded-2xl border border-gray-200 p-6 sm:p-8",
  title: "text-xl font-semibold text-gray-900 mb-2",
  subtitle: "text-gray-600 mb-6"
};

const cardStyles = {
  base: "bg-white rounded-xl border border-gray-200 p-5 h-full",
  metric: "p-5 bg-white rounded-xl border border-gray-200",
  metricValue: "text-2xl font-bold text-gray-900 mb-1",
  metricLabel: "text-sm text-gray-600"
};

// =============== SCENARIO MODAL ===============
const AggressiveScenarioModal = ({ isOpen, onClose, formData, onUpgrade }) => {
  const calculateAggressiveScenarios = () => {
    const {
      currentAge = 30,
      monthlyExpenses = 0,
      expectedReturns = 12,
      inflationRate = 6,
      lifespan = 85,
      monthlyIncome = 0,
      moneySaved = 0
    } = formData;

    const targetAges = [55, 50, 45, 40, 35];
    const scenarios = [];

    for (const targetAge of targetAges) {
      if (targetAge <= currentAge) continue;

      const yearsToTarget = targetAge - currentAge;
      if (yearsToTarget < 5) continue;

      // Simplified calculation
      const annualExpense = monthlyExpenses * 12;
      const requiredCorpus = annualExpense * 25 * Math.pow(1 + inflationRate/100, yearsToTarget);
      
      const monthlyRate = Math.pow(1 + expectedReturns/100, 1/12) - 1;
      const monthsToTarget = yearsToTarget * 12;
      
      const futureValueFactor = (Math.pow(1 + monthlyRate, monthsToTarget) - 1) / monthlyRate;
      const requiredSIP = Math.round((requiredCorpus - (moneySaved || 0)) / futureValueFactor);
      
      const requiredIncome = requiredSIP + monthlyExpenses + 20000;
      const isRealistic = requiredIncome <= monthlyIncome * 1.3;
      const incomeGap = requiredIncome - monthlyIncome;

      scenarios.push({
        targetAge,
        requiredSIP,
        requiredIncome,
        currentIncome: monthlyIncome,
        incomeGap,
        isRealistic,
        yearsToTarget,
        message: isRealistic
          ? `Possible with ${Math.round((requiredIncome/monthlyIncome - 1) * 100)}% income growth`
          : `Requires ₹${formatCurrency(incomeGap)}/month additional income`
      });
    }

    return scenarios;
  };

  const calculatedScenarios = calculateAggressiveScenarios();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aggressive Early Retirement Scenarios</h3>
              <p className="text-gray-600">
                Mathematically possible, but financially challenging
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Disclaimer */}
            <div className="p-5 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-600">⚠</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Reality Check</h4>
                  <p className="text-gray-700">
                    These scenarios show what's mathematically required for early retirement. 
                    They are NOT recommendations. Early retirement requires exponential increases in savings.
                  </p>
                </div>
              </div>
            </div>

            {/* Scenarios Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {calculatedScenarios.map((scenario, index) => (
                <div key={index} className={`p-5 rounded-xl border ${
                  scenario.isRealistic ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900">Retire at {scenario.targetAge}</div>
                      <div className="text-sm text-gray-600">{scenario.yearsToTarget} years from now</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      scenario.isRealistic ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {scenario.isRealistic ? 'Borderline possible' : 'Challenging'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Required SIP:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(scenario.requiredSIP)}/month</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Required income:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(scenario.requiredIncome)}/month</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current income:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(scenario.currentIncome)}/month</span>
                    </div>
                    
                    {scenario.incomeGap > 0 && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-sm text-red-700">
                          <span className="font-medium">Gap:</span> Need ₹{formatCurrency(scenario.incomeGap)}/month more income
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-4">{scenario.message}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    const calculatorSection = document.getElementById('calculator-inputs');
                    if (calculatorSection) {
                      calculatorSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    onClose();
                  }}
                  className="py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Update Income Details
                </button>
                <button
                  onClick={onUpgrade}
                  className="py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Get Premium Analysis
                </button>
                <button
                  onClick={onClose}
                  className="py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
              
              <p className="text-sm text-gray-500 text-center mt-6">
                Remember: Survival is cheap. Early retirement is expensive. Focus on realistic optimization first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============== UPGRADE MODAL ===============
const UpgradeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">☆</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Upgrade to Premium Reality Analysis</h3>
            <p className="text-gray-600">
              Get income-aware, mathematically realistic retirement planning
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            {[
              "Income-expense reality analysis",
              "Multiple optimization paths",
              "Income growth scenarios",
              "Advisor-ready reality report"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-gray-900">₹999</div>
            <div className="text-gray-600">per year</div>
            <p className="text-sm text-gray-500 mt-2">Cancel anytime • 7-day money-back guarantee</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => {
                alert('Redirecting to payment...');
                onClose();
              }}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              Upgrade to Realistic Planning
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============== FINANCIAL ESSENTIALS SECTION ===============
const FinancialEssentialsSection = ({ currentResults }) => {
  const essentials = [
    {
      title: "Life Insurance",
      description: "Protects your loved ones financially in case of unforeseen events",
      value: "10x Annual Income",
      color: "bg-blue-50 border-blue-100"
    },
    {
      title: "Health Insurance",
      description: "Comprehensive health coverage for medical emergencies",
      value: "50% of Annual Income",
      color: "bg-green-50 border-green-100"
    },
    {
      title: "Emergency Fund",
      description: "6-12 months of expenses as a financial safety net",
      value: "₹6,00,000",
      color: "bg-amber-50 border-amber-100"
    },
    {
      title: "Required Monthly SIP",
      description: "Additional monthly SIP needed to meet your goals",
      value: currentResults.sipGap ? formatCurrency(currentResults.sipGap) : '—',
      color: "bg-purple-50 border-purple-100"
    }
  ];

  return (
    <div className={sectionStyles.wrapper}>
      <h3 className={sectionStyles.title}>Financial Essentials</h3>
      <p className={sectionStyles.subtitle}>Core financial protections and requirements</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {essentials.map((item, index) => (
          <div key={index} className={`p-5 rounded-xl border ${item.color}`}>
            <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
            <p className="text-sm text-gray-600 mb-4">{item.description}</p>
            <div className="text-lg font-bold text-gray-900">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============== KEY INSIGHTS SECTION ===============
const KeyInsightsSection = ({ currentResults }) => {
  return (
    <div className={sectionStyles.wrapper}>
      <h3 className={sectionStyles.title}>Key Insights</h3>
      <p className={sectionStyles.subtitle}>Analysis of your current retirement plan</p>
      
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            currentResults.freedomAge === 'Achieved' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
          }`}>
            {currentResults.freedomAge === 'Achieved' ? '✓' : '!'}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 mb-2">
              {currentResults.freedomAge === 'Achieved'
                ? 'Your current plan leads to sustainable financial freedom'
                : 'Your current plan needs adjustment for sustainable financial freedom'}
            </p>
            <p className="text-gray-700">
              {currentResults.freedomAge === 'Achieved'
                ? 'Your retirement corpus is projected to last beyond your expected lifespan.'
                : `Based on current projections, your corpus may deplete by age ${currentResults.depletionAge || '—'}.`}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            ₹
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 mb-2">
              {currentResults.sipGap > 0 
                ? `Consider increasing your monthly SIP by ${formatCurrency(currentResults.sipGap || 0)}`
                : 'Your current SIP rate is sufficient for your goals'}
            </p>
            <p className="text-gray-700">
              {currentResults.sipGap > 0
                ? 'This adjustment will help bridge the gap between your expected and required corpus.'
                : 'Continue with your current investment discipline to stay on track.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============== MAIN DASHBOARD COMPONENT ===============
export default function FinancialReadinessPage() {
  const { dashboardData, formData, results } = useCalculator();
  const router = useRouter();
  const [showAggressiveScenarios, setShowAggressiveScenarios] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleUpgradeToPremium = () => {
    setShowUpgradeModal(true);
  };

  const handleExploreScenarios = () => {
    setShowAggressiveScenarios(true);
  };

  if (!dashboardData && !formData?.yearlyData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dashboard Not Available</h2>
          <p className="text-gray-600 mb-8">
            Complete the financial freedom calculator to see your personalized dashboard.
          </p>
          <button
            onClick={() => router.push('/calculator')}
            className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go to Calculator
          </button>
        </div>
      </div>
    );
  }

  const data = dashboardData || formData.yearlyData;
  const currentResults = results || formData;

  return (
    <div className={containerStyles.wrapper}>
      <div className={containerStyles.sectionSpacing}>
        {/* Header */}
        <div className="pt-8 pb-4">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">Your Financial Dashboard</h1>
          <p className="text-gray-600">
            Track your journey to financial freedom with realistic, income-aware projections
          </p>
        </div>

        {/* Status Banner */}
        {((results && Object.keys(results).length) || formData?.freedomAge) ? (
          <>
            <StatusBanner
              status={currentResults.freedomAge === 'Achieved' ? 'Achieved' : 'Pending'}
              freedomAge={currentResults.depletionAge || currentResults.freedomAge}
              expectedCorpus={currentResults.expectedCorpus}
              requiredCorpus={currentResults.requiredCorpus}
            />

            {/* Stat Cards - 4 Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Freedom Age"
                value={currentResults.freedomAge === 'Achieved' ? 'Achieved' : currentResults.depletionAge || '—'}
                type="age"
                description="Age when you achieve full financial freedom"
                color={currentResults.freedomAge === 'Achieved' ? 'primary' : 'warning'}
              />
              
              <StatCard
                title="Expected Corpus"
                value={currentResults.expectedCorpus || 0}
                type="currency"
                description="Projected wealth at retirement"
              />
              
              <StatCard
                title="Required Corpus"
                value={currentResults.requiredCorpus || 0}
                type="currency"
                description="Amount needed for sustainable retirement"
              />
              
              <StatCard
                title="Monthly SIP Gap"
                value={currentResults.sipGap || 0}
                type="currency"
                description="Additional investment needed monthly"
                color={currentResults.sipGap > 0 ? 'danger' : 'primary'}
              />
            </div>

            {/* Key Insights */}
            <KeyInsightsSection currentResults={currentResults} />

            {/* Corpus Chart */}
            <div className={sectionStyles.wrapper}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className={sectionStyles.title}>Retirement Corpus Timeline</h3>
                  <p className={sectionStyles.subtitle}>Visual projection of your wealth accumulation</p>
                </div>
              </div>
              <CorpusChart data={data} />
            </div>

            {/* Corpus Table */}
            <div className={sectionStyles.wrapper}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className={sectionStyles.title}>Year-by-Year Breakdown</h3>
                  <p className={sectionStyles.subtitle}>Detailed projection of your retirement journey</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Current Plan
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    Premium Scenarios
                  </span>
                </div>
              </div>
              <CorpusTable data={data} />
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700 text-center">
                  This table shows your projected growth year-by-year under current assumptions.
                  <span className="font-medium text-blue-700 ml-2">
                    Upgrade to Premium to see how income changes affect these projections.
                  </span>
                </p>
              </div>
            </div>

            {/* Realistic Retirement Optimizer */}
            <div className="mt-10">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Retirement Optimization</h2>
                <p className="text-gray-600">
                  Income-aware analysis that separates survival, optimization, and fantasy scenarios
                </p>
              </div>
              <RealisticRetirementOptimizer 
                formData={{
                  ...formData,
                  monthlyExpenses: formData?.monthlyExpenses || 0,
                  monthlySIP: formData?.monthlySIP || 0,
                  currentAge: formData?.currentAge || 30,
                  retirementAge: formData?.retirementAge || 60,
                  lifespan: formData?.lifespan || 85,
                  inflationRate: formData?.inflationRate || 6,
                  expectedReturns: formData?.expectedReturns || 12,
                  moneySaved: formData?.moneySaved || 0
                }}
                results={currentResults}
                onExploreScenarios={handleExploreScenarios}
                onUpgradeToPremium={handleUpgradeToPremium}
              />
            </div>

            {/* Financial Essentials */}
            <FinancialEssentialsSection currentResults={currentResults} />

            {/* CTA Section */}
            <div className="mt-8">
              <CTASection />
            </div>

            {/* Disclaimer */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-700">ℹ</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-2">Important Disclaimer</p>
                  <p className="text-gray-700">
                    This tool provides realistic, income-aware projections based on your inputs. 
                    It separates survival, optimization, and fantasy scenarios clearly. 
                    This is not investment advice. Please consult with a certified financial planner for personalized guidance.
                  </p>
                </div>
              </div>
            </div>

            {/* Modals */}
            <AggressiveScenarioModal 
              isOpen={showAggressiveScenarios}
              onClose={() => setShowAggressiveScenarios(false)}
              formData={{
                ...formData,
                monthlyIncome: formData?.monthlyIncome || 0,
                monthlyExpenses: formData?.monthlyExpenses || 0
              }}
              onUpgrade={handleUpgradeToPremium}
            />

            <UpgradeModal 
              isOpen={showUpgradeModal}
              onClose={() => setShowUpgradeModal(false)}
            />
          </>
        ) : (
          <div className={sectionStyles.wrapper}>
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete Calculator First</h3>
              <p className="text-gray-600 mb-8">
                Please complete the financial freedom calculator to see your personalized analyses.
              </p>
              <button
                onClick={() => router.push('/calculator')}
                className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Go to Calculator
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}