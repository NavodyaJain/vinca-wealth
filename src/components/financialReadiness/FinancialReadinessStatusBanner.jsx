// src/components/financialReadiness/FinancialReadinessStatusBanner.jsx
const FinancialReadinessStatusBanner = ({ results }) => {
  const {
    financialReadinessAge,
    expectedCorpusAtRetirement,
    requiredCorpusAtRetirement,
    depletionAge,
    currentMonthlySIP,
    requiredMonthlySIP,
    sipGap
  } = results;

  const formatCurrency = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    return `₹${value.toLocaleString()}`;
  };

  const isSecure = sipGap <= 0;
  const hasDepletion = depletionAge && depletionAge < results.lifespan;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Top Row - 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
          <div className="text-sm font-medium text-blue-700 mb-1">
            Financial Readiness Age
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {financialReadinessAge || 'Not reachable'}
          </div>
          <div className="text-xs text-gray-600">
            Age when corpus becomes sufficient for retirement plan
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-5">
          <div className="text-sm font-medium text-emerald-700 mb-1">
            Expected Corpus
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(expectedCorpusAtRetirement)}
          </div>
          <div className="text-xs text-gray-600">
            Estimated corpus at retirement (with current SIP)
          </div>
        </div>

        <div className="bg-violet-50 border border-violet-100 rounded-lg p-5">
          <div className="text-sm font-medium text-violet-700 mb-1">
            Required Corpus
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(requiredCorpusAtRetirement)}
          </div>
          <div className="text-xs text-gray-600">
            Minimum corpus needed to survive till lifespan
          </div>
        </div>
      </div>

      {/* SIP Adjustment Required Block */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">SIP Adjustment Required</h3>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">
            {hasDepletion 
              ? `Your corpus may deplete around age ${depletionAge.toFixed(1)}` 
              : 'Your corpus survives till lifespan'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm font-medium text-gray-700">Current Monthly SIP</div>
              {!isSecure && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Insufficient
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(currentMonthlySIP)}
            </div>
            <div className="text-xs text-gray-500">Per month</div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm font-medium text-gray-700">Required Monthly SIP</div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Secure
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(requiredMonthlySIP)}
            </div>
            <div className="text-xs text-gray-500">Per month</div>
          </div>
        </div>

        {!isSecure && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-blue-900">
                  Action Required: Increase your monthly SIP
                </div>
                <div className="text-lg font-bold text-blue-700">
                  +{formatCurrency(sipGap)}/month
                </div>
                <div className="text-sm text-blue-600">
                  to secure your retirement goal
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialReadinessStatusBanner;