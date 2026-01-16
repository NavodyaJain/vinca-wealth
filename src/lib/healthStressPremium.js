// Premium health stress analysis logic
// Computes out-of-pocket health impact on retirement sustainability using Financial Readiness inputs.

const MEDICAL_INFLATION = 0.09; // 9%
const SAFE_WITHDRAWAL_RATE = 0.04; // 4% annual

const CATEGORY_MODELS = {
  everyday: {
    key: 'everyday',
    monthlyOOP: 1200, // at present-day prices
    oneTimeOOP: 0,
    oneTimeYearOffset: null,
    recoveryMonths: 0,
    recoveryMonthly: 0
  },
  planned: {
    key: 'planned',
    monthlyOOP: 600, // recovery monthly for 12 months
    monthlyOOPDurationMonths: 12,
    monthlyOOPStartYearOffset: 5,
    oneTimeOOP: 80000, // at retirement + 5y
    oneTimeYearOffset: 5
  },
  highImpact: {
    key: 'high-impact',
    monthlyOOP: 2000, // recovery monthly for 18 months starting at retirement
    monthlyOOPDurationMonths: 18,
    monthlyOOPStartYearOffset: 0,
    oneTimeOOP: 240000, // at retirement
    oneTimeYearOffset: 0,
    dailyHospitalOOP: 6000
  }
};

const clampNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const normalizeInputs = (raw = {}) => {
  return {
    currentAge: clampNumber(raw.currentAge ?? raw.current_age ?? raw.age, 35),
    retirementAge: clampNumber(raw.retirementAge ?? raw.retirement_age, 60),
    lifespan: clampNumber(raw.lifespan ?? raw.lifeExpectancy ?? raw.life_expectancy, 85),
    monthlyExpenses: Math.max(0, clampNumber(raw.monthlyExpenses ?? raw.expenses, 50000)),
    moneySaved: Math.max(0, clampNumber(raw.moneySaved ?? raw.currentCorpus ?? raw.corpus, 1500000)),
    monthlySIP: Math.max(0, clampNumber(raw.monthlySIP ?? raw.sip ?? raw.monthlySip, 20000)),
    expectedReturns: clampNumber(raw.expectedReturns ?? raw.expected_returns, 10),
    inflationRate: Math.max(0, clampNumber(raw.inflationRate ?? raw.inflation ?? raw.inflation_rate, 6)),
    retirementReturns: clampNumber(raw.retirementReturns ?? raw.retirement_returns, 7),
    withdrawalIncrease: clampNumber(raw.withdrawalIncrease ?? raw.withdrawal_increase ?? raw.inflationRate ?? raw.inflation ?? 6, 6),
    emergencyFund: Math.max(0, clampNumber(raw.emergencyFund ?? raw.emergency_fund, 0))
  };
};

const adjustForMedicalInflation = (value, yearsFromNow) => value * Math.pow(1 + MEDICAL_INFLATION, yearsFromNow);

const calculateCorpusAtRetirement = ({ currentAge, retirementAge, moneySaved, monthlySIP, expectedReturns }) => {
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const monthlyRate = expectedReturns / 100 / 12;
  const months = yearsToRetirement * 12;

  // FV of current savings
  const fvSavings = moneySaved * Math.pow(1 + expectedReturns / 100, yearsToRetirement);

  // FV of SIP contributions
  const fvSIP = monthlyRate === 0
    ? monthlySIP * months
    : monthlySIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

  return fvSavings + fvSIP;
};

const computeAnnualHealthCost = ({ model, yearsToRetirement, yearIndex }) => {
  let annual = 0;

  // Monthly OOP stream
  if (model.monthlyOOP) {
    const startOffset = model.monthlyOOPStartYearOffset ?? 0;
    const durationMonths = model.monthlyOOPDurationMonths ?? 12;
    const startYear = startOffset;
    const endYear = startYear + Math.ceil(durationMonths / 12);

    if (yearIndex >= startYear && yearIndex < endYear) {
      const monthsElapsed = Math.max(0, (yearIndex - startYear) * 12);
      const remainingMonths = Math.max(0, durationMonths - monthsElapsed);
      const monthsThisYear = Math.min(12, remainingMonths);
      if (monthsThisYear > 0) {
        const monthlyAdj = adjustForMedicalInflation(model.monthlyOOP, yearsToRetirement + yearIndex);
        annual += monthlyAdj * monthsThisYear;
      }
    }
  }

  // One-time OOP event
  if (model.oneTimeOOP !== undefined && model.oneTimeYearOffset !== null) {
    if (yearIndex === model.oneTimeYearOffset) {
      annual += adjustForMedicalInflation(model.oneTimeOOP, yearsToRetirement + yearIndex);
    }
  }

  return annual;
};

