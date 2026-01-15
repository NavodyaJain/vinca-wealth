'use client';

import { useState } from 'react';
import StressTestCharts from '@/components/StressTestCharts';
import SequenceRiskChart from '@/components/SequenceRiskChart';

const GRAPH_OPTIONS = [
  { value: 'all', label: 'All graphs (recommended)' },
  { value: 'corpus', label: 'Corpus Survival Timeline' },
  { value: 'inflation', label: 'Inflation Pressure' },
  { value: 'sequence', label: 'Sequence Risk' }
];

export default function StressTestGraphSection({
  retirementPhaseData,
  sequenceData,
  lifespan,
  retirementAge
}) {
  const [selectedView, setSelectedView] = useState('all');

  const showCorpus = selectedView === 'all' || selectedView === 'corpus';
  const showInflation = selectedView === 'all' || selectedView === 'inflation';
  const showSequence = selectedView === 'all' || selectedView === 'sequence';

  return (
    <div className="space-y-6">
      {/* Graph Selector Dropdown */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-gray-900">View graphs:</label>
        <select
          value={selectedView}
          onChange={(e) => setSelectedView(e.target.value)}
          className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors cursor-pointer"
        >
          {GRAPH_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Graphs Container - Stacked Vertically */}
      <div className="space-y-6">
        {/* Graph 1: Corpus Survival Timeline */}
        {showCorpus && (
          <div>
            <StressTestCharts
              retirementPhaseData={retirementPhaseData}
              lifespan={lifespan}
              retirementAge={retirementAge}
              graphType="corpus"
            />
          </div>
        )}

        {/* Graph 2: Inflation Pressure */}
        {showInflation && (
          <div>
            <StressTestCharts
              retirementPhaseData={retirementPhaseData}
              lifespan={lifespan}
              retirementAge={retirementAge}
              graphType="inflation"
            />
          </div>
        )}

        {/* Graph 3: Sequence Risk */}
        {showSequence && (
          <div>
            <SequenceRiskChart sequenceData={sequenceData} />
          </div>
        )}
      </div>
    </div>
  );
}
