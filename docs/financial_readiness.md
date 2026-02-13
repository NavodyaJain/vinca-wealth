# Financial Readiness PRD

## 1. Feature Overview

**Financial Readiness** is a retirement planning calculator that projects financial sustainability until a user's declared lifespan. Located at `/dashboard/financial-readiness/`, it computes expected corpus at retirement, required corpus for expenses, SIP gap, and earliest achievable retirement age (Financial Readiness Age).

The feature calculates real-time whether a user can retire at their target age and die solvent, or how much monthly SIP must increase to achieve this.

---

## 2. User Journey (As Implemented)

1. **Entry**: User navigates to `/dashboard/financial-readiness/`
2. **Data Load**: System retrieves saved inputs from `financialReadinessInputs` or uses default inputs (Current Age: 30, Monthly Expenses: ₹50,000, Retirement Age: 60, Lifespan: 85, etc.)
3. **Input Editing**:
   - User optionally edits 13 financial fields (current age, money saved, monthly income, expenses, retirement age, SIP, years to invest, returns, SIP increase rate, lifespan, inflation, withdrawal increase, retirement returns) 
   - System saves inputs to localStorage immediately
4. **Calculation**: User clicks "Analyze" → system recalculates all metrics
5. **Results Display**: KPI cards show Corpus at Retirement, Required Corpus, SIP Gap, Depletion Age, Financial Readiness Age
6. **Action**: User can save results to localStorage and view charts/timeline
7. **Exit**: User returns to dashboard or navigates to other tools

---

## 3. Visible Outputs

**KPI Cards (Status Banner):**
- Expected Corpus at Retirement: ₹ amount
- Required Corpus at Retirement: ₹ amount  
- Current Monthly SIP: ₹ amount
- Required Monthly SIP: ₹ amount
- Depletion Age: Age number (year corpus runs out if not enough)
- Sustainability Till Age: Age number (declared lifespan if sustainable)

**Year-on-Year Chart**:
- Timeline from current age to lifespan
- Corpus growth during accumulation phase
- Corpus depletion during withdrawal phase
- Yearly corpus values and withdrawal amounts

**Status Label**:
- "Financial Readiness Achieved" (if expected corpus ≥ required corpus AND required SIP ≤ monthly income available)
- "Gap Exists" (if either condition fails)

**Gap Metrics**:
- Corpus Gap: Required Corpus - Expected Corpus (₹ amount, can be negative if no gap)
- SIP Gap: Required Monthly SIP - Current Monthly SIP (₹ amount)

---

## 4. Inputs Used

**Required Inputs:**
- Current Age (years, 18-75)
- Money Already Saved (₹)
- Monthly Income (₹)
- Monthly Expenses (₹)
- Retirement Age (years)
- Current Monthly SIP (₹)
- Investment Years (auto-derived: retirement age - current age)
- Expected Returns Pre-Retirement (% annual, typically 10-12)
- SIP Increase Rate (% annual, typically 10)
- Lifespan (years, typically 85-90)
- Inflation Rate (% annual, typically 6)
- Withdrawal Increase Rate (% annual for expense inflation in retirement, typically 5)
- Expected Returns Post-Retirement (% annual, typically 7-8)

**Data Sources:**
- User input form fields OR
- localStorage keys: `financialReadinessInputs`, `vincaWealthData`, `retirementInputs`
- Fallback: Hard-coded defaults if no localStorage data

**What Is Ignored:**
- Past investment performance (only forward projections used)
- Tax impacts on corpus
- Investment-specific holdings
- Market timing or external market conditions
- Life events (marriage, children, inheritance)
- Health-specific expenses (handled separately in Health Stress Test)

---

## 5. Calculations & Scoring Logic

### Corpus Projection (Accumulation Phase: Current Age to Retirement Age)

**Year-by-year:**
1. Start with "Money Already Saved"
2. Each year: `Corpus = Corpus × (1 + Expected Returns%) + Monthly SIP × 12`
3. Annually increase SIP by SIP Increase Rate
4. Continue until Retirement Age

**Result:** Expected Corpus at Retirement (₹)

### Required Corpus (Withdrawal Phase: Retirement Age to Lifespan)

**Calculation:**
1. Start with monthly expenses adjusted for inflation up to retirement age:
   - `Starting Withdrawal = Monthly Expenses × (1 + Inflation%)^(Retirement Age - Current Age)`
2. Binary search to find minimum starting corpus that lasts until lifespan
3. Test if corpus survives monthly withdrawals (increasing by Withdrawal Increase Rate annually) with post-retirement returns applied
4. Iteration continues until corpus reaches 0 or user survives to lifespan

**Result:** Required Corpus at Retirement (₹)

### Financial Readiness Age

**Definition:** Earliest age at which current SIP commitment can sustain until lifespan

**Calculation:**
1. Test each age from Current Age + 5 → Retirement Age
2. For each test age: calculate corpus at that age with current SIP rate
3. Simulate withdrawal phase from that age
4. If corpus survives to lifespan → Financial Readiness Age = that age
5. First age where sustainability confirmed is final result

