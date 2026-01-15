'use client';

import { useState, useEffect } from 'react';
import TopAssetsOverview from '@/components/top-assets/TopAssetsOverview';
import AssetLeaderboard from '@/components/top-assets/AssetLeaderboard';
import AssetCharts from '@/components/top-assets/AssetCharts';
import HistoricalPlanComparison from '@/components/PlanComparison';
import PlanStressTestPremium from '@/components/PlanStressTestPremium';
import ProSubscriptionModal from '@/components/financialReadiness/ProSubscriptionModal';
import { Target, BarChart3, TrendingUp, Shield, Crown, Zap, ShieldCheck, TrendingDown, RefreshCcw, Flame, LineChart, CheckCircle2, BookOpen } from 'lucide-react';
import { usePremium } from '@/lib/premium';

export default function TopDealsPage() {
  const { isPremium, upgradeToPremium } = usePremium();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isProUnlockedLocal, setIsProUnlockedLocal] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  
  const [formData] = useState({
    currentAge: 30,
    retirementAge: 60,
    lifespan: 85,
    monthlyIncome: 150000,
    monthlyExpenses: 50000,
    monthlyRetirementExpenses: 50000,
    moneySaved: 500000,
    monthlySIP: 30000,
    expectedReturns: 12,
    sipIncreaseRate: 10,
    inflationRate: 6,
    retirementReturns: 8,
    withdrawalIncrease: 0
  });

  // Check localStorage on mount
  useEffect(() => {
    const isProUnlocked = localStorage.getItem('vinca_pro_unlocked_top_assets') === 'true';
    setIsProUnlockedLocal(isProUnlocked);
  }, []);

  const handleSubscribe = (planId) => {
    console.log('Subscribed to plan:', planId);
    // Set localStorage to persist premium unlock
    localStorage.setItem('vinca_pro_unlocked_top_assets', 'true');
    setIsProUnlockedLocal(true);
    upgradeToPremium();
    setShowSubscriptionModal(false);
  };

  const handleConfirmSubscription = () => {
    if (selectedPlan) {
      handleSubscribe(selectedPlan);
    }
  };

  const resetProForTesting = () => {
    localStorage.removeItem('vinca_pro_unlocked_top_assets');
    setIsProUnlockedLocal(false);
    window.location.reload();
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ============================================= */}
      {/* MODULE HEADER - TOP ASSETS ANALYSIS */}
      {/* ============================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Header Text */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Top Assets Analysis
          </h1>
          <p className="text-slate-600 text-lg">
            Understand how your retirement plan behaves in real market conditions — through two experiences: learning (Free) and stress testing (Pro).
          </p>
        </div>
      </div>

      {/* ============================================= */}
      {/* WRAPPER 1: FREE SECTION (TOP) */}
      {/* ============================================= */}
      <div id="free-section" className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50 rounded-2xl border border-blue-200 shadow-md p-6 sm:p-8 overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 -z-10"></div>
        
        {/* Header with Badge */}
        <div className="mb-8 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-3 py-1 bg-blue-700 text-white text-xs font-semibold rounded-full">
              Free Preview
            </span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Market Reality Check
          </h2>
          <p className="text-slate-700 text-lg font-medium mb-3">
            Learn why retirement plans fail even when numbers look correct — inflation, drawdowns, and recovery time.
          </p>
          <p className="text-slate-600 text-base italic">
            Build confidence by understanding the risks before optimizing anything.
          </p>
        </div>

        {/* Show/Hide Education Button */}
        {!showEducation && (
          <div className="space-y-6 relative z-10">
            {/* Value Teasers Grid - 3 cards in a row on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Drawdowns */}
              <div className="p-5 rounded-xl border border-blue-200 bg-white/80 backdrop-blur hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                    <TrendingDown className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Drawdowns</h4>
                    <p className="text-slate-600 text-xs mt-1">How downturns hurt long plans</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Recovery Cycles */}
              <div className="p-5 rounded-xl border border-blue-200 bg-white/80 backdrop-blur hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-cyan-100 rounded-lg flex-shrink-0">
                    <RefreshCcw className="text-cyan-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Recovery Cycles</h4>
                    <p className="text-slate-600 text-xs mt-1">Why recovery time matters</p>
                  </div>
                </div>
              </div>

              {/* Card 3: Inflation Basics */}
              <div className="p-5 rounded-xl border border-blue-200 bg-white/80 backdrop-blur hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                    <Flame className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Inflation Basics</h4>
                    <p className="text-slate-600 text-xs mt-1">How purchasing power declines</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-4 pt-6 border-t border-blue-200">
              <button
                onClick={() => setShowEducation(true)}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg text-lg"
              >
                Start Free Market Preview
              </button>
              <p className="text-center text-sm text-slate-600">
                No signup • 60 sec clarity
              </p>
              <button
                onClick={() => setShowEducation(true)}
                className="w-full px-6 py-2 text-blue-600 font-semibold hover:text-blue-700 text-sm transition-colors"
              >
                Jump to learning →
              </button>
            </div>
          </div>
        )}

        {/* Educational Content (Hidden by default, revealed on click) */}
        {showEducation && (
          <div className="space-y-8 relative z-10">
            {/* Educational Header */}
            <div className="flex items-center gap-3 mb-6 pt-6 border-t border-blue-200">
              <div className="p-2 bg-slate-200 rounded-lg">
                <BarChart3 size={20} className="text-slate-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Educational Asset Analysis
                </h3>
                <p className="text-slate-600 text-sm">
                  Historical patterns and rankings for educational purposes only
                </p>
              </div>
            </div>

            {/* Disclaimer Banner */}
            <div className="p-4 bg-white border border-slate-300 rounded-lg">
              <p className="text-sm text-slate-700 font-medium">
                ⚠️ Educational Content – Not Investment Advice
              </p>
              <p className="text-sm text-slate-600 mt-1">
                This analysis uses historical data to show patterns, not to recommend investments. 
                Past performance does not guarantee future results. Consult a SEBI-registered advisor for personal advice.
              </p>
            </div>

            {/* Overview Metrics */}
            <div className="mb-8">
              <TopAssetsOverview />
            </div>

            {/* Horizontal Flow Content */}
            <div className="space-y-8">
              {/* Asset Leaderboard */}
              <div>
                <AssetLeaderboard />
              </div>

              {/* Historical Pattern Analysis */}
              <div>
                <AssetCharts />
              </div>

              {/* Historical Plan Comparison */}
              <div>
                <HistoricalPlanComparison />
              </div>

              {/* Educational Insights */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Key Retirement Planning Insights
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-5 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Target size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Historical Patterns Matter</h4>
                        <p className="text-sm text-slate-600">
                          Different asset classes have behaved differently during past retirement periods. 
                          Understanding these patterns helps set realistic expectations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-100 rounded-lg">
                        <TrendingUp size={20} className="text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Sequence of Returns Risk</h4>
                        <p className="text-sm text-slate-600">
                          The order in which returns occur can significantly impact retirement outcomes, 
                          even with the same average returns over time.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-100 rounded-lg">
                        <BarChart3 size={20} className="text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Diversification Trade-offs</h4>
                        <p className="text-sm text-slate-600">
                          Different asset allocations have historically offered different trade-offs 
                          between growth potential and stability during retirement.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Shield size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Building Confidence</h4>
                        <p className="text-sm text-slate-600">
                          Historical analysis helps build evidence-based understanding, not predictions. 
                          Use this to inform conversations with your financial advisor.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Disclaimer */}
            <div className="border-t border-slate-200 pt-6">
              <div className="text-sm text-slate-600 bg-slate-50 p-6 rounded-xl">
                <p className="font-medium text-slate-900 mb-3">Important Educational Information:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>This analysis uses historical data and is for educational purposes only</li>
                  <li>Past performance does not indicate future results</li>
                  <li>Different asset classes may behave differently in various economic conditions</li>
                  <li>This analysis shows historical patterns, NOT investment recommendations</li>
                  <li>No asset class or investment is being recommended or endorsed</li>
                  <li>Consult with a SEBI-registered investment advisor before making any investment decisions</li>
                  <li>This is not investment advice, recommendation, or solicitation to buy/sell any securities</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================= */}
      {/* WRAPPER 2: PREMIUM SECTION (BOTTOM) */}
      {/* ============================================= */}
      <div id="premium-section" className="relative bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 rounded-2xl border border-purple-200 shadow-lg p-6 sm:p-8 overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20 -z-10"></div>
        
        {/* Header with Badge */}
        <div className="mb-8 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-3 py-1 bg-purple-700 text-white text-xs font-semibold rounded-full">
              Premium Insight
            </span>
            <Zap className="text-amber-500" size={18} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Plan Survival Stress Test
          </h2>
          <p className="text-slate-700 text-lg font-medium mb-3">
            Test if your retirement plan survives inflation + real market shocks — without changing your asset mix.
          </p>
          <p className="text-slate-600 text-base italic">
            Know your plan's survival confidence before you commit decades of savings.
          </p>
          
          {/* Quick Value Bullets */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
              <span>See when your money runs out (if it does)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
              <span>Understand inflation damage on your lifestyle</span>
            </div>
          </div>
        </div>

        {/* Premium Content or Locked State */}
        {isProUnlockedLocal ? (
          <div className="relative z-10">
            <PlanStressTestPremium formData={formData} />
          </div>
        ) : (
          <div className="space-y-8 relative z-10">
            {/* Value Teasers Grid - 4 cards (2x2 on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Survival Confidence */}
              <div className="p-5 rounded-xl border border-purple-200 bg-white/80 backdrop-blur hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <ShieldCheck className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Survival Confidence</h4>
                    <p className="text-slate-600 text-xs mt-1">How likely your corpus lasts till lifespan</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Crash Sensitivity */}
              <div className="p-5 rounded-xl border border-purple-200 bg-white/80 backdrop-blur hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                    <TrendingDown className="text-red-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Crash Sensitivity</h4>
                    <p className="text-slate-600 text-xs mt-1">Early vs late crash impact on withdrawals</p>
                  </div>
                </div>
              </div>

              {/* Card 3: Inflation Pressure */}
              <div className="p-5 rounded-xl border border-purple-200 bg-white/80 backdrop-blur hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                    <Flame className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Inflation Pressure</h4>
                    <p className="text-slate-600 text-xs mt-1">How lifestyle costs rise inside retirement</p>
                  </div>
                </div>
              </div>

              {/* Card 4: Payout Sustainability */}
              <div className="p-5 rounded-xl border border-purple-200 bg-white/80 backdrop-blur hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                    <LineChart className="text-emerald-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Payout Sustainability</h4>
                    <p className="text-slate-600 text-xs mt-1">Whether withdrawals stay realistic long-term</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-4 pt-6 border-t border-purple-200">
              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                Unlock Pro Stress Test
              </button>
              <p className="text-center text-sm text-slate-600">
                See Worst • Expected • Best case outcomes
              </p>
              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="w-full px-6 py-2 text-purple-600 font-semibold hover:text-purple-700 text-sm transition-colors"
              >
                See what Pro includes →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <ProSubscriptionModal
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
          onConfirm={handleConfirmSubscription}
          onClose={() => setShowSubscriptionModal(false)}
        />
      )}

      {/* Developer Testing Reset Button */}
      <div className="text-center py-4">
        <button
          onClick={resetProForTesting}
          className="text-xs text-slate-500 hover:text-slate-700 underline transition-colors"
        >
          Reset Pro (Testing)
        </button>
      </div>
    </div>
  );
}