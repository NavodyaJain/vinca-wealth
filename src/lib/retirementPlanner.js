/**
 * Retirement Planning Calculator Library
 * Comprehensive financial readiness analysis with corpus projections and SIP adjustments
 */

/**
 * Calculate all retirement metrics for a given financial profile
 * @param {Object} formData - User's financial data
 * @returns {Object} Retirement metrics including readiness age, corpus requirements, SIP gap
 */
export function calculateRetirementMetrics(formData) {
  // Extract inputs with defaults
  const currentAge = formData.currentAge || 30;
  const moneySaved = formData.moneySaved || 0;
  const monthlyExpenses = formData.monthlyExpenses || 0;
  const monthlySIP = formData.monthlySIP || 0;
  const retirementAge = formData.retirementAge || 60;
  const lifespan = formData.lifespan || 85;
  const expectedReturns = formData.expectedReturns || 12;
  const sipIncreaseRate = formData.sipIncreaseRate || 0;
  const inflationRate = formData.inflationRate || 6;
  const withdrawalIncrease = formData.withdrawalIncrease || inflationRate;
  const retirementReturns = formData.retirementReturns || 8;

  // Convert annual rates to monthly
  const monthlyAccumulationRate = Math.pow(1 + expectedReturns / 100, 1 / 12) - 1;
  const monthlyRetirementRate = Math.pow(1 + retirementReturns / 100, 1 / 12) - 1;
  const monthlyInflationRate = Math.pow(1 + inflationRate / 100, 1 / 12) - 1;
  const monthlyWithdrawalIncreaseRate = Math.pow(1 + withdrawalIncrease / 100, 1 / 12) - 1;

  // Helper: Calculate expected corpus at given retirement age
  function computeExpectedCorpus(retAge, testSIP) {
    const monthsToRet = (retAge - currentAge) * 12;
    if (monthsToRet <= 0) return moneySaved;

    if (sipIncreaseRate === 0) {
      // Simple formula: no SIP increase
      const fvSaved = moneySaved * Math.pow(1 + monthlyAccumulationRate, monthsToRet);
      const fvSIP = testSIP * (Math.pow(1 + monthlyAccumulationRate, monthsToRet) - 1) / monthlyAccumulationRate;
      return fvSaved + fvSIP;
    } else {
      // Simulate month-by-month with SIP increase
      let corpus = moneySaved;
      let sip = testSIP;
      const monthlyIncRate = Math.pow(1 + sipIncreaseRate / 100, 1 / 12) - 1;
      for (let m = 0; m < monthsToRet; m++) {
        corpus = corpus * (1 + monthlyAccumulationRate) + sip;
        if ((m + 1) % 12 === 0) {
          sip *= 1 + sipIncreaseRate / 100;
        }
      }
      return corpus;
    }
  }

  // Helper: Check if corpus survives from retAge to lifespan
  function survivesToLifespan(corpusAtRet, retAge) {
    const yearsToRet = retAge - currentAge;
    const retirementMonthExpense = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRet);
    
    let corpus = corpusAtRet;
    let withdrawal = retirementMonthExpense;
    const monthsInRet = (lifespan - retAge) * 12;

    for (let m = 0; m < monthsInRet; m++) {
      corpus = corpus * (1 + monthlyRetirementRate) - withdrawal;
      if (corpus <= 0) return false;
      withdrawal *= 1 + monthlyWithdrawalIncreaseRate;
    }
    return corpus > 0;
  }

  // Helper: Get depletion age using month-by-month simulation
  function getDepletionAge(corpusAtRet, retAge) {
    const yearsToRet = retAge - currentAge;
    const retirementMonthExpense = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRet);
    
    let corpus = corpusAtRet;
    let withdrawal = retirementMonthExpense;
    const maxMonths = (lifespan - retAge) * 12;

    for (let m = 0; m < maxMonths; m++) {
      corpus = corpus * (1 + monthlyRetirementRate) - withdrawal;
      if (corpus <= 0) {
        return retAge + m / 12;
      }
      withdrawal *= 1 + monthlyWithdrawalIncreaseRate;
    }
    return null; // Safe till lifespan
  }

  // 1. Calculate Expected Corpus at target retirement age
  const expectedCorpus = computeExpectedCorpus(retirementAge, monthlySIP);

  // 2. Calculate Required Corpus using binary search
  let requiredCorpus = 0;
  {
    let low = 0;
    let high = expectedCorpus * 5;
    for (let iter = 0; iter < 30; iter++) {
      const mid = (low + high) / 2;
      if (survivesToLifespan(mid, retirementAge)) {
        requiredCorpus = mid;
        high = mid;
      } else {
        low = mid;
      }
    }
  }

  // 3. Calculate Depletion Age with current SIP
  const depletionAge = getDepletionAge(expectedCorpus, retirementAge);

  // 4. Calculate Required SIP (minimal increase for safety)
  let requiredSIP = monthlySIP;
  {
    let sipLow = monthlySIP;
    let sipHigh = monthlySIP + 200000;
    for (let iter = 0; iter < 30; iter++) {
      const midSIP = (sipLow + sipHigh) / 2;
      const midCorpus = computeExpectedCorpus(retirementAge, midSIP);
      if (survivesToLifespan(midCorpus, retirementAge) && midCorpus >= requiredCorpus) {
        requiredSIP = midSIP;
        sipHigh = midSIP;
      } else {
        sipLow = midSIP;
      }
    }
  }

  const sipGap = Math.max(0, requiredSIP - monthlySIP);

  // 5. Calculate Financial Readiness Age (earliest sustainable retirement age)
  let financialReadinessAge = null;
  for (let testAge = currentAge + 5; testAge <= retirementAge; testAge++) {
    const testCorpus = computeExpectedCorpus(testAge, monthlySIP);
    if (survivesToLifespan(testCorpus, testAge)) {
      financialReadinessAge = testAge;
      break;
    }
  }

  return {
    financialReadinessAge,
    expectedCorpus,
    requiredCorpus,
    depletionAge,
    currentSIP: monthlySIP,
    requiredSIP,
    sipGap,
    isSustainable: expectedCorpus >= requiredCorpus
  };
}

