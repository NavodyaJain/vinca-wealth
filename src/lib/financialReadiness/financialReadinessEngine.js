// src/lib/financialReadiness/financialReadinessEngine.js
const buildRequiredCorpusByAge = ({ currentAge, lifespan, monthlyExpenses, inflationRate, retirementMonthlyRate, withdrawalIncreaseRate }) => {
  const result = [];

  const survives = ({ startCorpus, startWithdrawal, startAge }) => {
    let corpus = startCorpus;
    let withdrawal = startWithdrawal;
    const totalMonths = Math.max(1, Math.round((lifespan - startAge) * 12));

    for (let m = 0; m < totalMonths; m++) {
      corpus *= 1 + retirementMonthlyRate;
      corpus -= withdrawal;
      if (corpus <= 0) return false;
      if ((m + 1) % 12 === 0) {
        withdrawal *= 1 + withdrawalIncreaseRate / 100;
      }
    }

    return corpus > 0;
  };

  const requiredAtAge = (age) => {
    const startWithdrawal = monthlyExpenses * Math.pow(1 + inflationRate / 100, Math.max(0, age - currentAge));

    let low = 0;
    let high = Math.max(startWithdrawal * 12 * (lifespan - age + 1) * 2, 1_000_000);

    for (let i = 0; i < 40; i++) {
      const mid = (low + high) / 2;
      const ok = survives({ startCorpus: mid, startWithdrawal, startAge: age });
      if (ok) {
        high = mid;
      } else {
        low = mid;
      }
    }

    return (low + high) / 2;
  };

  for (let age = Math.floor(currentAge); age <= Math.round(lifespan); age++) {
    result.push({ age, requiredCorpus: requiredAtAge(age) });
  }

  return result;
};

