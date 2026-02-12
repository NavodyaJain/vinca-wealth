# Lifestyle Planner

---

## 1. Feature Purpose

The Lifestyle Planner assesses whether a user's desired retirement spending level can be sustained by their projected retirement corpus throughout their expected lifespan. It evaluates affordability by simulating month-by-month retirement withdrawals and determining the retirement lifestyle tier (Basic, Comfortable, Premium) that the plan can actually support.

---

## 2. What Inputs Are Used

**From Financial Readiness Calculator**:
- **Projected retirement corpus** (₹)
- **Current age and target retirement age** (years)
- **Expected lifespan** (years)
- **Current monthly expenses** (₹) — used as baseline for lifestyle comparison
- **Expected inflation rate** (% annual)

**From User Input**:
- **Desired monthly spending** (₹ at today's prices) — Or indirectly through lifestyle tier selection
- **Lifestyle tier preference** (Optional, to set expected spending level: Basic, Comfortable, or Premium)

If user selects a tier instead of specifying exact income:
- **Basic tier**: Estimated at current monthly expenses × 1.1
- **Comfortable tier**: current monthly expenses × 1.5
- **Premium tier**: current monthly expenses × 2.0

---

## 3. How the Score / Number Is Built

### Step 1: Adjust Desired Spending for Inflation

Convert today's desired monthly spending to inflation-adjusted spending at retirement:
- Multiply desired income by (1 + inflation rate) raised to the power of years until retirement
- Example: ₹100,000 today with 6% inflation over 30 years = ₹574,349 at retirement start

### Step 2: Simulate Retirement Year-by-Year

For each year from retirement to expected lifespan:
1. Apply investment returns to the corpus
2. Calculate how much the corpus can afford to withdraw monthly for that year
3. Deduct the desired monthly withdrawal (inflation-adjusted for that specific year)
4. Track the corpus balance remaining
5. Identify if/when the corpus becomes insufficient

### Step 3: Assess Affordability Status

Compare how long the full desired withdrawal can be sustained:
- **Maintained**: Desired spending is sustainable for the entire retirement period
- **Tight**: Desired spending is sustainable for at least 50% of the retirement period, then becomes insufficient
- **Not Maintained**: Desired spending is sustainable for less than 50% of retirement period

### Step 4: Determine Affordable Lifestyle Tier

Map the actual sustainable monthly income (converted back to today's prices) to a lifestyle tier:
- **Basic**: Sustainable income ≤ current expenses × 1.1
- **Comfortable**: current expenses × 1.1 < sustainable income ≤ current expenses × 1.5
- **Premium**: Sustainable income > current expenses × 1.5

---

## 4. What the Score Means

**Affordance Status: Maintained** — The desired monthly spending level can be sustained throughout retirement.  The plan supports the chosen lifestyle for life.

**Affordance Status: Tight** — The desired spending level is sustainable for roughly half of retirement, then becomes reduced. The early retirement years can support desired spending; later years require adjustments.

**Affordance Status: Not Maintained** — The desired spending level depletes the corpus before the expected lifespan. The plan cannot support the chosen lifestyle for the full retirement period.

**Lifest Tier** (Basic/Comfortable/Premium) — Indicates what relative spending level (compared to current expenses) the retirement plan can actually afford. This is independent of what the user desires.

---

## 5. What the Score Does NOT Mean

- **Does NOT include healthcare costs** — Assumes basic living expenses only; does not deduct medical, long-term care, or health-related costs (model separately in Health Stress Test)
- **Does NOT account for taxes** — Assumes withdrawals are after-tax; does not model income tax, capital gains tax, or other levies
- **Does NOT model sequence-of-returns risk** — Assumes constant annual returns; does not vary returns year-to-year or model market downturns
- **Does NOT include inflation variation** — Uses single inflation rate; real inflation may differ or vary by expense category
- **Does NOT predict actual spending behavior** — Assumes user will strictly adhere to desired withdrawal; does not model discretionary changes
- **Does NOT evaluate lifestyle quality** — Higher tiers do not indicate better or worse quality of life
- **Does NOT integrate with tax planning** — Tier classification is independent of tax-optimized withdrawal strategies
- **Does NOT account for irregular expenses** — Assumes regular monthly withdrawals; does not model lumpy costs (home repairs, travel, etc.)

---

## 6. Boundaries & Constraints

- **Tier boundaries are fixed** — Basic/Comfortable/Premium boundaries (1.1x and 1.5x multipliers) are not customizable
- **Assumes constant annual returns** — Investment returns do not vary; uses fixed expected return rate throughout retirement
- **No rebalancing modeled** — Portfolio allocation does not change; assets expected to generate consistent returns
- **Single inflation rate** — One inflation rate applies to all expenses; does not differentiate categories (e.g., food vs. healthcare)
- **Current expenses as baseline** — Tier comparison is relative to current spending; absolute spending amounts (₹) are not tiered
- **Lifespan-based end date** — Retirement ends at user's expected lifespan, not at corpus depletion or other trigger
- **No lifestyle flexibility** — Cannot model year-by-year spending adjustments or reduced spending in later years
- **No additional income sources** — Assumes retirement withdrawals only; does not model pension, rental income, or other sources
- **Household model is simplified** — Assumes one individual; does not model dual-income households or dependent care

---

**Document Version**: 1.0  
**Last Updated**: February 2026

