// Realistic Retirement Optimization Engine
// Provides income-aware retirement planning with reality checks

/**
 * Calculate financial reality check metrics
 */
export function calculateFinancialReality(formData) {
  const {
    currentAge,
    retirementAge,
    lifespan,
    monthlyIncome,
    monthlyExpenses,
    monthlyRetirementExpenses,
    currentSavings,
    monthlySIP,
    expectedReturn,
    inflationRate,
  } = formData;

  // Calculate current financial metrics
  const monthlySurplus = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? (monthlySurplus / monthlyIncome) * 100 : 0;
  const yearsToRetirement = retirementAge - currentAge;
  const retirementYears = lifespan - retirementAge;

  // Calculate safe SIP capacity (max 50% of surplus for sustainability)
  const maxSafeSIP = monthlySurplus * 0.5;
  const sipAsPercentOfSurplus = monthlySurplus > 0 ? (monthlySIP / monthlySurplus) * 100 : 0;
  const isSIPSafe = monthlySIP <= maxSafeSIP;

  return {
    monthlySurplus,
    savingsRate,
    yearsToRetirement,
    retirementYears,
    maxSafeSIP,
    sipAsPercentOfSurplus,
    isSIPSafe,
  };
}

/**
 * Calculate survival mode - minimum required corpus
 */
export function calculateSurvivalMode(formData, results) {
  const {
    retirementAge,
    lifespan,
    monthlyRetirementExpenses,
    inflationRate,
  } = formData;

  const retirementYears = lifespan - retirementAge;
  const avgInflation = inflationRate / 100;
  
  // Calculate inflation-adjusted expenses
  const yearsToRetirement = formData.retirementAge - formData.currentAge;
  const futureMonthlyExpense = monthlyRetirementExpenses * Math.pow(1 + avgInflation, yearsToRetirement);
  const futureYearlyExpense = futureMonthlyExpense * 12;
  
  // Use 4% safe withdrawal rate
  const minimumCorpus = futureYearlyExpense / 0.04;
  
  // Check if projected corpus meets minimum
  const projectedCorpus = results?.corpusAtRetirement || 0;
  const corpusGap = minimumCorpus - projectedCorpus;
  const gapPercentage = minimumCorpus > 0 ? (corpusGap / minimumCorpus) * 100 : 0;
  
  let survivalStatus = 'SAFE';
  if (gapPercentage > 50) survivalStatus = 'UNSAFE';
  else if (gapPercentage > 25) survivalStatus = 'AT_RISK';
  else if (gapPercentage > 0) survivalStatus = 'MODERATE';
  
  return {
    minimumCorpus,
    projectedCorpus,
    corpusGap: Math.max(0, corpusGap),
    gapPercentage: Math.max(0, gapPercentage),
    survivalStatus,
    futureMonthlyExpense,
    futureYearlyExpense,
    retirementYears,
  };
}

/**
 * Calculate realistic optimization scenarios
 */
export function calculateRealisticOptimization(formData, financialReality) {
  const { monthlySurplus, maxSafeSIP } = financialReality;
  const currentSIP = formData.monthlySIP;
  
  // Calculate additional SIP capacity
  const availableAdditionalSIP = Math.max(0, maxSafeSIP - currentSIP);
  
  // Generate optimization scenarios (10%, 25%, 50% of available capacity)
  const scenarios = [
    {
      label: 'Conservative',
      percentage: 10,
      additionalSIP: Math.round(availableAdditionalSIP * 0.1),
      description: '10% of safe capacity',
    },
    {
      label: 'Balanced',
      percentage: 25,
      additionalSIP: Math.round(availableAdditionalSIP * 0.25),
      description: '25% of safe capacity',
    },
    {
      label: 'Aggressive',
      percentage: 50,
      additionalSIP: Math.round(availableAdditionalSIP * 0.5),
      description: '50% of safe capacity',
    },
  ];

  // Calculate impact for each scenario
  const optimizedScenarios = scenarios.map(scenario => {
    const newTotalSIP = currentSIP + scenario.additionalSIP;
    const monthlyRate = (formData.expectedReturn / 100) / 12;
    const months = (formData.retirementAge - formData.currentAge) * 12;
    
    // Calculate future value
    const futureValue = formData.currentSavings * Math.pow(1 + monthlyRate, months) +
      newTotalSIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    return {
      ...scenario,
      newTotalSIP,
      projectedCorpus: futureValue,
    };
  });

  return {
    availableAdditionalSIP,
    currentSIP,
    maxSafeSIP,
    scenarios: optimizedScenarios,
  };
}

/**
 * Calculate aggressive fantasy scenario (using all surplus)
 */
