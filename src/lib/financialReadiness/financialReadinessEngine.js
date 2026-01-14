// src/lib/financialReadiness/financialReadinessEngine.js
export function calculateFinancialReadinessResults(formData) {
  // Extract and parse form data with defaults
  const parseValue = (value, defaultValue) => {
    if (value === undefined || value === null || value === '') return defaultValue;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  const currentAge = parseValue(formData.currentAge, 30);
  const moneySaved = parseValue(formData.moneySaved, 500000);
  const monthlyExpenses = parseValue(formData.monthlyExpenses, 50000);
  const monthlyIncome = parseValue(formData.monthlyIncome, 150000);
  const retirementAge = parseValue(formData.retirementAge, 60);
  const monthlySIP = parseValue(formData.monthlySIP, 30000);
  const expectedReturns = parseValue(formData.expectedReturns, 12);
  const sipIncreaseRate = parseValue(formData.sipIncreaseRate, 10);
  const lifespan = parseValue(formData.lifespan, 85);
  const inflationRate = parseValue(formData.inflationRate, 6);
  const withdrawalIncrease = parseValue(formData.withdrawalIncrease, 0);
  const retirementReturns = parseValue(formData.retirementReturns, 8);

  // Monthly rate conversions
  const accumulationMonthlyRate = Math.pow(1 + expectedReturns / 100, 1 / 12) - 1;
  const retirementMonthlyRate = Math.pow(1 + retirementReturns / 100, 1 / 12) - 1;
  const inflationMonthlyRate = Math.pow(1 + inflationRate / 100, 1 / 12) - 1;
  const withdrawIncreaseMonthlyRate = Math.pow(1 + withdrawalIncrease / 100, 1 / 12) - 1;

  // Helper function: Simulate accumulation phase
  function simulateAccumulation(startCorpus, startSIP, startAge, endAge, includeSIPIncrease = true) {
    let corpus = startCorpus;
    let totalInvested = 0;
    let sip = startSIP;
    
    const startYear = Math.floor(startAge);
    const endYear = Math.floor(endAge);
    
    for (let year = startYear; year < endYear; year++) {
      for (let month = 0; month < 12; month++) {
        totalInvested += sip;
        corpus += sip;
        corpus *= (1 + accumulationMonthlyRate);
      }
      if (includeSIPIncrease) {
        sip *= (1 + sipIncreaseRate / 100);
      }
    }
    
    return { corpus, totalInvested, finalSIP: sip };
  }

  // Helper function: Simulate retirement phase
  function simulateRetirement(startCorpus, startAge, endAge) {
    let corpus = startCorpus;
    
    // Calculate initial withdrawal
    const yearsToRetirement = startAge - currentAge;
    let withdrawal = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    
    const startYear = Math.floor(startAge);
    const endYear = Math.floor(endAge);
    let depletionAge = null;
    
    for (let year = startYear; year < endYear && corpus > 0; year++) {
      for (let month = 0; month < 12 && corpus > 0; month++) {
        corpus *= (1 + retirementMonthlyRate);
        corpus -= withdrawal;
        withdrawal *= (1 + withdrawIncreaseMonthlyRate);
        
        const currentAge = startAge + (year - startYear) + (month + 1) / 12;
        if (corpus <= 0 && !depletionAge) {
          depletionAge = currentAge;
        }
      }
    }
    
    return { finalCorpus: Math.max(0, corpus), depletionAge };
  }

  // Calculate expected corpus
  const { corpus: expectedCorpusAtRetirement } = simulateAccumulation(
    moneySaved,
    monthlySIP,
    currentAge,
    retirementAge,
    true
  );

  // Calculate required corpus using binary search
  function findRequiredCorpus() {
    let low = 0;
    let high = Math.max(expectedCorpusAtRetirement * 5, 10000000);
    
    for (let i = 0; i < 30; i++) {
      const mid = (low + high) / 2;
      const { finalCorpus } = simulateRetirement(mid, retirementAge, lifespan);
      
      if (finalCorpus > 0) {
        high = mid;
      } else {
        low = mid;
      }
    }
    
    return (low + high) / 2;
  }

  const requiredCorpusAtRetirement = findRequiredCorpus();

  // Calculate required SIP
  function findRequiredSIP() {
    let low = monthlySIP;
    let high = Math.min(monthlyIncome * 0.8, monthlySIP + 500000);
    
    for (let i = 0; i < 30; i++) {
      const mid = (low + high) / 2;
      const { corpus: expectedCorpus } = simulateAccumulation(
        moneySaved,
        mid,
        currentAge,
        retirementAge,
        true
      );
      
      if (expectedCorpus >= requiredCorpusAtRetirement) {
        high = mid;
      } else {
        low = mid;
      }
    }
    
    return (low + high) / 2;
  }

  const requiredMonthlySIP = findRequiredSIP();
  const sipGap = Math.max(0, requiredMonthlySIP - monthlySIP);

  // Find financial readiness age
  function findFinancialReadinessAge() {
    for (let testAge = currentAge + 1; testAge <= retirementAge; testAge++) {
      const { corpus: testCorpus } = simulateAccumulation(
        moneySaved,
        monthlySIP,
        currentAge,
        testAge,
        true
      );
      
      const { finalCorpus } = simulateRetirement(testCorpus, testAge, lifespan);
      
      if (finalCorpus > 0) {
        return testAge;
      }
    }
    return null;
  }

  const financialReadinessAge = findFinancialReadinessAge();

  // Calculate depletion age
  const { depletionAge } = simulateRetirement(
    expectedCorpusAtRetirement,
    retirementAge,
    lifespan
  );

  // Generate timeline chart data
  function generateTimelineChartData() {
    const data = [];
    let corpus = moneySaved;
    let totalInvested = 0;
    let sip = monthlySIP;
    let withdrawal = null;
    
    for (let age = currentAge; age <= lifespan; age++) {
      data.push({
        age: Math.round(age),
        corpus: Math.max(0, corpus),
        totalInvested: totalInvested
      });
      
      if (age < retirementAge) {
        for (let month = 0; month < 12; month++) {
          totalInvested += sip;
          corpus += sip;
          corpus *= (1 + accumulationMonthlyRate);
        }
        sip *= (1 + sipIncreaseRate / 100);
      } else if (age < lifespan) {
        if (age === retirementAge) {
          const yearsToRetirement = retirementAge - currentAge;
          withdrawal = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);
        }
        
        for (let month = 0; month < 12 && corpus > 0; month++) {
          corpus *= (1 + retirementMonthlyRate);
          corpus -= withdrawal;
          withdrawal *= (1 + withdrawIncreaseMonthlyRate);
        }
      }
    }
    
    return data;
  }

  // Generate table rows
  function generateTableRows() {
    const rows = [];
    let corpus = moneySaved;
    let sip = monthlySIP;
    let withdrawal = null;
    
    for (let age = currentAge; age <= lifespan; age++) {
      const startingCorpus = corpus;
      
      if (age < retirementAge) {
        for (let month = 0; month < 12; month++) {
          corpus += sip;
          corpus *= (1 + accumulationMonthlyRate);
        }
        
        rows.push({
          age: Math.round(age),
          phase: 'SIP Phase',
          startingAmount: startingCorpus,
          monthlySIP: sip,
          monthlySWP: 0,
          returnRate: (Math.pow(1 + accumulationMonthlyRate, 12) - 1) * 100,
          endingCorpus: corpus
        });
        
        sip *= (1 + sipIncreaseRate / 100);
      } else if (age < lifespan) {
        if (age === retirementAge) {
          const yearsToRetirement = retirementAge - currentAge;
          withdrawal = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);
        }
        
        for (let month = 0; month < 12 && corpus > 0; month++) {
          corpus *= (1 + retirementMonthlyRate);
          corpus -= withdrawal;
          withdrawal *= (1 + withdrawIncreaseMonthlyRate);
        }
        
        rows.push({
          age: Math.round(age),
          phase: 'Retirement Phase',
          startingAmount: startingCorpus,
          monthlySIP: 0,
          monthlySWP: withdrawal / Math.pow(1 + withdrawIncreaseMonthlyRate, 6),
          returnRate: (Math.pow(1 + retirementMonthlyRate, 12) - 1) * 100,
          endingCorpus: Math.max(0, corpus)
        });
      }
    }
    
    return rows;
  }

  return {
    financialReadinessAge,
    expectedCorpusAtRetirement,
    requiredCorpusAtRetirement,
    depletionAge,
    currentMonthlySIP: monthlySIP,
    requiredMonthlySIP,
    sipGap,
    timelineChartData: generateTimelineChartData(),
    tableRows: generateTableRows(),
    lifespan,
    retirementAge
  };
}