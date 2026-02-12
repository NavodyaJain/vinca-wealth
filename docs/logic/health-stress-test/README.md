# Health Stress Test

## 1. Data Inputs

### Source: Financial Readiness calculator output
- `currentAge`: Current age (years)
- `retirementAge`: Target retirement age (years)
- `lifespan`: Expected lifespan (years)
- `monthlyExpenses`: Current monthly expenses (₹)
- `monthlySIP`: Current monthly SIP (₹)
- `moneySaved`: Current corpus (₹)
- `expectedReturns`: Annual returns during work phase (%)
- `inflationRate`: General inflation rate (%)
- `emergencyFund`: Optional emergency fund pool (₹)

### User-Selected Input:
- `scenario`: One of three health scenarios:
  - `everyday`: Ongoing manageable conditions (4% of annual expenses annually)
  - `planned`: Single planned medical event (₹3L one-time + 5% post-recovery monthly cost)
  - `high-impact`: Major health event (₹15L one-time + 10% ongoing recovery cost)

### Constants:
- **Medical inflation rate**: 9% annually (higher than general inflation)
- **Hospital daily rate** (assumption): ₹20,000–₹30,000 depending on scenario

---

## 2. Core Calculations

### A. Baseline Retirement Metrics (Without Health Impact)

**Goal**: Calculate corpus depletion if no health costs occur.

**Process**:
1. Calculate corpus at retirement (same as Financial Readiness)
2. Simulate monthly withdrawals in retirement with inflation
3. Track when corpus depletes
4. Record: corpus at retirement, final corpus, depletion age

**Result**: `baselineMetrics` with:
- `corpusAtRetirement`: ₹ (before health costs)
- `finalCorpus`: ₹ (at end of simulation or at depletion)
- `depletionAge`: Age when corpus reaches 0

### B. Health Cost Projection

**Goal**: Calculate cumulative health costs over retirement period.

**Scenario-based multipliers**:
| Scenario | Annual % | One-Time Cost | Recurrence |
|----------|----------|---------------|-----------|
| everyday | 4% of annual expenses | ₹0 | Annual |
| planned | 2% of annual expenses | ₹3,00,000 | Event |
| high-impact | 6% of annual expenses | ₹15,00,000 | Event + Ongoing |

**Process**:
1. Base annual health cost = `monthlyExpenses × 12 × multiplier`
2. Project with medical inflation (9%) through retirement period
3. Add one-time cost (assumed to occur once during retirement)
4. Sum all costs

**Formula**:
$$\text{totalHealthCost} = \sum_{year=1}^{n} (\text{baseAnnualCost} \times (1.09)^{year}) + \text{oneTimeCost}$$

**Result**: `healthCosts` with:
- `annualCost`: Current annual cost (before inflation)
- `totalCost`: Cumulative cost over entire retirement
- `oneTimeCost`: ₹ amount from scenario definition

### C. Health-Adjusted Corpus Simulation

**Goal**: Apply health costs to retirement corpus and calculate new depletion age.

**Process for each year**:
1. Apply investment returns: `corpus × (1 + returns/100)`
2. Withdraw living expenses (inflation-adjusted)
3. **Apply health costs** (annual + one-time if year 1)
4. Check if corpus depletes
5. Escalate both expenses and health costs by inflation

**Key difference from baseline**: Additional deduction for health costs.

**Result**: `healthAdjustedMetrics` with:
- `depletionAge`: Age when corpus runs out *with* health costs
- `finalCorpus`: Remaining corpus at end (or 0 if depleted)
- `yearsEarlier`: How many years sooner corpus depletes

### D. Care Support Calculation

**Goal**: Calculate how many days/months of hospitalization can be supported from emergency fund.

**Process**:
1. Daily hospital cost from scenario: ₹20,000–₹30,000/day
2. Monthly recovery cost: % of monthly expenses
3. Divide emergency fund by daily cost → days supported
4. Or divide by monthly cost → months of recovery supported

**Result**: `careSupport` with:
- `daysSupported`: Days of hospitalization affordable
- `monthsSupported`: Months of recovery at reduced capacity
- `assumptions`: Assumptions used for calculation

---

## 3. Scoring Logic

**Not applicable** — Health Stress Test produces health-adjusted metrics, not a score.

**Output flags**:
- `healthRiskLevel`: "low", "medium", or "high"
  - Derived from corpus reduction percentage and scenario
  - High: >30% corpus reduction
  - Medium: 15–30% reduction
  - Low: <15% reduction

---

## 4. State Machine / Lifecycle

**Single-phase calculator** — No state machine.

**Lifecycle**:
1. **Financial Readiness results loaded** → baseline metrics calculated
2. **User selects health scenario** (UI provides radio buttons)
3. **User clicks "Calculate"** → `calculateHealthImpact()` executes with:
   - Financial Readiness user inputs
   - Selected scenario
4. **Results displayed**:
   - Baseline vs. health-adjusted comparison
   - Depletion age difference
   - Corpus reduction percentage
   - Care support estimation
