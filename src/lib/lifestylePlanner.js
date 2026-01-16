// Lifestyle Planner helpers

// Format currency with Indian notation (₹)
export function formatCurrency(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(2)}K`;
  return `₹${Math.round(amount)}`;
}

// Short number format for tooltips
export function formatNumberShort(num) {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toFixed(0);
}

// Future value of monthly SIP
export function calculateFutureValueOfSIP(monthlySIP, annualReturn, years) {
  const monthlyRate = annualReturn / 100 / 12;
  const months = years * 12;
  if (monthlyRate === 0) return monthlySIP * months;
  return monthlySIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
}

// Future value of lump sum
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
  const futureValueOfSavings = calculateFutureValueOfLumpSum(moneySaved, expectedReturns, yearsToRetirement);
  const futureValueOfSIP = calculateFutureValueOfSIP(monthlySIP, expectedReturns, yearsToRetirement);
  return futureValueOfSavings + futureValueOfSIP;
}

// Inflation helpers
export function calculateInflationAdjustedAmount(amount, inflationRate, years) {
  const annualInflationRate = inflationRate / 100;
  return amount * Math.pow(1 + annualInflationRate, years);
}

export function discountToToday(amount, inflationRate, years) {
  if (years <= 0) return amount;
  const annualInflationRate = inflationRate / 100;
  return amount / Math.pow(1 + annualInflationRate, years);
}

// Single source-of-truth retirement simulation (monthly values)
export function simulateRetirementTimeline({
  currentAge,
  retirementAge,
  expectedLifespan,
  startingCorpus,
  desiredMonthlyIncomeToday,
  inflationRate,
  postRetirementReturnRate
}) {
  const yearsToRetirement = Math.max(retirementAge - currentAge, 0);
  const desiredMonthlyAtRetirementStart = calculateInflationAdjustedAmount(
    desiredMonthlyIncomeToday,
    inflationRate,
    yearsToRetirement
  );

  const timeline = [];
  let corpus = startingCorpus;
  let failureAge = null;
  let gapMonthlyAtFailure = 0;

  for (let yearIndex = 0; yearIndex <= expectedLifespan - retirementAge; yearIndex++) {
    const age = retirementAge + yearIndex;
    const corpusStart = corpus;
    const corpusAfterReturn = corpusStart * (1 + postRetirementReturnRate / 100);
    const desiredMonthly = desiredMonthlyAtRetirementStart * Math.pow(1 + inflationRate / 100, yearIndex);
    const desiredYearlyWithdrawal = desiredMonthly * 12;
    const remainingYears = Math.max(expectedLifespan - age + 1, 1);
    const supportedMonthly = Math.max(0, corpusAfterReturn / remainingYears / 12);
    const corpusEnd = corpusAfterReturn - desiredYearlyWithdrawal;

    if (failureAge === null && (corpusEnd <= 0 || desiredMonthly > supportedMonthly)) {
      failureAge = age;
      gapMonthlyAtFailure = Math.max(0, desiredMonthly - supportedMonthly);
    }

    timeline.push({
      age,
      corpusStart,
      corpusAfterReturn,
      desiredMonthly,
      desiredYearlyWithdrawal,
      supportedMonthly,
      corpusEnd: Math.max(corpusEnd, 0),
      isDepleted: corpusEnd <= 0
    });

    corpus = Math.max(corpusEnd, 0);
  }

  const sustainableTillAge = failureAge === null ? expectedLifespan : Math.max(retirementAge, failureAge);
  const totalYears = Math.max(expectedLifespan - retirementAge, 0);
  const yearsSupported = Math.max(sustainableTillAge - retirementAge, 0);

  return {
    timeline,
    sustainableTillAge,
    yearsSupported,
    totalYears,
    failureAge,
    gapMonthlyAtFailure,
    desiredMonthlyAtRetirementStart
  };
}

export function deriveAffordabilityStatus(simulationResult) {
  const { failureAge, yearsSupported, totalYears } = simulationResult;

  if (failureAge === null || yearsSupported >= totalYears) {
    return { status: 'Maintained', color: 'text-emerald-700', bg: 'bg-emerald-50' };
  }

  if (yearsSupported >= totalYears * 0.5) {
    return { status: 'Tight', color: 'text-amber-700', bg: 'bg-amber-50' };
  }

  return { status: 'Not Maintained', color: 'text-rose-700', bg: 'bg-rose-50' };
}

// Classification helper (today's value)
export function getAffordableLifestyleTier(supportedMonthlyToday, currentMonthlyExpense) {
  if (!currentMonthlyExpense) {
    return { tier: 'Comfortable', message: 'Based on your current plan, you can afford this lifestyle.' };
  }
  const basicThreshold = currentMonthlyExpense * 1.1;
  const comfortableThreshold = currentMonthlyExpense * 1.5;
  if (supportedMonthlyToday <= basicThreshold) return { tier: 'Basic', message: 'Based on your current plan, you can afford a Basic retirement lifestyle.' };
  if (supportedMonthlyToday <= comfortableThreshold) return { tier: 'Comfortable', message: 'Based on your current plan, you can afford a Comfortable retirement lifestyle.' };
  return { tier: 'Premium', message: 'Based on your current plan, you can afford a Premium retirement lifestyle.' };
}

// Additional legacy helpers (retained for other screens)
export function calculateSIPIncreaseNeeded(inputs, desiredMonthlyIncomeAtRetirement) {
  const {
    monthlySIP = 0,
    currentAge = 30,
    retirementAge = 60,
    expectedReturns = 12
  } = inputs;

  const yearsToRetirement = retirementAge - currentAge;
  const safeWithdrawalRate = 4;
  const requiredAnnualIncome = desiredMonthlyIncomeAtRetirement * 12;
  const requiredCorpus = (requiredAnnualIncome * 100) / safeWithdrawalRate;

  const monthlyRate = expectedReturns / 100 / 12;
  const months = yearsToRetirement * 12;
  const existingSavings = inputs.moneySaved || 0;
  const futureValueOfExisting = calculateFutureValueOfLumpSum(existingSavings, expectedReturns, yearsToRetirement);
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

  for (let extraYears = 0; extraYears <= 20; extraYears++) {
    const totalYears = (retirementAge - currentAge) + extraYears;
    const futureValueOfSavings = calculateFutureValueOfLumpSum(moneySaved, expectedReturns, totalYears);
    const futureValueOfSIP = calculateFutureValueOfSIP(monthlySIP, expectedReturns, totalYears);
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

export function getLifestyleFitStatus(desiredIncome, supportedSafeIncome, supportedAggressiveIncome) {
  if (supportedSafeIncome >= desiredIncome) {
    return { status: 'Affordable', color: 'text-emerald-600', bgColor: 'bg-emerald-50' };
  } else if (supportedAggressiveIncome >= desiredIncome) {
    return { status: 'Tight', color: 'text-amber-600', bgColor: 'bg-amber-50' };
  }
  return { status: 'Not Sustainable', color: 'text-rose-600', bgColor: 'bg-rose-50' };
}