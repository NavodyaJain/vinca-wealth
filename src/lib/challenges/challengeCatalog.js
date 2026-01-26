// src/lib/challenges/challengeCatalog.js
export const CHALLENGES = [
  {
    id: "weekly_sip_boost",
    title: "Weekly SIP Boost",
    description: "Increase your SIP by a small amount every week.",
    cadence: "weekly",
    durationLabel: "7 days",
    bestFor: "Discipline, SIP growth",
    whyThisMatters: "Small, regular increases compound over time.",
    tasks: [
      { id: "task_1", title: "Review SIP amount", description: "Check your current SIP.", type: "action", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_2", title: "Increase SIP by ₹500", description: "Add a small increment.", type: "action", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_3", title: "Update SIP in app", description: "Update your SIP in your investment app.", type: "action", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_4", title: "Log SIP boost", description: "Record your new SIP amount.", type: "reflection", isVerified: false, ctaLabel: "Mark done" }
    ]
  },
  {
    id: "weekly_expense_audit",
    title: "Weekly Expense Audit",
    description: "Audit your expenses for the week and spot leaks.",
    cadence: "weekly",
    durationLabel: "7 days",
    bestFor: "Discipline, expense control",
    whyThisMatters: "Regular audits help you stay on track.",
    tasks: [
      { id: "task_1", title: "Download expense report", description: "Get your bank statement or app report.", type: "action", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_2", title: "Categorize expenses", description: "Sort your expenses into needs/wants.", type: "action", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_3", title: "Spot leaks", description: "Identify unnecessary spends.", type: "reflection", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_4", title: "Set improvement goal", description: "Pick one area to improve next week.", type: "reflection", isVerified: false, ctaLabel: "Mark done" }
    ]
  },
  {
    id: "monthly_savings_sprint",
    title: "Monthly Savings Sprint",
    description: "Save a little extra this month for a specific goal.",
    cadence: "monthly",
    durationLabel: "1 month",
    bestFor: "Behavior, savings boost",
    whyThisMatters: "Short sprints help you build savings momentum.",
    tasks: [
      { id: "task_1", title: "Pick a savings goal", description: "Choose a goal for this month.", type: "reflection", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_2", title: "Automate extra savings", description: "Set up an auto-transfer.", type: "action", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_3", title: "Track progress", description: "Check your savings mid-month.", type: "action", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_4", title: "Celebrate win", description: "Reward yourself for hitting the goal.", type: "reflection", isVerified: false, ctaLabel: "Mark done" }
    ]
  },
  {
    id: "monthly_emergency_fund_build",
    title: "Monthly Emergency Fund Build",
    description: "Add to your emergency fund this month.",
    cadence: "monthly",
    durationLabel: "1 month",
    bestFor: "Behavior, safety net",
    whyThisMatters: "A strong emergency fund protects your plan.",
    tasks: [
      { id: "task_1", title: "Check current fund size", description: "See how many months of expenses you have.", type: "action", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_2", title: "Set a target", description: "Aim for 6 months of expenses.", type: "reflection", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_3", title: "Add to fund", description: "Transfer extra savings to your fund.", type: "action", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_4", title: "Review fund location", description: "Keep it in a safe, liquid account.", type: "reflection", isVerified: false, ctaLabel: "Mark done" }
    ]
  },
  {
    id: "quarterly_retirement_review",
    title: "Quarterly Retirement Review",
    description: "Review your retirement plan and update assumptions.",
    cadence: "quarterly",
    durationLabel: "3 months",
    bestFor: "Review, plan update",
    whyThisMatters: "Quarterly reviews keep your plan realistic.",
    tasks: [
      { id: "task_1", title: "Check plan progress", description: "See if you’re on track.", type: "action", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_2", title: "Update assumptions", description: "Adjust for any life changes.", type: "reflection", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_3", title: "Review asset allocation", description: "Check your investment mix.", type: "action", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_4", title: "Set next quarter goal", description: "Pick a focus for next quarter.", type: "reflection", isVerified: false, ctaLabel: "Mark done" }
    ]
  },
  {
    id: "yearly_retirement_health_check",
    title: "Yearly Retirement Health Check",
    description: "Do a deep review of your retirement plan.",
    cadence: "yearly",
    durationLabel: "1 year",
    bestFor: "Deep review, long-term",
    whyThisMatters: "Annual reviews help you stay on track for the long run.",
    tasks: [
      { id: "task_1", title: "Run plan health check", description: "Review your plan’s overall health.", type: "action", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_2", title: "Check insurance coverage", description: "Make sure you’re protected.", type: "action", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_3", title: "Update retirement goals", description: "Adjust for any changes.", type: "reflection", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_4", title: "Review asset allocation", description: "Check your investment mix.", type: "action", isVerified: false, ctaLabel: "Mark done" },
      { id: "task_5", title: "Set next year’s focus", description: "Pick a focus for next year.", type: "reflection", isVerified: false, ctaLabel: "Mark done" }
    ]
  }
];

export function getChallengeById(id) {
  return CHALLENGES.find(c => c.id === id);
}
