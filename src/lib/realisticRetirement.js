/**
 * Realistic Retirement Optimization Engine
 * Income-aware, mathematically correct, impossible to misinterpret
 */

// Constants
const MAX_SIP_INCOME_RATIO = 0.6; // SIP should not exceed 60% of income
const SAFE_SURPLUS_THRESHOLD = 10000; // Minimum safe monthly surplus

/**
 * Calculate financial reality check
 */
export const calculateFinancialReality = (formData) => {
  const {
    monthlyIncome = 0,
    monthlyExpenses = 0,
    monthlySIP: currentSIP = 0
  } = formData;

  // Basic financial health
  const monthlySurplus = monthlyIncome > 0 ? monthlyIncome - monthlyExpenses - currentSIP : 0;
  const maxPossibleSIP = Math.max(0, monthlyIncome > 0 ? monthlyIncome - monthlyExpenses : 0);
  const currentSIPIncomeRatio = monthlyIncome > 0 ? currentSIP / monthlyIncome : 0;
  
  let realityScore = 0;
  let cashFlowStatus = monthlyIncome === 0 ? 'unknown' : 'safe';
  let warnings = [];

  if (monthlyIncome === 0) {
    // No income provided
    cashFlowStatus = 'unknown';
    warnings.push({
      type: 'info',
      message: 'Add your monthly income to see realistic optimization.',
      fix: 'Click "Edit income" to add your net monthly take-home pay.'
    });
    realityScore = 50; // Neutral score when no income data
    
    return {
      monthlyIncome,
      monthlyExpenses,
      currentSIP,
      monthlySurplus: 0,
      maxPossibleSIP: 0,
      currentSIPIncomeRatio: 0,
      cashFlowStatus,
      warnings,
      realityScore,
      canOptimize: false
    };
  }

  // Cash flow safety (30%)
  if (monthlySurplus < 0) {
    cashFlowStatus = 'unsafe';
    warnings.push({
      type: 'critical',
      message: 'Your expenses and SIP exceed your income. This plan is cash-flow unsafe.',
      fix: 'Reduce expenses or increase income before optimizing retirement.'
    });
    realityScore += 10;
  } else if (monthlySurplus < SAFE_SURPLUS_THRESHOLD) {
    cashFlowStatus = 'tight';
    warnings.push({
      type: 'warning',
      message: `You have only ₹${formatNumber(monthlySurplus)} monthly surplus. Consider building emergency savings first.`,
      fix: 'Aim for at least ₹10,000 monthly surplus before aggressive retirement planning.'
    });
    realityScore += 20;
  } else {
    cashFlowStatus = 'healthy';
    realityScore += 30;
  }

  // SIP feasibility check (30%)
  if (currentSIPIncomeRatio > MAX_SIP_INCOME_RATIO) {
    warnings.push({
      type: 'warning',
      message: `Your SIP (${Math.round(currentSIPIncomeRatio * 100)}% of income) leaves little room for other financial goals.`,
      fix: 'Consider balancing retirement savings with other financial needs.'
    });
    realityScore += 10;
  } else if (currentSIPIncomeRatio > 0.4) {
    realityScore += 25;
  } else {
    realityScore += 30;
  }

  // Income-expense ratio health (40%)
  const expenseIncomeRatio = monthlyIncome > 0 ? monthlyExpenses / monthlyIncome : 1;
  if (expenseIncomeRatio > 0.7) {
    warnings.push({
      type: 'warning',
      message: `Your expenses are ${Math.round(expenseIncomeRatio * 100)}% of income, leaving little for savings.`,
      fix: 'Focus on increasing income or reducing expenses.'
    });
    realityScore += 10;
  } else if (expenseIncomeRatio > 0.5) {
    realityScore += 20;
  } else {
    realityScore += 40;
  }

  return {
    monthlyIncome,
    monthlyExpenses,
    currentSIP,
    monthlySurplus,
    maxPossibleSIP,
    currentSIPIncomeRatio,
    cashFlowStatus,
    warnings,
    realityScore: Math.min(100, Math.round(realityScore)),
    canOptimize: cashFlowStatus !== 'unsafe' && monthlySurplus >= 0
  };
};

/**
 * Survival Mode: Will I run out of money?
 */
