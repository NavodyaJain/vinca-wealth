# Lifestyle Planner PRD

## 1. Feature Overview

**Lifestyle Planner** projects what monthly income the retirement corpus can sustain across the lifespan. Located at `/dashboard/lifestyle-planner/`, it answers: "Given my corpus at retirement, how much can I spend each month and for how long?"

The feature calculates "Supported Monthly Income at Retirement" (what corpus generates) vs. "Desired Monthly Expenses" (user's spending target), identifying lifestyle sustainability gaps.

---

## 2. User Journey (As Implemented)

1. **Entry**: User navigates to `/dashboard/lifestyle-planner/`
2. **Data Load**: System retrieves inputs from `financialReadinessInputs` localStorage OR uses mock defaults
3. **Corpus Estimation**: System calculates projected corpus at retirement using Financial Readiness engine
4. **Simulation**: Generates retirement timeline (age by age) showing:
   - Desired monthly income (current expenses inflated to each retirement year)
   - Supported monthly income (corpus-derived, with post-retirement returns)
   - Gap (if desired > supported)
5. **Results Display**: 
   - KPI shows "Supported Monthly Income at Retirement" 
   - Chart shows timeline of desired vs. supported income
6. **Exit**: User saves reading or navigates to other tools

---

## 3. Visible Outputs

**KPI Card:**
- Supported Monthly Income at Retirement: ₹ amount (corpus withdrawal rate at age 60)

**Year-on-Year Chart/Table:**
- Age column
- Required Monthly (desired spending, inflation-adjusted from current expenses)
- Supported Monthly (corpus-derived withdrawal capability)
- Gap Monthly (required - supported, only shown if positive)

**Status Indicator:**
- "Lifestyle is Sustainable" if supported ≥ required for entire retirement period
- "Lifestyle Gap Exists" if projected supported income falls short in any year

---

## 4. Inputs Used

**Inputs from Financial Readiness (Auto-Loaded):**
- Current Age
- Retirement Age
- Lifespan / Life Expectancy
- Monthly Expenses (user's desired spending)
- Monthly SIP
- Money Saved (current corpus)
- Expected Returns (pre-retirement growth rate)
- Inflation Rate
- Retirement Returns (post-retirement asset growth rate)
- Emergency Fund (if available, not always used in core logic)

**Data Source:**
- localStorage key: `financialReadinessInputs` (primary)
- Fallback: `retirementInputs` or `calculatorInputs`
- Hard-coded mock defaults if none found (Current Age 30, Monthly Expenses ₹50,000, etc.)

**What Is Ignored:**
- Tax impacts on corpus or withdrawals
- Healthcare-specific expenses (deferred to Health Stress Test)
- Investment fees or costs
- Sequence of returns risk
- Market volatility
- Pension or other income sources
- One-time expenses (e.g., weddings, home repairs)
- Inflation differences by expense category

---

## 5. Calculations & Scoring Logic

### Corpus at Retirement Estimation

Uses the same calculation as Financial Readiness:
- Start: Money Saved
- Each year: `Corpus = Corpus × (1 + Expected Returns%) + Monthly SIP × 12`
- SIP increases by SIP Increase Rate annually
- Result: Projected corpus at Retirement Age

### Retirement Timeline Simulation

**Year-by-year from Retirement Age to Lifespan:**

1. **Desired Monthly Income (at each age):**
   - `Desired = Monthly Expenses × (1 + Inflation Rate%)^(Years Since Retirement Age)`
   - Example: Age 60 (retirement): Desired = ₹50,000
   - Age 61: Desired = ₹50,000 × 1.06 = ₹53,000
   - Continues inflating throughout retirement

2. **Supported Monthly Income (at each age):**
   - Apply post-retirement returns to corpus: `Corpus = Corpus × (1 + Post-Retirement Returns%)`
   - Withdraw desired amount: `Corpus = Corpus - (Desired × 12)`
   - Supported = previous year's supported amount (stationary, not dynamic)
   - Stops if corpus depletes (<= 0)

**Result:** Timeline array with each age showing required vs. supported

### Lifestyle Gap Calculation

**At Retirement Age (primary metric shown):**
- `Gap = max(0, Desired Monthly - Supported Monthly)`
- Displayed as ₹ amount or as percentage of desired

**Per Year (in chart):**
- If supported income falls short of desired in any year
- Gap exists and is visually indicated

---

## 6. Progress & State Transitions

**Data Persistence:**
- Inputs are pulled from localStorage (shared with Financial Readiness)
- Timeline simulation runs on each page load
- Results not persisted independently (recalculated from inputs)

**Recalculation Triggers:**
- Page load (automatic)
- User returns from other tools and inputs have changed

**Transitions:**
- Can navigate back to Financial Readiness (to adjust corpus assumptions)
- Can navigate to Health Stress Test (which adds healthcare costs to desired monthly spend)

---

## 7. Constraints & Limits

**Hard Limits:**
- Same age/year constraints as Financial Readiness
- Monthly Expenses must be > 0
- Post-Retirement Returns: 0-100% (realistic rates: 5-10%)

**Simulation Range:**
- Starts at Retirement Age (not earlier)
- Ends at declared Lifespan
- No projections beyond lifespan

**Display Limits:**
- Corpus formatted to nearest rupee
- Percentages rounded to 1 decimal
- Income amounts formatted in Indian currency notation (₹, Lakh, Crore)

---

## 8. What This Feature Does NOT Do

- **No Healthcare Costs**: Does not estimate or model medical expenses in retirement
- **No Tax Calculation**: Does not estimate income tax on withdrawals or capital gains
- **No Active Rebalancing**: Does not suggest portfolio changes or shifts in asset allocation
- **No Debt Servicing**: Does not account for EMI or other liabilities in retirement
- **No Income Beyond Corpus**: Does not include pensions, rental income, or other passive income
- **No Bequest Planning**: Does not calculate surplus to leave heirs
- **No Behavioral Adjustment**: Does not model spending discipline changes in retirement
- **No Sequence Risk**: Does not model market downturns early in retirement
- **No Lifestyle Tiers**: Does not offer "luxury", "modest", or "survival" lifestyle options
- **No Recommendation**: Does not advise on spending cuts or income sources
- **No Sensitivity Analysis**: Does not show "what if" scenarios for different inflation rates

---

## 9. Data Integration

**Consumes From:**
- Financial Readiness calculator inputs and corpus estimate

**Provides To:**
- Readiness Fit scoring (uses lifestyle gap as "Category B" input)
- Membership Fit diagnostic (flags if lifestyle gap exists)

**Not Used By:**
- Sprints (independent flow)
- Health Stress Test (separate calculation, but shares inputs)

---

## 10. Output Example

**User Scenario:**
- Corpus at Retirement: ₹50,000,000
- Post-Retirement Returns: 8% annual
- Desired Monthly Expenses: ₹50,000 (today's value)
- Inflation Rate: 6%
- Lifespan: 85, Current Age: 35, Retirement Age: 60

**At Age 60 (Retirement):**
- Desired Monthly: ₹50,000 × (1.06)^25 = ₹215,000
- Supported Monthly: ₹50,000,000 × 8% / 12 = ₹333,333
- Gap: ₹0 (supported > desired, no gap)

**At Age 70 (10 years into retirement):**
- Desired Monthly: ₹215,000 × (1.06)^10 = ₹384,000
- Corpus: Depleting due to withdrawals and inflation of expenses
- Supported Monthly: (updated corpus) × 8% / 12
- If supported < desired → Gap exists and is visible

**Output:** Timeline chart shows sustained vs. gap phases across 25-year retirement
