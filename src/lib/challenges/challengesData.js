// src/lib/challenges/challengesData.js
// Challenge catalog for Vinca Wealth

const challenges = [
  {
    id: 'kickstart_7',
    title: '7-Day Retirement Kickstart',
    durationDays: 7,
    timePerDay: '5 min/day',
    goal: 'Set your foundation for retirement planning',
    reward: 'Kickstart Badge',
    dailyTasks: [
      [
        { id: 'ks1_1', title: 'Set your retirement goal', type: 'setup', description: 'Define your retirement target amount.', ctaLabel: 'Complete', isOptional: false },
        { id: 'ks1_2', title: 'Open Financial Readiness', type: 'tool', description: 'Explore your readiness score.', ctaLabel: 'Open tool', route: '/dashboard/financial-readiness', isOptional: false },
        { id: 'ks1_3', title: 'Read: Why start early?', type: 'learning', description: 'Learn the power of compounding.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'ks2_1', title: 'Review lifestyle needs', type: 'reflection', description: 'Think about your desired lifestyle.', ctaLabel: 'Complete', isOptional: false },
        { id: 'ks2_2', title: 'Update SIP amount', type: 'tool', description: 'Adjust your SIP in readiness tool.', ctaLabel: 'Open tool', route: '/dashboard/financial-readiness', isOptional: false },
        { id: 'ks2_3', title: 'Read: SIP basics', type: 'learning', description: 'Understand SIPs for retirement.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'ks3_1', title: 'Check insurance', type: 'setup', description: 'Ensure you have basic insurance.', ctaLabel: 'Complete', isOptional: false },
        { id: 'ks3_2', title: 'Open Health Stress Test', type: 'tool', description: 'See your health risk.', ctaLabel: 'Open tool', route: '/dashboard/health-stress', isOptional: false },
        { id: 'ks3_3', title: 'Read: Health & Wealth', type: 'learning', description: 'How health impacts wealth.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'ks4_1', title: 'Set up auto-SIP', type: 'setup', description: 'Automate your SIPs for discipline.', ctaLabel: 'Complete', isOptional: false },
        { id: 'ks4_2', title: 'Open Lifestyle Planner', type: 'tool', description: 'Plan your lifestyle goals.', ctaLabel: 'Open tool', route: '/dashboard/lifestyle-planner', isOptional: false },
        { id: 'ks4_3', title: 'Read: Automation wins', type: 'learning', description: 'Why automation matters.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'ks5_1', title: 'Review asset allocation', type: 'reflection', description: 'Check your asset mix.', ctaLabel: 'Complete', isOptional: false },
        { id: 'ks5_2', title: 'Open Financial Readiness', type: 'tool', description: 'Revisit your readiness score.', ctaLabel: 'Open tool', route: '/dashboard/financial-readiness', isOptional: false },
        { id: 'ks5_3', title: 'Read: Asset allocation', type: 'learning', description: 'Basics of asset allocation.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'ks6_1', title: 'Check progress', type: 'reflection', description: 'See how far you’ve come.', ctaLabel: 'Complete', isOptional: false },
        { id: 'ks6_2', title: 'Open Health Stress Test', type: 'tool', description: 'Update your health status.', ctaLabel: 'Open tool', route: '/dashboard/health-stress', isOptional: false },
        { id: 'ks6_3', title: 'Read: Progress stories', type: 'learning', description: 'Stories of successful retirees.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'ks7_1', title: 'Plan next steps', type: 'reflection', description: 'Set your next retirement goal.', ctaLabel: 'Complete', isOptional: false },
        { id: 'ks7_2', title: 'Share your plan', type: 'setup', description: 'Tell a friend or family member.', ctaLabel: 'Complete', isOptional: true },
        { id: 'ks7_3', title: 'Open Lifestyle Planner', type: 'tool', description: 'Refine your lifestyle plan.', ctaLabel: 'Open tool', route: '/dashboard/lifestyle-planner', isOptional: false }
      ]
    ]
  },
  {
    id: 'emergency_7',
    title: 'Emergency Fund Sprint',
    durationDays: 7,
    timePerDay: '4 min/day',
    goal: 'Build your emergency fund safety net',
    reward: 'Safety Net Badge',
    dailyTasks: [
      [
        { id: 'em1_1', title: 'Calculate emergency fund', type: 'setup', description: 'Figure out your 6-month buffer.', ctaLabel: 'Complete', isOptional: false },
        { id: 'em1_2', title: 'Open Financial Readiness', type: 'tool', description: 'Check your liquidity.', ctaLabel: 'Open tool', route: '/dashboard/financial-readiness', isOptional: false },
        { id: 'em1_3', title: 'Read: Why emergency funds?', type: 'learning', description: 'Importance of emergency funds.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'em2_1', title: 'Set up savings account', type: 'setup', description: 'Open a dedicated account.', ctaLabel: 'Complete', isOptional: false },
        { id: 'em2_2', title: 'Automate savings', type: 'setup', description: 'Set up auto-transfer.', ctaLabel: 'Complete', isOptional: false },
        { id: 'em2_3', title: 'Open Financial Readiness', type: 'tool', description: 'Update your savings status.', ctaLabel: 'Open tool', route: '/dashboard/financial-readiness', isOptional: false }
      ],
      [
        { id: 'em3_1', title: 'Review expenses', type: 'reflection', description: 'List your monthly expenses.', ctaLabel: 'Complete', isOptional: false },
        { id: 'em3_2', title: 'Open Lifestyle Planner', type: 'tool', description: 'Plan for emergencies.', ctaLabel: 'Open tool', route: '/dashboard/lifestyle-planner', isOptional: false },
        { id: 'em3_3', title: 'Read: Expense tracking', type: 'learning', description: 'How to track expenses.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'em4_1', title: 'Check insurance', type: 'setup', description: 'Ensure you have health insurance.', ctaLabel: 'Complete', isOptional: false },
        { id: 'em4_2', title: 'Open Health Stress Test', type: 'tool', description: 'Check your health risk.', ctaLabel: 'Open tool', route: '/dashboard/health-stress', isOptional: false },
        { id: 'em4_3', title: 'Read: Insurance basics', type: 'learning', description: 'Why insurance matters.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'em5_1', title: 'Set emergency contacts', type: 'setup', description: 'List your emergency contacts.', ctaLabel: 'Complete', isOptional: false },
        { id: 'em5_2', title: 'Open Financial Readiness', type: 'tool', description: 'Review your plan.', ctaLabel: 'Open tool', route: '/dashboard/financial-readiness', isOptional: false },
        { id: 'em5_3', title: 'Read: Emergency stories', type: 'learning', description: 'Stories of real emergencies.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'em6_1', title: 'Test fund access', type: 'reflection', description: 'Can you access your fund fast?', ctaLabel: 'Complete', isOptional: false },
        { id: 'em6_2', title: 'Open Lifestyle Planner', type: 'tool', description: 'Simulate an emergency.', ctaLabel: 'Open tool', route: '/dashboard/lifestyle-planner', isOptional: false },
        { id: 'em6_3', title: 'Read: Access tips', type: 'learning', description: 'Tips for quick access.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'em7_1', title: 'Review your plan', type: 'reflection', description: 'Is your fund enough?', ctaLabel: 'Complete', isOptional: false },
        { id: 'em7_2', title: 'Share your plan', type: 'setup', description: 'Tell a friend or family member.', ctaLabel: 'Complete', isOptional: true },
        { id: 'em7_3', title: 'Open Financial Readiness', type: 'tool', description: 'Final check.', ctaLabel: 'Open tool', route: '/dashboard/financial-readiness', isOptional: false }
      ]
    ]
  },
  {
    id: 'sip_boost_7',
    title: 'SIP Boost Week',
    durationDays: 7,
    timePerDay: '6 min/day',
    goal: 'Boost your SIPs for faster growth',
    reward: 'SIP Booster Badge',
    dailyTasks: [
      [
        { id: 'sb1_1', title: 'Review SIPs', type: 'reflection', description: 'Check your current SIPs.', ctaLabel: 'Complete', isOptional: false },
        { id: 'sb1_2', title: 'Open Lifestyle Planner', type: 'tool', description: 'Plan SIP step-up.', ctaLabel: 'Open tool', route: '/dashboard/lifestyle-planner', isOptional: false },
        { id: 'sb1_3', title: 'Read: SIP step-up', type: 'learning', description: 'How to step up SIPs.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'sb2_1', title: 'Set SIP increase', type: 'setup', description: 'Decide your SIP increase.', ctaLabel: 'Complete', isOptional: false },
        { id: 'sb2_2', title: 'Open Financial Readiness', type: 'tool', description: 'Update SIP in tool.', ctaLabel: 'Open tool', route: '/dashboard/financial-readiness', isOptional: false },
        { id: 'sb2_3', title: 'Read: SIP growth', type: 'learning', description: 'Benefits of SIP growth.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'sb3_1', title: 'Check asset allocation', type: 'reflection', description: 'Review your asset mix.', ctaLabel: 'Complete', isOptional: false },
        { id: 'sb3_2', title: 'Open Health Stress Test', type: 'tool', description: 'Check health impact.', ctaLabel: 'Open tool', route: '/dashboard/health-stress', isOptional: false },
        { id: 'sb3_3', title: 'Read: Asset allocation', type: 'learning', description: 'Why allocation matters.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'sb4_1', title: 'Automate SIP step-up', type: 'setup', description: 'Set up auto-increase.', ctaLabel: 'Complete', isOptional: false },
        { id: 'sb4_2', title: 'Open Lifestyle Planner', type: 'tool', description: 'Simulate SIP step-up.', ctaLabel: 'Open tool', route: '/dashboard/lifestyle-planner', isOptional: false },
        { id: 'sb4_3', title: 'Read: Automation', type: 'learning', description: 'Why automate SIPs.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'sb5_1', title: 'Check progress', type: 'reflection', description: 'See your SIP growth.', ctaLabel: 'Complete', isOptional: false },
        { id: 'sb5_2', title: 'Open Financial Readiness', type: 'tool', description: 'Review SIP in tool.', ctaLabel: 'Open tool', route: '/dashboard/financial-readiness', isOptional: false },
        { id: 'sb5_3', title: 'Read: Progress stories', type: 'learning', description: 'Stories of SIP success.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'sb6_1', title: 'Review SIP automation', type: 'reflection', description: 'Is automation working?', ctaLabel: 'Complete', isOptional: false },
        { id: 'sb6_2', title: 'Open Health Stress Test', type: 'tool', description: 'Check health impact.', ctaLabel: 'Open tool', route: '/dashboard/health-stress', isOptional: false },
        { id: 'sb6_3', title: 'Read: Automation tips', type: 'learning', description: 'Tips for automation.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'sb7_1', title: 'Plan next SIP step', type: 'setup', description: 'Set your next SIP goal.', ctaLabel: 'Complete', isOptional: false },
        { id: 'sb7_2', title: 'Share your SIP plan', type: 'setup', description: 'Tell a friend or family member.', ctaLabel: 'Complete', isOptional: true },
        { id: 'sb7_3', title: 'Open Lifestyle Planner', type: 'tool', description: 'Refine your SIP plan.', ctaLabel: 'Open tool', route: '/dashboard/lifestyle-planner', isOptional: false }
      ]
    ]
  },
  {
    id: 'fire_reality_14',
    title: 'FIRE Reality Check',
    durationDays: 14,
    timePerDay: '7 min/day',
    goal: 'Test your FIRE plan with real numbers',
    reward: 'FIRE Badge',
    dailyTasks: [
      [
        { id: 'fr1_1', title: 'Define FIRE number', type: 'setup', description: 'Calculate your FIRE target.', ctaLabel: 'Complete', isOptional: false },
        { id: 'fr1_2', title: 'Open Financial Readiness', type: 'tool', description: 'Check your FIRE readiness.', ctaLabel: 'Open tool', route: '/dashboard/financial-readiness', isOptional: false },
        { id: 'fr1_3', title: 'Read: FIRE basics', type: 'learning', description: 'Understand FIRE movement.', ctaLabel: 'Watch', isOptional: true }
      ],
      [
        { id: 'fr2_1', title: 'Review expenses', type: 'reflection', description: 'List your annual expenses.', ctaLabel: 'Complete', isOptional: false },
        { id: 'fr2_2', title: 'Open Lifestyle Planner', type: 'tool', description: 'Plan for FIRE lifestyle.', ctaLabel: 'Open tool', route: '/dashboard/lifestyle-planner', isOptional: false },
        { id: 'fr2_3', title: 'Read: Expense tracking', type: 'learning', description: 'How to track expenses.', ctaLabel: 'Watch', isOptional: true }
      ],
      // ...days 3-14 (add similar structure for each day)
    ]
  }
];

export function getChallenges() {
  return challenges;
}

export function getChallengeById(id) {
  return challenges.find((c) => c.id === id);
}
