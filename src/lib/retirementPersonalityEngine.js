// src/lib/retirementPersonalityEngine.js
// Personality calculation and club recommendation engine

/**
 * All available retirement personalities
 */
export const PERSONALITIES = {
  FIRE_MAXIMIZER: {
    key: 'fire-maximizer',
    name: 'FIRE Maximizer',
    tagline: 'Maximizing freedom, minimizing timelines.',
    traits: ['High surplus discipline', 'Goal-driven', 'Early retirement focus', 'Aggressive optimizer'],
    icon: '🔥',
    iconSecondary: '⚡',
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-50 to-red-50',
    accentColor: 'orange'
  },
  PREMIUM_LIFE_ARCHITECT: {
    key: 'premium-life-architect',
    name: 'Premium Life Architect',
    tagline: 'Building a retirement that feels like a reward.',
    traits: ['Experience-first', 'High lifestyle clarity', 'Planning mindset', 'Quality focused'],
    icon: '✨',
    iconSecondary: '🏝️',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    accentColor: 'purple'
  },
  COMFORT_FIRST_STABILIZER: {
    key: 'comfort-first-stabilizer',
    name: 'Comfort-First Stabilizer',
    tagline: 'Stable comfort with zero drama.',
    traits: ['Risk-aware', 'Steady progress', 'Practical', 'Balanced approach'],
    icon: '🛡️',
    iconSecondary: '🧘',
    gradient: 'from-teal-500 to-cyan-500',
    bgGradient: 'from-teal-50 to-cyan-50',
    accentColor: 'teal'
  },
  HEALTH_SHIELD_PLANNER: {
    key: 'health-shield-planner',
    name: 'Health-Shield Planner',
    tagline: 'Protecting retirement from health surprises.',
    traits: ['Preparedness', 'Safety buffer', 'Realistic planning', 'Health-conscious'],
    icon: '🩺',
    iconSecondary: '🧠',
    gradient: 'from-blue-500 to-indigo-500',
    bgGradient: 'from-blue-50 to-indigo-50',
    accentColor: 'blue'
  },
  SAFETY_NET_BUILDER: {
    key: 'safety-net-builder',
    name: 'Safety Net Builder',
    tagline: 'Slow, safe, and sustainable.',
    traits: ['Low risk', 'Strong foundation', 'Consistent saver', 'Long-term thinker'],
    icon: '🧱',
    iconSecondary: '✅',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50',
    accentColor: 'green'
  },
  ADVENTURE_RETIREE: {
    key: 'adventure-retiree',
    name: 'Adventure Retiree',
    tagline: 'Retire to live, not just to stop working.',
    traits: ['Travel-driven', 'Experience seeker', 'Growth mindset', 'Life enthusiast'],
    icon: '🌍',
    iconSecondary: '🎒',
    gradient: 'from-amber-500 to-yellow-500',
    bgGradient: 'from-amber-50 to-yellow-50',
    accentColor: 'amber'
  },
  HIGH_RISK_REALITY_CHECKER: {
    key: 'high-risk-reality-checker',
    name: 'High-Risk Reality Checker',
    tagline: 'Big dreams, but backed with reality.',
    traits: ['High ambition', 'Risk-aware health planning', 'Strategic', 'Balanced dreamer'],
    icon: '⚖️',
    iconSecondary: '🚨',
    gradient: 'from-rose-500 to-red-500',
    bgGradient: 'from-rose-50 to-red-50',
    accentColor: 'rose'
  },
  BALANCED_WEALTH_DESIGNER: {
    key: 'balanced-wealth-designer',
    name: 'Balanced Wealth Designer',
    tagline: 'Optimized life with controlled risk.',
    traits: ['Balanced growth', 'Calm execution', 'Consistent upgrades', 'Measured approach'],
    icon: '📈',
    iconSecondary: '🧩',
    gradient: 'from-slate-500 to-gray-600',
    bgGradient: 'from-slate-50 to-gray-100',
    accentColor: 'slate'
  }
};

/**
 * Available clubs for community
 */
