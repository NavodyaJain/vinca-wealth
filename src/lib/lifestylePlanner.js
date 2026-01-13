// Lifestyle Planner Calculation Library

// Format currency with Indian notation (₹)
export function formatCurrency(amount) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(2)}K`;
  }
  return `₹${Math.round(amount)}`;
}

// Format number short (for tooltips)
export function formatNumberShort(num) {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toFixed(0);
}

// Calculate future value of a monthly SIP
export function calculateFutureValueOfSIP(monthlySIP, annualReturn, years) {
  const monthlyRate = annualReturn / 100 / 12;
  const months = years * 12;
  
  if (monthlyRate === 0) {
    return monthlySIP * months;
  }
  
  return monthlySIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
}

// Calculate future value of lump sum
export function calculateFutureValueOfLumpSum(lumpSum, annualReturn, years) {
  const annualRate = annualReturn / 100;
  return lumpSum * Math.pow(1 + annualRate, years);
}

// Estimate corpus at retirement
export function estimateCorpusAtRetirement(inputs) {
  const {
    moneySaved = 0,
    monthlySIP = 0,
    expectedReturns = 12,
    currentAge = 30,
    retirementAge = 60
  } = inputs;
  
  const yearsToRetirement = retirementAge - currentAge;
  
  // Future value of existing savings
  const futureValueOfSavings = calculateFutureValueOfLumpSum(
    moneySaved,
    expectedReturns,
    yearsToRetirement
  );
  
  // Future value of SIP contributions
  const futureValueOfSIP = calculateFutureValueOfSIP(
    monthlySIP,
    expectedReturns,
    yearsToRetirement
  );
  
  return futureValueOfSavings + futureValueOfSIP;
}

// Calculate inflation-adjusted amount
export function calculateInflationAdjustedAmount(amount, inflationRate, years) {
  const annualInflationRate = inflationRate / 100;
  return amount * Math.pow(1 + annualInflationRate, years);
}

// Estimate supported monthly retirement income
export function estimateSupportedMonthlyIncome(corpus, withdrawalRate) {
  const annualWithdrawal = corpus * (withdrawalRate / 100);
  return annualWithdrawal / 12;
}

// Generate paycheck timeline data
export function generatePaycheckTimeline(inputs, desiredMonthlyIncome, isSafeWithdrawal = true) {
  const {
    retirementAge = 60,
    lifespan = 90,
    retirementReturns = 8,
    inflationRate = 6
  } = inputs;
  
  const withdrawalRate = isSafeWithdrawal ? 4 : 5;
  const corpus = estimateCorpusAtRetirement(inputs);
  let currentCorpus = corpus;
  const timeline = [];
  
  for (let age = retirementAge; age <= lifespan; age++) {
    const yearsInRetirement = age - retirementAge;
    
    // Calculate inflation-adjusted desired income
    const inflatedDesiredIncome = calculateInflationAdjustedAmount(
      desiredMonthlyIncome,
      inflationRate,
      yearsInRetirement
    );
    
    // Calculate supported income (reducing corpus over time)
    const annualWithdrawal = currentCorpus * (withdrawalRate / 100);
    const supportedMonthlyIncome = annualWithdrawal / 12;
    
    // Reduce corpus by withdrawal (simplified model)
    currentCorpus = currentCorpus - annualWithdrawal;
    
    // Add growth on remaining corpus
    currentCorpus = currentCorpus * (1 + retirementReturns / 100);
    
    timeline.push({
      age,
      desiredIncome: inflatedDesiredIncome,
      supportedIncome: supportedMonthlyIncome,
      corpusRemaining: currentCorpus
    });
  }
  
  return timeline;
}

// Calculate lifestyle tier income
export function getLifestyleTierIncome(currentMonthlyExpenses, tier, customValue = null) {
  const multipliers = {
    basic: 1.0,
    comfortable: 1.3,
    premium: 1.7
  };
  
  if (tier === 'custom' && customValue !== null) {
    return customValue;
  }
  
  return currentMonthlyExpenses * (multipliers[tier] || 1.0);
}

// Calculate SIP increase needed to achieve desired lifestyle
export function calculateSIPIncreaseNeeded(inputs, desiredMonthlyIncomeAtRetirement) {
  const {
    monthlySIP = 0,
    currentAge = 30,
    retirementAge = 60,
    expectedReturns = 12,
    retirementReturns = 8
  } = inputs;
  
  const yearsToRetirement = retirementAge - currentAge;
  const safeWithdrawalRate = 4;
  const requiredAnnualIncome = desiredMonthlyIncomeAtRetirement * 12;
  const requiredCorpus = (requiredAnnualIncome * 100) / safeWithdrawalRate;
  
  // Calculate required monthly SIP to reach required corpus
  const monthlyRate = expectedReturns / 100 / 12;
  const months = yearsToRetirement * 12;
  const existingSavings = inputs.moneySaved || 0;
  const futureValueOfExisting = calculateFutureValueOfLumpSum(
    existingSavings,
    expectedReturns,
    yearsToRetirement
  );
  
  const requiredFutureValueFromSIP = requiredCorpus - futureValueOfExisting;
  
  if (monthlyRate === 0 || months === 0) {
    return { requiredIncrease: 0, newMonthlySIP: monthlySIP };
  }
  
  const requiredMonthlySIP = requiredFutureValueFromSIP / 
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  
  const increaseNeeded = Math.max(0, requiredMonthlySIP - monthlySIP);
  
  return {
    requiredIncrease: increaseNeeded,
    newMonthlySIP: requiredMonthlySIP,
    percentageIncrease: monthlySIP > 0 ? ((increaseNeeded / monthlySIP) * 100) : 100
  };
}

// Calculate retirement age adjustment needed
export function calculateRetirementAgeAdjustment(inputs, desiredMonthlyIncomeAtRetirement) {
  const {
    currentAge = 30,
    retirementAge = 60,
    monthlySIP = 0,
    moneySaved = 0,
    expectedReturns = 12
  } = inputs;
  
  const safeWithdrawalRate = 4;
  const requiredAnnualIncome = desiredMonthlyIncomeAtRetirement * 12;
  const requiredCorpus = (requiredAnnualIncome * 100) / safeWithdrawalRate;
  
  let yearsNeeded = retirementAge - currentAge;
  let corpusAchieved = 0;
  
  // Find years needed to reach required corpus
  for (let extraYears = 0; extraYears <= 20; extraYears++) {
    const totalYears = (retirementAge - currentAge) + extraYears;
    
    const futureValueOfSavings = calculateFutureValueOfLumpSum(
      moneySaved,
      expectedReturns,
      totalYears
    );
    
    const futureValueOfSIP = calculateFutureValueOfSIP(
      monthlySIP,
      expectedReturns,
      totalYears
    );
    
    corpusAchieved = futureValueOfSavings + futureValueOfSIP;
    
    if (corpusAchieved >= requiredCorpus) {
      yearsNeeded = totalYears;
      break;
    }
  }
  
  const newRetirementAge = currentAge + yearsNeeded;
  const extraYears = newRetirementAge - retirementAge;
  
  return {
    extraYears,
    newRetirementAge,
    isAchievable: corpusAchieved >= requiredCorpus
  };
}

// Calculate lifestyle reduction needed
export function calculateLifestyleReductionNeeded(inputs, currentDesiredIncome) {
  const corpus = estimateCorpusAtRetirement(inputs);
  const safeWithdrawalRate = 4;
  const supportedAnnualIncome = (corpus * safeWithdrawalRate) / 100;
  const supportedMonthlyIncome = supportedAnnualIncome / 12;
  
  if (supportedMonthlyIncome >= currentDesiredIncome) {
    return { reductionNeeded: 0, affordableIncome: currentDesiredIncome };
  }
  
  const reductionNeeded = currentDesiredIncome - supportedMonthlyIncome;
  const percentageReduction = (reductionNeeded / currentDesiredIncome) * 100;
  
  return {
    reductionNeeded,
    affordableIncome: supportedMonthlyIncome,
    percentageReduction
  };
}

// Get lifestyle fit status
export function getLifestyleFitStatus(desiredIncome, supportedSafeIncome, supportedAggressiveIncome) {
  if (supportedSafeIncome >= desiredIncome) {
    return { status: 'Affordable', color: 'text-emerald-600', bgColor: 'bg-emerald-50' };
  } else if (supportedAggressiveIncome >= desiredIncome) {
    return { status: 'Tight', color: 'text-amber-600', bgColor: 'bg-amber-50' };
  } else {
    return { status: 'Not Sustainable', color: 'text-rose-600', bgColor: 'bg-rose-50' };
  }
}