export function calculateFinancialReadinessResults(formData) {
  const parseValue = (value, fallback) => {
    if (value === undefined || value === null || value === '') return fallback;
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  const currentAge = parseValue(formData.currentAge, 26);
  const moneySaved = parseValue(formData.moneySaved, 500000);
  const monthlyIncome = parseValue(formData.monthlyIncome, 150000);
  const monthlyExpenses = parseValue(formData.monthlyExpenses, 50000);
  const retirementAge = parseValue(formData.retirementAge, 60);
  const monthlySIP = parseValue(formData.monthlySIP, 20000);
  const expectedReturns = parseValue(formData.expectedReturns, 12);
  const sipIncreaseRate = parseValue(formData.sipIncreaseRate, 10);
  const lifespan = parseValue(formData.lifespan, 85);
  const inflationRate = parseValue(formData.inflationRate, 6);
  const withdrawalIncrease = parseValue(formData.withdrawalIncrease, 7);
  const retirementReturns = parseValue(formData.retirementReturns, 9);
  const investmentYears = Math.max(1, parseValue(formData.investmentYears, retirementAge - currentAge));

  const accumulationMonthlyRate = expectedReturns / 100 / 12;
  const retirementMonthlyRate = retirementReturns / 100 / 12;

  const simulateAccumulation = (sipAmount) => {
    let corpus = moneySaved;
    let sip = sipAmount;
    const totalMonths = Math.max(1, Math.round(investmentYears * 12));

    for (let m = 0; m < totalMonths; m++) {
      corpus += sip;
      corpus *= 1 + accumulationMonthlyRate;
      if ((m + 1) % 12 === 0) {
        sip *= 1 + sipIncreaseRate / 100;
      }
    }

    return { corpus, finalSip: sip };
  };

  const simulateRetirement = (startCorpus, startAge = retirementAge) => {
    let corpus = startCorpus;
    let monthlyWithdrawal = monthlyExpenses * Math.pow(1 + inflationRate / 100, Math.max(0, startAge - currentAge));
    const totalMonths = Math.max(1, Math.round((lifespan - startAge) * 12));
    let depletionAge = null;

    for (let m = 0; m < totalMonths; m++) {
      corpus *= 1 + retirementMonthlyRate;
      corpus -= monthlyWithdrawal;
      if (corpus <= 0 && depletionAge === null) {
        depletionAge = startAge + (m + 1) / 12;
        corpus = 0;
        break;
      }
      if ((m + 1) % 12 === 0) {
        monthlyWithdrawal *= 1 + withdrawalIncrease / 100;
      }
    }

    return { finalCorpus: corpus, depletionAge };
  };

  const { corpus: expectedCorpusAtRetirement } = simulateAccumulation(monthlySIP);

  const findRequiredCorpus = () => {
    let low = 0;
    let high = Math.max(expectedCorpusAtRetirement * 3, monthlyExpenses * 12 * (lifespan - retirementAge) * 2, 1_000_000);
    for (let i = 0; i < 40; i++) {
      const mid = (low + high) / 2;
      const { finalCorpus } = simulateRetirement(mid);
      if (finalCorpus > 0) {
        high = mid;
      } else {
        low = mid;
      }
    }
    return (low + high) / 2;
  };

  const requiredCorpusAtRetirement = findRequiredCorpus();

  const requiredCorpusByAge = buildRequiredCorpusByAge({
    currentAge,
    lifespan,
    monthlyExpenses,
    inflationRate,
    retirementMonthlyRate,
    withdrawalIncreaseRate: withdrawalIncrease
  });
  const requiredCorpusByAgeMap = requiredCorpusByAge.reduce((acc, item) => {
    acc[item.age] = item.requiredCorpus;
    return acc;
  }, {});

  const findRequiredSIP = () => {
    let low = 0;
    let high = monthlySIP + 200000;
    for (let i = 0; i < 40; i++) {
      const mid = (low + high) / 2;
      const { corpus } = simulateAccumulation(mid);
      if (corpus >= requiredCorpusAtRetirement) {
        high = mid;
      } else {
        low = mid;
      }
    }
    return (low + high) / 2;
  };

  const requiredMonthlySIP = findRequiredSIP();
  const sipGap = Math.max(0, requiredMonthlySIP - monthlySIP);

  const { depletionAge } = simulateRetirement(expectedCorpusAtRetirement);

  const financialReadinessAge = sipGap <= 0 ? retirementAge : null;

  const monthlySurplus = monthlyIncome - monthlyExpenses - monthlySIP;
  const emergencyReserveMonthly = Math.max(0, monthlyExpenses * 0.2);
  const investableSurplus = Math.max(0, monthlySurplus - emergencyReserveMonthly);
  const additionalSIPNeeded = Math.max(0, requiredMonthlySIP - monthlySIP);
  const isDesiredAgeFeasible = Number.isFinite(requiredMonthlySIP) && additionalSIPNeeded <= investableSurplus;

  const generateTimelineChartData = () => {
    const data = [];
    let corpus = moneySaved;
    let sip = monthlySIP;
    let monthlyWithdrawal = monthlyExpenses * Math.pow(1 + inflationRate / 100, Math.max(0, retirementAge - currentAge));

    for (let year = 0; year <= Math.round(lifespan - currentAge); year++) {
      const age = currentAge + year;
      data.push({ age, corpus: Math.max(0, corpus) });

      if (age < retirementAge) {
        for (let m = 0; m < 12; m++) {
          corpus += sip;
          corpus *= 1 + accumulationMonthlyRate;
        }
        sip *= 1 + sipIncreaseRate / 100;
      } else {
        for (let m = 0; m < 12 && corpus > 0; m++) {
          corpus *= 1 + retirementMonthlyRate;
          corpus -= monthlyWithdrawal;
        }
        monthlyWithdrawal *= 1 + withdrawalIncrease / 100;
      }
    }

    return data;
  };

  const generateTableRows = () => {
    const rows = [];
    let corpus = moneySaved;
    let sip = monthlySIP;
    let monthlyWithdrawal = monthlyExpenses * Math.pow(1 + inflationRate / 100, Math.max(0, retirementAge - currentAge));

    const annualAccumReturn = (Math.pow(1 + accumulationMonthlyRate, 12) - 1) * 100;
    const annualRetReturn = (Math.pow(1 + retirementMonthlyRate, 12) - 1) * 100;

    // Accumulation phase
    for (let age = Math.round(currentAge); age < Math.round(retirementAge); age++) {
      const startingCorpus = corpus;
      const startingSip = sip;
      for (let m = 0; m < 12; m++) {
        corpus += sip;
        corpus *= 1 + accumulationMonthlyRate;
      }
      rows.push({
        age,
        phase: 'SIP Phase',
        startingAmount: startingCorpus,
        monthlySIP: startingSip,
        monthlySWP: 0,
        returnRate: annualAccumReturn,
        endingCorpus: Math.max(0, corpus)
      });
      sip *= 1 + sipIncreaseRate / 100;
    }

    // Retirement phase
    for (let age = Math.round(retirementAge); age <= Math.round(lifespan); age++) {
      const startingCorpus = corpus;
      const startingSWP = monthlyWithdrawal;
      for (let m = 0; m < 12; m++) {
        corpus *= 1 + retirementMonthlyRate;
        corpus -= monthlyWithdrawal;
        if (corpus <= 0) {
          corpus = 0;
          break;
        }
      }
      rows.push({
        age,
        phase: 'Retirement Phase',
        startingAmount: startingCorpus,
        monthlySIP: 0,
        monthlySWP: startingSWP,
        returnRate: annualRetReturn,
        endingCorpus: Math.max(0, corpus)
      });
      monthlyWithdrawal *= 1 + withdrawalIncrease / 100;
      if (corpus <= 0) break;
    }

    return rows;
  };

  const inputs = {
    currentAge,
    retirementAge,
    lifespan,
    monthlyIncome,
    monthlyExpenses,
    monthlySIP,
    moneySaved,
    expectedReturns,
    retirementReturns,
    inflationRate,
    sipIncreaseRate,
    withdrawalIncrease,
    investmentYears
  };

  return {
    inputs,
    expectedCorpusAtRetirement,
    requiredCorpusAtRetirement,
    depletionAge,
    currentMonthlySIP: monthlySIP,
    requiredMonthlySIP,
    sipGap,
    timelineChartData: generateTimelineChartData(),
    tableRows: generateTableRows(),
    currentAge,
    lifespan,
    retirementAge,
    moneySaved,
    financialReadinessAge,
    monthlyIncome,
    monthlyExpenses,
    expectedReturns,
    retirementReturns,
    inflationRate,
    sipIncreaseRate,
    withdrawalIncrease,
    investableSurplus,
    emergencyReserveMonthly,
    isDesiredAgeFeasible,
    requiredCorpusByAge,
    requiredCorpusByAgeMap
  };
}
export function computeRequiredCorpusByAge(formData) {
  const parseValue = (value, fallback) => {
    if (value === undefined || value === null || value === '') return fallback;
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  const currentAge = parseValue(formData.currentAge, 26);
  const monthlyExpenses = parseValue(formData.monthlyExpenses, 50000);
  const lifespan = parseValue(formData.lifespan, 85);
  const inflationRate = parseValue(formData.inflationRate, 6);
  const withdrawalIncreaseRate = parseValue(formData.withdrawalIncrease, 7);
  const retirementReturns = parseValue(formData.retirementReturns, 9);

  const retirementMonthlyRate = retirementReturns / 100 / 12;

  return buildRequiredCorpusByAge({
    currentAge,
    lifespan,
    monthlyExpenses,
    inflationRate,
    retirementMonthlyRate,
    withdrawalIncreaseRate
  });
}