/**
 * Calculate expected corpus at retirement age
 * @param {Object} params - Calculation parameters
 * @returns {number} Expected corpus value
 */
export function calculateExpectedCorpus({
  currentAge,
  moneySaved,
  monthlySIP,
  retirementAge,
  expectedReturns = 12,
  sipIncreaseRate = 0
}) {
  const monthlyAccumulationRate = Math.pow(1 + expectedReturns / 100, 1 / 12) - 1;
  const monthsToRet = (retirementAge - currentAge) * 12;

  if (monthsToRet <= 0) return moneySaved;

  if (sipIncreaseRate === 0) {
    const fvSaved = moneySaved * Math.pow(1 + monthlyAccumulationRate, monthsToRet);
    const fvSIP = monthlySIP * (Math.pow(1 + monthlyAccumulationRate, monthsToRet) - 1) / monthlyAccumulationRate;
    return fvSaved + fvSIP;
  } else {
    let corpus = moneySaved;
    let sip = monthlySIP;
    const monthlyIncRate = Math.pow(1 + sipIncreaseRate / 100, 1 / 12) - 1;
    for (let m = 0; m < monthsToRet; m++) {
      corpus = corpus * (1 + monthlyAccumulationRate) + sip;
      if ((m + 1) % 12 === 0) {
        sip *= 1 + sipIncreaseRate / 100;
      }
    }
    return corpus;
  }
}

/**
 * Calculate required corpus for sustainability till lifespan
 * @param {Object} params - Calculation parameters
 * @returns {number} Required corpus value
 */
