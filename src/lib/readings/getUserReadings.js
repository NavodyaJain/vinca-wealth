// src/lib/readings/getUserReadings.js
// Loads all relevant tool readings from localStorage, returns normalized object

export default function getUserReadings() {
  if (typeof window === 'undefined') return null;
  let readings = {
    readiness: null,
    fire: null,
    lifestyle: null,
    health: null
  };
  try {
    // Financial Readiness
    const readinessInputs = JSON.parse(localStorage.getItem('financialReadinessInputs') || 'null');
    const readinessResults = JSON.parse(localStorage.getItem('financialReadinessResults') || 'null');
    const firePremiumResults = JSON.parse(localStorage.getItem('firePremiumResults') || 'null');
    // Lifestyle
    const lifestylePlannerReading = JSON.parse(localStorage.getItem('lifestylePlannerReading') || 'null');
    // Health
    const healthStressReading = JSON.parse(localStorage.getItem('healthStressReading') || 'null');
    // SavedReadings (optional)
    const savedReadings = JSON.parse(localStorage.getItem('savedReadings') || 'null');

    // Readiness
    if (readinessResults) {
      readings.readiness = {
        retirementAge: readinessResults.retirementAge,
        requiredCorpus: readinessResults.requiredCorpus,
        expectedCorpus: readinessResults.expectedCorpus,
        corpusGap: readinessResults.corpusGap,
        requiredSip: readinessResults.requiredSip,
        currentSip: readinessResults.currentSip,
        sipGap: readinessResults.sipGap,
        statusType: readinessResults.statusType,
        earlyRetirementPossible: readinessResults.earlyRetirementPossible,
        monthlyIncome: readinessInputs?.monthlyIncome
      };
    }
    // FIRE
    if (firePremiumResults) {
      readings.fire = {
        fireAge: firePremiumResults.fireAge,
        surplusUsed: firePremiumResults.surplusUsed,
        totalSIP: firePremiumResults.totalSIP,
        expectedCorpusAtFireAge: firePremiumResults.expectedCorpusAtFireAge,
        yearsEarly: firePremiumResults.yearsEarly,
        notFeasible: firePremiumResults.notFeasible
      };
    }
    // Lifestyle
    if (lifestylePlannerReading) {
      readings.lifestyle = {
        supportedMonthlyIncome: lifestylePlannerReading.supportedMonthlyIncome,
        lifestyleTier: lifestylePlannerReading.lifestyleTier,
        isAffordable: lifestylePlannerReading.isAffordable,
        gapMonthly: lifestylePlannerReading.gapMonthly
      };
    }
    // Health
    if (healthStressReading) {
      readings.health = {
        selectedCategory: healthStressReading.selectedCategory,
        healthAdjustedCorpus: healthStressReading.healthAdjustedCorpus,
        extraMonthlyHealthLoad: healthStressReading.extraMonthlyHealthLoad,
        sustainableTillAge: healthStressReading.sustainableTillAge,
        hospitalizationDaysAffordable: healthStressReading.hospitalizationDaysAffordable,
        nursingMonthsAffordable: healthStressReading.nursingMonthsAffordable
      };
    }
    // Merge in savedReadings if present (as fallback)
    if (savedReadings) {
      readings = { ...readings, ...savedReadings };
    }
  } catch (e) {
    // Fallback: do nothing, keep nulls
  }
  return readings;
}