const simulateScenario = (inputs, model) => {
  const yearsToRetirement = Math.max(0, inputs.retirementAge - inputs.currentAge);
  const totalYears = Math.max(0, inputs.lifespan - inputs.retirementAge);
  const baseMonthlyAtRetirement = inputs.monthlyExpenses * Math.pow(1 + inputs.inflationRate / 100, yearsToRetirement);

  const corpusAtRetirement = calculateCorpusAtRetirement(inputs);
  if (!Number.isFinite(corpusAtRetirement) || corpusAtRetirement <= 0 || totalYears <= 0) {
    return { error: 'noCorpus' };
  }

  let corpusBaseline = corpusAtRetirement;
  let corpusHealth = corpusAtRetirement;
  let firstFailureAge = null;
  let firstFailureGap = 0;

  let pvHealthCost = 0;

  const corpusSeries = [];
  const pressureSeries = [];

  for (let year = 0; year <= totalYears; year++) {
    const age = inputs.retirementAge + year;

    const baselineMonthly = baseMonthlyAtRetirement * Math.pow(1 + inputs.inflationRate / 100, year);
    const baselineAnnual = baselineMonthly * 12;

    const healthAnnual = computeAnnualHealthCost({ model, yearsToRetirement, yearIndex: year });
    const requiredAnnual = baselineAnnual + healthAnnual;
    const requiredMonthly = requiredAnnual / 12;

    const supportedMonthly = Math.max(0, (corpusHealth * SAFE_WITHDRAWAL_RATE) / 12);
    const supportedAnnual = supportedMonthly * 12;

    const baselineSupportedMonthly = Math.max(0, (corpusBaseline * SAFE_WITHDRAWAL_RATE) / 12);

    const gapMonthly = requiredMonthly - supportedMonthly;

    pressureSeries.push({
      age,
      baselineRequiredMonthly: baselineMonthly,
      baselineSupportedMonthly,
      requiredMonthly,
      supportedMonthly,
      gap: gapMonthly
    });

    if ((gapMonthly > 0 || corpusHealth <= 0) && firstFailureAge === null) {
      firstFailureAge = age;
      firstFailureGap = gapMonthly;
    }

    corpusSeries.push({
      age,
      baselineCorpus: Math.max(0, corpusBaseline),
      healthCorpus: Math.max(0, corpusHealth),
      difference: Math.max(0, corpusBaseline) - Math.max(0, corpusHealth)
    });

    // PV accumulation for total health cost
    pvHealthCost += healthAnnual / Math.pow(1 + inputs.retirementReturns / 100, year + 1);

    // Advance corpus values
    corpusBaseline = corpusBaseline * (1 + inputs.retirementReturns / 100) - baselineAnnual;
    corpusHealth = corpusHealth * (1 + inputs.retirementReturns / 100) - requiredAnnual;

    if (corpusHealth <= 0) {
      corpusHealth = 0;
      // Keep sim going to complete series shape, but firstFailureAge already captured
    }
  }

  const survives = firstFailureAge === null;
  const survivalAge = survives ? inputs.lifespan : firstFailureAge;
  const yearsSupported = Math.max(0, survivalAge - inputs.retirementAge);

  const totalYearsPlanned = Math.max(1, totalYears);
  const ratio = yearsSupported / totalYearsPlanned;
  const statusTone = survives ? 'green' : ratio >= 0.7 ? 'amber' : 'red';
  const statusLabel = survives ? 'Survives' : ratio >= 0.7 ? 'Tight' : 'Not Affordable';

  const healthAdjustedCorpusAtRetirement = Math.max(0, corpusAtRetirement - pvHealthCost);
  const monthlyRequiredAtRetirement = pressureSeries[0]?.requiredMonthly ?? requiredAnnual / 12;
  const supportedMonthlyAtRetirement = pressureSeries[0]?.supportedMonthly ?? Math.max(0, (corpusAtRetirement * SAFE_WITHDRAWAL_RATE) / 12);

  const shortfallAtFailure = firstFailureAge === null ? 0 : Math.max(0, firstFailureGap);

  const dailyHospitalOOP = model.dailyHospitalOOP || 6000;
  const buffer = inputs.emergencyFund;
  const hospitalizationDaysAffordable = buffer > 0 ? Math.max(0, Math.floor(buffer / dailyHospitalOOP)) || null : null;

  const recoveryMonthlyAtRetirement = model.monthlyOOP
    ? adjustForMedicalInflation(model.monthlyOOP, yearsToRetirement + (model.monthlyOOPStartYearOffset ?? 0))
    : null;
  const nursingMonthsAffordable = buffer > 0 && recoveryMonthlyAtRetirement
    ? Math.max(0, Math.floor(buffer / recoveryMonthlyAtRetirement)) || null
    : null;

  return {
    error: null,
    corpusAtRetirement,
    healthAdjustedCorpusAtRetirement,
    requiredMonthlyAtRetirement: monthlyRequiredAtRetirement,
    supportedMonthlyAtRetirement,
    monthlyGap: monthlyRequiredAtRetirement - supportedMonthlyAtRetirement,
    statusTone,
    statusLabel,
    survivalAge,
    yearsSupported,
    totalYears: totalYearsPlanned,
    firstFailureAge: firstFailureAge ?? null,
    shortfallAtFailure,
    corpusSeries,
    pressureSeries,
    model,
    inputs,
    pvHealthCost,
    hospitalizationDaysAffordable,
    nursingMonthsAffordable
  };
};

export function computeHealthPremiumImpact(userInputs, categoryKey = 'everyday') {
  if (!userInputs) return null;
  const inputs = normalizeInputs(userInputs);
  const model = CATEGORY_MODELS[categoryKey] || CATEGORY_MODELS.everyday;
  return simulateScenario(inputs, model);
}

export function getPremiumScenarioMeta(categoryKey = 'everyday') {
  return CATEGORY_MODELS[categoryKey] || CATEGORY_MODELS.everyday;
}

export { MEDICAL_INFLATION };