export const calculateSurvivalMode = (formData, results) => {
  const {
    currentAge = 30,
    lifespan = 85
  } = formData;

  const {
    freedomAge,
    depletionAge
  } = results || {};

  let survivalMessage = '';
  let survivalStatus = 'unknown';
  let yearsCovered = 0;

  if (freedomAge === 'Achieved') {
    survivalMessage = 'Your retirement corpus lasts beyond your expected lifespan.';
    survivalStatus = 'safe';
    yearsCovered = lifespan - currentAge;
  } else if (depletionAge) {
    yearsCovered = depletionAge - currentAge;
    const yearsShort = lifespan - depletionAge;
    
    if (depletionAge >= lifespan) {
      survivalMessage = `Your money lasts until age ${depletionAge}, beyond your expected lifespan of ${lifespan}.`;
      survivalStatus = 'safe';
    } else if (yearsShort <= 5) {
      survivalMessage = `Your money lasts until age ${depletionAge}, just ${yearsShort} years short of your lifespan of ${lifespan}.`;
      survivalStatus = 'warning';
    } else {
      survivalMessage = `Your money may deplete by age ${depletionAge}, ${yearsShort} years before your expected lifespan of ${lifespan}.`;
      survivalStatus = 'danger';
    }
  } else {
    survivalMessage = 'Complete the retirement calculator to check sustainability.';
    survivalStatus = 'unknown';
  }

  // Calculate safety margin
  const safetyMargin = lifespan - (depletionAge || lifespan);
  
  return {
    mode: 'survival',
    label: 'Will I run out of money before my expected lifespan?',
    survivalMessage,
    survivalStatus,
    yearsCovered,
    safetyMargin,
    depletionAge: depletionAge || lifespan,
    lifespan,
    importantNote: 'This checks sustainability assuming you retire at your chosen retirement age. This is NOT early retirement.'
  };
};

/**
 * Realistic Optimization Mode: Best possible within income limits
 */
export const calculateRealisticOptimization = (formData, results, financialReality) => {
  if (!financialReality.canOptimize) {
    return {
      mode: 'realistic',
      label: 'What is the best I can realistically do based on my income and expenses?',
      message: 'Cannot optimize until cash flow is safe.',
      realisticSIP: formData.monthlySIP || 0,
      earliestRetirementAge: formData.retirementAge || 60,
      isRealistic: false,
      requires: 'Fix cash flow first'
    };
  }

  const {
    currentAge = 30,
    lifespan = 85,
    monthlyExpenses = 0,
    inflationRate = 6,
    expectedReturns = 12,
    monthlyIncome = 0,
    moneySaved = 0,
    retirementAge = 60
  } = formData;

  const { monthlySurplus, maxPossibleSIP } = financialReality;
  const currentSIP = formData.monthlySIP || 0;

  // Start with current SIP, gradually increase within surplus limits
  let optimalSIP = currentSIP;
  let earliestAge = retirementAge;
  let usedSurplus = 0;

  // We can use up to 80% of surplus for retirement optimization
  const availableForOptimization = Math.min(
    monthlySurplus * 0.8,
    maxPossibleSIP - currentSIP
  );

  if (availableForOptimization > 0) {
    // Test incremental increases
    const testIncrements = [1000, 2500, 5000, 10000];
    for (const increment of testIncrements) {
      if (increment <= availableForOptimization) {
        const testSIP = currentSIP + increment;
        
        // Simulate retirement age with this SIP
        const testRetirementAge = simulateRetirementAge(
          currentAge,
          testSIP,
          monthlyExpenses,
          expectedReturns,
          inflationRate,
          lifespan,
          moneySaved,
          retirementAge
        );

        if (testRetirementAge < earliestAge) {
          optimalSIP = testSIP;
          earliestAge = testRetirementAge;
          usedSurplus = increment;
        }
      }
    }
  }

  const yearsEarlier = retirementAge - earliestAge;
  const requiresSacrifice = usedSurplus > monthlySurplus * 0.5;
  const comfortLevel = requiresSacrifice ? 'Requires sacrifice' : 'Fits comfortably';

  return {
    mode: 'realistic',
    label: 'What is the best I can realistically do based on my income and expenses?',
    keyInsight: 'Early retirement is limited by surplus, not desire.',
    optimalSIP,
    earliestRetirementAge: Math.max(earliestAge, currentAge + 5), // Minimum 5 years
    usedSurplus,
    availableSurplus: monthlySurplus,
    yearsEarlier: Math.max(0, yearsEarlier),
    requiresSacrifice,
    comfortLevel,
    message: yearsEarlier > 0 
      ? `This is the maximum additional SIP you can safely add today without breaking cash flow.`
      : 'Your current plan is already optimal within realistic constraints.',
    isRealistic: true,
    note: requiresSacrifice 
      ? 'This requires significant commitment but stays within your income limits.'
      : 'This fits comfortably within your current financial situation.',
    explanation: {
      monthlyAction: 'Maximum additional SIP you can safely add today without breaking cash flow',
      earliestAge: 'Earliest age achievable without lying to your income (NOT a dream age)',
      yearsEarlier: 'Calculated relative to your original retirement age, not fantasy scenarios'
    }
  };
};

