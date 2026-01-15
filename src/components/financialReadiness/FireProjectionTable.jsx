import React from 'react';

const FireProjectionTable = ({ simulationData = [], retirementStartAge, desiredRetirementAge, formatCurrency }) => {
  if (!simulationData.length) return null;

  const rows = simulationData.map((row) => {
    const phase = row.phase || (row.age < retirementStartAge ? 'SIP Phase' : 'Withdrawal Phase');
    const status = (() => {
      if (!row.isSustainableFromThisAge || row.projectedCorpus <= 0) return { label: 'Unsustainable', tone: 'text-rose-700 bg-rose-50 border border-rose-200' };
      const req = row.requiredCorpusAtThisAge || 0;
      if (req <= 0) return { label: 'Safe', tone: 'text-emerald-700 bg-emerald-50 border border-emerald-200' };
      if (row.projectedCorpus >= req) return { label: 'Safe', tone: 'text-emerald-700 bg-emerald-50 border border-emerald-200' };
      if (row.projectedCorpus >= req * 0.9) return { label: 'Tight', tone: 'text-amber-700 bg-amber-50 border border-amber-200' };
      return { label: 'Unsustainable', tone: 'text-rose-700 bg-rose-50 border border-rose-200' };
    })();

    return {
      ...row,
      phase,
      status
    };
  });

  return (
    <div className="bg-white text-slate-900 rounded-2xl shadow-sm border border-gray-200 p-4 space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white shadow-inner overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[420px] overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur text-slate-700 shadow-sm">
                <tr>
                  <th className="px-3 py-3 text-left">Age</th>
                  <th className="px-3 py-3 text-left">Phase</th>
                  <th className="px-3 py-3 text-left">Starting Corpus</th>
                  <th className="px-3 py-3 text-left">Contribution / SIP (Yearly)</th>
                  <th className="px-3 py-3 text-left">Return Applied</th>
                  <th className="px-3 py-3 text-left">Yearly Withdrawal</th>
                  <th className="px-3 py-3 text-left">Ending Corpus</th>
                  <th className="px-3 py-3 text-left">
                    <div className="flex items-center gap-2">
                      <span>Required Corpus</span>
                      <span className="text-xs text-slate-500" title="Required corpus is shown only after retirement starts because while working, salary covers expenses.">ⓘ</span>
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const isEven = idx % 2 === 0;
                  const phase = row.phase || (row.age < retirementStartAge ? 'SIP Phase' : 'Withdrawal Phase');
                  const withdrawal = row.withdrawalYearly ?? row.yearlyWithdrawal ?? 0;
                  const contribution = row.contributionYearly ?? 0;
                  const returnApplied = row.returnApplied ?? 0;
                  const requiredDisplay = row.isRetired ? (formatCurrency ? formatCurrency(row.requiredCorpusAtThisAge || 0) : row.requiredCorpusAtThisAge || 0) : '--';
                  return (
                    <tr key={row.age} className={isEven ? 'bg-slate-50' : 'bg-white'}>
                      <td className="px-3 py-3 font-semibold text-slate-900">{row.age}</td>
                      <td className="px-3 py-3 text-slate-700">{phase}</td>
                      <td className="px-3 py-3">{formatCurrency ? formatCurrency(row.startingCorpus) : row.startingCorpus}</td>
                      <td className="px-3 py-3">{formatCurrency ? formatCurrency(contribution) : contribution}</td>
                      <td className="px-3 py-3">{formatCurrency ? formatCurrency(returnApplied) : returnApplied}</td>
                      <td className="px-3 py-3">{formatCurrency ? formatCurrency(withdrawal) : withdrawal}</td>
                      <td className="px-3 py-3 font-semibold text-slate-900">{formatCurrency ? formatCurrency(row.projectedCorpus) : row.projectedCorpus}</td>
                      <td className="px-3 py-3 text-slate-700">{requiredDisplay}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${row.status.tone}`}>
                          {row.status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FireProjectionTable;
