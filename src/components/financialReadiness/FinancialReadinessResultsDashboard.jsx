// src/components/financialReadiness/FinancialReadinessResultsDashboard.jsx
import FinancialReadinessStatusBanner from './FinancialReadinessStatusBanner';
import YearOnYearCorpusChart from './YearOnYearCorpusChart';
import YearOnYearCorpusTable from './YearOnYearCorpusTable';
import PremiumFireCalculatorSection from './PremiumFireCalculatorSection';

const formatCurrency = (value) => {
  if (!value && value !== 0) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const FinancialReadinessResultsDashboard = ({ formData, results }) => {
  if (!results) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Calculating your financial readiness results...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <FinancialReadinessStatusBanner results={results} />

      {/* Chart Section - Full Width */}
      <div className="rounded-2xl shadow-sm p-6 bg-white border border-gray-100">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Financial Journey Visualization</h3>
          <p className="text-sm text-gray-600 mt-1">Year-by-year corpus growth and retirement projection</p>
        </div>
        <YearOnYearCorpusChart 
          chartData={results.timelineChartData}
          currentAge={formData.currentAge}
          retirementAge={formData.retirementAge}
          lifespan={formData.lifespan}
        />
      </div>

      {/* Detailed Table Section - Full Width Below Chart */}
      <div className="rounded-2xl shadow-sm p-6 bg-white border border-gray-100">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Year-by-Year Projection</h3>
          <p className="text-sm text-gray-600 mt-1">Detailed breakdown of corpus growth, withdrawals, and corpus balance</p>
        </div>
        <YearOnYearCorpusTable tableRows={results.tableRows} />
      </div>

      {/* Premium FIRE Calculator Section */}
      <PremiumFireCalculatorSection 
        formData={formData}
        results={results}
      />
    </div>
  );
};

export default FinancialReadinessResultsDashboard;