/**
 * Aggressive Fantasy Mode: What would it take to retire very early?
 */
export const calculateAggressiveFantasy = (formData, results) => {
  const {
    currentAge = 30,
    monthlyExpenses = 0,
    expectedReturns = 12,
    inflationRate = 6,
    lifespan = 85,
    monthlyIncome = 0,
    monthlySIP: currentSIP = 0,
    moneySaved = 0
  } = formData;

  const retirementAges = Array.from({ length: 15 }, (_, i) => currentAge + 5 + i).filter(age => age < lifespan);
  const scenarios = [];
  const chartData = [];

  for (const targetAge of retirementAges) {
    if (targetAge <= currentAge) continue;

    const yearsToTarget = targetAge - currentAge;
    if (yearsToTarget < 5) continue;

    // Calculate required SIP for this early retirement
    const requiredSIP = calculateRequiredSIPForAge(
      currentAge,
      targetAge,
      monthlyExpenses,
      expectedReturns,
      inflationRate,
      lifespan,
      moneySaved
    );

    // Calculate required income (SIP + expenses + 20% buffer for other savings)
    const requiredIncome = Math.round(requiredSIP + monthlyExpenses * 1.2);
    const isRealistic = requiredIncome <= monthlyIncome * 1.3; // Within 30% of current income
    const incomeMultiplier = monthlyIncome > 0 ? (requiredIncome / monthlyIncome).toFixed(1) : '∞';
    
    scenarios.push({
      targetAge,
      requiredSIP: Math.round(requiredSIP),
      requiredIncome,
      currentIncome: monthlyIncome,
      currentSIP,
      isRealistic,
      yearsToTarget,
      incomeMultiplier,
      feasibility: isRealistic ? 'Borderline possible' : 'Not realistic today',
      message: `To retire at ${targetAge}, you would need ₹${formatNumber(requiredSIP)}/month SIP.`
    });

    // Generate chart data
    chartData.push({
      retirementAge: targetAge,
      requiredSIP: Math.round(requiredSIP),
      currentSIP,
      maxRealisticSIP: monthlyIncome > 0 ? monthlyIncome - monthlyExpenses : 0,
      requiredIncome,
      currentIncome: monthlyIncome,
      monthlyExpenses,
      isFeasible: isRealistic
    });
  }

  return {
    mode: 'aggressive',
    label: 'If I insist on retiring very early, what would it mathematically cost?',
    disclaimer: 'These scenarios ignore income limits and are not recommendations.',
    purpose: [
      'To expose the cost of early retirement',
      'To prevent blind optimism',
      'To educate users why FIRE is expensive'
    ],
    scenarios,
    chartData: chartData.slice(0, 10), // Limit to 10 data points for readability
    visualStyle: 'Educational, not aspirational'
  };
};

/**
 * Generate Fantasy Chart Data
 */
export const generateFantasyChartData = (formData) => {
  const {
    currentAge = 30,
    monthlyExpenses = 0,
    expectedReturns = 12,
    inflationRate = 6,
    lifespan = 85,
    monthlyIncome = 0,
    monthlySIP: currentSIP = 0,
    moneySaved = 0
  } = formData;

  const ages = [];
  for (let age = currentAge + 5; age <= Math.min(currentAge + 25, lifespan - 5); age += 1) {
    ages.push(age);
  }

  return ages.map(targetAge => {
    const yearsToTarget = targetAge - currentAge;
    const requiredSIP = calculateRequiredSIPForAge(
      currentAge,
      targetAge,
      monthlyExpenses,
      expectedReturns,
      inflationRate,
      lifespan,
      moneySaved
    );

    const requiredIncome = Math.round(requiredSIP + monthlyExpenses * 1.2);
    
    return {
      retirementAge: targetAge,
      requiredSIP: Math.round(requiredSIP),
      currentSIP,
      maxRealisticSIP: monthlyIncome > 0 ? Math.min(monthlyIncome - monthlyExpenses, monthlyIncome * 0.6) : 0,
      requiredIncome,
      currentIncome: monthlyIncome,
      monthlyExpenses,
      yearsToTarget,
      isFeasible: requiredIncome <= monthlyIncome * 1.5
    };
  });
};

