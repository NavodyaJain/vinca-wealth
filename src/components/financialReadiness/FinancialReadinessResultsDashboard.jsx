// src/components/financialReadiness/FinancialReadinessResultsDashboard.jsx
import { useEffect, useMemo, useState } from 'react';
import FinancialReadinessStatusBanner from './FinancialReadinessStatusBanner';
import YearOnYearCorpusChart from './YearOnYearCorpusChart';
import YearOnYearCorpusTable from './YearOnYearCorpusTable';
import PremiumFireCalculatorSection from './PremiumFireCalculatorSection';
import ProSubscriptionModal from './ProSubscriptionModal';
import ActionRequiredCard from '../ActionRequiredCard';
import { usePremium } from '@/lib/premium';
import { calculateFinancialReadinessResults } from '@/lib/financialReadiness/financialReadinessEngine';

const FinancialReadinessResultsDashboard = ({ formData, results }) => {
  const { isPremium, upgradeToPremium } = usePremium();
  const [showProModal, setShowProModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const computedResults = useMemo(() => {
    if (results) return results;
    if (formData && Object.keys(formData).length) {
      return calculateFinancialReadinessResults(formData);
    }
    return null;
  }, [formData, results]);

  useEffect(() => {
    if (!isPremium) return;
    const timer = setTimeout(() => {
      const section = document.getElementById('fire-calculator-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [isPremium]);

  const handleConfirmPlan = () => {
    upgradeToPremium();
    setShowProModal(false);
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null || Number.isNaN(value)) return '—';
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    if (value === 0) return '₹0';
    return `₹${Math.round(value).toLocaleString('en-IN')}`;
  };

  if (!computedResults) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Calculating your financial readiness results...</p>
      </div>
    );
  }

  const sipDelta = computedResults?.requiredMonthlySIP !== undefined && computedResults?.currentMonthlySIP !== undefined
    ? computedResults.requiredMonthlySIP - computedResults.currentMonthlySIP
    : null;

  const actionMessage = sipDelta !== null && sipDelta > 0
    ? `To retire at ${Math.round(computedResults.retirementAge)} and survive till ${computedResults.lifespan}, increase your SIP by ${formatCurrency(sipDelta)} / month.`
    : 'You are on track ✅ No SIP increase required.';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Status Banner */}
      <div id="status-banner">
        <FinancialReadinessStatusBanner results={computedResults} />
      </div>

      <ActionRequiredCard
        title="Action Required"
        message={actionMessage}
        ctaHref="/dashboard/financial-readiness"
        ctaLabel=""
      />

      {/* Chart Section - Full Width */}
      <div className="rounded-2xl shadow-sm p-4 sm:p-6 bg-white border border-slate-200" id="projection-chart">
        <div className="mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Financial Journey Visualization</h3>
          <p className="text-sm text-gray-600 mt-1">Year-by-year corpus growth and retirement projection</p>
        </div>
        <YearOnYearCorpusChart 
          chartData={computedResults.timelineChartData}
          currentAge={computedResults.currentAge}
          retirementAge={computedResults.retirementAge}
          lifespan={computedResults.lifespan}
        />
      </div>

      {/* Detailed Table Section - Full Width Below Chart */}
      <div className="rounded-2xl shadow-sm p-4 sm:p-6 bg-white border border-slate-200" id="projection-table">
        <div className="mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Year-by-Year Projection</h3>
          <p className="text-sm text-gray-600 mt-1">Detailed breakdown of corpus growth, withdrawals, and corpus balance</p>
        </div>
        <YearOnYearCorpusTable tableRows={computedResults.tableRows} />
      </div>

      <PremiumFireCalculatorSection 
        results={computedResults}
        onUpgradeClick={() => setShowProModal(true)}
      />

      {showProModal && (
        <ProSubscriptionModal
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
          onConfirm={handleConfirmPlan}
          onClose={() => setShowProModal(false)}
        />
      )}
    </div>
  );
};

export default FinancialReadinessResultsDashboard;