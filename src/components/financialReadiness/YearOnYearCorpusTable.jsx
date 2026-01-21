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
      <div className="h-64 sm:h-72 flex items-center justify-center border border-gray-200 rounded-xl">
        <p className="text-gray-500">No table data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden border border-gray-200 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-[920px] w-full text-left">
            <thead className="bg-gray-50 text-[11px] sm:text-xs uppercase text-gray-600">
              <tr>
                <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 font-semibold bg-gray-50 lg:sticky lg:left-0 lg:z-10">Age</th>
                <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 font-semibold">Phase</th>
                <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 font-semibold">Starting Amount</th>
                <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 font-semibold">Monthly SIP</th>
                <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 font-semibold">Monthly SWP</th>
                <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 font-semibold">Return %</th>
                <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 font-semibold">Ending Corpus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
              {tableRows.map((row, index) => {
                const baseBg = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                return (
                  <tr key={index} className={`${baseBg} hover:bg-gray-50`}>
                    <td className={`px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-900 bg-gray-50 lg:sticky lg:left-0 lg:z-10 ${baseBg}`}>{row.age}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.phase === 'SIP Phase' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {row.phase}
                      </span>
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-900">{formatCurrency(row.startingAmount)}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-900">{formatCurrency(row.monthlySIP)}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-900">{formatCurrency(row.monthlySWP)}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-gray-900">{formatPercentage(row.returnRate)}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-gray-900">{formatCurrency(row.endingCorpus)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>Showing {tableRows.length} years of data</div>
        <div className="flex items-center gap-1">
          <span>Swipe horizontally to view all columns</span>
          <span aria-hidden>→</span>
        </div>
      </div>
    </div>
  );
};

export default YearOnYearCorpusTable;