// src/components/financialReadiness/YearOnYearCorpusTable.jsx
const YearOnYearCorpusTable = ({ tableRows }) => {
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '-';
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${Math.round(value / 1000)}K`;
  };

  const formatPercentage = (value) => {
    if (!value && value !== 0) return '-';
    return `${value.toFixed(1)}%`;
  };

  if (!tableRows || tableRows.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center border border-gray-200 rounded-lg">
        <p className="text-gray-500">No table data available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">Detailed Table</h3>
        <p className="text-gray-600 text-sm">
          Year-by-year breakdown of your financial journey
        </p>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-7 gap-4 p-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                <div>Age</div>
                <div>Phase</div>
                <div>Starting Amount</div>
                <div>Monthly SIP</div>
                <div>Monthly SWP</div>
                <div>Return %</div>
                <div>Ending Corpus</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {tableRows.map((row, index) => (
                <div 
                  key={index} 
                  className={`grid grid-cols-7 gap-4 p-4 text-sm hover:bg-gray-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-900">{row.age}</div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      row.phase === 'SIP Phase' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {row.phase}
                    </span>
                  </div>
                  <div className="text-gray-900">{formatCurrency(row.startingAmount)}</div>
                  <div className="text-gray-900">{formatCurrency(row.monthlySIP)}</div>
                  <div className="text-gray-900">{formatCurrency(row.monthlySWP)}</div>
                  <div className="text-gray-900">{formatPercentage(row.returnRate)}</div>
                  <div className="font-semibold text-gray-900">{formatCurrency(row.endingCorpus)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 flex justify-between">
        <div>Showing {tableRows.length} years of data</div>
        <div>Scroll to see more →</div>
      </div>
    </div>
  );
};

export default YearOnYearCorpusTable;