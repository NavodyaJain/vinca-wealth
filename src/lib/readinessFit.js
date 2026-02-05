/**
 * Readiness Fit Calculation Engine
 * Diagnoses how well Vinca's features support the user's financial readiness needs
 * Based on actual retirement data from Financial Readiness, Lifestyle Planner, Health Stress Test
 * SEBI-compliant: Educational only, no recommendations
 */

/**
 * Calculate Fit Score (0-100) based on data from multiple tools
 * @param {Object} data - Aggregated data from all input sources
 * @returns {Object} Fit score breakdown with reasoning
 */
export function calculateReadinessFitScore(data) {
  // Validate inputs
  const safeData = {
    // Financial Readiness
    isReady: data?.financialReadiness?.isReady ?? false,
    retirementAgeAchievable: data?.financialReadiness?.retirementAgeAchievable ?? null,
    earlyRetirementGapYears: data?.financialReadiness?.earlyRetirementGapYears ?? 0,
    requiredSIP: data?.financialReadiness?.requiredSIP ?? 0,
    currentSIP: data?.financialReadiness?.currentSIP ?? 0,
    surplusAvailable: data?.financialReadiness?.surplusAvailable ?? 0,
    lifespanSustainability: data?.financialReadiness?.lifespanSustainability ?? null,
    corpusAtRetirement: data?.financialReadiness?.corpusAtRetirement ?? 0,
    requiredCorpus: data?.financialReadiness?.requiredCorpus ?? 0,

    // Lifestyle Planner
    targetLifestyleTier: data?.lifestyle?.targetLifestyleTier ?? null,
    affordableLifestyleTier: data?.lifestyle?.affordableLifestyleTier ?? null,
    monthlyIncomeRequired: data?.lifestyle?.monthlyIncomeRequired ?? 0,
    monthlyIncomeSupported: data?.lifestyle?.monthlyIncomeSupported ?? 0,
    lifestyleGap: data?.lifestyle?.lifestyleGap ?? 0,

    // Health Stress Test
    healthAdjustedCorpus: data?.health?.healthAdjustedCorpus ?? 0,
    baselineCorpus: data?.health?.baselineCorpus ?? 0,
    monthlyHealthGap: data?.health?.monthlyHealthGap ?? 0,
    survivalAge: data?.health?.survivalAge ?? null,
    healthRiskLevel: data?.health?.healthRiskLevel ?? 'low',

    // Sprint Participation
    hasStartedSprint: data?.sprints?.hasStartedSprint ?? false,
    completedSprintsCount: data?.sprints?.completedSprintsCount ?? 0,
    activeSprintType: data?.sprints?.activeSprintType ?? null,

    // User preferences (for context)
    desiredRetirementAge: data?.preferences?.desiredRetirementAge ?? null,
    lifespan: data?.preferences?.lifespan ?? 85,
  };

  // Calculate category scores
  const categoryA = calculateRetirementClarity(safeData);
  const categoryB = calculateLifestyleConfidence(safeData);
  const categoryC = calculateHealthRobustness(safeData);
  const categoryD = calculateExecutionDiscipline(safeData);
  const categoryE = calculateGuidanceNeed(safeData);

  // Total score
  const totalScore = Math.min(100, Math.max(0, categoryA.score + categoryB.score + categoryC.score + categoryD.score + categoryE.score));

  // Determine fit level
  let fitLevel = 'limited';
  if (totalScore >= 80) fitLevel = 'strong';
  else if (totalScore >= 50) fitLevel = 'moderate';

  return {
    totalScore,
    fitLevel,
    categories: {
      retirementClarity: categoryA,
      lifestyleConfidence: categoryB,
      healthRobustness: categoryC,
      executionDiscipline: categoryD,
      guidanceNeed: categoryE,
    },
    signals: generateSignals(safeData, categoryA, categoryB, categoryC, categoryD, categoryE),
    recommendedFeatures: recommendFeatures(safeData, categoryA, categoryB, categoryC, categoryD, categoryE),
    closingMessage: generateClosingMessage(fitLevel, safeData),
  };
}

/**
 * Category A: Retirement Clarity (0-25 points)
 * Measures uncertainty about whether retirement plan is achievable and sustainable
 */
function calculateRetirementClarity(data) {
  let score = 0;
  const signals = [];

  // If not ready at all
  if (data.isReady === false) {
    score = 25;
    signals.push('Retirement readiness not achieved at target age');
  }
  // Ready but sustainability uncertain
  else if (data.isReady === true && data.lifespanSustainability === false) {
    score = 15;
    signals.push('Plan does not fully sustain through expected lifespan');
  }
  // Ready and sustainable
  else if (data.isReady === true && data.lifespanSustainability === true) {
    score = 5;
    signals.push('Retirement plan is on track and sustainable');
  }
  // Default
  else {
    score = 10;
  }

  return { score, signals };
}

/**
 * Category B: Lifestyle Confidence (0-25 points)
 * Measures uncertainty about whether desired lifestyle can be sustained
 */
