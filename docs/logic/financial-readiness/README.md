# Financial Readiness

## 1. Data Inputs

### Source: Form inputs (Calculator page)
- `currentAge`: Current age of the user (years)
- `moneySaved`: Current corpus/lump sum investment (₹)
- `monthlyIncome`: Current monthly income (₹)
- `monthlyExpenses`: Current monthly expenses (₹)
- `retirementAge`: Target retirement age (years)
- `monthlySIP`: Current monthly SIP amount (₹)
- `expectedReturns`: Expected annual returns during work phase (%)
- `sipIncreaseRate`: Annual SIP escalation rate (%)
- `lifespan`: Expected lifespan (years)
- `inflationRate`: General inflation rate for expenses (%)
- `withdrawalIncrease`: Annual increase in withdrawal during retirement (%)
- `retirementReturns`: Expected annual returns during retirement phase (%)

### Default Values (if missing)
- currentAge: 26 years
- moneySaved: ₹500,000
- monthlyIncome: ₹150,000
- monthlyExpenses: ₹50,000
- retirementAge: 60 years
- monthlySIP: ₹20,000
- expectedReturns: 12%
- sipIncreaseRate: 10%
- lifespan: 85 years
- inflationRate: 6%
- withdrawalIncrease: 7%
- retirementReturns: 9%

---

## 2. Core Calculations

### A. Conversion of Annual Rates to Monthly Rates
All calculations use monthly compounding for precision. Annual percentages are converted as:

$$\text{monthlyRate} = (1 + \text{annualRate\%}/100)^{1/12} - 1$$

For example, 12% annual = 0.9488% monthly.

### B. Accumulation Phase (Current Age → Retirement Age)

**Goal**: Calculate corpus at retirement from current savings + monthly SIP.

**Process**:
1. Start corpus = `moneySaved`
2. For each month from now until retirement:
   - Add monthly SIP (with annual step-up applied every 12 months)
   - Apply monthly returns to entire corpus

**Formula**:
- Corpus in month $m$:
  $$C_m = C_{m-1} \times (1 + r_{acc}) + \text{SIP}_m$$

where:
- $r_{acc}$ = monthly accumulation rate
- $\text{SIP}_m = \text{baseSIP} \times (1 + \text{sipIncreaseRate})^{\text{years elapsed}}$

At retirement: **`expectedCorpusAtRetirement`** = final corpus after all accumulations.

### C. Required Corpus Calculation

**Goal**: Find minimum corpus needed at retirement to sustain withdrawal until lifespan.

**Process**: Binary search with 40 iterations to find the corpus amount that:
- Generates desired monthly withdrawal (inflation-adjusted)
- Maintains positive balance until lifespan
- Uses monthly compounding and annual withdrawal escalation

**Validation logic**:
```
survives(corpus):
  for each month in retirement period:
    corpus *= (1 + r_retirement)
    corpus -= monthlyWithdrawal
    if corpus <= 0: return FALSE
  return corpus > 0
```

**Result**: **`requiredCorpusAtRetirement`** = minimum corpus needed.

### D. SIP Gap Calculation

**Goal**: Calculate additional monthly SIP needed to meet retirement goal.

**Process**:
1. Calculate required corpus (from above)
2. Simulate accumulation with different SIP amounts via binary search
3. Find minimum SIP that grows to required corpus
4. Gap = Required SIP - Current SIP

**Result**: **`requiredMonthlySIP`** and **`sipGap`** (max of 0 if already sufficient).

### E. Depletion Age Calculation

**Goal**: Find the age when retirement corpus is depleted.

**Process**:
1. Simulate retirement phase with expected corpus
2. Each month: apply returns, withdraw expenses (inflated annually)
3. Track when corpus ≤ 0

**Result**: **`depletionAge`** = age at depletion, or `lifespan` if corpus lasts the full period.

### F. Monthly vs. Annual Calculations

- **Accumulation**: Exact monthly simulation (monthsToRetirement = yearsToRetirement × 12)
- **SIP step-up**: Applied annually; `SIP_year = baseSIP × (1 + sipIncreaseRate)^year`
- **Expense inflation**: Applied annually; `withdrawal = withdrawal × (1 + inflationRate)^year`
- **Returns**: Applied monthly using compounded monthly rates

---

## 3. Scoring Logic

**Not applicable** — Financial Readiness produces numeric outputs, not a score.

**Output flags instead**:
- `isReadyForRetirement`: Boolean. TRUE if sipGap ≤ 0 and expectedCorpus ≥ requiredCorpus at target retirementAge
- `isDesiredAgeFeasible`: Boolean. TRUE if additional SIP needed (additionalSIPNeeded) ≤ investable surplus

---

## 4. State Machine / Lifecycle

**Single-phase calculator** — No state machine.