5. **User clicks "Save Reading"** → Persisted to localStorage:
   - `healthStressReading`
   - Also saved to `vincaUserJourney.readings.healthStress`

**No dynamic state**: Results remain constant until user selects different scenario or inputs change.

---

## 5. Persistence & Source of Truth

### localStorage Keys:
- **`healthStressReading`**: Saved results including metrics, scenario selected (JSON)
- **`vincaUserJourney`**: Master record with `readings.healthStress` sub-object

### File Ownership:
- **[lib/healthStressEngine.js](../../src/lib/healthStressEngine.js)** ← **AUTHORITATIVE**
  - `calculateHealthImpact()`
  - `calculateBaselineRetirement()`
  - `calculateHealthCosts()`
  - `applyHealthImpact()`

### Storage / Persistence:
- **[lib/userJourneyStorage.js](../../src/lib/userJourneyStorage.js)**
  - `saveUserReading('healthStress', ...)`

### Pages:
- **[app/tools/health-stress/page.js](../../src/app/tools/health-stress/page.js)**

### Components:
- **[components/HealthStressTest.jsx](../../src/components/HealthStressTest.jsx)** ← Primary calculator UI
- **[components/HealthStressTrends.jsx](../../src/components/HealthStressTrends.jsx)** ← Trend visualization
- **[components/StressTestCharts.jsx](../../src/components/StressTestCharts.jsx)** ← Chart display

---

## 6. Output Values

### Primary Outputs (from metrics object):
- **`baselineCorpus`**: Corpus at retirement without health costs (₹)
- **`healthAdjustedCorpus`**: Corpus at retirement with health costs (₹)
- **`corpusReduction`**: Percentage reduction (0.0–1.0, e.g., 0.25 = 25%)
- **`baselineDepletionAge`**: Depletion age without health costs (age)
- **`depletionAge`**: Depletion age with health costs (age)
- **`yearsEarlier`**: How many years sooner corpus depletes (integer)
- **`annualHealthCost`**: Current annual health cost (₹)
- **`totalHealthCost`**: Total over entire retirement (₹)
- **`hospitalizationDays`**: Days of hospitalization supportable (integer)
- **`recoveryMonths`**: Months of recovery supportable (decimal)

### Secondary Outputs:
- **`baselineMetrics`**: Year-by-year baseline simulation data
- **`healthCosts`**: Breakdown of health cost calculation
- **`careSupport`**: Hospitalization affordability analysis
- **`scenarioImpact`**: Description of selected scenario

### Formatting Rules:
- Corpus amounts: Rounded to nearest rupee
- Percentages: Displayed as whole numbers (e.g., "25% reduction")
- Ages: Integer years
- Days/Months: Whole numbers

---

## 7. Edge Conditions

### Missing Data Behavior:
- **No emergency fund**: careSupport calculates 0 days/months supported
- **No scenario selected**: Impact assumed to be "everyday" (4%)
- **Invalid inputs from Financial Readiness**: Calculation still proceeds with available data

### First-Time User Behavior:
- **User hasn't run Financial Readiness**: Defaults used for corpus
- **User views without selecting scenario**: No calculation; UI shows prompt

### Partial Completion Behavior:
- **User changes Financial Readiness inputs**: Health Stress must be recalculated
- **User changes only scenario**: Engine re-runs with same Financial Readiness data

### Known Limitations:
- **Medical inflation is fixed** (9%) — not customizable
- **Hospital costs are assumptions** — not user-adjustable
- **No insurance coverage modeled** — assumes 100% self-pay
- **One-time events assumed to occur once** — no multi-event scenarios
- **No family/dependent healthcare**: Individual health costs only
- **Emergency fund separate from retirement corpus** — doesn't account for opportunity cost

---

## 8. File Ownership

### Logic / Engines:
- **[lib/healthStressEngine.js](../../src/lib/healthStressEngine.js)** ← **AUTHORITATIVE**
  - `calculateHealthImpact()`
  - `calculateBaselineRetirement()`
  - `calculateHealthCosts()`
  - `applyHealthImpact()`
  - `calculateCareSupport()`

### Storage / Persistence:
- **[lib/userJourneyStorage.js](../../src/lib/userJourneyStorage.js)**
  - `saveUserReading('healthStress', ...)`

### Pages:
- **[app/tools/health-stress/page.js](../../src/app/tools/health-stress/page.js)**

### Components:
- **[components/HealthStressTest.jsx](../../src/components/HealthStressTest.jsx)** ← Primary UI
- **[components/StressTestCharts.jsx](../../src/components/StressTestCharts.jsx)** ← Comparison charts
- **[components/StressTestSummaryCards.jsx](../../src/components/StressTestSummaryCards.jsx)** ← Summary metrics

---

## Implementation Notes

**Medical inflation separate from general inflation**: 9% fixed rate reflecting healthcare cost trends.

**Two-phase simulation**: Baseline first (for benchmark), then health-adjusted (for impact).

**Care support is illustrative**: Emergency fund usage is separate from retirement corpus.

**Scenario selection is binary**: User picks one scenario; no mixed scenarios.

**Assumptions documented**: All costs and rates are clearly stated in code comments.