function calculateLifestyleConfidence(data) {
  let score = 0;
  const signals = [];

  // Significant gap between target and affordable
  if (data.targetLifestyleTier && data.affordableLifestyleTier && data.targetLifestyleTier > data.affordableLifestyleTier + 1) {
    score = 25;
    signals.push(`Desired lifestyle (Tier ${data.targetLifestyleTier}) exceeds affordable tier (${data.affordableLifestyleTier})`);
  }
  // Moderate gap
  else if (data.monthlyIncomeRequired > 0 && data.monthlyIncomeSupported > 0 && data.monthlyIncomeRequired > data.monthlyIncomeSupported * 1.2) {
    score = 15;
    signals.push('Monthly lifestyle expenses exceed projected retirement income');
  }
  // Minor gap or aligned
  else if (data.lifestyleGap > 0 || (data.monthlyIncomeRequired > 0 && data.monthlyIncomeSupported > 0 && data.monthlyIncomeRequired > data.monthlyIncomeSupported)) {
    score = 10;
    signals.push('Slight mismatch between desired and affordable lifestyle');
  }
  // Fully supported
  else {
    score = 5;
    signals.push('Desired lifestyle is affordable in retirement');
  }

  return { score, signals };
}

/**
 * Category C: Health Robustness (0-25 points)
 * Measures uncertainty about healthcare costs and longevity
 */
function calculateHealthRobustness(data) {
  let score = 0;
  const signals = [];

  // High risk or significant gap
  if (data.healthRiskLevel === 'high' || (data.monthlyHealthGap && data.monthlyHealthGap > 0)) {
    score = 25;
    signals.push('Healthcare costs create significant retirement uncertainty');
  }
  // Medium risk
  else if (data.healthRiskLevel === 'medium') {
    score = 15;
    signals.push('Moderate healthcare risk to retirement plan');
  }
  // Check survivability vs expected lifespan
  else if (data.survivalAge && data.lifespan && data.survivalAge < data.lifespan) {
    score = 20;
    signals.push(`Health-adjusted survival age (${data.survivalAge}) below expected lifespan (${data.lifespan})`);
  }
  // Check corpus gap
  else if (data.healthAdjustedCorpus > 0 && data.baselineCorpus > 0 && data.baselineCorpus - data.healthAdjustedCorpus > data.baselineCorpus * 0.1) {
    score = 12;
    signals.push('Healthcare costs reduce retirement corpus significantly');
  }
  // Low risk
  else {
    score = 5;
    signals.push('Healthcare impact is manageable within retirement plan');
  }

  return { score, signals };
}

/**
 * Category D: Execution Discipline (0-15 points)
 * Measures whether user is taking action to improve their readiness
 */
function calculateExecutionDiscipline(data) {
  let score = 0;
  const signals = [];

  // No action taken
  if (!data.hasStartedSprint) {
    score = 15;
    signals.push('No structured planning sprints initiated');
  }
  // Some action, incomplete
  else if (data.completedSprintsCount === 0 && data.hasStartedSprint) {
    score = 10;
    signals.push('Planning sprint started but not completed');
  }
  // Action taken and maintained
  else if (data.completedSprintsCount > 0) {
    score = 5;
    signals.push(`${data.completedSprintsCount} planning sprint(s) completed`);
  }

  return { score, signals };
}

/**
 * Category E: Guidance Need (0-10 points)
 * Measures if user needs external guidance vs. self-sufficient
 */
function calculateGuidanceNeed(data) {
  let score = 0;
  const signals = [];

  // Early retirement desired but not achievable
  if (data.desiredRetirementAge && data.retirementAgeAchievable && data.desiredRetirementAge < data.retirementAgeAchievable) {
    score = 10;
    signals.push('Early retirement desired but not achievable with current plan');
  }
  // SIP increase needed but limited surplus
  else if (data.requiredSIP > data.currentSIP && data.surplusAvailable < (data.requiredSIP - data.currentSIP) * 2) {
    score = 7;
    signals.push('SIP increase required but surplus capacity is limited');
  }
  // Conflicting signals (multiple areas of uncertainty)
  else if ((data.isReady === false || data.isReady === null) && data.healthRiskLevel === 'high') {
    score = 7;
    signals.push('Multiple uncertainties across retirement and health domains');
  }
  // Self-sufficient
  else {
    score = 3;
    signals.push('Plan is relatively clear; optimization guidance may help');
  }

  return { score, signals };
}

/**
 * Generate user-facing signal bullets explaining the score
 */
function generateSignals(data, catA, catB, catC, catD, catE) {
  const allSignals = [];

  // Collect top signals from each category
  if (catA.signals && catA.signals.length > 0) {
    allSignals.push(...catA.signals);
  }
  if (catB.signals && catB.signals.length > 0) {
    allSignals.push(...catB.signals);
  }
  if (catC.signals && catC.signals.length > 0) {
    allSignals.push(...catC.signals);
  }
  if (catD.signals && catD.signals.length > 0) {
    allSignals.push(...catD.signals);
  }
  if (catE.signals && catE.signals.length > 0) {
    allSignals.push(...catE.signals);
  }

  // Return top 2-4 signals
  return allSignals.slice(0, 4);
}

