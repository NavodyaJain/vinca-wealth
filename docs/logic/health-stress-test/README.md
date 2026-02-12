# Health Stress Test

---

## 1. Feature Purpose

The Health Stress Test measures the impact of health-related costs on a user's retirement corpus and lifespan sustainability. It models how different health scenarios (ongoing manageable conditions, single planned events, or major health events) reduce the expected retirement corpus and potentially shorten the period that savings can sustain withdrawals.

---

## 2. What Inputs Are Used

**From Financial Readiness Results**:
- **Expected corpus at retirement** (₹)
- **Current age, retirement age, expected lifespan** (years)
- **Monthly expenses during retirement** (₹)
- **Expected investment returns during retirement** (%)
- **Inflation rate for expenses** (%)

**User-Selected Health Scenario** (one of three):
- **Everyday**: Ongoing manageable health conditions (adds 4% of annual expenses annually)
- **Planned**: Single planned medical event (adds ₹3,00,000 one-time + 5% ongoing monthly recovery costs)
- **High-Impact**: Major health event (adds ₹15,00,000 one-time + 10% ongoing monthly recovery costs)

**Optional Input**:
- **Emergency fund available** (₹) — separate funds reserved for healthcare

---

## 3. How the Score / Number Is Built

### Step 1: Establish Baseline (Without Health Costs)

Using the Financial Readiness results, the calculator simulates retirement corpus depletion assuming no health costs:
- Start with expected corpus at retirement
- Each month: apply investment returns, deduct living expenses (adjusted annually for inflation)
- Track the age at which corpus reaches zero

Result: **Baseline depletion age** (used as reference point)

### Step 2: Calculate Health Costs Over Retirement

The calculator projects health-related costs based on the selected scenario:
1. Calculate annual health cost:
   - Everyday: 4% of current annual expenses
   - Planned: ₹3,00,000 (one-time) + 5% of monthly expenses ongoing
   - High-Impact: ₹15,00,000 (one-time) + 10% of monthly expenses ongoing
2. Escalate these costs annually at 9% (medical inflation rate)
3. Sum all health costs over the entire retirement period

Result: **Total projected health costs** (₹)

### Step 3: Apply Health Costs to Retirement Corpus

Simulate retirement with health costs deducted:
1. Start with expected corpus at retirement
2. Each month:
   - Apply investment returns
   - Deduct living expenses (inflation-adjusted)
   - Deduct health costs (if applicable that month)
3. Track when corpus depletes

Result: **Health-adjusted depletion age**

### Step 4: Calculate Impact

Compare baseline vs. health-adjusted outcomes:
- **Corpus reduction**: Percentage difference between retirement corpus and health-adjusted corpus
- **Years earlier**: Baseline depletion age minus health-adjusted depletion age
- **Risk level**: Categorize as Low, Medium, or High based on corpus reduction

---

## 4. What the Score Means

**Baseline Depletion Age** — The age at which retirement corpus would be fully depleted if no health costs occur. This is the benchmark scenario.

**Health-Adjusted Depletion Age** — The age at which corpus would be depleted when health costs are included. If this is significantly earlier than baseline, health costs have a material impact.

**Corpus Reduction** — The percentage of retirement corpus consumed by projected health costs. 
- **Low impact (< 15%)** — Health costs are manageable relative to overall retirement savings
- **Medium impact (15–30%)** — Health costs represent a meaningful reduction but plan remains sustainable with adjustments
- **High impact (> 30%)** — Health costs significantly reduce retirement savings and may force earlier depletion

**Years Earlier** — How many years sooner the corpus depletes when health costs are included. A larger gap indicates greater vulnerability to health expenses.

---

## 5. What the Score Does NOT Mean

- **Does NOT predict actual health events** — Only models three pre-defined scenarios; real health events may be different in timing, severity, or cost
- **Does NOT account for insurance** — Assumes 100% out-of-pocket costs; does not deduct insurance coverage, reimbursement, or government assistance
- **Does NOT model insurance claims timing** — Assumes all costs must be paid immediately; does not model claim processing, deductibles, or co-pays
- **Does NOT predict actual medical inflation** — Uses 9% fixed medical inflation rate; actual inflation may vary or differ from general inflation
- **Does NOT assess quality of healthcare** — Assumes standard hospital/clinic costs; does not model private vs. public care or healthcare quality trade-offs
- **Does NOT evaluate care access** — Does not consider geographic location, healthcare availability, or quality of care
- **Does NOT include dependent healthcare** — Models individual health costs only; does not include spouse, children, or parent care
- **Does NOT account for preventive savings** — Does not credit healthy behaviors that might reduce costs or extend longevity
- **Does NOT predict emergency fund usage** — Emergency fund is shown separately; impact on retirement corpus is not automatically deducted

---

## 6. Boundaries & Constraints

- **Three scenario types only** — Does not model custom health cost amounts or patterns; user must choose from pre-defined options
- **Fixed medical inflation** — Always uses 9% annual escalation; not adjustable or varied by scenario
- **One-time events occur once** — Planned and high-impact scenarios assume one major event during retirement; does not model recurring major events
- **Hospital costs are standardized** — Uses fixed daily rates (₹20,000–₹30,000) as assumption; does not vary by location, hospital type, or treatment
- **Recovery costs are percentage-based** — Ongoing costs calculated as % of monthly expenses; not flexible for different recovery timelines
- **Baseline is same methodology as Financial Readiness** — Uses identical accumulation and withdrawal logic; no scenario variance in baseline
- **Emergency fund is separate** — Does not automatically integrate emergency fund into retirement calculations; care support is informational only
- **No insurance model** — Assumes self-pay; any insurance data is not integrated
- **Retirement corpus does not rebuild** — Once health costs deplete corpus, no income sources replenish it (retirement phase only)
- **Single person model** — Health costs for one individual only; does not model household scenarios

---

**Document Version**: 1.0  
**Last Updated**: February 2026

