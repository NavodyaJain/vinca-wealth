/**
 * Health Stress Test Calculation Engine
 * Pure JavaScript calculations for health impact on retirement
 * SEBI-compliant: Educational only, no recommendations
 */

// Healthcare inflation assumption (separate from general inflation)
const MEDICAL_INFLATION_RATE = 0.09; // 9% annually

// Scenario-based cost multipliers
const SCENARIO_MULTIPLIERS = {
  everyday: {
    annualCostMultiplier: 0.04, // 4% of annual expenses
    oneTimeCost: 0,
    recurrence: 'annual',
    description: 'Ongoing manageable conditions',
    hospitalDaily: null,
    recoveryMonthly: null
  },
  planned: {
    annualCostMultiplier: 0.02,
    oneTimeCost: 300000, // ₹3L event
    recurrence: 'event',
    description: 'Single planned medical event',
    hospitalDaily: 20000,
    recoveryMonthly: 0.05 // as % of monthly expenses
  },
  'high-impact': {
    annualCostMultiplier: 0.06,
    oneTimeCost: 1500000, // ₹15L major event
    recurrence: 'event+ongoing',
    description: 'Major health event with ongoing care',
    hospitalDaily: 30000,
    recoveryMonthly: 0.1 // as % of monthly expenses
  }
};

/**
 * Calculate health-adjusted retirement metrics
 * @param {Object} userInputs - Retirement inputs from Financial Readiness
 * @param {Object} scenario - Selected health scenario
 * @returns {Object} Analysis results
 */
export function calculateHealthImpact(userInputs, scenario) {
  // Validate inputs
  if (!userInputs || !scenario) {
    throw new Error('Missing required inputs');
  }

  const {
    currentAge,
    retirementAge,
    lifespan,
    monthlyExpenses,
    monthlySIP,
    moneySaved,
    expectedReturns,
    inflationRate,
    emergencyFund = 0
  } = userInputs;

  const scenarioConfig = SCENARIO_MULTIPLIERS[scenario.id] || SCENARIO_MULTIPLIERS.everyday;

  // Calculate baseline metrics (without health impact)
  const baselineMetrics = calculateBaselineRetirement(
    userInputs
  );

  // Calculate health costs over retirement period
  const healthCosts = calculateHealthCosts(
    userInputs,
    scenarioConfig
  );

  // Apply health costs to retirement corpus
  const healthAdjustedMetrics = applyHealthImpact(
    baselineMetrics,
    healthCosts,
    userInputs
  );

  // Calculate hospitalization affordability
  const careSupport = calculateCareSupport({
    emergencyFund,
    scenarioConfig,
    monthlyExpenses,
    userPaysPercent: 1 // legacy engine assumes self-pay; update when coverage available
  });

  return {
    baselineMetrics,
    healthCosts,
    healthAdjustedMetrics,
    metrics: {
      baselineCorpus: baselineMetrics.finalCorpus,
      healthAdjustedCorpus: healthAdjustedMetrics.finalCorpus,
      corpusReduction: 1 - (healthAdjustedMetrics.finalCorpus / baselineMetrics.finalCorpus),
      baselineDepletionAge: baselineMetrics.depletionAge,
      depletionAge: healthAdjustedMetrics.depletionAge,
      yearsEarlier: baselineMetrics.depletionAge - healthAdjustedMetrics.depletionAge,
      annualHealthCost: healthCosts.annualCost,
      totalHealthCost: healthCosts.totalCost,
      hospitalizationDays: careSupport.daysSupported,
      recoveryMonths: careSupport.monthsSupported,
      careSupport,
      scenarioImpact: scenarioConfig.description
    },
    assumptions: {
      medicalInflation: MEDICAL_INFLATION_RATE,
      hospitalDailyCost: careSupport.assumptions.hospitalDaily,
      recoveryMonthlyCost: careSupport.assumptions.recoveryMonthly,
      calculationPeriod: lifespan - retirementAge
    }
  };
}

/**
 * Calculate baseline retirement metrics
 */