/**
 * Recommend features based on highest-scoring categories
 * Each recommendation includes a reason tied to actual data
 */
function recommendFeatures(data, catA, catB, catC, catD, catE) {
  const features = [];
  const categoryScores = [
    { name: 'financial-readiness', score: catA.score, reason: 'Retirement uncertainty' },
    { name: 'lifestyle-planner', score: catB.score, reason: 'Lifestyle sustainability' },
    { name: 'health-stress-test', score: catC.score, reason: 'Health impact analysis' },
    { name: 'retirement-sprints', score: catD.score, reason: 'Execution planning' },
    { name: 'elevate-manager', score: catE.score, reason: 'Guidance & optimization' },
  ];

  // Sort by score descending
  const sorted = categoryScores.sort((a, b) => b.score - a.score);

  // Add top 2-3 features with actual reasoning
  for (let i = 0; i < Math.min(3, sorted.length); i++) {
    if (sorted[i].score > 0) {
      const feature = createFeatureCard(sorted[i].name, data, sorted[i].score);
      if (feature) {
        features.push(feature);
      }
    }
  }

  return features;
}

/**
 * Create a feature recommendation card with data-driven reasoning
 */
function createFeatureCard(featureName, data, score) {
  const cards = {
    'financial-readiness': {
      name: 'Financial Readiness',
      icon: '📊',
      description: 'See if your retirement plan can sustain your expected lifespan',
      reason: data.isReady === false
        ? 'Your current plan does not achieve your retirement goal at the target age.'
        : data.lifespanSustainability === false
        ? 'Your plan reaches retirement, but may not sustain through your expected lifespan.'
        : 'Verify your retirement plan is on track and sustainable.',
    },
    'lifestyle-planner': {
      name: 'Lifestyle Planner',
      icon: '🏠',
      description: 'Understand what lifestyle your plan can actually support',
      reason: data.targetLifestyleTier && data.affordableLifestyleTier
        ? `Your desired lifestyle (Tier ${data.targetLifestyleTier}) exceeds what your plan can sustain (Tier ${data.affordableLifestyleTier}).`
        : 'Clarify the gap between your desired and affordable retirement lifestyle.',
    },
    'health-stress-test': {
      name: 'Health Stress Test',
      icon: '💪',
      description: 'See how healthcare costs impact your retirement corpus',
      reason: data.healthRiskLevel === 'high'
        ? 'Healthcare costs create significant uncertainty in your retirement plan.'
        : data.monthlyHealthGap > 0
        ? `Monthly healthcare costs (₹${Math.round(data.monthlyHealthGap)}) reduce your retirement sustainability.`
        : 'Understand the healthcare cost impact on your long-term plan.',
    },
    'retirement-sprints': {
      name: 'Retirement Sprints',
      icon: '🎯',
      description: 'Create structured, actionable plans to improve readiness',
      reason: data.hasStartedSprint
        ? `You've started ${data.completedSprintsCount > 0 ? 'and completed' : 'but not yet completed'} planning sprints. Continue building discipline.`
        : 'Structured planning helps you close gaps and take consistent action.',
    },
    'elevate-manager': {
      name: 'Elevate (Manager)',
      icon: '👤',
      description: 'Get guidance from a financial wellness manager',
      reason: data.desiredRetirementAge && data.retirementAgeAchievable && data.desiredRetirementAge < data.retirementAgeAchievable
        ? 'A manager can help optimize your plan to achieve early retirement.'
        : data.requiredSIP > data.currentSIP
        ? 'Expert guidance can help you navigate SIP increases and optimize savings.'
        : 'A manager can help prioritize and optimize your readiness plan.',
    },
  };

  return cards[featureName] || null;
}

/**
 * Generate closing message based on fit level
 */
function generateClosingMessage(fitLevel, data) {
  if (fitLevel === 'strong') {
    return 'Vinca helps you make informed decisions without guesswork. By tracking these areas, you will build confidence in your plan.';
  } else if (fitLevel === 'moderate') {
    return 'Vinca supports specific areas where clarity and discipline matter most. Use these insights to strengthen your plan step by step.';
  } else {
    return 'Your plan appears largely on track. Vinca may help with optimization, specific risk planning, or exploring different scenarios — not urgent but valuable.';
  }
}

/**
 * Format score for display (with color gradient)
 */
export function getScoreDisplay(score) {
  let color = '#059669'; // Green
  if (score < 50) color = '#6B7280'; // Grey
  else if (score < 80) color = '#F59E0B'; // Amber

  return {
    score: Math.round(score),
    color,
    label: getScoreLabel(score),
  };
}

function getScoreLabel(score) {
  if (score >= 80) return 'Strong Fit';
  if (score >= 50) return 'Moderate Fit';
  return 'Limited Fit';
}