**Result:** Age number (e.g., 48) or null if goal retirement age is only option

### SIP Gap

**Formula:** `Required Monthly SIP - Current Monthly SIP`

**Interpretation:**
- If positive: User must increase monthly SIP by this amount to retire at target age
- If zero or negative: Current SIP is sufficient or excessive

### Depletion Age

**Definition:** Age at which corpus runs out if user is NOT sustainable

**Calculation:**
- Simulates withdrawal from retirement age forward
- Tracks when corpus hits ₹0
- Returns that age

**Result:** Age number OR null if sustainable to lifespan

---

## 6. Progress & State Transitions

**Data Persistence:**
- Inputs are saved to localStorage on each change (real-time)
- Results are NOT persisted between sessions (recalculated each time based on inputs)
- User can mark calculation as "saved" which triggers a toast confirmation

**Recalculation Triggers:**
- User clicks "Analyze" button
- Page loads (auto-recalculates with stored inputs)

**State Flow:**
1. Not Analyzed (initial) → View default results
2. User Analyzes → Results update immediately
3. Results Shown → User can edit and re-analyze (no state change until click)

**Transitions to Other Features:**
- User can save reading (button: "Save Reading") → Stores result in `vincaUserReadings`
- User navigates to Lifestyle Planner or Health Stress Test → Uses same inputs from localStorage

---

## 7. Constraints & Limits

**Hard Limits:**
- Current Age: 18-75 years (enforced)
- Retirement Age must be > Current Age
- Lifespan must be > Retirement Age
- Monthly Expenses must be > 0
- Returns, inflation, withdrawal increase rates: 0-100% (no negative rates)

**Calculation Limits:**
- Timeline stops at declared Lifespan (no projections beyond)
- Corpus cannot go below ₹0 (displayed as ₹0 if negative calculation result)
- SIP increases stop at Retirement Age (no increases in withdrawal phase)

**Non-Reversible Actions:**
- None. All inputs are editable and recalculation can be run again with different values.

**Maximum Values:**
- No explicit cap on corpus, SIP, or income amounts
- Decimal precision: Rounded to nearest rupee for display

---

## 8. What This Feature Does NOT Do

- **No Tax Calculation**: Does not model income tax, capital gains tax, or post-retirement tax brackets
- **No Debt Management**: Does not account for existing loans, EMI, or debt repayment schedules
- **No Health Impact**: Health-related expenses are NOT modeled here (see Health Stress Test)
- **No Portfolio Allocation**: Does not specify asset classes, stock/bond split, or rebalancing strategy
- **No Asset-Specific Analysis**: Does not model individual investments, mutual funds, or holdings
- **No Market Timing**: Does not adjust returns based on economic conditions or market cycles
- **No Behavioral Factors**: Does not model inflation adjustment of SIP, missed payments, or inconsistency penalties
- **No Pension or Social Security**: Does not include government pensions, NPS withdrawals, or CPF contributions
- **No Bequest Planning**: Does not calculate surplus left to heirs at lifespan
- **No Life Events**: Does not model career changes, job loss, inheritance, or windfalls
- **No Liability or Risk Assessment**: Does not score or rank riskiness of the plan
- **No Recommendations**: Does not suggest actions or next steps (educational only)

---

## 9. Data Storage & Integration

**User Readings Storage:**
Result is saved to `vincaUserReadings.financialReadiness` with:
- Retirement Age, Lifespan, Expected Corpus, Required Corpus, Corpus Gap
- Current SIP, Required SIP, SIP Gap
- Depletion Age, Sustainability Flag

**Consumed By:**
- Lifestyle Planner (uses expected corpus to simulate lifestyle)
- Readiness Fit (uses gaps to score membership fit)
- Elevate Eligibility (uses corpus and SIP gaps)

---

## 10. Calculation Example

**User Input:**
- Current Age: 35, Money Saved: ₹1,000,000, Monthly Income: ₹100,000, Monthly Expenses: ₹50,000
- Retirement Age: 60, SIP: ₹20,000/month, Investment Years: 25
- Returns: 12%, SIP Increase: 10%, Lifespan: 85
- Inflation: 6%, Withdrawal Increase: 5%, Post-Retirement Returns: 8%

**Expected Corpus at 60:**
- Year 1: 1,000,000 × 1.12 + 20,000 × 12 = 1,360,000
- Year 2: 1,360,000 × 1.12 + 22,000 × 12 = 1,798,720
- ... (continues 25 years)
- Result: ~₹62,000,000 (illustrative)

**Required Corpus at 60:**
- Starting withdrawal at 60: ₹50,000 × (1.06)^25 = ₹215,000/month
- Binary search: Find X such that withdrawing ₹215,000 initially (increasing 5% yearly) with 8% returns lasts 25 years
- Result: ~₹45,000,000 (illustrative)

**Output:**
- Corpus Gap: ₹62M - ₹45M = ₹17M (positive, no gap)
- Financial Readiness Achieved: Yes
- Financial Readiness Age: ~52 years (earliest sustainable retirement)
- SIP Gap: 0 or negative (current SIP is sufficient)
