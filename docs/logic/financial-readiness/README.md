# Financial Readiness Calculator

---

## 1. Feature Purpose

The Financial Readiness Calculator assesses whether a user's current financial plan (existing savings, monthly contributions, and expected returns) will support their target retirement age and lifespan. It calculates how much corpus will be available at retirement and how long that corpus will sustain retirement withdrawals.

---

## 2. What Inputs Are Used

**From User Input**:
- **Current age** (years)
- **Target retirement age** (years)
- **Expected lifespan** (years)
- **Current lump sum savings** (₹)
- **Current monthly income** (₹)
- **Current monthly expenses** (₹)
- **Current monthly SIP contribution** (₹)
- **Annual SIP increase rate** (%)
- **Expected returns during working years** (% annual)
- **Expected returns during retirement** (% annual)
- **Annual expense inflation rate** (%)
- **Annual withdrawal increase during retirement** (%)

If any input is missing, the calculator uses default values (e.g., age 26, SIP ₹20,000, returns 12%).

---

## 3. How the Score / Number Is Built

### Step 1: Accumulation Phase (Current Age → Retirement Age)

The calculator simulates month-by-month growth of the user's corpus:
1. Start with current lump sum savings
2. For each month until retirement:
   - Add the monthly SIP contribution (increasing annually by the SIP increase rate)
   - Apply monthly investment returns to the entire corpus
3. Result: **Expected corpus at retirement** (a rupee amount)

### Step 2: Retirement Requirement Calculation

The calculator determines the minimum corpus needed at retirement to sustain planned withdrawals:
1. Starting with current monthly expenses as the base withdrawal
2. Calculate how much corpus would be needed to generate this withdrawal (adjusted annually for inflation)
3. Simulate drawdown month-by-month from retirement to expected lifespan, checking if corpus remains positive
4. Use a binary search to find the exact minimum corpus that prevents depletion before lifespan
5. Result: **Required corpus at retirement** (a rupee amount)

### Step 3: Readiness Assessment

The calculator compares actual vs. required:
1. If expected corpus ≥ required corpus: **Plan is ready** at target retirement age
2. If expected corpus < required corpus: **Plan is not ready** at target age
   - Calculator also computes:
     - Additional monthly SIP required to reach the goal (if achievable)
     - Age at which the plan becomes ready (if deferred)
     - Age when corpus depletes (based on expected corpus)

---

## 4. What the Score Means

**Readiness Status: YES** — User's expected corpus at target retirement age meets or exceeds the amount needed to sustain withdrawals until expected lifespan. The current plan is on track.

**Readiness Status: NO** — User's expected corpus falls short. Further action needed:
- Increase monthly SIP by X amount
- Defer retirement by Y years
- Reduce expected retirement expenses

**Depletion Age** — The age at which the expected corpus would fully deplete if no changes are made. If this age is before expected lifespan, the plan runs out of money.

**SIP Gap** — The additional monthly contribution (in rupees) required to reach the retirement goal. A zero gap means current SIP is sufficient.

---

## 5. What the Score Does NOT Mean

- **Does NOT predict actual market returns** — Assumes returns will match the user-provided percentage every year (ignores volatility and cycles)
- **Does NOT account for tax impact** — Does not deduct income tax, capital gains tax, or other levies on returns or withdrawals
- **Does NOT include unexpected life events** — Ignores medical emergencies, job loss, sudden windfall, or family support
- **Does NOT account for inflation variation** — Uses a single inflation rate; real inflation may differ
- **Does NOT factor in lifestyle changes** — Assumes expenses remain constant relative to inflation
- **Does NOT evaluate financial readiness quality** — Only measures numeric sufficiency, not plan robustness or risk
- **Does NOT provide investment advice** — Does not recommend specific funds, allocations, or asset classes
- **Does NOT predict lifetime financial fulfillment** — High readiness score does not guarantee financial peace or life satisfaction

---

## 6. Boundaries & Constraints

- **Assumes constant annual returns** — Returns do not vary year to year; uses average expected return as constant
- **Monthly compounding model** — All calculations work at monthly intervals; results are precise to monthly accuracy only
- **Inflation applies uniformly** — Single inflation rate applied to expenses annually; does not differentiate expense categories
- **No withdrawal flexibility** — Assumes fixed withdrawal amount, adjusted annually; does not model discretionary spending
- **Retirement date is target-based** — Calculation uses the user's target retirement age; does not model phased retirement
- **No regulatory or compliance checks** — Does not verify if plan meets minimum savings requirements or pension rules
- **Lifespan is user-defined** — Uses expected lifespan input; does not use mortality tables or actuarial data
- **Lump sum and SIP are the only sources** — Does not model bonus income, inheritance, rental returns, or other income
- **SIP increase is annual fixed percentage** — Assumes linear annual escalation; does not model market-linked increases
- **Retirement corpus is static** — Does not rebalance or rebuild corpus after retirement begins (assumes withdrawal-only phase)
- **Single household model** — Assumes one person; does not model joint retirement or survivor benefits

---

**Document Version**: 1.0  
**Last Updated**: February 2026

