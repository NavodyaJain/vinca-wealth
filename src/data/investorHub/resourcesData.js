// src/data/investorHub/resourcesData.js
// Static data for Investor Hub Resources (Video Series, Blogs, Templates)

export const videoSeries = [
  {
    id: 'retirement-basics',
    title: 'Retirement Planning Basics',
    description: 'A beginner-friendly series covering the fundamentals of retirement planning in India.',
    bannerImage: 'https://placehold.co/400x200?text=Resource+Image',
    difficulty: 'Beginner',
    tags: ['Retirement', 'Basics', 'Planning'],
    modules: [
      {
        moduleId: 'mod1',
        title: 'Introduction to Retirement',
        description: 'Why plan for retirement? Key concepts and myths.',
        videos: [
          {
            videoId: 'v1',
            title: 'Why Retirement Planning Matters',
            durationMinutes: 7,
            previewUrl: '#',
            summary: 'Understand the importance of early retirement planning.'
          },
          {
            videoId: 'v2',
            title: 'Common Retirement Myths',
            durationMinutes: 5,
            previewUrl: '#',
            summary: 'Debunking myths around retirement in India.'
          }
        ]
      },
      {
        moduleId: 'mod2',
        title: 'Building Your Corpus',
        description: 'How to estimate and build your retirement corpus.',
        videos: [
          {
            videoId: 'v3',
            title: 'Estimating Your Needs',
            durationMinutes: 8,
            previewUrl: '#',
            summary: 'Learn to estimate your post-retirement needs.'
          }
        ]
      }
    ],
    totalDurationMinutes: 20,
    createdAt: '2025-12-01'
  },
  {
    id: 'advanced-tax',
    title: 'Advanced Tax Strategies for Retirees',
    description: 'Explore tax-saving strategies and compliance for retirees.',
    bannerImage: 'https://placehold.co/400x200?text=Resource+Image',
    difficulty: 'Advanced',
    tags: ['Tax', 'Retirement', 'Compliance'],
    modules: [
      {
        moduleId: 'mod1-tax',
        title: 'Tax Optimization Strategies',
        description: 'Learn advanced tax-saving techniques for retirement income.',
        videos: [
          {
            videoId: 'v-tax-1',
            title: 'Income Tax Planning for Retirees',
            durationMinutes: 12,
            previewUrl: 'https://placehold.co/400x200?text=template-video',
            summary: 'Master income tax deductions and exemptions available to retirees in India.'
          },
          {
            videoId: 'v-tax-2',
            title: 'Capital Gains and Wealth Tax Strategies',
            durationMinutes: 10,
            previewUrl: 'https://placehold.co/400x200?text=template-video',
            summary: 'Understand long-term and short-term capital gains tax implications for retirement portfolios.'
          }
        ]
      }
    ],
    totalDurationMinutes: 22,
    createdAt: '2026-01-10'
  }
];

export const blogs = [
  {
    slug: 'retirement-mistakes-to-avoid',
    title: '5 Retirement Planning Mistakes to Avoid',
    excerpt: 'Avoid these common pitfalls when planning your retirement.',
    category: 'Retirement',
    readTimeMinutes: 4,
    bannerImage: 'https://placehold.co/400x200?text=Resource+Image',
    createdAt: '2026-01-15',
    contentSections: [
      { heading: 'Summary', body: 'Retirement planning is crucial, but many make avoidable mistakes. This article highlights the top 5 errors and how to sidestep them.' },
      { heading: 'Key Insights', body: 'Start early, review your plan regularly, avoid underestimating expenses, diversify investments, and don’t ignore healthcare.' },
      { heading: 'Practical Checklist', body: '✔️ Set clear retirement goals\n✔️ Track expenses\n✔️ Review insurance\n✔️ Update investments annually' },
      { heading: 'Common Mistakes', body: '1. Delaying planning\n2. Not accounting for inflation\n3. Ignoring health costs\n4. Over-relying on one asset\n5. Not seeking advice' },
      { heading: 'Disclaimer', body: 'Educational content only. Not investment advice. Consult a SEBI-registered advisor for personal guidance.' }
    ]
  },
  {
    slug: 'nps-vs-ppf',
    title: 'NPS vs PPF: Which is Better?',
    excerpt: 'A comparison of NPS and PPF for long-term retirement savings.',
    category: 'Investing',
    readTimeMinutes: 6,
    bannerImage: 'https://placehold.co/400x200?text=Resource+Image',
    createdAt: '2025-12-20',
    contentSections: [
      { heading: 'Summary', body: 'NPS and PPF are popular retirement savings options. This article compares their features, returns, and suitability.' },
      { heading: 'Key Insights', body: 'NPS offers market-linked returns and flexibility; PPF is government-backed and safe. Both have tax benefits.' },
      { heading: 'Practical Checklist', body: '✔️ Assess your risk profile\n✔️ Check lock-in periods\n✔️ Review withdrawal rules' },
      { heading: 'Common Mistakes', body: '1. Not understanding lock-in\n2. Ignoring tax implications\n3. Not diversifying' },
      { heading: 'Disclaimer', body: 'Educational content only. Not investment advice. Consult a SEBI-registered advisor for personal guidance.' }
    ]
  }
];

export const templates = [
  {
    id: 'goal-tracker',
    title: 'Retirement Goal Tracker',
    description: 'Track your retirement goals and progress with this template.',
    category: 'Planning',
    bestFor: 'Individuals starting retirement planning',
    bannerImage: 'https://placehold.co/400x200?text=Resource+Image',
    fileUrl: '#',
    createdAt: '2025-11-10',
    previewFields: [
      { label: 'Goal Name', value: 'Retire at 50 with comfort' },
      { label: 'Target Retirement Age', value: '50' },
      { label: 'Monthly Expenses Estimate', value: '₹60,000' },
      { label: 'Healthcare Buffer %', value: '15%' },
      { label: 'Emergency Fund Months', value: '12' },
      { label: 'Notes', value: 'Review annually' }
    ]
  },
  {
    id: 'expense-planner',
    title: 'Monthly Expense Planner',
    description: 'Plan and monitor your monthly expenses for better savings.',
    category: 'Budgeting',
    bestFor: 'Anyone looking to optimize expenses',
    bannerImage: 'https://placehold.co/400x200?text=Resource+Image',
    fileUrl: '#',
    createdAt: '2026-01-05',
    previewFields: [
      { label: 'Goal Name', value: 'Track monthly expenses' },
      { label: 'Estimated Monthly Spend', value: '₹40,000' },
      { label: 'Best For', value: 'Budgeting beginners' },
      { label: 'Emergency Fund Months', value: '6' },
      { label: 'Notes', value: 'Update after every salary credit' }
    ]
  }
];
