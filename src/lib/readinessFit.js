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
  // Validate inputs - ONLY calculator outputs (Financial, Lifestyle, Health)
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

    // Health Stress Test (comes from metrics object)
    healthAdjustedCorpus: data?.health?.metrics?.healthAdjustedCorpus ?? data?.health?.healthAdjustedCorpus ?? 0,
    baselineCorpus: data?.health?.metrics?.baselineCorpus ?? data?.health?.baselineCorpus ?? 0,
    depletionAge: data?.health?.metrics?.depletionAge ?? data?.health?.depletionAge ?? null,
    baselineDepletionAge: data?.health?.metrics?.baselineDepletionAge ?? data?.health?.baselineDepletionAge ?? null,
    monthlyHealthGap: data?.health?.monthlyHealthGap ?? 0,
    healthRiskLevel: data?.health?.healthRiskLevel ?? 'low',
  };


  // Calculate gap scores from ALL THREE calculators
  // Each contributes to overall score based on gap severity
  const categoryA = calculateRetirementGap(safeData);  // 33 points
  const categoryB = calculateLifestyleGap(safeData);   // 33 points
  const categoryC = calculateHealthGap(safeData);      // 34 points

  // Total score = sum of all gaps (higher score = more gaps = more need for Vinca)
  const totalScore = Math.min(100, Math.max(0, categoryA.score + categoryB.score + categoryC.score));

  // Determine fit level
  let fitLevel = 'limited';
  if (totalScore >= 80) fitLevel = 'strong';
  else if (totalScore >= 50) fitLevel = 'moderate';

  // Generate DYNAMIC reasons from actual data (not static)
  const reasons = generateDynamicReasons(safeData, categoryA, categoryB, categoryC);

  return {
    score: totalScore,
    fitLevel: fitLevel === 'strong' ? 'Strong Fit' : fitLevel === 'moderate' ? 'Moderate Fit' : 'Limited Fit',
    reasons,
    relevantFeatures: recommendFeatures(safeData, categoryA, categoryB, categoryC),
    closingMessage: generateClosingMessage(fitLevel, safeData),
  };
}

/**
 * Category A: Financial Readiness Gap (0-33 points)
 * Measures retirement readiness and lifespan sustainability
 * Higher score = larger gap = more need for Vinca
 */
function calculateRetirementGap(data) {
  let score = 0;
  const signals = [];

  // Plan not ready for target retirement age
  if (data.isReady === false) {
    score = 33;
    signals.push('Your plan does not yet achieve your retirement goal at your target age, creating critical uncertainty');
  }
  // Plan ready but not sustainable for full lifespan
  else if (data.isReady === true && data.lifespanSustainability === false) {
    score = 22;
    signals.push('Your plan reaches retirement but may not sustain your full expected lifespan');
  }
  // Plan is fully ready and sustainable
  else if (data.isReady === true && data.lifespanSustainability === true) {
    score = 11;
    signals.push('Your retirement plan is on track and sustainable');
  }
  // Unknown status
  else {
    score = 11;
  }

  return { score, signals };
}

/**
 * Category B: Lifestyle Gap (0-33 points)
 * Measures lifestyle affordability and retirement income adequacy
 * Higher score = larger gap = more need for Vinca
 */
function calculateLifestyleGap(data) {
  let score = 0;
  const signals = [];

  // Desired lifestyle exceeds what plan can support
  if (data.targetLifestyleTier && data.affordableLifestyleTier && data.targetLifestyleTier > data.affordableLifestyleTier) {
    score = 33;
    const gap = data.targetLifestyleTier - data.affordableLifestyleTier;
    signals.push(`Your desired lifestyle (Tier ${data.targetLifestyleTier}) exceeds what your plan supports (Tier ${data.affordableLifestyleTier})`);
  }
  // Monthly income shortfall exists
  else if (data.monthlyIncomeRequired > 0 && data.monthlyIncomeSupported > 0 && data.monthlyIncomeRequired > data.monthlyIncomeSupported) {
    score = 22;
    signals.push(`Your monthly lifestyle needs (₹${Math.round(data.monthlyIncomeRequired)}) exceed projected retirement income (₹${Math.round(data.monthlyIncomeSupported)})`);
  }
  // Lifestyle is fully supported
  else {
    score = 11;
    signals.push('Your desired lifestyle is supported by your retirement income');
  }

  return { score, signals };
}

/**
 * Category C: Health Sustainability Gap (0-34 points)
 * Measures healthcare cost impact and longevity risk
 * Higher score = larger gap = more need for Vinca
 */