export function calculateRequiredCorpus({
  currentAge,
  monthlyExpenses,
  retirementAge,
  lifespan,
  inflationRate = 6,
  withdrawalIncrease,
  retirementReturns = 8,
  expectedCorpus
}) {
  const monthlyRetirementRate = Math.pow(1 + retirementReturns / 100, 1 / 12) - 1;
  const monthlyWithdrawalIncreaseRate = Math.pow(1 + (withdrawalIncrease || inflationRate) / 100, 1 / 12) - 1;

  function survivesToLifespan(corpusAtRet) {
    const yearsToRet = retirementAge - currentAge;
    const retirementMonthExpense = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRet);
    
    let corpus = corpusAtRet;
    let withdrawal = retirementMonthExpense;
    const monthsInRet = (lifespan - retirementAge) * 12;

    for (let m = 0; m < monthsInRet; m++) {
      corpus = corpus * (1 + monthlyRetirementRate) - withdrawal;
      if (corpus <= 0) return false;
      withdrawal *= 1 + monthlyWithdrawalIncreaseRate;
    }
    return corpus > 0;
  }

  let requiredCorpus = 0;
  let low = 0;
  let high = (expectedCorpus || 0) * 5;

  for (let iter = 0; iter < 30; iter++) {
    const mid = (low + high) / 2;
    if (survivesToLifespan(mid)) {
      requiredCorpus = mid;
      high = mid;
    } else {
      low = mid;
    }
  }

  return requiredCorpus;
}

/**
 * Calculate depletion age with current plan
 * @param {Object} params - Calculation parameters
 * @returns {number|null} Age when corpus depletes, or null if safe till lifespan
 */
export function calculateDepletionAge({
  currentAge,
  monthlyExpenses,
  expectedCorpus,
  retirementAge,
  lifespan,
  inflationRate = 6,
  withdrawalIncrease,
  retirementReturns = 8
}) {
  const monthlyRetirementRate = Math.pow(1 + retirementReturns / 100, 1 / 12) - 1;
  const monthlyWithdrawalIncreaseRate = Math.pow(1 + (withdrawalIncrease || inflationRate) / 100, 1 / 12) - 1;

  const yearsToRet = retirementAge - currentAge;
  const retirementMonthExpense = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRet);
  
  let corpus = expectedCorpus;
  let withdrawal = retirementMonthExpense;
  const maxMonths = (lifespan - retirementAge) * 12;

  for (let m = 0; m < maxMonths; m++) {
    corpus = corpus * (1 + monthlyRetirementRate) - withdrawal;
    if (corpus <= 0) {
      return retirementAge + m / 12;
    }
    withdrawal *= 1 + monthlyWithdrawalIncreaseRate;
  }

  return null; // Safe till lifespan
}

/**
 * Calculate required SIP increase for sustainability
 * @param {Object} params - Calculation parameters
 * @returns {Object} { requiredSIP, sipGap }
 */
export function calculateSIPAdjustment({
  currentAge,
  moneySaved,
  monthlyExpenses,
  monthlySIP,
  retirementAge,
  lifespan,
  expectedReturns = 12,
  sipIncreaseRate = 0,
  inflationRate = 6,
  withdrawalIncrease,
  retirementReturns = 8
}) {
  const monthlyAccumulationRate = Math.pow(1 + expectedReturns / 100, 1 / 12) - 1;
  const monthlyRetirementRate = Math.pow(1 + retirementReturns / 100, 1 / 12) - 1;
  const monthlyWithdrawalIncreaseRate = Math.pow(1 + (withdrawalIncrease || inflationRate) / 100, 1 / 12) - 1;

  function computeExpectedCorpus(testSIP) {
    const monthsToRet = (retirementAge - currentAge) * 12;
    if (monthsToRet <= 0) return moneySaved;

    if (sipIncreaseRate === 0) {
      const fvSaved = moneySaved * Math.pow(1 + monthlyAccumulationRate, monthsToRet);
      const fvSIP = testSIP * (Math.pow(1 + monthlyAccumulationRate, monthsToRet) - 1) / monthlyAccumulationRate;
      return fvSaved + fvSIP;
    } else {
      let corpus = moneySaved;
      let sip = testSIP;
      const monthlyIncRate = Math.pow(1 + sipIncreaseRate / 100, 1 / 12) - 1;
      for (let m = 0; m < monthsToRet; m++) {
        corpus = corpus * (1 + monthlyAccumulationRate) + sip;
        if ((m + 1) % 12 === 0) {
          sip *= 1 + sipIncreaseRate / 100;
        }
      }
      return corpus;
    }
  }

  function survivesToLifespan(corpusAtRet) {
    const yearsToRet = retirementAge - currentAge;
    const retirementMonthExpense = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRet);
    
    let corpus = corpusAtRet;
    let withdrawal = retirementMonthExpense;
    const monthsInRet = (lifespan - retirementAge) * 12;

    for (let m = 0; m < monthsInRet; m++) {
      corpus = corpus * (1 + monthlyRetirementRate) - withdrawal;
      if (corpus <= 0) return false;
      withdrawal *= 1 + monthlyWithdrawalIncreaseRate;
    }
    return corpus > 0;
  }

  // Get required corpus first
  let requiredCorpus = 0;
  {
    let low = 0;
    let high = computeExpectedCorpus(monthlySIP) * 5;
    for (let iter = 0; iter < 30; iter++) {
      const mid = (low + high) / 2;
      if (survivesToLifespan(mid)) {
        requiredCorpus = mid;
        high = mid;
      } else {
        low = mid;
      }
    }
  }

  // Find required SIP
  let requiredSIP = monthlySIP;
  {
    let sipLow = monthlySIP;
    let sipHigh = monthlySIP + 200000;
    for (let iter = 0; iter < 30; iter++) {
      const midSIP = (sipLow + sipHigh) / 2;
      const midCorpus = computeExpectedCorpus(midSIP);
      if (survivesToLifespan(midCorpus) && midCorpus >= requiredCorpus) {
        requiredSIP = midSIP;
        sipHigh = midSIP;
      } else {
        sipLow = midSIP;
      }
    }
  }

  const sipGap = Math.max(0, requiredSIP - monthlySIP);

  return {
    requiredSIP,
    sipGap
  };
}

