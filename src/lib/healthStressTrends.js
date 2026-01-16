// Freemium health trend helpers (non-medical, educational only)

const clampNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export const getFreemiumHealthTrendInputs = (raw = {}) => {
  const monthlyExpenses = Math.max(0, clampNumber(raw.monthlyExpenses ?? 50000, 50000));
  const monthlyCheckupCost = Math.max(500, Math.round(monthlyExpenses * 0.03));
  const extraMonthlyHealthLoad = Math.max(2500, Math.min(10000, monthlyCheckupCost + 2000));

  return {
    monthlyCheckupCost,
    extraMonthlyHealthLoad,
    medicalInflationRate: 9
  };
};

export const calculateBaselineRetirementCorpus = (raw = {}) => {
  const currentAge = clampNumber(raw.currentAge ?? raw.current_age ?? raw.age, 35);
  const retirementAge = clampNumber(raw.retirementAge ?? raw.retirement_age, 60);
  const moneySaved = Math.max(0, clampNumber(raw.moneySaved ?? raw.currentCorpus ?? raw.corpus, 1500000));
  const monthlySIP = Math.max(0, clampNumber(raw.monthlySIP ?? raw.sip ?? raw.monthlySip, 20000));
  const expectedReturns = clampNumber(raw.expectedReturns ?? raw.expected_returns, 10);

  const monthsToRetirement = Math.max(0, (retirementAge - currentAge) * 12);
  if (monthsToRetirement === 0) return moneySaved;

  const monthlyRate = Math.pow(1 + expectedReturns / 100, 1 / 12) - 1;
  const fvSavings = moneySaved * Math.pow(1 + monthlyRate, monthsToRetirement);
  const fvFactor = monthlyRate === 0 ? monthsToRetirement : ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate);
  const fvSip = monthlySIP * fvFactor;

  return fvSavings + fvSip;
};

export const calculateFreemiumHealthAdjustedCorpus = (raw = {}) => {
  const currentAge = clampNumber(raw.currentAge ?? raw.current_age ?? raw.age, 35);
  const retirementAge = clampNumber(raw.retirementAge ?? raw.retirement_age, 60);
  const lifespan = clampNumber(raw.lifespan ?? raw.lifeExpectancy ?? raw.life_expectancy, 85);
  const inflationRate = Math.max(0, clampNumber(raw.inflationRate ?? raw.inflation ?? raw.inflation_rate, 6));

  const { extraMonthlyHealthLoad } = getFreemiumHealthTrendInputs(raw);
  const yearsInRetirement = Math.max(0, lifespan - retirementAge);
  const corpusAtRetirement = calculateBaselineRetirementCorpus(raw);

  const totalHealthCostToday = extraMonthlyHealthLoad * 12 * yearsInRetirement;
  const inflationAdjustedHealthCost = totalHealthCostToday * Math.pow(1 + 0.09, yearsInRetirement / 2);

  const adjusted = corpusAtRetirement - inflationAdjustedHealthCost;
  return {
    corpusAtRetirement,
    healthAdjustedCorpus: Math.max(0, adjusted),
    yearsInRetirement,
    inflationRate,
    extraMonthlyHealthLoad
  };
};