export const CLUBS = [
  {
    id: 'fire-maximizers',
    name: '🔥 FIRE Maximizers Club',
    shortName: 'FIRE Maximizers',
    description: 'A community of ambitious savers working towards financial independence and early retirement. Share strategies, track progress, and stay motivated.',
    longDescription: 'Join fellow FIRE enthusiasts who are committed to maximizing their savings rate and achieving financial independence. This is a space for sharing surplus optimization strategies, SIP discipline tips, and early retirement planning discussions.',
    tags: ['FIRE', 'Early Retirement', 'Surplus Strategy'],
    discussionTopics: [
      'Surplus optimization techniques',
      'SIP discipline and automation',
      'Early retirement case studies',
      'Side income strategies',
      'Lifestyle arbitrage ideas'
    ],
    bestFor: [
      { title: 'Aggressive Savers', description: 'Those investing 50%+ of surplus' },
      { title: 'Early Retirement Seekers', description: 'Aiming to retire 8+ years early' },
      { title: 'Goal Trackers', description: 'Love tracking progress metrics' }
    ],
    gradient: 'from-orange-500 to-red-500',
    personalityKeys: ['fire-maximizer', 'high-risk-reality-checker']
  },
  {
    id: 'premium-lifestyle',
    name: '✨ Premium Lifestyle Club',
    shortName: 'Premium Lifestyle',
    description: 'For those who believe retirement should be a reward. Discuss premium experiences, travel planning, and maintaining quality of life.',
    longDescription: 'Connect with like-minded individuals who prioritize quality experiences in retirement. Share ideas on lifestyle planning, travel destinations, hobby funding, and how to build a corpus that supports your dream retirement.',
    tags: ['Premium Living', 'Experience First', 'Quality Life'],
    discussionTopics: [
      'Travel and experience planning',
      'Hobby and passion funding',
      'Quality of life priorities',
      'Premium healthcare planning',
      'Estate and legacy planning'
    ],
    bestFor: [
      { title: 'Experience Seekers', description: 'Value experiences over things' },
      { title: 'Premium Planners', description: 'Targeting comfortable+ lifestyle' },
      { title: 'Quality Focused', description: 'Won\'t compromise on life quality' }
    ],
    gradient: 'from-purple-500 to-pink-500',
    personalityKeys: ['premium-life-architect', 'adventure-retiree']
  },
  {
    id: 'health-shield',
    name: '🩺 Health Shield Club',
    shortName: 'Health Shield',
    description: 'Focused on protecting your retirement from health surprises. Discuss medical planning, insurance strategies, and health cost management.',
    longDescription: 'A supportive community for those who understand the importance of health planning in retirement. Share knowledge about health insurance, medical cost inflation, preventive care, and building adequate health buffers.',
    tags: ['Health Planning', 'Medical Costs', 'Risk Management'],
    discussionTopics: [
      'Health insurance optimization',
      'Medical inflation protection',
      'Preventive health strategies',
      'Emergency fund sizing',
      'Long-term care planning'
    ],
    bestFor: [
      { title: 'Health Conscious', description: 'Prioritize health security' },
      { title: 'Risk Managers', description: 'Plan for medical scenarios' },
      { title: 'Practical Planners', description: 'Realistic about health costs' }
    ],
    gradient: 'from-blue-500 to-indigo-500',
    personalityKeys: ['health-shield-planner', 'comfort-first-stabilizer']
  },
  {
    id: 'steady-builders',
    name: '🧱 Steady Builders Club',
    shortName: 'Steady Builders',
    description: 'For patient wealth builders who believe in slow and steady wins the race. Share long-term strategies and consistent saving habits.',
    longDescription: 'Join the community of patient investors who understand that wealth building is a marathon, not a sprint. Discuss consistent SIP strategies, debt-free living, emergency fund building, and sustainable financial habits.',
    tags: ['Steady Growth', 'Low Risk', 'Long Term'],
    discussionTopics: [
      'Consistent SIP strategies',
      'Debt-free journey tips',
      'Emergency fund building',
      'Conservative investment options',
      'Financial discipline habits'
    ],
    bestFor: [
      { title: 'Conservative Investors', description: 'Prefer stability over high returns' },
      { title: 'Habit Builders', description: 'Value consistency and discipline' },
      { title: 'Long-term Thinkers', description: 'Patient wealth accumulators' }
    ],
    gradient: 'from-green-500 to-emerald-500',
    personalityKeys: ['safety-net-builder', 'balanced-wealth-designer']
  },
  {
    id: 'adventure-retirees',
    name: '🌍 Adventure Retirees Club',
    shortName: 'Adventure Retirees',
    description: 'For those who see retirement as the beginning of life\'s greatest adventure. Share travel ideas, bucket list experiences, and adventure planning.',
    longDescription: 'Connect with fellow adventure seekers who are planning an active, exciting retirement. Discuss travel hacking, bucket list experiences, staying active in retirement, and funding your adventures.',
    tags: ['Travel', 'Adventure', 'Active Retirement'],
    discussionTopics: [
      'Retirement travel planning',
      'Bucket list experiences',
      'Active retirement lifestyle',
      'Travel budgeting tips',
      'Adventure destination ideas'
    ],
    bestFor: [
      { title: 'Travel Enthusiasts', description: 'Dream of seeing the world' },
      { title: 'Active Retirees', description: 'Won\'t slow down in retirement' },
      { title: 'Experience Collectors', description: 'Value memories over possessions' }
    ],
    gradient: 'from-amber-500 to-yellow-500',
    personalityKeys: ['adventure-retiree', 'premium-life-architect']
  }
];

/**
 * Calculate retirement personality based on readings
 * @param {object} readings - The readings from all 4 tools
 * @returns {object} The calculated personality
 */
