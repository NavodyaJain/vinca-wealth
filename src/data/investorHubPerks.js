// src/data/investorHubPerks.js
// Realistic fintech-style perks data for Investor Hub Perks Marketplace

const investorHubPerks = [
  {
    id: 'itr500',
    title: '₹500 off on ITR Filing',
    description: 'Get ₹500 instant discount on your Income Tax Return filing with our trusted partner.',
    category: 'Tax & Compliance',
    validTill: '31 Mar 2026',
    platform: 'TaxBuddy',
    image: 'https://placehold.co/160x120?text=ITR+Filing',
    howToUse: [
      'Click Redeem and get your unique code.',
      'Go to TaxBuddy and select ITR filing.',
      'Apply the code at checkout.',
      'Complete your filing and save instantly.'
    ],
    terms: [
      'Valid for new users only.',
      'Cannot be combined with other offers.',
      'One-time use per user.'
    ]
  },
  {
    id: 'books15',
    title: '15% off on Financial Books',
    description: 'Exclusive 15% discount on bestselling finance and investing books.',
    category: 'Learning & Books',
    validTill: '30 Apr 2026',
    platform: 'BookMyFinance',
    image: 'https://placehold.co/160x120?text=Finance+Books',
    howToUse: [
      'Click Redeem to get your code.',
      'Visit BookMyFinance and add books to cart.',
      'Apply code at checkout.'
    ],
    terms: [
      'Applicable on select titles only.',
      'Max discount ₹300.',
      'Non-transferable.'
    ]
  },
  {
    id: 'portfolio-health',
    title: 'Free Portfolio Health Check',
    description: 'Get a comprehensive portfolio health check and risk analysis report.',
    category: 'Investing Tools',
    validTill: '31 May 2026',
    platform: 'FinCheck',
    image: 'https://placehold.co/160x120?text=Portfolio+Check',
    howToUse: [
      'Click View Perk and sign up on FinCheck.',
      'Upload your portfolio statement.',
      'Receive your report in 24 hours.'
    ],
    terms: [
      'For educational purposes only.',
      'No investment advice provided.'
    ]
  },
  {
    id: 'tracker-premium',
    title: '3 Months Premium for Investing Tracker',
    description: 'Enjoy 3 months of premium features on India’s top investing tracker app.',
    category: 'Investing Tools',
    validTill: '31 Jul 2026',
    platform: 'TrackWealth',
    image: 'https://placehold.co/160x120?text=Tracker+Premium',
    howToUse: [
      'Click Redeem and copy your code.',
      'Sign up or log in to TrackWealth.',
      'Activate premium in your account settings.'
    ],
    terms: [
      'Valid for new premium users only.',
      'Auto-renews at standard rate after 3 months.'
    ]
  },
  {
    id: 'tax-consult',
    title: '₹300 off on Tax Consultation',
    description: 'Flat ₹300 off on your first tax consultation session.',
    category: 'Tax & Compliance',
    validTill: '15 Mar 2026',
    platform: 'TaxGenius',
    image: 'https://placehold.co/160x120?text=Tax+Consult',
    howToUse: [
      'Click Redeem and book your session.',
      'Discount auto-applies at payment.'
    ],
    terms: [
      'First-time users only.',
      'Session must be booked before expiry.'
    ]
  },
  {
    id: 'insurance-discount',
    title: '10% off on Term Insurance',
    description: 'Get 10% off on new term insurance premium for the first year.',
    category: 'Health & Insurance',
    validTill: '31 Dec 2026',
    platform: 'SecureLife',
    image: 'https://placehold.co/160x120?text=Term+Insurance',
    howToUse: [
      'Click View Perk and fill the form.',
      'Our advisor will contact you with your offer.'
    ],
    terms: [
      'Offer valid for policies above ₹10 lakh sum assured.',
      'Subject to underwriting approval.'
    ]
  },
  {
    id: 'creditcard-cashback',
    title: '₹1000 Cashback on Credit Card',
    description: 'Apply for a new credit card and get ₹1000 cashback on first spend.',
    category: 'Credit Cards & Banking',
    validTill: '30 Jun 2026',
    platform: 'CardXpress',
    image: 'https://placehold.co/160x120?text=Credit+Card',
    howToUse: [
      'Click Redeem and apply online.',
      'Complete KYC and make your first transaction.'
    ],
    terms: [
      'Cashback credited within 30 days of first spend.',
      'New cardholders only.'
    ]
  },
  {
    id: 'wellness-gym',
    title: '1 Month Free Gym Membership',
    description: 'Enjoy a complimentary month at top gyms in your city.',
    category: 'Lifestyle & Wellness',
    validTill: '31 Aug 2026',
    platform: 'FitNation',
    image: 'https://placehold.co/160x120?text=Free+Gym',
    howToUse: [
      'Click Redeem and show code at gym reception.'
    ],
    terms: [
      'Valid at participating gyms only.',
      'One-time use.'
    ]
  },
  {
    id: 'partner-discount',
    title: '20% Off Partner Brands',
    description: 'Get exclusive 20% off on select partner brands across India.',
    category: 'Partner Discounts',
    validTill: '31 Dec 2026',
    platform: 'GrowthX Partners',
    image: 'https://placehold.co/160x120?text=Partner+Discount',
    howToUse: [
      'Click View Perk to see all brands.',
      'Show your Vinca Wealth ID at checkout.'
    ],
    terms: [
      'Brands and offers subject to change.',
      'Cannot be clubbed with other offers.'
    ]
  },
  {
    id: 'health-check',
    title: 'Free Annual Health Checkup',
    description: 'Book a free annual health checkup at leading diagnostic centers.',
    category: 'Health & Insurance',
    validTill: '31 Oct 2026',
    platform: 'HealthPlus',
    image: 'https://placehold.co/160x120?text=Health+Check',
    howToUse: [
      'Click Redeem and book your slot online.'
    ],
    terms: [
      'Limited slots available.',
      'One checkup per user per year.'
    ]
  },
  {
    id: 'demat-offer',
    title: 'Zero Account Opening for Demat',
    description: 'Open a new demat account with zero opening charges.',
    category: 'Investing Tools',
    validTill: '31 Dec 2026',
    platform: 'StockEase',
    image: 'https://placehold.co/160x120?text=Demat+Account',
    howToUse: [
      'Click Redeem and complete online KYC.'
    ],
    terms: [
      'Account must be opened before expiry.',
      'Charges may apply for future years.'
    ]
  },
  {
    id: 'wellness-yoga',
    title: 'Free Online Yoga Classes',
    description: 'Access unlimited online yoga classes for 2 months.',
    category: 'Lifestyle & Wellness',
    validTill: '30 Sep 2026',
    platform: 'YogaNow',
    image: 'https://placehold.co/160x120?text=Yoga+Classes',
    howToUse: [
      'Click Redeem and register on YogaNow.'
    ],
    terms: [
      'Unlimited access for 2 months.',
      'New users only.'
    ]
  },
  {
    id: 'banking-savings',
    title: '5% Extra Savings Account Interest',
    description: 'Open a new savings account and get 5% interest for 6 months.',
    category: 'Credit Cards & Banking',
    validTill: '31 May 2026',
    platform: 'SafeBank',
    image: 'https://placehold.co/160x120?text=Bank+Savings',
    howToUse: [
      'Click Redeem and open account online.'
    ],
    terms: [
      'Interest rate applicable for first 6 months only.',
      'New customers only.'
    ]
  },
  {
    id: 'insurance-consult',
    title: 'Free Insurance Consultation',
    description: 'Get a free 30-min consultation with a certified insurance advisor.',
    category: 'Health & Insurance',
    validTill: '31 Jul 2026',
    platform: 'InsureSmart',
    image: 'https://placehold.co/160x120?text=Insurance+Consult',
    howToUse: [
      'Click View Perk and book your slot.'
    ],
    terms: [
      'One session per user.',
      'Subject to advisor availability.'
    ]
  },
  {
    id: 'learning-masterclass',
    title: 'Free Masterclass: Personal Finance',
    description: 'Attend a live masterclass on personal finance and investing basics.',
    category: 'Learning & Books',
    validTill: '15 May 2026',
    platform: 'FinEdu',
    image: 'https://placehold.co/160x120?text=Masterclass',
    howToUse: [
      'Click Redeem and register for the event.'
    ],
    terms: [
      'Limited seats available.',
      'Event date as per schedule.'
    ]
  },
  {
    id: 'partner-courses',
    title: '30% Off Partner Courses',
    description: 'Get 30% off on select online courses from our partners.',
    category: 'Partner Discounts',
    validTill: '31 Dec 2026',
    platform: 'GrowthX Academy',
    image: 'https://placehold.co/160x120?text=Partner+Courses',
    howToUse: [
      'Click View Perk to see all courses.',
      'Apply code at partner site.'
    ],
    terms: [
      'Discount valid on select courses only.',
      'Cannot be combined with other offers.'
    ]
  },
  {
    id: 'wellness-therapy',
    title: '2 Free Therapy Sessions',
    description: 'Book two free online therapy sessions with certified therapists.',
    category: 'Lifestyle & Wellness',
    validTill: '31 Oct 2026',
    platform: 'MindEase',
    image: 'https://placehold.co/160x120?text=Therapy+Sessions',
    howToUse: [
      'Click Redeem and book your sessions.'
    ],
    terms: [
      'Sessions must be booked before expiry.',
      'New users only.'
    ]
  },
  {
    id: 'tax-filing',
    title: '₹200 off on Tax Filing',
    description: 'Flat ₹200 off on your next tax filing service.',
    category: 'Tax & Compliance',
    validTill: '30 Apr 2026',
    platform: 'TaxBuddy',
    image: 'https://placehold.co/160x120?text=Tax+Filing',
    howToUse: [
      'Click Redeem and get your code.',
      'Apply code at checkout.'
    ],
    terms: [
      'One-time use per user.',
      'Cannot be clubbed with other offers.'
    ]
  }
];

export default investorHubPerks;
