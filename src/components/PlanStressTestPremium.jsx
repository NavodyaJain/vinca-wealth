'use client';

import { useState } from 'react';
import ScenarioSelector from '@/components/ScenarioSelector';
import StressTestSummaryCards from '@/components/StressTestSummaryCards';
import StressTestGraphSection from '@/components/StressTestGraphSection';
import { calculateStressTestScenario, getScenarioExplanation, getScenarioConfig, calculateSequenceRiskData } from '@/lib/stressTestCalculations';

export default function PlanStressTestPremium({ formData }) {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [analyzedScenario, setAnalyzedScenario] = useState(null);
  const [results, setResults] = useState(null);
  const [sequenceData, setSequenceData] = useState(null);

  const handleAnalyze = () => {
    if (!selectedScenario) return;

    const stressTestResult = calculateStressTestScenario(formData, selectedScenario);
    const sequenceRiskData = calculateSequenceRiskData(formData, selectedScenario);
    
    setResults(stressTestResult);
    setSequenceData(sequenceRiskData);
    setAnalyzedScenario(selectedScenario);
  };

  const handleScenarioSwitch = (newScenario) => {
    setSelectedScenario(newScenario);
    const stressTestResult = calculateStressTestScenario(formData, newScenario);
    const sequenceRiskData = calculateSequenceRiskData(formData, newScenario);
    
    setResults(stressTestResult);
    setSequenceData(sequenceRiskData);
    setAnalyzedScenario(newScenario);
  };

  const lifespan = parseFloat(formData.lifespan) || 85;
  const retirementAge = parseFloat(formData.retirementAge) || 60;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Plan Survival Stress Test</h2>
        <p className="text-gray-600">
          See how your retirement plan holds up under real-world market conditions — without changing your asset mix.
        </p>
      </div>

      {/* Scenario Selection or Results */}
      {!results ? (
        <ScenarioSelector
          selectedScenario={selectedScenario}
          onSelect={setSelectedScenario}
          onAnalyze={handleAnalyze}
          isDisabled={!selectedScenario}
        />
      ) : (
        <div className="space-y-8">
          {/* Results Summary Cards */}
          <StressTestSummaryCards results={results} />

          {/* Scenario Explanation */}
          <div className={`rounded-xl p-6 border-2 ${getScenarioConfig(analyzedScenario).bgColor} ${getScenarioConfig(analyzedScenario).borderColor}`}>
            <div className="flex items-start gap-4">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className={`font-semibold mb-2 ${getScenarioConfig(analyzedScenario).textColor}`}>
                  What this scenario means
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {getScenarioExplanation(analyzedScenario)}
                </p>
              </div>
            </div>
          </div>

          {/* Graphs Section */}
          <StressTestGraphSection
            retirementPhaseData={results.retirementPhaseData}
            sequenceData={sequenceData}
            lifespan={lifespan}
            retirementAge={retirementAge}
          />

          {/* Scenario Switch Chips */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-600 w-full">Switch scenario:</p>
            {['worst', 'expected', 'best'].map((scenario) => {
              const config = getScenarioConfig(scenario);
              const isActive = analyzedScenario === scenario;
              return (
                <button
                  key={scenario}
                  onClick={() => handleScenarioSwitch(scenario)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? `${config.bgColor} ${config.borderColor} border-2 ${config.textColor}`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  {config.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-gray-100 rounded-lg p-4 text-xs text-gray-600">
        <p className="font-medium text-gray-900 mb-2">⚠️ Educational Simulation</p>
        <p>
          This stress test is a simulation based on your inputs and hypothetical scenario assumptions. It is for educational 
          purposes only and does not provide investment recommendations. Actual results may vary significantly based on real 
          market conditions, personal circumstances, and behavioral factors. Consult a SEBI-registered financial advisor for 
          personalized guidance.
        </p>
      </div>
    </div>
  );
}
