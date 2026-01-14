'use client';

import { useEffect } from 'react';
import { useCalculator } from '../../../context/CalculatorContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StatusBanner from '../../../components/StatusBanner';
import StatCard from '../../../components/StatCard';
import CTASection from '../../../components/CTASection';
import { formatCurrency, formatAge } from '../../../lib/formatters';
import { calculateRetirementMetrics } from '../../../lib/retirementPlanner';

export default function ResultsPage() {
  const { formData } = useCalculator();
  const router = useRouter();

  useEffect(() => {
    // Redirect to calculator if no formData
    if (!formData || Object.keys(formData).length === 0) {
      router.push('/calculator');
    }
  }, [formData, router]);

  if (!formData || Object.keys(formData).length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Loading your results...</p>
      </div>
    );
  }

  // Calculate retirement metrics
  const metrics = calculateRetirementMetrics(formData);
  const {
    financialReadinessAge,
    expectedCorpus,
    requiredCorpus,
    depletionAge,
    currentSIP,
    requiredSIP,
    sipGap,
    isSustainable
  } = metrics;

  const isAchieved = isSustainable;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4">
            Your Financial Readiness Analysis
          </h1>
          <p className="text-lg text-slate-600">
            Comprehensive retirement planning insights based on your financial profile
          </p>
        </div>

        <StatusBanner formData={formData} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Financial Readiness Age"
            value={financialReadinessAge}
            type="age"
            subtitle="Earliest sustainable retirement age"
            description={financialReadinessAge ? `You can retire as early as age ${financialReadinessAge}` : 'Not achieved under current plan'}
            status={financialReadinessAge ? 'achieved' : 'warning'}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="primary"
          />
          
          <StatCard
            title="Expected Corpus"
            value={expectedCorpus}
            type="currency"
            subtitle={`At age ${formData.retirementAge || 60}`}
            description="Projected wealth with current plan"
            status={expectedCorpus >= requiredCorpus ? 'achieved' : 'insufficient'}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color={expectedCorpus >= requiredCorpus ? 'primary' : 'danger'}
          />
          
          <StatCard
            title="Required Corpus"
            value={requiredCorpus}
            type="currency"
            subtitle={`Till age ${formData.lifespan || 85}`}
            description="Amount needed for sustainability"
            status="achieved"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          
          <StatCard
            title="Monthly SIP Gap"
            value={sipGap}
            type="currency"
            badge={sipGap > 0 ? 'Insufficient' : 'Secure'}
            description={sipGap > 0 ? 'Additional monthly investment needed' : 'Current SIP is sufficient'}
            status={sipGap > 0 ? 'insufficient' : 'secure'}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            }
            color={sipGap > 0 ? 'danger' : 'primary'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Monthly SIP</h3>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{formatCurrency(currentSIP)}</div>
                <p className="text-sm text-slate-600 mb-4">Your current monthly investment</p>
                <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                  Insufficient
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-600 mb-2">Progress to Target</p>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div className="bg-orange-500 h-3 rounded-full" style={{width: `${Math.min((currentSIP / requiredSIP) * 100, 100)}%`}}></div>
                </div>
                <p className="text-xs text-slate-600 mt-2">{Math.round((currentSIP / requiredSIP) * 100)}% of required SIP</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-green-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Required Monthly SIP</h3>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(requiredSIP)}</div>
                <p className="text-sm text-slate-600 mb-4">For sustainable retirement plan</p>
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Secure
                </div>
              </div>
              <div className="pt-4 border-t border-green-200">
                <p className="text-xs text-slate-600 mb-2">Increase Needed</p>
                <p className="text-2xl font-bold text-green-600 mb-2">{formatCurrency(sipGap)}</p>
                <p className="text-xs text-slate-600">per month to reach target</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-12">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                isAchieved ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {isAchieved ? '✓' : '!'}
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  {isAchieved 
                    ? 'Excellent! Your plan is sustainable.' 
                    : 'Your plan needs adjustment for sustainability.'}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {isAchieved
                    ? `Your expected corpus (${formatCurrency(expectedCorpus)}) is sufficient to sustain you till age ${formData.lifespan || 85}.`
                    : `Your corpus may deplete by age ${depletionAge ? Math.round(depletionAge) : 'unknown'}. Consider increasing your SIP.`}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                ₹
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  {sipGap > 0 
                    ? `Increase your SIP by ${formatCurrency(sipGap)}/month`
                    : 'Your current SIP rate is on track'}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {sipGap > 0
                    ? 'This adjustment will help achieve financial readiness by age ' + (financialReadinessAge || formData.retirementAge || 60) + '.'
                    : 'Continue your current investment discipline and stay on track with your goals.'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                🎯
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  {financialReadinessAge 
                    ? `You can achieve financial readiness by age ${financialReadinessAge}`
                    : 'Financial readiness not achieved under current plan'}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {financialReadinessAge
                    ? `This is ${financialReadinessAge - (formData.currentAge || 30)} years from now. Regular monitoring and adjustments will help you stay on track.`
                    : 'Consider increasing your SIP, extending your working years, or reducing expenses.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link 
            href="/dashboard" 
            className="btn-cta flex-1 text-center"
          >
            View Detailed Dashboard
          </Link>
          
          <Link 
            href="/calculator" 
            className="btn-secondary flex-1 text-center"
          >
            Adjust My Plan
          </Link>
        </div>

        <CTASection 
          title="Want to optimize your financial plan?"
          description="Our certified financial planners can help you fine-tune your strategy, explore tax-efficient options, and ensure you're maximizing your wealth-building potential."
          ctaText="Get Personalized Advice"
          secondaryCta="Recalculate"
        />
      </div>
    </div>
  );
}