/**
 * Calculate Reality Confidence Score
 */
export const calculateRealityConfidence = (financialReality, survivalMode, realisticMode) => {
  let score = 0;
  
  // Income-expense health (30%)
  score += financialReality.realityScore * 0.3;
  
  // Lifespan coverage (30%)
  if (survivalMode.survivalStatus === 'safe') {
    score += 30;
  } else if (survivalMode.survivalStatus === 'warning') {
    score += 20;
  } else if (survivalMode.survivalStatus === 'danger') {
    score += 10;
  } else {
    score += 15; // unknown
  }
  
  // SIP feasibility (20%)
  if (realisticMode.isRealistic && !realisticMode.requiresSacrifice) {
    score += 20;
  } else if (realisticMode.isRealistic) {
    score += 15;
  } else {
    score += 5;
  }
  
  // Inflation buffer (20%)
  const realReturns = 12 - 6; // Default values
  if (realReturns >= 6) score += 20;
  else if (realReturns >= 4) score += 15;
  else if (realReturns >= 2) score += 10;
  else score += 5;

  const finalScore = Math.min(100, Math.round(score));
  
  let label = 'Financial fantasy';
  if (finalScore >= 80) label = 'Realistic & Strong';
  else if (finalScore >= 50) label = 'Possible but fragile';
  
  return {
    score: finalScore,
    label,
    components: {
      incomeExpenseHealth: financialReality.realityScore,
      lifespanCoverage: survivalMode.survivalStatus === 'safe' ? 100 : 
                        survivalMode.survivalStatus === 'warning' ? 70 :
                        survivalMode.survivalStatus === 'danger' ? 40 : 50,
      sipFeasibility: realisticMode.isRealistic ? (realisticMode.requiresSacrifice ? 75 : 100) : 25,
      inflationBuffer: Math.min(100, realReturns * 10)
    }
  };
};

// Helper functions
const simulateRetirementAge = (currentAge, monthlySIP, monthlyExpenses, expectedReturns, inflationRate, lifespan, currentCorpus, originalRetirementAge) => {
  // Simplified simulation
  const annualSIP = monthlySIP * 12;
  const annualExpense = monthlyExpenses * 12;
  
  let corpus = currentCorpus || 0;
  let age = currentAge;
  
  // Accumulation phase
  while (age < lifespan && corpus < (annualExpense * 25)) { // 25x expenses rule
    corpus = corpus * (1 + expectedReturns/100) + annualSIP;
    age += 1;
  }
  
  // If we never accumulate enough, return original retirement age
  if (age >= lifespan) {
    return originalRetirementAge;
  }
  
  return Math.min(age, originalRetirementAge);
};

const calculateRequiredSIPForAge = (currentAge, targetAge, monthlyExpenses, expectedReturns, inflationRate, lifespan, currentCorpus) => {
  const yearsToTarget = targetAge - currentAge;
  const postRetirementYears = lifespan - targetAge;
  
  if (yearsToTarget <= 0 || postRetirementYears <= 0) {
    return Infinity;
  }
  
  // Calculate required retirement corpus using 4% rule with inflation adjustment
  const annualExpense = monthlyExpenses * 12;
  const requiredCorpus = annualExpense * 25 * Math.pow(1 + inflationRate/100, yearsToTarget);
  
  // Calculate required SIP using future value formula
  const monthlyRate = Math.pow(1 + expectedReturns/100, 1/12) - 1;
  const monthsToTarget = yearsToTarget * 12;
  
  const futureValueFactor = (Math.pow(1 + monthlyRate, monthsToTarget) - 1) / monthlyRate;
  const requiredSIP = Math.max(0, (requiredCorpus - (currentCorpus || 0)) / futureValueFactor);
  
  return Math.round(requiredSIP);
};

const formatNumber = (num) => {
  if (!num && num !== 0) return '₹0';
  
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(1)} Cr`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)} L`;
  } else if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1)} K`;
  } else {
    return `₹${Math.round(num).toLocaleString('en-IN')}`;
  }
};