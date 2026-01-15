// src/lib/financialReadiness/firePremiumEngine.js
// Smart surplus lever for FIRE premium output

export function calculateFirePremiumResults(formData, financialReadinessResults) {
  const parseValue = (value, defaultValue) => {
    if (value === undefined || value === null || value === '') return defaultValue;
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  };

  const monthlyIncome = parseValue(formData.monthlyIncome, 150000);
  const monthlyExpenses = parseValue(formData.monthlyExpenses, 50000);
  const currentMonthlySIP = parseValue(formData.monthlySIP, 30000);
  const retirementAge = parseValue(formData.retirementAge, 60);
  const desiredRetirementAge = retirementAge;
  const currentAge = parseValue(formData.currentAge, 30);
  const lifespan = parseValue(formData.lifespan, 85);
  const requiredMonthlySIP = parseValue(financialReadinessResults?.requiredMonthlySIP, 0);

  // Surplus math for lever (no reserve deduction for allocation UI)
  const monthlySurplus = Math.max(0, monthlyIncome - monthlyExpenses - currentMonthlySIP);
  const emergencyReserveMonthly = Math.max(0, monthlyExpenses * 0.2);
  const investableSurplus = monthlySurplus; // lever base equals monthly surplus
  const maxAffordableSIP = currentMonthlySIP + monthlySurplus;

  const requiredCorpusByAgeMap = financialReadinessResults?.requiredCorpusByAgeMap || {};
  const requiredCorpusAtRetirement = financialReadinessResults?.requiredCorpusAtRetirement;

  // Ratios: ladder for detection + finer grid for slider (5% steps)
  const ladderRatios = [0, 0.25, 0.5, 0.75, 1];
  const sliderRatios = Array.from({ length: 21 }, (_, idx) => idx * 0.05); // 0..1 step 5%

  const planForRatio = (ratio) => {
    const additionalSIP = monthlySurplus * ratio;
    const newMonthlySIP = currentMonthlySIP + additionalSIP;
    const earliest = findEarliestSustainableAge({
      retireSearchEndAge: lifespan,
      testSIP: newMonthlySIP,
      currentAge,
      lifespan,
      formData,
      requiredCorpusByAgeMap,
      requiredCorpusAtRetirement
    });

    const feasibleAtDesired = earliest.fireAge !== null && earliest.fireAge <= desiredRetirementAge;
    const yearsEarlier = earliest.fireAge ? Math.max(0, desiredRetirementAge - earliest.fireAge) : 0;

    return {
      ratio,
      pct: ratio * 100,
      additionalSIP,
      newMonthlySIP,
      fireAge: earliest.fireAge,
      yearsEarlier,
      projectedCorpusAtFireAge: earliest.projectedCorpus || 0,
      requiredCorpusAtFireAge: earliest.requiredCorpus || 0,
      corpusGap: (earliest.projectedCorpus || 0) - (earliest.requiredCorpus || 0),
      depletionAge: earliest.depletionAge,
      feasibleAtDesired
    };
  };

  const ladderScenarios = ladderRatios.map(planForRatio);
  const sliderScenarios = sliderRatios.map(planForRatio);

  const requiredPctToMeetDesiredAge = (() => {
    const feasible = ladderScenarios
      .filter((s) => s.feasibleAtDesired && s.fireAge !== null)
      .sort((a, b) => a.ratio - b.ratio);
    return feasible.length ? feasible[0].ratio : null;
  })();

  const isDesiredAgeFeasible = requiredPctToMeetDesiredAge !== null && maxAffordableSIP >= requiredMonthlySIP;

  // Smart lever jump
  const computePremiumLeverPct = () => {
    if (investableSurplus <= 0) return 0;
    if (requiredPctToMeetDesiredAge === null) return 1; // Not achievable even with ladder until 75 -> push to max
    if (requiredPctToMeetDesiredAge >= 1) return 1;

    let leverJump = 0.1;
    if (requiredPctToMeetDesiredAge <= 0.25) leverJump = 0.15;
    else if (requiredPctToMeetDesiredAge === 0.5) leverJump = 0.2;
    else if (requiredPctToMeetDesiredAge >= 0.75) leverJump = 0.1;

    return Math.min(1, requiredPctToMeetDesiredAge + leverJump);
  };

  const premiumLeverPct = computePremiumLeverPct();

  const findScenarioForRatio = (ratio) => {
    const match = sliderScenarios.find((s) => Math.abs(s.ratio - ratio) < 0.0001);
    return match || planForRatio(ratio);
  };

  const premiumScenario = findScenarioForRatio(premiumLeverPct);
  const baselineScenario = findScenarioForRatio(0);

  const safetyScenario = premiumLeverPct >= 1
    ? findScenarioForRatio(monthlySurplus > 0 ? 0.75 : 0)
    : null;

  const optimizedMonthlySIP = premiumScenario?.newMonthlySIP ?? maxAffordableSIP;
  const optimizedRetirementAge = premiumScenario?.fireAge || desiredRetirementAge;

  return {
    monthlyIncome,
    monthlyExpenses,
    currentMonthlySIP,
    monthlySurplus,
    emergencyReserveMonthly,
    investableSurplus,
    maxAffordableSIP,
    requiredMonthlySIP,
    isDesiredAgeFeasible,
    optimizedMonthlySIP,
    optimizedRetirementAge,
    premiumLeverPct,
    requiredPctToMeetDesiredAge,
    scenarios: sliderScenarios,
    ladderScenarios,
    premiumScenario,
    baselineScenario,
    safetyScenario,
    financialReadinessAge: financialReadinessResults?.financialReadinessAge,
    planType: isDesiredAgeFeasible ? 'feasible' : 'income-constrained'
  };
}

