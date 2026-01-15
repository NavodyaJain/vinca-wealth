'use client';

import { AlertTriangle, BarChart3, TrendingUp } from 'lucide-react';
import { getScenarioConfig } from '@/lib/stressTestCalculations';

const SCENARIOS = ['worst', 'expected', 'best'];

const scenarioIcons = {
  AlertTriangle,
  BarChart3,
  TrendingUp
};

export default function ScenarioSelector({ selectedScenario, onSelect, onAnalyze, isDisabled }) {
  return (
    <div className="space-y-6">
      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SCENARIOS.map((scenario) => {
          const config = getScenarioConfig(scenario);
          const Icon = scenarioIcons[config.icon];
          const isSelected = selectedScenario === scenario;

          return (
            <button
              key={scenario}
              onClick={() => onSelect(scenario)}
              className={`p-5 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? `${config.borderColor} ${config.bgColor} shadow-lg ring-2 ring-offset-2 ${config.textColor.replace('text-', 'ring-')}`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <Icon size={24} className={isSelected ? config.textColor : 'text-gray-400'} />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{config.name}</h3>
                  <p className={`text-xs font-medium ${isSelected ? config.textColor : 'text-gray-500'}`}>
                    {config.tag}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{config.description}</p>
            </button>
          );
        })}
      </div>

      {/* Hook Line */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">💡 How to use:</span> Pick a scenario first. Then we'll show your plan's survival timeline, depletion risk, and inflation impact.
        </p>
      </div>

      {/* Analyze Button */}
      <button
        onClick={onAnalyze}
        disabled={isDisabled}
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
          isDisabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
        }`}
      >
        Analyze Selected Scenario →
      </button>
    </div>
  );
}