function calculateHealthGap(data) {
  let score = 0;
  const signals = [];

  // Check for health-adjusted survival gap or high risk
  // depletionAge = age when corpus runs out after health costs
  if (data.healthRiskLevel === 'high' || (data.depletionAge && data.depletionAge < 85)) {
    score = 34;
    if (data.healthRiskLevel === 'high') {
      signals.push('Healthcare costs create significant uncertainty in your retirement corpus');
    } else if (data.depletionAge) {
      signals.push(`Healthcare costs reduce your corpus sustainability to age ${Math.round(data.depletionAge)}, creating uncertainty`);
    }
  }
  // Medium health risk or moderate impact
  else if (data.healthRiskLevel === 'medium') {
    score = 23;
    signals.push('Moderate healthcare risk introduces uncertainty into your retirement plan');
  }
  // Check if health reduces corpus significantly
  else if (data.healthAdjustedCorpus && data.baselineCorpus && data.baselineCorpus > 0) {
    const corpusReduction = 1 - (data.healthAdjustedCorpus / data.baselineCorpus);
    if (corpusReduction > 0.15) {
      score = 23;
      signals.push(`Healthcare costs reduce your corpus by ${Math.round(corpusReduction * 100)}%, creating moderate uncertainty`);
    } else {
      score = 12;
      signals.push('Healthcare costs are manageable within your retirement plan');
    }
  }
  // Low health risk or no data
  else {
    score = 12;
    signals.push('Healthcare costs are manageable within your retirement plan');
  }

  return { score, signals };
}

/**
 * Generate DYNAMIC reasons from real user data and calculator outputs ONLY
 * Uses all three calculators: Financial Readiness, Lifestyle, and Health
 * Returns only top-scoring reasons (2-3 most relevant)
 */
function generateDynamicReasons(data, catA, catB, catC) {
  const allReasons = [];

  // Retirement Gap reasons (from Financial Readiness)
  if (catA.score > 0 && catA.signals && catA.signals.length > 0) {
    allReasons.push({
      source: 'Financial Readiness',
      reason: catA.signals[0],
      score: catA.score,
    });
  }

  // Lifestyle Gap reasons (from Lifestyle Planner)
  if (catB.score > 0 && catB.signals && catB.signals.length > 0) {
    allReasons.push({
      source: 'Lifestyle Planner',
      reason: catB.signals[0],
      score: catB.score,
    });
  }

  // Health Gap reasons (from Health Stress Test)
  if (catC.score > 0 && catC.signals && catC.signals.length > 0) {
    allReasons.push({
      source: 'Health Stress Test',
      reason: catC.signals[0],
      score: catC.score,
    });
  }

  // Sort by score (highest first) and return top 3 most relevant
  const sorted = allReasons.sort((a, b) => b.score - a.score);
  return sorted.slice(0, 3).map(({ score, ...rest }) => rest);
}

/**
 * Recommend features based on highest-scoring categories
 * Only recommends features for actual data gaps (never invents)
 */
function recommendFeatures(data, catA, catB, catC) {
  const features = [];
  const categoryScores = [
    { name: 'Financial Readiness Calculator', key: 'financial-readiness', score: catA.score },
    { name: 'Lifestyle Planner', key: 'lifestyle-planner', score: catB.score },
    { name: 'Health Stress Test', key: 'health-stress-test', score: catC.score },
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
 * Based on calculator gaps ONLY
 * Returns {feature: string, why: string}
 */
function createFeatureData(featureKey, data) {
  const features = {
    'financial-readiness': {
      feature: 'Financial Readiness Calculator',
      why: data.isReady === false
        ? 'Your plan does not yet achieve your retirement goal. We can help validate if adjustments to savings, timeline, or spending are needed.'
        : data.lifespanSustainability === false
        ? 'Your plan reaches retirement, but sustaining your full lifespan is uncertain. We can help stress-test longevity risk.'
        : 'We can help validate your plan is on track and sustainable through your expected lifespan.',
    },
    'lifestyle-planner': {
      feature: 'Lifestyle Planner',
      why: data.targetLifestyleTier && data.affordableLifestyleTier && data.targetLifestyleTier > data.affordableLifestyleTier
        ? `Your desired lifestyle (Tier ${data.targetLifestyleTier}) may exceed what your plan supports (Tier ${data.affordableLifestyleTier}). We can help clarify and bridge this gap.`
        : 'We can help you translate lifestyle choices into realistic income and corpus requirements.',
    },
    'health-stress-test': {
      feature: 'Health Stress Test',
      why: data.healthRiskLevel === 'high'
        ? 'Healthcare costs create significant uncertainty in your retirement corpus. We can help stress-test your plan against medical risks.'
        : data.monthlyHealthGap > 0
        ? `Healthcare costs (₹${Math.round(data.monthlyHealthGap)}/month) introduce material uncertainty. We can help model this impact.`
        : 'We can help you understand and model healthcare cost impact across different longevity scenarios.',
    },
  };

  return features[featureKey] || null;
}

/**
 * Generate closing message based on fit level
 */
function generateClosingMessage(fitLevel, data) {
  if (fitLevel === 'strong') {
    return 'We can strongly support your retirement planning. By using these insights, you will build confidence in your plan.';
  } else if (fitLevel === 'moderate') {
    return 'We can meaningfully support your financial readiness. Use these insights to strengthen your plan step by step.';
  } else {
    return 'We can offer targeted support for optimization. Your plan is on track, and we can help with specific risk planning or exploring different scenarios.';
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
