export const defaultToolFormData = {
  currentAge: 26,
  moneySaved: 500000,
  monthlyIncome: 120000,
  monthlyExpenses: 50000,
  monthlySIP: 20000,
  expectedReturns: 12,
  sipIncreaseRate: 10,
  retirementAge: 60,
  investmentYears: 34, // auto default = retirementAge - currentAge
  lifespan: 85,
  inflationRate: 6,
  withdrawalIncrease: 7,
  retirementReturns: 9
};

export const toolStepsConfig = [
  {
    title: 'Basic profile inputs',
    description: 'Tell us about your current age and savings so we can personalize your plan.',
    fields: [
      { id: 'currentAge', label: 'Current Age', type: 'number', min: 18, max: 80, suffix: 'years', helper: 'Your current age in years' },
      { id: 'moneySaved', label: 'Money Already Saved', type: 'currency', prefix: '₹', helper: 'Investable savings today' },
      { id: 'investmentYears', label: 'Years you plan to invest', type: 'number', min: 1, max: 60, suffix: 'years', helper: 'Auto defaults to retirement age minus current age' }
    ]
  },
  {
    title: 'Income + expenses inputs',
    description: 'Share your inflows and outflows to size the right investment plan.',
    fields: [
      { id: 'monthlyIncome', label: 'Monthly Income', type: 'currency', prefix: '₹', helper: 'Take-home income per month' },
      { id: 'monthlyExpenses', label: 'Monthly Expenses', type: 'currency', prefix: '₹', helper: 'Lifestyle expenses per month' },
      { id: 'monthlySIP', label: 'Current Monthly SIP', type: 'currency', prefix: '₹', helper: 'Amount you invest monthly today' },
      { id: 'expectedReturns', label: 'Expected Annual Returns', type: 'percentage', min: 1, max: 25, helper: 'Pre-retirement return expectation' },
      { id: 'sipIncreaseRate', label: 'Annual SIP Increase', type: 'percentage', min: 0, max: 20, helper: 'Expected year-on-year SIP step-up' }
    ]
  },
  {
    title: 'Retirement planning inputs',
    description: 'Calibrate retirement age, lifespan, and conservative drawdown assumptions.',
    fields: [
      { id: 'retirementAge', label: 'Expected Retirement Age', type: 'number', min: 40, max: 75, suffix: 'years', helper: 'Age at which you want to retire' },
      { id: 'lifespan', label: 'Expected Lifespan', type: 'number', min: 70, max: 100, suffix: 'years', helper: 'Plan for longevity' },
      { id: 'inflationRate', label: 'Inflation Assumption', type: 'percentage', min: 1, max: 12, helper: 'Average annual inflation you expect' },
      { id: 'withdrawalIncrease', label: 'Annual Withdrawal Increase', type: 'percentage', min: 0, max: 10, helper: 'How much your withdrawals may rise each year' },
      { id: 'retirementReturns', label: 'Post-Retirement Returns', type: 'percentage', min: 4, max: 12, helper: 'Conservative return during retirement' }
    ]
  }
];
