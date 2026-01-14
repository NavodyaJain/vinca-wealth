// src/lib/financialReadiness/firePremiumEngine.js
import { calculateFinancialReadinessResults } from './financialReadinessEngine';

export function calculateFirePremiumResults(formData, financialReadinessResults) {
  // Ensure all values are parsed with defaults
  const parseValue = (value, defaultValue) => {
    if (value === undefined || value === null || value === '') return defaultValue;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  const monthlyIncome = parseValue(formData.monthlyIncome, 150000);
  const monthlyExpenses = parseValue(formData.monthlyExpenses, 50000);
  const currentMonthlySIP = parseValue(formData.monthlySIP, 30000);
  const retirementAge = parseValue(formData.retirementAge, 60);
  const currentAge = parseValue(formData.currentAge, 30);
  const lifespan = parseValue(formData.lifespan, 85);
  
  // Calculate surplus correctly: Income - Expenses - Current SIP
  const monthlySurplus = monthlyIncome - monthlyExpenses - currentMonthlySIP;
  const emergencyReserveMonthly = Math.max(0, monthlyExpenses * 0.20); // 20% of expenses
  const investableSurplus = Math.max(0, monthlySurplus - emergencyReserveMonthly);
  
  // Scenario ratios
  const ratios = [0.0, 0.25, 0.50, 0.75, 1.0];
  
  // Generate scenarios
  const scenarios = ratios.map(ratio => {
    const additionalSIP = investableSurplus * ratio;
    const newMonthlySIP = currentMonthlySIP + additionalSIP;
    
    // Calculate FIRE Age for this scenario
    const fireAgeResult = calculateFireAgeForSIP(formData, newMonthlySIP, currentAge, retirementAge, lifespan);
    const fireAge = fireAgeResult?.fireAge || null;
    const projectedCorpusAtFireAge = fireAgeResult?.projectedCorpus || 0;
    const requiredCorpusAtFireAge = fireAgeResult?.requiredCorpus || 0;
    const corpusGap = projectedCorpusAtFireAge - requiredCorpusAtFireAge;
    
    const yearsEarlier = fireAge ? Math.max(0, retirementAge - fireAge) : 0;
    
    return {
      ratio,
      additionalSIP,
      newMonthlySIP,
      fireAge,
      yearsEarlier,
      projectedCorpusAtFireAge,
      requiredCorpusAtFireAge,
      corpusGap
    };
  });
  
  // Find recommended scenario
  const recommended = findRecommendedScenario(scenarios, retirementAge, investableSurplus);
  
  // Add baseline scenario (0% allocation)
  const baselineScenario = scenarios.find(s => s.ratio === 0.0);
  
  return {
    monthlyIncome,
    monthlyExpenses,
    currentMonthlySIP,
    monthlySurplus,
    emergencyReserveMonthly,
    investableSurplus,
    scenarios,
    recommended,
    baselineScenario,
    financialReadinessAge: financialReadinessResults?.financialReadinessAge
  };
}

function calculateFireAgeForSIP(formData, newSIP, currentAge, retirementAge, lifespan) {
  const moneySaved = parseFloat(formData.moneySaved) || 500000;
  const expectedReturns = parseFloat(formData.expectedReturns) || 12;
  const sipIncreaseRate = parseFloat(formData.sipIncreaseRate) || 10;
  const monthlyExpenses = parseFloat(formData.monthlyExpenses) || 50000;
  const inflationRate = parseFloat(formData.inflationRate) || 6;
  const retirementReturns = parseFloat(formData.retirementReturns) || 8;
  const withdrawalIncrease = parseFloat(formData.withdrawalIncrease) || 0;
  
  const accumulationMonthlyRate = Math.pow(1 + expectedReturns / 100, 1 / 12) - 1;
  const retirementMonthlyRate = Math.pow(1 + retirementReturns / 100, 1 / 12) - 1;
  const inflationMonthlyRate = Math.pow(1 + inflationRate / 100, 1 / 12) - 1;
  const withdrawIncreaseMonthlyRate = Math.pow(1 + withdrawalIncrease / 100, 1 / 12) - 1;
  
  // Try ages from currentAge+1 to retirementAge-1
  for (let testAge = currentAge + 1; testAge < retirementAge; testAge += 0.5) {
    // Simulate accumulation to test age
    let corpus = moneySaved;
    let sip = newSIP;
    
    const startYear = Math.floor(currentAge);
    const endYear = Math.floor(testAge);
    
    for (let year = startYear; year < endYear; year++) {
      for (let month = 0; month < 12; month++) {
        corpus += sip;
        corpus *= (1 + accumulationMonthlyRate);
      }
      sip *= (1 + sipIncreaseRate / 100);
    }
    
    const projectedCorpus = corpus;
    
    // Calculate required corpus at test age
    const yearsToTestAge = testAge - currentAge;
    let withdrawal = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToTestAge);
    
    let retirementCorpus = projectedCorpus;
    const retirementStartYear = Math.floor(testAge);
    const lifespanYear = Math.floor(lifespan);
    
    for (let year = retirementStartYear; year < lifespanYear && retirementCorpus > 0; year++) {
      for (let month = 0; month < 12 && retirementCorpus > 0; month++) {
        retirementCorpus *= (1 + retirementMonthlyRate);
        retirementCorpus -= withdrawal;
        withdrawal *= (1 + withdrawIncreaseMonthlyRate);
      }
    }
    
    if (retirementCorpus > 0) {
      // Calculate required corpus at test age (simplified using 4% rule)
      const annualWithdrawal = monthlyExpenses * 12 * Math.pow(1 + inflationRate / 100, yearsToTestAge);
      const yearsInRetirement = lifespan - testAge;
      const requiredCorpus = annualWithdrawal * yearsInRetirement / 0.04; // Using 4% rule
      return {
        fireAge: testAge,
        projectedCorpus,
        requiredCorpus
      };
    }
  }
  
  return null;
}

function findRecommendedScenario(scenarios, retirementAge, investableSurplus) {
  if (investableSurplus <= 0) {
    return scenarios[0]; // Return 0% allocation if no investable surplus
  }
  
  const baseline = scenarios.find(s => s.ratio === 0.0);
  const baselineFireAge = baseline?.fireAge;
  
  // Find the smallest ratio that improves FIRE Age by at least 2 years
  for (const ratio of [0.25, 0.50, 0.75, 1.0]) {
    const scenario = scenarios.find(s => s.ratio === ratio);
    if (scenario?.fireAge && baselineFireAge) {
      const improvement = baselineFireAge - scenario.fireAge;
      if (improvement >= 2) {
        return scenario;
      }
    }
  }
  
  // If no ratio improves by 2 years, find any improvement
  for (const ratio of [0.25, 0.50, 0.75, 1.0]) {
    const scenario = scenarios.find(s => s.ratio === ratio);
    if (scenario?.fireAge && baselineFireAge && scenario.fireAge < baselineFireAge) {
      return scenario;
    }
  }
  
  // If no improvement, recommend 25% if it meaningfully improves corpus gap
  const quarterScenario = scenarios.find(s => s.ratio === 0.25);
  if (quarterScenario?.corpusGap > (baseline?.corpusGap || 0) * 1.1) {
    return quarterScenario;
  }
  
  // Otherwise, stick with baseline
  return baseline;
}