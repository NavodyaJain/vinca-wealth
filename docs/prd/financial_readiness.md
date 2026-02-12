# Financial Readiness

## Feature Overview

Financial Readiness is a calculator tool that determines whether a user's savings plan can achieve their target retirement age and sustain through their expected lifespan. It projects monthly contributions, compound growth during accumulation, and monthly withdrawals during retirement to calculate retirement readiness status.

## Visible Outputs

- **Status banner** displaying readiness: "Ready at [age]" or "Gap of [years]"
- **Results cards** showing:
  - Expected corpus at retirement (₹ amount)
  - Required corpus (₹ amount)
  - Corpus surplus or gap (₹ amount)
  - Depletion age (age when money runs out)
  - SIP gap if needed (₹/month additional required)
  - Sustainabilty status (yes/no through lifespan)
- **Timeline table** showing year-by-year corpus balance during accumulation and retirement phases
- **Early Retirement Corpus Lookup** (requiredCorpusByAge): Array of {age, requiredCorpus} pairs for each year from current age to lifespan, enabling users to explore retiring at any earlier age and see corpus requirement adjustment
- **Investable Surplus**: Monthly income minus expenses minus current SIP, less 20% emergency reserve
- **Feasibility Flag**: Boolean indicating if required additional SIP can be covered by investable surplus

## Inputs Used

**Form fields collected**:
- Current age, money saved, monthly income, monthly expenses, retirement age, monthly SIP, expected returns (%), SIP increase rate (%), lifespan expectancy, inflation rate (%), withdrawal increase (%), retirement returns (%)

**Data source**: User input via 3-step form. Results persisted to localStorage under key `financialReadinessResults`.

**Data ignored**: Journal entries, learning progress, challenges, health data, community activity.

## Calculation & Scoring Logic

### Step 1: Convert Annual Returns to Monthly Rates
For accumulation: `monthlyRate = (1 + annualRate/100)^(1/12) - 1`
For retirement: same formula with retirement returns %

### Step 2: Accumulate to Retirement Age
Start with `moneySaved`. For each month until retirement:
- Add monthly SIP (with annual step-up: SIP × (1 + sipIncreaseRate/100)^yearsElapsed every 12 months)
- Apply returns: multiply corpus by (1 + monthlyRate)

### Step 3: Calculate Minimum Corpus Needed
Binary search (40 iterations) finds minimum corpus at retirement that:
- Allows monthly withdrawal equal to (month expenses × inflation from now to retirement) 
- Increases withdrawal 7% annually (withdrawalIncrease %)
- Does not run out before lifespan

### Step 4: Retirement Simulation
From retirement age to sifespan, for each month:
- Apply returns to corpus
- Subtract monthly withdrawal
- Track when corpus reaches zero (depletion age)

### Step 5: Determine Readiness
- `isReady = true` if expected corpus ≥ required corpus
- `lifespanSustainable = true` if depletion age ≥ lifespan
- `requiredSIP` calculated if current SIP insufficient

### Step 6: Build Early Retirement Corpus Lookup (Corpus Adjust Feature)
For each age from current age to lifespan, calculate minimum corpus needed to retire at that age:
- For target age: compute adjusted withdrawal starting amount (monthly expenses × inflation adjustment to that age)
- Binary search (40 iterations) to find minimum corpus that sustains from that age to lifespan
- Store all {age, requiredCorpus} pairs in `requiredCorpusByAge` array
- **Purpose**: Enables users to explore retiring earlier than target age and see how corpus requirement adjusts—younger retirement = higher corpus needed due to longer withdrawal period

## Update Triggers

**Recalculation occurs when**:
- User submits form with "Analyze your Financial Readiness" button
- All calculations including corpus adjustment for early retirement ages are performed
- Results scroll into view automatically after calculation

**No recalculation on**:
- Page navigation away and back (requires re-submit)
- Tool abandonment (form state saved to localStorage but results not auto-updated)
- Changes to other tools (independent calculation)

## Constraints & Limits

**Hard-coded values**:
- Binary search: 40 iterations for precision
- Withdrawal increase: 7% (fixed)
- Monthly compounding (not annual)
- SIP step-up: applied every 12 months

**Input validation**: All fields required; returns error if any empty or NaN

**Caps**: None on corpus values; can grow indefinitely

## What This Feature Does NOT Do

❌ Does not model individual stock picks, asset allocation, or portfolio rebalancing

❌ Does not apply taxes or advisory fees

❌ Does not account for bonuses, variable income, or salary raises

❌ Does not model market drawdowns or sequence risk

❌ Does not provide personalized advice or recommendations

❌ Does not auto-update when date changes or time passes

❌ Does not integrate with challenges or sprints for automatic recalculation

❌ Does not compare results against peer benchmarks

❌ Does not model education expenses, home loans, or major life events

❌ Does not track result history or changes over time


