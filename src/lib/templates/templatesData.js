// src/lib/templates/templatesData.js
// Static list of plan templates for Vinca Wealth

const templates = [
  {
    id: 'retirement_kickstart',
    name: 'Retirement Kickstart',
    tags: ['Beginner', 'Safety'],
    bestFor: ['Beginner', 'Safety'],
    timeToImplement: '5–10 min',
    includes: [
      'Lifestyle target',
      'SIP rule',
      'Retirement assumptions'
    ],
    badge: 'Manager Verified',
    description: 'A simple, safe plan to get started with retirement investing.',
    whatItSetsUp: [
      'Basic lifestyle goal',
      'Monthly SIP automation',
      'Conservative asset allocation'
    ],
    assumptions: ['Inflation 5%', 'Returns 9%', 'Retirement age 60'],
    recommendedChallengeId: 'kickstart_7'
  },
  {
    id: 'emergency_fund',
    name: 'Emergency Fund Builder',
    tags: ['Safety', 'Family'],
    bestFor: ['Family', 'Safety'],
    timeToImplement: '5–10 min',
    includes: [
      'Emergency fund target',
      'Monthly savings rule',
      'Short-term liquidity'
    ],
    badge: 'Manager Verified',
    description: 'Build a safety net for your family and peace of mind.',
    whatItSetsUp: [
      'Emergency fund goal',
      'Savings automation',
      'Short-term asset allocation'
    ],
    assumptions: ['Inflation 5%', 'Returns 7%', '3-6 months expenses'],
    recommendedChallengeId: 'emergency_7'
  },
  {
    id: 'sip_boost',
    name: 'SIP Booster',
    tags: ['Growth', 'Beginner'],
    bestFor: ['Beginner', 'Growth'],
    timeToImplement: '5–10 min',
    includes: [
      'SIP step-up rule',
      'Aggressive allocation',
      'Goal tracking'
    ],
    badge: 'Manager Verified',
    description: 'Accelerate your wealth with a step-up SIP plan.',
    whatItSetsUp: [
      'Step-up SIP automation',
      'Aggressive asset allocation',
      'Goal progress tracking'
    ],
    assumptions: ['Inflation 5%', 'Returns 11%', 'Annual SIP increase 10%'],
    recommendedChallengeId: 'sip_boost_7'
  },
  {
    id: 'fire_reality',
    name: 'FIRE Reality Check',
    tags: ['FIRE', 'Advanced'],
    bestFor: ['FIRE', 'Advanced'],
    timeToImplement: '5–10 min',
    includes: [
      'FIRE target',
      'Withdrawal rule',
      'Aggressive assumptions'
    ],
    badge: 'Manager Verified',
    description: 'Test your FIRE plan with realistic numbers and stress scenarios.',
    whatItSetsUp: [
      'FIRE goal setup',
      'Withdrawal simulation',
      'Stress test scenarios'
    ],
    assumptions: ['Inflation 6%', 'Returns 10%', 'Withdrawal rate 3.5%'],
    recommendedChallengeId: 'fire_reality_14'
  }
];

export function getTemplates() {
  return templates;
}

export function getTemplateById(id) {
  return templates.find((t) => t.id === id);
}
