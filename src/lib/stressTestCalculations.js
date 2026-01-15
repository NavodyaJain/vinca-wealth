// Helper to calculate retirement plan survival scenarios
// Based on user inputs from calculator context

/**
 * Calculate corpus growth during accumulation phase
 */
export function calculateAccumulationPhase(formData) {
  const currentAge = parseFloat(formData.currentAge) || 30;
  const retirementAge = parseFloat(formData.retirementAge) || 60;
  const moneySaved = parseFloat(formData.moneySaved) || 500000;
  const monthlySIP = parseFloat(formData.monthlySIP) || 30000;
  const expectedReturns = parseFloat(formData.expectedReturns) || 12;
  const sipIncreaseRate = parseFloat(formData.sipIncreaseRate) || 10;

  let corpus = moneySaved;
  const monthlyRate = Math.pow(1 + expectedReturns / 100, 1 / 12) - 1;
  let currentSIP = monthlySIP;
  const months = (retirementAge - currentAge) * 12;

  for (let month = 1; month <= months; month++) {
    corpus += currentSIP;
    corpus *= 1 + monthlyRate;

    // Apply annual SIP increase
    if (month % 12 === 0) {
      currentSIP *= 1 + sipIncreaseRate / 100;
    }
  }

  return corpus;
}

/**
 * Calculate retirement phase with scenario adjustments
 */
export function calculateRetirementPhase(formData, corpus, scenarioType) {
  const retirementAge = parseFloat(formData.retirementAge) || 60;
  const lifespan = parseFloat(formData.lifespan) || 85;
  const monthlyExpenses = parseFloat(formData.monthlyExpenses) || 50000;
  const inflationRate = parseFloat(formData.inflationRate) || 6;
  const retirementReturns = parseFloat(formData.retirementReturns) || 8;
  const withdrawalIncrease = parseFloat(formData.withdrawalIncrease) || 0;

  // Apply scenario multipliers
  let adjustedReturns = retirementReturns;
  let adjustedInflation = inflationRate;

  if (scenarioType === 'worst') {
    adjustedReturns = retirementReturns * 0.6; // 40% lower returns
    adjustedInflation = inflationRate * 1.5; // 50% higher inflation
    corpus *= 0.8; // Simulate 20% market shock at retirement
  } else if (scenarioType === 'best') {
    adjustedReturns = retirementReturns * 1.3; // 30% higher returns
    adjustedInflation = inflationRate * 0.7; // 30% lower inflation
  }

  const monthlyRate = Math.pow(1 + adjustedReturns / 100, 1 / 12) - 1;
  const monthlyInflationRate = Math.pow(1 + adjustedInflation / 100, 1 / 12) - 1;

  let currentExpense = monthlyExpenses;
  let depletionAge = null;
  const retirementPhaseData = [];

  for (let month = 1; month <= (lifespan - retirementAge) * 12; month++) {
    const currentAge = retirementAge + month / 12;

    // Apply withdrawal increase
    if (month % 12 === 0) {
      const increaseRate = Math.max(adjustedInflation, withdrawalIncrease) / 100;
      currentExpense *= 1 + increaseRate;
    }

    // Withdraw amount
    const yearlyExpense = currentExpense * 12;
    corpus -= yearlyExpense;

    // Grow remaining corpus
    corpus *= 1 + monthlyRate;

    // Track for charts (annual snapshots)
    if (month % 12 === 0) {
      retirementPhaseData.push({
        year: Math.floor(month / 12),
        age: Math.round(currentAge * 10) / 10,
        corpus: Math.max(0, Math.round(corpus)),
        yearlyExpense: Math.round(yearlyExpense),
        monthlyExpense: Math.round(currentExpense)
      });
    }

    // Track depletion point
    if (corpus <= 0 && depletionAge === null) {
      depletionAge = currentAge;
    }

    if (corpus <= 0) {
      corpus = 0;
    }
  }

  return {
    finalCorpus: Math.round(corpus),
    depletionAge,
    retirementPhaseData,
    finalExpense: Math.round(currentExpense * 12)
  };
}

/**
 * Calculate stress test scenario
 */
export function calculateStressTestScenario(formData, scenarioType) {
  // Phase 1: Accumulation
  const corpusAtRetirement = calculateAccumulationPhase(formData);

  // Phase 2: Retirement
  const retirementResult = calculateRetirementPhase(
    formData,
    corpusAtRetirement,
    scenarioType
  );

  const retirementAge = parseFloat(formData.retirementAge) || 60;
  const lifespan = parseFloat(formData.lifespan) || 85;

  // Calculate metrics
  const survivalAge = retirementResult.depletionAge || lifespan;
  
  // Survival Confidence Score (0-100)
  let survivalConfidence = 100;
  if (retirementResult.depletionAge) {
    const yearsToDepletion = retirementResult.depletionAge - retirementAge;
    const yearsExpected = lifespan - retirementAge;
    survivalConfidence = Math.max(0, Math.round((yearsToDepletion / yearsExpected) * 100));
  }

  // Inflation pressure calculation
  const inflationRate = parseFloat(formData.inflationRate) || 6;
  const inflationMultiplier = scenarioType === 'worst' ? 1.5 : scenarioType === 'best' ? 0.7 : 1;
  const adjustedInflation = inflationRate * inflationMultiplier;
  const retirementReturns = parseFloat(formData.retirementReturns) || 8;
  const returnMultiplier = scenarioType === 'worst' ? 0.6 : scenarioType === 'best' ? 1.3 : 1;
  const adjustedReturns = retirementReturns * returnMultiplier;

  // Inflation Confidence Score (0-100)
  const inflationConfidence = Math.max(0, Math.round((adjustedReturns / adjustedInflation) * 100 * 0.7));

  const purchasingPowerStatus =
    retirementResult.finalCorpus > 0 && survivalAge >= lifespan
      ? 'Protected ✅'
      : 'Shrinks ⚠️';

  return {
    survivalAge: survivalAge === lifespan ? `Beyond ${lifespan}` : Math.floor(survivalAge),
    depletionAge: retirementResult.depletionAge,
    survivalConfidence,
    inflationConfidence,
    purchasingPowerStatus,
    corpusAtRetirement: Math.round(corpusAtRetirement),
    finalCorpus: retirementResult.finalCorpus,
    retirementPhaseData: retirementResult.retirementPhaseData,
    adjustedInflation: Math.round(adjustedInflation * 10) / 10,
    adjustedReturns: Math.round(adjustedReturns * 10) / 10
  };
}