export const getRetirementPersonality = (readings) => {
  const {
    financialReadiness,
    earlyRetirement,
    lifestylePlanner,
    healthStress
  } = readings;

  // Extract key factors
  const surplusStyle = financialReadiness?.surplusInvestmentStyle || 'Balanced';
  const sipRatio = financialReadiness?.sipCommitmentRatio || 0.5;
  
  const optimizerStyle = earlyRetirement?.optimizerStyle || 'Curious';
  const yearsEarly = earlyRetirement?.yearsEarly || 0;
  
  const lifestyleTier = lifestylePlanner?.chosenTier || 'Comfortable';
  
  const healthCategory = healthStress?.chosenCategory || 'Everyday';

  // Priority scoring system
  // Priority: Health high risk > Lifestyle premium > Early retirement extreme > Investment aggressiveness
  
  // Check for High-Risk Reality Checker first
  // When: Health category Hospitalization, Lifestyle Premium, Aggressive investing
  if (
    healthCategory === 'Hospitalization' &&
    lifestyleTier === 'Premium' &&
    surplusStyle === 'Aggressive'
  ) {
    return PERSONALITIES.HIGH_RISK_REALITY_CHECKER;
  }

  // Check for Health-Shield Planner
  // When: Health category Hospitalization OR Planned, Conservative/Balanced investing
  if (
    (healthCategory === 'Hospitalization' || healthCategory === 'Planned') &&
    (surplusStyle === 'Conservative' || surplusStyle === 'Balanced')
  ) {
    return PERSONALITIES.HEALTH_SHIELD_PLANNER;
  }

  // Check for FIRE Maximizer
  // When: Aggressive investing, yearsEarly >= 8 OR optimizerStyle === "Maximizer", Lifestyle Comfortable/Premium
  if (
    surplusStyle === 'Aggressive' &&
    (yearsEarly >= 8 || optimizerStyle === 'Maximizer') &&
    (lifestyleTier === 'Comfortable' || lifestyleTier === 'Premium')
  ) {
    return PERSONALITIES.FIRE_MAXIMIZER;
  }

  // Check for Premium Life Architect
  // When: Lifestyle Premium, Balanced investing, Not extreme early retirement
  if (
    lifestyleTier === 'Premium' &&
    surplusStyle === 'Balanced' &&
    optimizerStyle !== 'Maximizer' &&
    yearsEarly < 8
  ) {
    return PERSONALITIES.PREMIUM_LIFE_ARCHITECT;
  }

  // Check for Adventure Retiree
  // When: Lifestyle Premium OR Comfortable, Early retirement curiosity (yearsEarly 3–7)
  if (
    (lifestyleTier === 'Premium' || lifestyleTier === 'Comfortable') &&
    yearsEarly >= 3 &&
    yearsEarly <= 7
  ) {
    return PERSONALITIES.ADVENTURE_RETIREE;
  }

  // Check for Comfort-First Stabilizer
  // When: Lifestyle Comfortable, Conservative or Balanced investing, Health category Everyday/Planned
  if (
    lifestyleTier === 'Comfortable' &&
    (surplusStyle === 'Conservative' || surplusStyle === 'Balanced') &&
    (healthCategory === 'Everyday' || healthCategory === 'Planned')
  ) {
    return PERSONALITIES.COMFORT_FIRST_STABILIZER;
  }

  // Check for Safety Net Builder
  // When: Lifestyle Basic or Comfortable, Conservative investing, No extreme early retirement
  if (
    (lifestyleTier === 'Basic' || lifestyleTier === 'Comfortable') &&
    surplusStyle === 'Conservative' &&
    optimizerStyle !== 'Maximizer' &&
    yearsEarly < 5
  ) {
    return PERSONALITIES.SAFETY_NET_BUILDER;
  }

  // Check for Balanced Wealth Designer
  // When: Balanced investing, Comfortable lifestyle, Everyday health costs, Moderate early retirement
  if (
    surplusStyle === 'Balanced' &&
    lifestyleTier === 'Comfortable' &&
    healthCategory === 'Everyday' &&
    (optimizerStyle === 'Curious' || optimizerStyle === 'Serious') &&
    yearsEarly >= 0 &&
    yearsEarly <= 5
  ) {
    return PERSONALITIES.BALANCED_WEALTH_DESIGNER;
  }

  // Default fallback based on investment style
  if (surplusStyle === 'Aggressive') {
    return PERSONALITIES.FIRE_MAXIMIZER;
  } else if (surplusStyle === 'Conservative') {
    return PERSONALITIES.SAFETY_NET_BUILDER;
  }

  // Ultimate fallback
  return PERSONALITIES.BALANCED_WEALTH_DESIGNER;
};

/**
 * Get recommended club based on personality key
 * @param {string} personalityKey - The personality key
 * @returns {object|null} The recommended club
 */
export const getRecommendedClub = (personalityKey) => {
  // Find club that includes this personality
  const club = CLUBS.find(c => c.personalityKeys.includes(personalityKey));
  return club || CLUBS[0]; // Fallback to first club
};

/**
 * Get all clubs
 */
export const getAllClubs = () => CLUBS;

/**
 * Get club by ID
 */
export const getClubById = (clubId) => {
  return CLUBS.find(c => c.id === clubId) || null;
};

/**
 * Get personality by key
 */
export const getPersonalityByKey = (key) => {
  return Object.values(PERSONALITIES).find(p => p.key === key) || null;
};
