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

  // Generate DYNAMIC reasons from actual data (not static)
  const reasons = generateDynamicReasons(safeData, categoryA, categoryB, categoryC, categoryD, categoryE);

  return {
    score: totalScore,
    fitLevel: fitLevel === 'strong' ? 'Strong Fit' : fitLevel === 'moderate' ? 'Moderate Fit' : 'Limited Fit',
    reasons,
    relevantFeatures: recommendFeatures(safeData, categoryA, categoryB, categoryC, categoryD, categoryE),
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
 * Generate DYNAMIC reasons from real user data and calculator outputs
 * Focuses on GAPS and WHERE VINCA IS RELEVANT (not validation of plan strength)
 * Returns only top-scoring reasons (2-4 most relevant)
 */
function generateDynamicReasons(data, catA, catB, catC, catD, catE) {
  const allReasons = [];

  // Financial Readiness reasons (only if data shows uncertainty)
  if (data.isReady !== null && catA.score > 0) {
    if (data.isReady === false) {
      allReasons.push({
        source: 'Financial Readiness Calculator',
        reason: 'Your plan does not yet achieve your retirement goal at your target age. Vinca helps validate if adjustments to savings, timeline, or spending are needed.',
        score: catA.score,
      });
    } else if (data.isReady === true && data.lifespanSustainability === false) {
      allReasons.push({
        source: 'Financial Readiness Calculator',
        reason: 'Your plan reaches retirement, but its ability to sustain your full lifespan is uncertain. Vinca helps stress-test longevity risk and validate sustainability.',
        score: catA.score,
      });
    }
  }

  // Lifestyle Planner reasons (only if gap exists)
  if ((data.targetLifestyleTier || data.affordableLifestyleTier) && catB.score > 0) {
    if (data.targetLifestyleTier && data.affordableLifestyleTier && data.targetLifestyleTier > data.affordableLifestyleTier) {
      allReasons.push({
        source: 'Lifestyle Planner',
        reason: `Your desired lifestyle (Tier ${data.targetLifestyleTier}) may exceed what your plan can support (Tier ${data.affordableLifestyleTier}). Vinca helps clarify this gap and explore lifestyle-income tradeoffs.`,
        score: catB.score,
      });
    } else if (data.monthlyIncomeRequired > 0 && data.monthlyIncomeSupported > 0 && data.monthlyIncomeRequired > data.monthlyIncomeSupported * 1.1) {
      allReasons.push({
        source: 'Lifestyle Planner',
        reason: `Your monthly retirement lifestyle needs (₹${Math.round(data.monthlyIncomeRequired)}) may exceed projected income (₹${Math.round(data.monthlyIncomeSupported)}). Vinca helps translate lifestyle choices into realistic corpus and income requirements.`,
        score: catB.score,
      });
    }
  }

  // Health Stress Test reasons (only if uncertainty exists)
  if ((data.healthRiskLevel || data.monthlyHealthGap > 0 || data.survivalAge) && catC.score > 0) {
    if (data.healthRiskLevel === 'high') {
      allReasons.push({
        source: 'Health Stress Test',
        reason: 'Your health scenario creates significant uncertainty around retirement corpus impact. Vinca helps stress-test your plan against medical costs and longevity risks.',
        score: catC.score,
      });
    } else if (data.monthlyHealthGap > 0) {
      allReasons.push({
        source: 'Health Stress Test',
        reason: `Healthcare costs (₹${Math.round(data.monthlyHealthGap)}/month) introduce material uncertainty into your corpus sustainability. Vinca helps model this impact across different health scenarios.`,
        score: catC.score,
      });
    } else if (data.healthRiskLevel === 'medium') {
      allReasons.push({
        source: 'Health Stress Test',
        reason: 'Moderate healthcare risk introduces uncertainty into your long-term corpus. Vinca helps clarify this risk and validate your plan against it.',
        score: catC.score,
      });
    }
  }

  // Sprints/Execution reasons (only if action gap exists)
  if (data.hasStartedSprint !== null && catD.score > 0) {
    if (data.hasStartedSprint === false) {
      allReasons.push({
        source: 'Retirement Sprints',
        reason: 'Long-term financial goals are difficult to track without structure, which can lead to loss of focus and discipline. Vinca helps convert long-term goals into structured, trackable action sprints.',
        score: catD.score,
      });
    } else if (data.hasStartedSprint === true && data.completedSprintsCount === 0) {
      allReasons.push({
        source: 'Retirement Sprints',
        reason: 'Consistency is challenging without structured tracking. Vinca helps you complete planning sprints to move from awareness to sustained action.',
        score: catD.score,
      });
    }
  }

  // Guidance/Prioritisation reasons (only if uncertainty exists across multiple areas)
  if (catE.score > 0) {
    const hasMultipleGaps = [catA.score, catB.score, catC.score, catD.score].filter(s => s > 5).length > 1;
    if (hasMultipleGaps || (data.desiredRetirementAge && data.retirementAgeAchievable && data.desiredRetirementAge < data.retirementAgeAchievable)) {
      allReasons.push({
        source: 'Elevate (Guidance)',
        reason: 'Multiple moving parts—retirement age, lifestyle, health, and investments—create decision uncertainty. Vinca helps prioritise which areas need focus most.',
        score: catE.score,
      });
    }
  }

  // Sort by score (highest first) and return top 2-4 most relevant
  const sorted = allReasons.sort((a, b) => b.score - a.score);
  return sorted.slice(0, 4).map(({ score, ...rest }) => rest);
}

/**
 * Recommend features based on highest-scoring categories
 * Only recommends features for actual data gaps (never invents)
 */
function recommendFeatures(data, catA, catB, catC, catD, catE) {
  const features = [];
  const categoryScores = [
    { name: 'Financial Readiness Calculator', key: 'financial-readiness', score: catA.score },
    { name: 'Lifestyle Planner', key: 'lifestyle-planner', score: catB.score },
    { name: 'Health Stress Test', key: 'health-stress-test', score: catC.score },
    { name: 'Retirement Sprints', key: 'retirement-sprints', score: catD.score },
    { name: 'Elevate (Manager)', key: 'elevate-manager', score: catE.score },
  ];

  // Sort by score descending
  const sorted = categoryScores.sort((a, b) => b.score - a.score);

  // Add top 2-3 features with actual data-driven reasoning
  for (let i = 0; i < Math.min(3, sorted.length); i++) {
    if (sorted[i].score > 0) {
      const featureData = createFeatureData(sorted[i].key, data);
      if (featureData) {
        features.push(featureData);
      }
    }
  }

  return features;
}

/**
 * Create feature recommendation with data-driven "why" explanation
 * Focus on GAPS, not validation. Explain why Vinca is relevant.
 * Returns {feature: string, why: string}
 */
function createFeatureData(featureKey, data) {
  const features = {
    'financial-readiness': {
      feature: 'Financial Readiness Calculator',
      why: data.isReady === false
        ? 'Your plan does not yet achieve your retirement goal. Vinca helps validate if adjustments are needed to savings, timeline, or spending.'
        : data.lifespanSustainability === false
        ? 'Your plan reaches retirement, but sustaining your full lifespan is uncertain. Vinca helps stress-test longevity risk.'
        : 'Vinca helps validate your plan is on track and sustainable through your expected lifespan.',
    },
    'lifestyle-planner': {
      feature: 'Lifestyle Planner',
      why: data.targetLifestyleTier && data.affordableLifestyleTier && data.targetLifestyleTier > data.affordableLifestyleTier
        ? `Your desired lifestyle (Tier ${data.targetLifestyleTier}) may exceed what your plan supports (Tier ${data.affordableLifestyleTier}). Vinca helps clarify this gap.`
        : 'Vinca helps you translate lifestyle choices into realistic income and corpus requirements, reducing retirement guesswork.',
    },
    'health-stress-test': {
      feature: 'Health Stress Test',
      why: data.healthRiskLevel === 'high'
        ? 'Healthcare costs create significant uncertainty in your retirement corpus. Vinca helps stress-test your plan against medical risks.'
        : data.monthlyHealthGap > 0
        ? `Healthcare costs (₹${Math.round(data.monthlyHealthGap)}/month) introduce material uncertainty. Vinca helps model this impact.`
        : 'Vinca helps you understand and model healthcare cost impact across different longevity scenarios.',
    },
    'retirement-sprints': {
      feature: 'Retirement Sprints',
      why: data.hasStartedSprint === false
        ? 'Long-term goals without structure lead to loss of focus over time. Vinca helps convert goals into structured, trackable action sprints.'
        : data.completedSprintsCount > 0
        ? 'Consistency is key to long-term discipline. Vinca helps you complete planning sprints to sustain action.'
        : 'Vinca helps you move from awareness to action with structured planning sprints.',
    },
    'elevate-manager': {
      feature: 'Elevate (Manager)',
      why: data.desiredRetirementAge && data.retirementAgeAchievable && data.desiredRetirementAge < data.retirementAgeAchievable
        ? 'Achieving early retirement requires optimisation across multiple areas. A manager helps prioritise and optimise your plan.'
        : 'Multiple moving parts create decision uncertainty. A manager helps prioritise which gaps need focus most.',
    },
  };

  return features[featureKey] || null;
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