export function calculateAggressiveFantasy(formData, financialReality) {
  const { monthlySurplus } = financialReality;
  const currentSIP = formData.monthlySIP;
  
  // Fantasy: invest ALL surplus
  const fantasyAdditionalSIP = Math.max(0, monthlySurplus - currentSIP);
  const fantasyTotalSIP = monthlySurplus;
  
  const monthlyRate = (formData.expectedReturn / 100) / 12;
  const months = (formData.retirementAge - formData.currentAge) * 12;
  
  // Calculate future value with fantasy SIP
  const fantasyCorpus = formData.currentSavings * Math.pow(1 + monthlyRate, months) +
    fantasyTotalSIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  
  // Reality check
  const isRealistic = fantasyAdditionalSIP <= (monthlySurplus * 0.5);
  const sustainabilityRisk = fantasyAdditionalSIP / monthlySurplus * 100;
  
  return {
    fantasyAdditionalSIP,
    fantasyTotalSIP,
    fantasyCorpus,
    isRealistic,
    sustainabilityRisk,
    warningMessage: isRealistic 
      ? 'This scenario is within safe limits'
      : 'Warning: This requires 100% of surplus - unsustainable for emergencies',
  };
}

/**
 * Calculate reality confidence score
 */
export function calculateRealityConfidence(formData, financialReality, survivalMode) {
  const components = {
    savingsRate: 0,
    sipSafety: 0,
    corpusAdequacy: 0,
    timeHorizon: 0,
  };

  // Savings rate score (0-25 points)
  const { savingsRate } = financialReality;
  if (savingsRate >= 20) components.savingsRate = 25;
  else if (savingsRate >= 15) components.savingsRate = 20;
  else if (savingsRate >= 10) components.savingsRate = 15;
  else if (savingsRate >= 5) components.savingsRate = 10;
  else components.savingsRate = 5;

  // SIP safety score (0-25 points)
  const { sipAsPercentOfSurplus } = financialReality;
  if (sipAsPercentOfSurplus <= 50) components.sipSafety = 25;
  else if (sipAsPercentOfSurplus <= 70) components.sipSafety = 20;
  else if (sipAsPercentOfSurplus <= 85) components.sipSafety = 15;
  else if (sipAsPercentOfSurplus <= 100) components.sipSafety = 10;
  else components.sipSafety = 5;

  // Corpus adequacy score (0-30 points)
  const { survivalStatus, gapPercentage } = survivalMode;
  if (survivalStatus === 'SAFE') components.corpusAdequacy = 30;
  else if (survivalStatus === 'MODERATE') components.corpusAdequacy = 20;
  else if (survivalStatus === 'AT_RISK') components.corpusAdequacy = 10;
  else components.corpusAdequacy = 5;

  // Time horizon score (0-20 points)
  const { yearsToRetirement } = financialReality;
  if (yearsToRetirement >= 20) components.timeHorizon = 20;
  else if (yearsToRetirement >= 15) components.timeHorizon = 15;
  else if (yearsToRetirement >= 10) components.timeHorizon = 10;
  else if (yearsToRetirement >= 5) components.timeHorizon = 5;
  else components.timeHorizon = 2;

  const totalScore = Object.values(components).reduce((sum, val) => sum + val, 0);

  let rating = 'Poor';
  if (totalScore >= 80) rating = 'Excellent';
  else if (totalScore >= 65) rating = 'Good';
  else if (totalScore >= 50) rating = 'Fair';

  return {
    score: totalScore,
    rating,
    components,
  };
}

/**
 * Generate chart data for fantasy vs reality comparison
 */
export function generateFantasyChartData(formData, survivalMode, optimization, fantasy) {
  const yearsToRetirement = formData.retirementAge - formData.currentAge;
  const data = [];
  
  const currentSIP = formData.monthlySIP;
  const balancedSIP = currentSIP + (optimization.scenarios[1]?.additionalSIP || 0);
  const fantasySIP = fantasy.fantasyTotalSIP;
  
  const monthlyRate = (formData.expectedReturn / 100) / 12;
  const currentSavings = formData.currentSavings;
  
  // Generate year-by-year projections
  for (let year = 0; year <= yearsToRetirement; year++) {
    const months = year * 12;
    const age = formData.currentAge + year;
    
    // Calculate corpus for each scenario
    const currentCorpus = currentSavings * Math.pow(1 + monthlyRate, months) +
      currentSIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    const balancedCorpus = currentSavings * Math.pow(1 + monthlyRate, months) +
      balancedSIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    const fantasyCorpus = currentSavings * Math.pow(1 + monthlyRate, months) +
      fantasySIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    data.push({
      age,
      year,
      currentPlan: Math.round(currentCorpus),
      balancedOptimization: Math.round(balancedCorpus),
      fantasyScenario: Math.round(fantasyCorpus),
      minimumRequired: Math.round(survivalMode.minimumCorpus),
    });
  }
  
  return data;
}