/**
 * Calculate Financial Readiness Age
 * @param {Object} params - Calculation parameters
 * @returns {number|null} Earliest sustainable retirement age, or null if not achieved
 */
export function calculateFinancialReadinessAge({
  currentAge,
  moneySaved,
  monthlyExpenses,
  monthlySIP,
  retirementAge,
  lifespan,
  expectedReturns = 12,
  sipIncreaseRate = 0,
  inflationRate = 6,
  withdrawalIncrease,
  retirementReturns = 8
}) {
  const monthlyAccumulationRate = Math.pow(1 + expectedReturns / 100, 1 / 12) - 1;
  const monthlyRetirementRate = Math.pow(1 + retirementReturns / 100, 1 / 12) - 1;
  const monthlyWithdrawalIncreaseRate = Math.pow(1 + (withdrawalIncrease || inflationRate) / 100, 1 / 12) - 1;

  function computeExpectedCorpus(retAge, testSIP) {
    const monthsToRet = (retAge - currentAge) * 12;
    if (monthsToRet <= 0) return moneySaved;

    if (sipIncreaseRate === 0) {
      const fvSaved = moneySaved * Math.pow(1 + monthlyAccumulationRate, monthsToRet);
      const fvSIP = testSIP * (Math.pow(1 + monthlyAccumulationRate, monthsToRet) - 1) / monthlyAccumulationRate;
      return fvSaved + fvSIP;
    } else {
      let corpus = moneySaved;
      let sip = testSIP;
      const monthlyIncRate = Math.pow(1 + sipIncreaseRate / 100, 1 / 12) - 1;
      for (let m = 0; m < monthsToRet; m++) {
        corpus = corpus * (1 + monthlyAccumulationRate) + sip;
        if ((m + 1) % 12 === 0) {
          sip *= 1 + sipIncreaseRate / 100;
        }
      }
      return corpus;
    }
  }

  function survivesToLifespan(corpusAtRet, retAge) {
    const yearsToRet = retAge - currentAge;
    const retirementMonthExpense = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRet);
    
    let corpus = corpusAtRet;
    let withdrawal = retirementMonthExpense;
    const monthsInRet = (lifespan - retAge) * 12;

    for (let m = 0; m < monthsInRet; m++) {
      corpus = corpus * (1 + monthlyRetirementRate) - withdrawal;
      if (corpus <= 0) return false;
      withdrawal *= 1 + monthlyWithdrawalIncreaseRate;
    }
    return corpus > 0;
  }

  for (let testAge = currentAge + 5; testAge <= retirementAge; testAge++) {
    const testCorpus = computeExpectedCorpus(testAge, monthlySIP);
    if (survivesToLifespan(testCorpus, testAge)) {
      return testAge;
    }
  }

  return null; // Not achieved
}
