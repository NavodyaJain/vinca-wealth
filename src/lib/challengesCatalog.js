// src/lib/challengesCatalog.js
// Cadence-based challenge catalog for Vinca Wealth

const challengesCatalog = [
  {
    id: 'weekly_surplus_discipline',
    title: 'Weekly Surplus Discipline',
    cadence: 'weekly',
    durationLabel: '7 days',
    effortLabel: '5 min/week',
    bestForTags: ['discipline', 'expense control'],
    descriptionShort: 'Build the habit of checking and saving your weekly surplus.',
    descriptionLong: 'Each week, review your spending and set aside any surplus. This builds discipline and helps you avoid lifestyle creep.',
    actionChecklist: [
      { id: 'check_expenses', label: 'Check weekly expenses', type: 'manual' },
      { id: 'save_surplus', label: 'Save surplus to investment', type: 'manual' }
    ],
    completionType: 'manual'
  },
  {
    id: 'monthly_sip_upgrade',
    title: 'Monthly SIP Upgrade',
    cadence: 'monthly',
    durationLabel: '1 month',
    effortLabel: '10 min/month',
    bestForTags: ['SIP improvement', 'growth'],
    descriptionShort: 'Step up your SIP every month to accelerate your retirement plan.',
    descriptionLong: 'Review your SIP amount on salary day and increase it if possible. Small upgrades compound over time.',
    actionChecklist: [
      { id: 'review_sip', label: 'Review SIP on salary day', type: 'manual' },
      { id: 'increase_sip', label: 'Increase SIP if possible', type: 'manual' }
    ],
    completionType: 'manual'
  },
  {
    id: 'quarterly_review',
    title: 'Quarterly Plan Review',
    cadence: 'quarterly',
    durationLabel: 'Quarterly',
    effortLabel: '30 min/quarter',
    bestForTags: ['review', 'risk check'],
    descriptionShort: 'Quarterly review of your retirement plan and risk assumptions.',
    descriptionLong: 'Every quarter, review your plan, update assumptions, and check for any risks or changes in your situation.',
    actionChecklist: [
      { id: 'review_plan', label: 'Review plan and update assumptions', type: 'manual' },
      { id: 'risk_check', label: 'Check for new risks', type: 'manual' }
    ],
    completionType: 'manual'
  },
  {
    id: 'yearly_health_check',
    title: 'Yearly Retirement Health Check',
    cadence: 'yearly',
    durationLabel: 'Annual',
    effortLabel: '30 min/year',
    bestForTags: ['health check', 'long-term'],
    descriptionShort: 'Annual checkup of your retirement plan health.',
    descriptionLong: 'Once a year, run a full checkup on your retirement plan, including financial readiness, health stress, and lifestyle alignment.',
    actionChecklist: [
      { id: 'run_fin_readiness', label: 'Run Financial Readiness', type: 'tool-linked' },
      { id: 'run_health_stress', label: 'Run Health Stress Test', type: 'tool-linked' }
    ],
    completionType: 'tool-linked'
  },
  {
    id: 'monthly_medical_buffer',
    title: 'Medical Buffer Month',
    cadence: 'monthly',
    durationLabel: '1 month',
    effortLabel: '10 min/month',
    bestForTags: ['medical', 'buffer'],
    descriptionShort: 'Add a medical buffer to your plan this month.',
    descriptionLong: 'If your plan breaks early due to health stress, add a medical buffer this month to improve resilience.',
    actionChecklist: [
      { id: 'add_medical_buffer', label: 'Add medical buffer to plan', type: 'manual' }
    ],
    completionType: 'manual'
  },
  {
    id: 'monthly_lifestyle_alignment',
    title: 'Lifestyle Alignment Month',
    cadence: 'monthly',
    durationLabel: '1 month',
    effortLabel: '10 min/month',
    bestForTags: ['lifestyle', 'alignment'],
    descriptionShort: 'Align your lifestyle with your retirement plan.',
    descriptionLong: 'If your lifestyle is high and unsupported, use this month to realign spending and expectations.',
    actionChecklist: [
      { id: 'review_lifestyle', label: 'Review lifestyle and adjust', type: 'manual' }
    ],
    completionType: 'manual'
  }
];

export default challengesCatalog;