function calculateBaselineRetirement(inputs) {
  const {
    currentAge,
    retirementAge,
    lifespan,
    monthlyExpenses,
    monthlySIP,
    moneySaved,
    expectedReturns,
    inflationRate
  } = inputs;

  const workingYears = retirementAge - currentAge;
  const retirementYears = lifespan - retirementAge;
  const totalYears = lifespan - currentAge;

  // Future value of current savings
  const fvCurrentSavings = moneySaved * Math.pow(1 + expectedReturns/100, workingYears);

  // Future value of SIP until retirement
  const monthlyReturn = expectedReturns / 100 / 12;
  const months = workingYears * 12;
  const fvSIP = monthlySIP * (
    (Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn
  ) * (1 + monthlyReturn);

  // Retirement corpus at retirement
  const corpusAtRetirement = fvCurrentSavings + fvSIP;

  // Monthly expenses at retirement (adjusted for inflation)
  const monthlyExpensesAtRetirement = monthlyExpenses * Math.pow(1 + inflationRate/100, workingYears);

  // Annual withdrawal needed (use let instead of const for reassignment)
  let annualWithdrawal = monthlyExpensesAtRetirement * 12;

  // Calculate depletion age
  let corpus = corpusAtRetirement;
  let age = retirementAge;
  let depletionAge = lifespan;

  for (let year = 1; year <= retirementYears; year++) {
    // Apply returns
    corpus = corpus * (1 + expectedReturns/100);
    
    // Withdraw annual expenses
    corpus -= annualWithdrawal;
    
    // Adjust withdrawal for inflation
    annualWithdrawal = annualWithdrawal * (1 + inflationRate/100);
    
    age++;
    
    if (corpus <= 0) {
      depletionAge = retirementAge + year;
      break;
    }
  }

  return {
    corpusAtRetirement,
    finalCorpus: Math.max(0, corpus),
    depletionAge,
    monthlyExpensesAtRetirement,
    annualWithdrawalAtRetirement: monthlyExpensesAtRetirement * 12
  };
}

/**
 * Calculate health costs based on scenario
 */
function calculateHealthCosts(inputs, scenarioConfig) {
  const { monthlyExpenses, retirementAge, currentAge, lifespan } = inputs;
  const annualExpenses = monthlyExpenses * 12;
  
  const workingYears = retirementAge - currentAge;
  const retirementYears = lifespan - retirementAge;
  
  // Base annual health cost
  let baseAnnualCost = annualExpenses * scenarioConfig.annualCostMultiplier;
  
  // Add one-time cost if applicable
  const oneTimeCost = scenarioConfig.oneTimeCost || 0;
  
  // Project costs with medical inflation
  let totalCost = 0;
  let annualCostAtRetirement = baseAnnualCost * Math.pow(1 + MEDICAL_INFLATION_RATE, workingYears);
  
  // Sum costs over retirement period
  for (let year = 1; year <= retirementYears; year++) {
    const yearCost = annualCostAtRetirement;
    totalCost += yearCost;
    
    // Apply medical inflation
    annualCostAtRetirement *= (1 + MEDICAL_INFLATION_RATE);
  }
  
  // Add one-time cost (assumed to occur once during retirement)
  totalCost += oneTimeCost;
  
  return {
    baseAnnualCost,
    annualCost: annualCostAtRetirement / Math.pow(1 + MEDICAL_INFLATION_RATE, retirementYears), // Current annual cost
    totalCost,
    oneTimeCost,
    scenarioType: scenarioConfig.recurrence
  };
}

/**
 * Apply health costs to retirement metrics
 */
function applyHealthImpact(baselineMetrics, healthCosts, inputs) {
  const { expectedReturns, inflationRate } = inputs;
  const { depletionAge: baselineDepletionAge, corpusAtRetirement } = baselineMetrics;
  
  let corpus = corpusAtRetirement;
  let age = inputs.retirementAge;
  let annualWithdrawal = baselineMetrics.annualWithdrawalAtRetirement;
  let healthAnnualCost = healthCosts.annualCost;
  let oneTimeCostApplied = false;
  let depletionAge = inputs.lifespan;
  
  for (let year = 1; age < inputs.lifespan; year++) {
    // Apply investment returns
    corpus = corpus * (1 + expectedReturns/100);
    
    // Withdraw living expenses
    corpus -= annualWithdrawal;
    
    // Apply health costs
    if (!oneTimeCostApplied && healthCosts.oneTimeCost > 0) {
      // Apply one-time cost in first 5 years of retirement
      if (year <= 5) {
        corpus -= healthCosts.oneTimeCost;
        oneTimeCostApplied = true;
      }
    }
    
    // Apply annual health costs
    corpus -= healthAnnualCost;
    
    // Inflate withdrawals and health costs
    annualWithdrawal *= (1 + inflationRate/100);
    healthAnnualCost *= (1 + MEDICAL_INFLATION_RATE);
    
    age++;
    
    if (corpus <= 0) {
      depletionAge = inputs.retirementAge + year;
      break;
    }
  }
  
  return {
    finalCorpus: Math.max(0, corpus),
    depletionAge,
    healthCostsApplied: {
      oneTime: oneTimeCostApplied,
      totalAnnualHealthCost: healthCosts.totalCost
    }
  };
}

/**
 * Calculate hospitalization affordability
 */
function calculateHospitalizationAffordability(emergencyFund, annualHealthCost, monthlyExpenses) {
  const dailyHospitalCost = 20000; // ₹20,000 per day
  
  // Total available for hospitalization
  const totalAvailable = emergencyFund + (annualHealthCost * 0.5); // Assume 50% of health budget for hospitalization
  
  // Calculate affordable days
  const affordableDays = Math.floor(totalAvailable / dailyHospitalCost);
  
  // Cap at reasonable maximum
  return Math.min(affordableDays, 60);
}

function calculateCareSupport({ emergencyFund = 0, scenarioConfig, monthlyExpenses = 0, userPaysPercent = 1 }) {
  const oopFactor = Number.isFinite(userPaysPercent) ? Math.max(0, userPaysPercent) : 1;
  if (!scenarioConfig || scenarioConfig === SCENARIO_MULTIPLIERS.everyday || (!scenarioConfig.hospitalDaily && !scenarioConfig.recoveryMonthly)) {
    return {
      daysSupported: null,
      monthsSupported: null,
      assumptions: {
        hospitalDaily: null,
        recoveryMonthly: null
      }
    };
  }

  const hospitalDailyBase = Number.isFinite(scenarioConfig.hospitalDaily)
    ? scenarioConfig.hospitalDaily
    : 20000;
  const recoveryBase = Number.isFinite(scenarioConfig.recoveryMonthly)
    ? scenarioConfig.recoveryMonthly * monthlyExpenses
    : (scenarioConfig.recoveryMonthly || 0);

  const hospitalDaily = hospitalDailyBase * oopFactor;
  const recoveryMonthly = recoveryBase * oopFactor;

  const daysSupported = hospitalDaily > 0 ? Math.floor(emergencyFund / hospitalDaily) : null;
  const monthsSupported = recoveryMonthly > 0 ? Math.floor(emergencyFund / recoveryMonthly) : null;

  return {
    daysSupported: Number.isFinite(daysSupported) && daysSupported > 0 ? daysSupported : null,
    monthsSupported: Number.isFinite(monthsSupported) && monthsSupported > 0 ? monthsSupported : null,
    assumptions: {
      hospitalDaily,
      recoveryMonthly
    }
  };
}

/**
 * Generate projection data for charts
 */
export function generateHealthProjection(userInputs, scenario, years = 30) {
  const data = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i <= years; i += 5) {
    const year = currentYear + i;
    const age = userInputs.currentAge + i;
    
    // Calculate baseline corpus
    const baseline = calculateBaselineCorpusAtAge(userInputs, age);
    
    // Calculate health-adjusted corpus
    const healthAdjusted = applyHealthCostToCorpus(
      baseline,
      age - userInputs.currentAge,
      scenario
    );
    
    data.push({
      year,
      age,
      baseline,
      healthAdjusted,
      difference: baseline - healthAdjusted
    });
  }
  
  return data;
}

// Helper functions
function calculateBaselineCorpusAtAge(inputs, targetAge) {
  const years = targetAge - inputs.currentAge;
  const { moneySaved, monthlySIP, expectedReturns } = inputs;
  
  // Simplified calculation
  const fvSavings = moneySaved * Math.pow(1 + expectedReturns/100, years);
  const monthlyRate = expectedReturns / 100 / 12;
  const months = years * 12;
  
  const fvSIP = monthlySIP * (
    (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate
  ) * (1 + monthlyRate);
  
  return fvSavings + fvSIP;
}

function applyHealthCostToCorpus(corpus, yearsFromNow, scenario) {
  const multiplier = SCENARIO_MULTIPLIERS[scenario.id]?.annualCostMultiplier || 0.04;
  
  // Apply compounding health cost impact
  const healthImpact = Math.pow(1 - multiplier, Math.min(yearsFromNow / 10, 1));
  
  return corpus * healthImpact;
}

export default {
  calculateHealthImpact,
  generateHealthProjection,
  MEDICAL_INFLATION_RATE,
  SCENARIO_MULTIPLIERS
};