function findEarliestSustainableAge({
  retireSearchEndAge,
  testSIP,
  currentAge,
  lifespan,
  formData,
  requiredCorpusByAgeMap,
  requiredCorpusAtRetirement
}) {
  const moneySaved = parseFloat(formData.moneySaved) || 500000;
  const expectedReturns = parseFloat(formData.expectedReturns) || 12;
  const sipIncreaseRate = parseFloat(formData.sipIncreaseRate) || 10;
  const monthlyExpenses = parseFloat(formData.monthlyExpenses) || 50000;
  const inflationRate = parseFloat(formData.inflationRate) || 6;
  const retirementReturns = parseFloat(formData.retirementReturns) || 8;
  const withdrawalIncrease = parseFloat(formData.withdrawalIncrease) || 0;

  const accumulationMonthlyRate = Math.pow(1 + expectedReturns / 100, 1 / 12) - 1;
  const retirementMonthlyRate = Math.pow(1 + retirementReturns / 100, 1 / 12) - 1;
  const withdrawIncreaseMonthlyRate = Math.pow(1 + withdrawalIncrease / 100, 1 / 12) - 1;

  let lastDepletionAge = null;

  const simulateForAge = (targetAge) => {
    const monthsToRetire = Math.max(0, Math.round((targetAge - currentAge) * 12));
    let corpus = moneySaved;
    let sip = testSIP;

    for (let month = 0; month < monthsToRetire; month++) {
      corpus += sip;
      corpus *= 1 + accumulationMonthlyRate;
      if ((month + 1) % 12 === 0) {
        sip *= 1 + sipIncreaseRate / 100;
      }
    }

    const projectedCorpus = corpus;
    const roundedAge = Math.round(targetAge);
    const requiredCorpus = requiredCorpusByAgeMap?.[roundedAge] ?? requiredCorpusAtRetirement ?? 0;

    // Withdrawals
    const monthsInRetirement = Math.max(0, Math.round((lifespan - targetAge) * 12));
    let withdrawal = monthlyExpenses * Math.pow(1 + inflationRate / 100, targetAge - currentAge);

    for (let month = 0; month < monthsInRetirement; month++) {
      corpus *= 1 + retirementMonthlyRate;
      corpus -= withdrawal;
      withdrawal *= 1 + withdrawIncreaseMonthlyRate;

      if (corpus <= 0) {
        const depletionAge = currentAge + (monthsToRetire + month + 1) / 12;
        lastDepletionAge = depletionAge;
        return { sustainable: false, depletionAge, projectedCorpus, requiredCorpus };
      }
    }

    return { sustainable: true, depletionAge: null, projectedCorpus, requiredCorpus };
  };

  for (let testAge = currentAge + 1; testAge <= retireSearchEndAge; testAge += 0.5) {
    const result = simulateForAge(testAge);
    if (result.sustainable) {
      return {
        fireAge: testAge,
        projectedCorpus: result.projectedCorpus,
        requiredCorpus: result.requiredCorpus,
        depletionAge: null
      };
    }
  }

  return {
    fireAge: null,
    projectedCorpus: 0,
    requiredCorpus: requiredCorpusAtRetirement || 0,
    depletionAge: lastDepletionAge
  };
}