'use client';

import { useState } from 'react';
import { Shield, Info, TrendingUp, Zap } from 'lucide-react';
import { getConfidenceTag } from '@/lib/stressTestCalculations';

const cardIcons = {
  survivalAge: TrendingUp,
  survivalConfidence: Shield,
  inflationConfidence: Zap,
  purchasingPower: Shield
};

const cardColors = {
  survivalAge: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600'
  },
  survivalConfidence: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'text-purple-600'
  },
  inflationConfidence: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-600'
  },
  purchasingPower: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600'
  }
};

const tooltips = {
  survivalConfidence: 'This score estimates how likely your plan is to last until your expected lifespan in this market scenario.',
  inflationConfidence: 'This score estimates how well your plan keeps up with rising living costs over time.'
};

const TooltipBox = ({ text, visible }) => {
  if (!visible) return null;
  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white text-gray-700 text-xs rounded-lg p-3 shadow-lg border border-gray-200 z-50 max-w-xs w-48">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
    </div>
  );
};

export default function StressTestSummaryCards({ results }) {
  const [tooltipVisible, setTooltipVisible] = useState(null);

  const cards = [
    {
      key: 'survivalAge',
      label: 'Plan Survival Age',
      value: results.survivalAge,
      subtext: 'Your corpus lasts till this age in the selected scenario',
      icon: cardIcons.survivalAge,
      showTooltip: false
    },
    {
      key: 'survivalConfidence',
      label: 'Survival Confidence',
      value: `${results.survivalConfidence}/100`,
      tag: getConfidenceTag(results.survivalConfidence).text,
      subtext: 'How strongly your plan survives without running out',
      icon: cardIcons.survivalConfidence,
      showTooltip: true
    },
    {
      key: 'inflationConfidence',
      label: 'Inflation Confidence',
      value: `${results.inflationConfidence}/100`,
      tag: getConfidenceTag(results.inflationConfidence).text,
      subtext: 'How well your plan absorbs rising expenses',
      icon: cardIcons.inflationConfidence,
      showTooltip: true
    },
    {
      key: 'purchasingPower',
      label: 'Purchasing Power Status',
      value: results.purchasingPowerStatus,
      subtext: 'Whether your lifestyle stays affordable after inflation',
      icon: cardIcons.purchasingPower,
      showTooltip: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const colors = cardColors[card.key];
        const Icon = card.icon;
        const tagInfo = card.tag ? getConfidenceTag(results[card.key]) : null;

        return (
          <div
            key={card.key}
            className={`p-5 rounded-xl border-2 ${colors.bg} ${colors.border}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon size={20} className={colors.icon} />
                <h3 className="font-semibold text-gray-900 text-sm">{card.label}</h3>
              </div>
              {card.showTooltip && (
                <div className="relative">
                  <button
                    onClick={() => setTooltipVisible(tooltipVisible === card.key ? null : card.key)}
                    className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${colors.icon}`}
                  >
                    <Info size={16} />
                  </button>
                  <TooltipBox
                    text={tooltips[card.key]}
                    visible={tooltipVisible === card.key}
                  />
                </div>
              )}
            </div>
            <div className="text-2xl font-semibold text-gray-900 mb-2">
              {card.value}
            </div>
            {card.tag && (
              <div className={`text-xs font-semibold mb-2 ${tagInfo.color}`}>
                {card.tag}
              </div>
            )}
            <p className="text-xs text-gray-600">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