/**
 * Generate scenario explanation text
 */
export function getScenarioExplanation(scenarioType) {
  const explanations = {
    worst: "This scenario simulates poor market conditions where recovery takes time and inflation remains high. If your withdrawals start early, your corpus may deplete sooner without a buffer.",
    expected:
      "This is the most likely long-term outcome based on normal market cycles. It helps you understand whether your plan remains stable without requiring extreme assumptions.",
    best: "This scenario shows the upside potential if markets perform strongly and inflation stays stable. Your plan may gain extra buffer years and higher flexibility."
  };

  return explanations[scenarioType] || explanations.expected;
}

/**
 * Get scenario colors and icons for UI
 */
export function getScenarioConfig(scenarioType) {
  const configs = {
    worst: {
      name: 'Worst Case',
      description: 'Market drops + slow recovery + inflation stays high',
      icon: 'AlertTriangle',
      tag: 'Stress Test',
      borderColor: 'border-red-200',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      accentColor: '#ef4444'
    },
    expected: {
      name: 'Expected Case',
      description: 'Normal market cycles and average inflation',
      icon: 'BarChart3',
      tag: 'Most realistic',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      accentColor: '#3b82f6'
    },
    best: {
      name: 'Best Case',
      description: 'Strong growth + stable inflation',
      icon: 'TrendingUp',
      tag: 'Upside scenario',
      borderColor: 'border-green-200',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      accentColor: '#10b981'
    }
  };

  return configs[scenarioType] || configs.expected;
}

/**
 * Get confidence score tag
 */
export function getConfidenceTag(score) {
  if (score >= 80) return { text: 'Strong ✅', color: 'text-green-600', bg: 'bg-green-50' };
  if (score >= 50) return { text: 'Moderate ⚠️', color: 'text-amber-600', bg: 'bg-amber-50' };
  return { text: 'Weak ❌', color: 'text-red-600', bg: 'bg-red-50' };
}

/**
 * Calculate sequence risk impact scenarios
 */
export function calculateSequenceRiskData(formData, scenarioType) {
  const retirementAge = parseFloat(formData.retirementAge) || 60;
  const lifespan = parseFloat(formData.lifespan) || 85;
  const corpusAtRetirement = calculateAccumulationPhase(formData);
  const monthlyExpenses = parseFloat(formData.monthlyExpenses) || 50000;
  const inflationRate = parseFloat(formData.inflationRate) || 6;
  const retirementReturns = parseFloat(formData.retirementReturns) || 8;
  const withdrawalIncrease = parseFloat(formData.withdrawalIncrease) || 0;

  // Apply scenario adjustments
  let adjustedReturns = retirementReturns;
  let adjustedInflation = inflationRate;

  if (scenarioType === 'worst') {
    adjustedReturns = retirementReturns * 0.6;
    adjustedInflation = inflationRate * 1.5;
  } else if (scenarioType === 'best') {
    adjustedReturns = retirementReturns * 1.3;
    adjustedInflation = inflationRate * 0.7;
  }

  const monthlyRate = Math.pow(1 + adjustedReturns / 100, 1 / 12) - 1;
  const monthlyInflationRate = Math.pow(1 + adjustedInflation / 100, 1 / 12) - 1;
  const retirementYears = lifespan - retirementAge;

  // Simulate three different sequences
  const sequences = [
    { name: 'Early Crash', crashYear: 1, color: '#ef4444' },
    { name: 'Middle Crash', crashYear: Math.floor(retirementYears / 2), color: '#f59e0b' },
    { name: 'Late Crash', crashYear: Math.floor(retirementYears * 0.8), color: '#3b82f6' }
  ];

  const sequenceData = sequences.map((seq) => {
    const data = [];
    let corpus = corpusAtRetirement;
    let currentExpense = monthlyExpenses;

    for (let month = 1; month <= retirementYears * 12; month++) {
      const currentYear = Math.ceil(month / 12);

      // Apply inflation to expense
      if (month % 12 === 0) {
        const increaseRate = Math.max(adjustedInflation, withdrawalIncrease) / 100;
        currentExpense *= 1 + increaseRate;
      }

      // Withdraw
      const yearlyExpense = currentExpense * 12;
      corpus -= yearlyExpense;

      // Apply crash impact at specified year
      let monthRate = monthlyRate;
      if (currentYear === seq.crashYear) {
        corpus *= 0.8; // -20% crash
        monthRate = monthlyRate * 0.3; // Reduced recovery
      }

      // Grow corpus
      corpus *= 1 + monthRate;
      corpus = Math.max(0, corpus);

      // Annual snapshot
      if (month % 12 === 0) {
        data.push({
          year: Math.floor(month / 12),
          corpus: Math.round(corpus),
          crashMarked: currentYear === seq.crashYear
        });
      }
    }

    return {
      ...seq,
      data
    };
  });

  return sequenceData;
}
