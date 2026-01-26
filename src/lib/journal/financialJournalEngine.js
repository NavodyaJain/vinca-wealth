// src/lib/journal/financialJournalEngine.js
// Computes KPIs, signals, monthly summaries for the Journal
import { safeParse } from "./dateUtils";

export function computeJourneyCompletion({ journeyStartDate, retirementDate }) {
  const start = safeParse(journeyStartDate);
  const end = safeParse(retirementDate);
  if (!start || !end) return 0;
  const totalMs = end - start;
  const passedMs = Date.now() - start.getTime();
  return Math.max(0, Math.min(100, Math.round((passedMs / totalMs) * 100)));
}

export function computePlanHealthScore({ requiredCorpus, expectedCorpus, sustainabilityFlag, sipRequired, sipCurrent, healthStressResult }) {
  // Example logic, degrade gracefully
  if (!requiredCorpus || !expectedCorpus) return 50;
  let score = 100;
  if (expectedCorpus < requiredCorpus) score -= 30;
  if (sustainabilityFlag === false) score -= 20;
  if (sipCurrent < sipRequired) score -= 20;
  if (healthStressResult === 'risk') score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function computeDisciplineScore(entries) {
  // Last 4 weeks average
  if (!entries || !entries.length) return 0;
  const last4 = entries.slice(0, 4);
  const sum = last4.reduce((acc, e) => acc + (e.disciplineScore || 0), 0);
  return Math.round(sum / Math.max(1, last4.length));
}

export function computeSignals({ readings, entries }) {
  // Example signals
  const signals = [];
  if (readings.sipRequired > readings.sipCurrent) {
    signals.push({
      title: "SIP gap detected",
      reason: `Required SIP ₹${readings.sipRequired} > Current SIP ₹${readings.sipCurrent}`,
      severity: "Medium"
    });
  }
  if (readings.expectedCorpus < readings.requiredCorpus) {
    signals.push({
      title: "Corpus sustainability risk",
      reason: `Expected corpus ₹${readings.expectedCorpus} < Required ₹${readings.requiredCorpus}`,
      severity: "High"
    });
  }
  if (entries.filter(e => e.expenseDrift > 0).length >= 2) {
    signals.push({
      title: "Expense pressure increasing",
      reason: "Overspending reported 2+ weeks",
      severity: "Medium"
    });
  }
  if (readings.healthStressResult === 'risk') {
    signals.push({
      title: "Health risk buffer needed",
      reason: "Health Stress Test shows risk",
      severity: "Medium"
    });
  }
  return signals;
}

export function computeMonthlySummary(entries, month) {
  // entries: all for the month (YYYY-MM)
  if (!entries || !entries.length) return null;
  const avgDiscipline = Math.round(entries.reduce((acc, e) => acc + (e.disciplineScore || 0), 0) / entries.length);
  const totalSIPChange = entries.reduce((acc, e) => acc + (e.sipChange || 0), 0);
  const totalEmergency = entries.reduce((acc, e) => acc + (e.emergencyAmount || 0), 0);
  // Top improvement area: most frequent action
  const actions = entries.flatMap(e => e.actions || []);
  const actionCounts = actions.reduce((acc, a) => { acc[a] = (acc[a] || 0) + 1; return acc; }, {});
  const topImprovement = Object.keys(actionCounts).sort((a, b) => actionCounts[b] - actionCounts[a])[0] || "—";
  // Next month focus: auto suggestion
  let nextFocus = "Maintain discipline";
  if (avgDiscipline < 60) nextFocus = "Improve consistency";
  if (totalEmergency > 0) nextFocus = "Build emergency buffer";
  return {
    month,
    avgDiscipline,
    totalSIPChange,
    totalEmergency,
    topImprovement,
    nextFocus
  };
}