**Lifecycle**:
1. **User fills form** → inputs stored in component state or localStorage
2. **User clicks "Calculate"** → `calculateFinancialReadinessResults()` executes immediately
3. **Results displayed** → Timeline chart, table rows, readiness status shown
4. **User clicks "Save Reading"** → Results persist to localStorage keys:
   - `financialReadinessInputs`
   - `financialReadinessResults`
   - Also saved to `vincaUserJourney.readings.financialReadiness`

**Data locked**: Once saved, results remain unchanged unless user recalculates with new inputs.

---

## 5. Persistence & Source of Truth

### localStorage Keys:
- **`financialReadinessInputs`**: User's form inputs (JSON)
- **`financialReadinessResults`**: Calculated results (corpus, SIP gap, depletion age, etc.) (JSON)
- **`vincaUserJourney`**: Master journey record, includes `readings.financialReadiness` sub-object

### File Ownership:
- **`financialReadiness/financialReadinessEngine.js`**: Authoritative source for all calculations
- **Components**: Read from engine, display results
- **Storage library** (`userJourneyStorage.js`): Persistes results to localStorage

### Access Pattern:
1. Component → Engine (`calculateFinancialReadinessResults()`)
2. Component → Storage (`saveUserReading('financialReadiness', ...)`)
3. Other features → Storage (`getUserJourney().readings.financialReadiness`)

---

## 6. Output Values

### Primary Outputs:
- **`expectedCorpusAtRetirement`**: ₹ amount (derived, not rounded)
- **`requiredCorpusAtRetirement`**: ₹ amount (derived)
- **`sipGap`**: ₹ monthly amount (derived, max 0)
- **`requiredMonthlySIP`**: ₹ monthly amount (derived)
- **`depletionAge`**: Age or "Never" string (derived)
- **`isReadyForRetirement`**: Boolean (derived)

### Secondary Outputs:
- **`timelineChartData`**: Array of { age, corpus } objects (60 data points: age 26–85+)
- **`tableRows`**: Array of year-by-year breakdown with phase, SIP, SWP, returns, corpus

### Formatting Rules:
- Corpus amounts: Rounded to nearest rupee (no decimals in display)
- Percentages: Displayed as whole numbers (e.g., 12%)
- Depletion age: Shown as integer year

---

## 7. Edge Conditions

### Missing Data Behavior:
- **All inputs have defaults** → Calculation always produces output
- **Zero inputs**: Treated as 0 (e.g., moneySaved = 0 is valid)
- **Negative inputs**: Not explicitly validated; may produce unexpected results (QA should catch)

### First-Time User Behavior:
- **No saved reading**: All defaults applied
- **Calculate button clicked**: Immediate output based on defaults
- **Results may show unready state**: Normal (indicates SIP gap)

### Partial Completion Behavior:
- **User closes form mid-way**: No output generated
- **User modifies one field**: Entire calculation re-runs (dependency chain)

### Known Limitations:
- **No validation on upper bounds**: Very high SIP or corpus may cause numerical overflow
- **Inflation assumption**: Simple annual escalation; no compound inflation on withdrawal escalation
- **Market volatility**: Returns are constant; no scenario variance
- **Tax impact**: No tax deduction on corpus or withdrawals

---

## 8. File Ownership

### Logic / Engines:
- **[financialReadiness/financialReadinessEngine.js](../../src/lib/financialReadiness/financialReadinessEngine.js)** ← **AUTHORITATIVE**
  - `calculateFinancialReadinessResults()`
  - `buildRequiredCorpusByAge()`

### Storage / Persistence:
- **[lib/userJourneyStorage.js](../../src/lib/userJourneyStorage.js)**
  - `getUserJourney()`
  - `setUserJourney()`
  - `saveUserReading()`

### Pages:
- **[app/tools/financial-readiness/page.js](../../src/app/tools/financial-readiness/page.js)**

### Components:
- **[components/financialReadiness/FinancialReadinessResultsDashboard.jsx](../../src/components/financialReadiness/FinancialReadinessResultsDashboard.jsx)** ← Primary UI
- **[components/financialReadiness/YearOnYearCorpusChart.jsx](../../src/components/financialReadiness/YearOnYearCorpusChart.jsx)** ← Visualization
- **[components/financialReadiness/YearOnYearCorpusTable.jsx](../../src/components/financialReadiness/YearOnYearCorpusTable.jsx)** ← Table view

---

## Implementation Notes

**Engine is pure logic**: No side effects; same inputs → same outputs always.

**Monthly compounding is precise**: Uses $e^{r \cdot t}$ equivalent formula instead of simple annual/12 division.

**Binary search for required corpus**: Guarantees convergence within 40 iterations and ₹0.01 accuracy.

**All calculations are synchronous**: No async operations; results available immediately.
