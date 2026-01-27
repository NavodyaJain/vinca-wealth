// src/lib/challenges/challengeCatalog.js
export const CHALLENGES = [
  {
    id: "monthly_sip_kickstart",
    title: "Monthly SIP Kickstart",
    description: "Start or restart your retirement SIP with one clear monthly commitment.",
    cadence: "monthly",
    durationLabel: "1 month",
    bestFor: "New or inconsistent retirement investors",
    objective: "Help users start or restart SIP discipline without overwhelm.",
    whoFor: "New or inconsistent retirement investors",
    disciplineType: "Monthly salary-aligned SIP execution",
    successDefinition: "SIP executed for the month.",
    timelineType: "single",
    type: "monthly",
    typeLabel: "Monthly",
    getPlan: (readings) => {
      // Use saved readings: Current SIP, Income, Expenses, Retirement gap
      // Calculate suggested monthly SIP (reuse existing logic)
      return {
        suggestedSIP: readings.suggestedMonthlySIP,
        salaryCycle: readings.salaryCycle,
        startDate: readings.startDate,
        endDate: readings.endDate,
        monthLabel: readings.startDate ? new Date(readings.startDate).toLocaleString('default', { month: 'long', year: 'numeric' }) : new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
      };
    }
  },
  {
    id: "quarterly_sip_discipline",
    title: "Quarterly SIP Discipline",
    description: "Maintain SIP discipline for 3 consecutive salary cycles.",
    cadence: "quarterly",
    durationLabel: "3 months",
    bestFor: "Users already investing but struggling with consistency",
    objective: "Maintain SIP discipline for 3 consecutive salary cycles.",
    whoFor: "Users already investing but struggling with consistency",
    disciplineType: "Habitual retirement investing without skips",
    successDefinition: "SIP executed for all 3 months without interruption.",
    timelineType: "monthly_checkpoints",
    type: "quarterly",
    typeLabel: "Quarterly",
    getPlan: (readings) => {
      // Calculate total SIP commitment for 3 months
      // Break into Month 1, Month 2, Month 3
      // Reflect step-up if enabled
      const monthlySIPs = [readings.sipMonth1, readings.sipMonth2, readings.sipMonth3];
      return {
        monthlySIPs,
        totalQuarterlySIP: monthlySIPs.reduce((a, b) => a + (b || 0), 0),
        stepUpEnabled: readings.stepUpEnabled
      };
    }
  },
  {
    id: "annual_retirement_consistency",
    title: "Annual SIP Discipline",
    description: "Maintain SIP discipline across 4 consecutive quarters.",
    cadence: "yearly",
    durationLabel: "12 months",
    bestFor: "Long-term investors who want consistency without burnout",
    objective: "Maintain SIP discipline across 4 consecutive quarters.",
    whoFor: "Long-term investors who want consistency without burnout",
    disciplineType: "Year-round retirement investing habit",
    successDefinition: "SIP executed for all 4 quarters without interruption.",
    timelineType: "quarterly_checkpoints",
    type: "yearly",
    typeLabel: "Yearly",
    getPlan: (readings) => {
      // Annual SIP = saved monthly SIP × 12
      // Quarterly SIP = annual SIP ÷ 4
      const annualSIP = readings.suggestedMonthlySIP * 12;
      const quarterlySIP = Math.round(annualSIP / 4);
      const quarterlySIPs = [quarterlySIP, quarterlySIP, quarterlySIP, annualSIP - quarterlySIP * 3];
      return {
        quarterlySIPs,
        totalAnnualSIP: annualSIP,
        stepUps: readings.stepUps
      };
    }
  }
];

export function getChallengeById(id) {
  return CHALLENGES.find(c => c.id === id);
}
