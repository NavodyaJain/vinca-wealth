# Lifestyle Planner

## 1. Data Inputs

### Source: Financial Readiness + User lifestyle selection
- **From Financial Readiness**:
  - `corpusAtRetirement`: Final corpus amount (₹)
  - `currentAge`: Current age (years)
  - `retirementAge`: Target retirement age (years)
  - `monthlyExpenses`: Current monthly expenses (₹) → used as baseline
  - `inflationRate`: Expense inflation rate (%)
  - `expectedLifespan`: Life expectancy (years)

### User-Selected Input:
- `desiredMonthlyIncomeToday`: Desired lifestyle spending at today's prices (₹)
  - Must be provided by user or inferred from tier selection

### Default Values (if missing):
- If `desiredMonthlyIncomeToday` is not provided, infer from tier:
  - Basic: current monthly expenses × 1.1
  - Comfortable: current monthly expenses × 1.5
  - Premium: current monthly expenses × 2.0

---

## 2. Core Calculations

### A. Inflation-Adjusted Income at Retirement Start

**Goal**: Convert today's desired monthly income to retirement-age prices.

$$\text{desiredMonthlyAtRetirement} = \text{desiredMonthlyToday} \times (1 + \text{inflationRate})^{\text{yearsToRetirement}}$$

Example: ₹100,000 today, 6% inflation, 30 years → ₹574,349 at retirement.

### B. Retirement Simulation (Monthly Precision)

**Goal**: Simulate retirement year-by-year, tracking if corpus succeeds or fails.

**Process for each year**:
1. Start with corpus at beginning of year
2. Apply post-retirement returns: `corpusAfterReturn = corpusStart × (1 + postRetirementReturnRate / 100)`
3. Calculate desired monthly withdrawal (inflation-adjusted for this year)
4. Calculate supported monthly withdrawal: `supported = corpusAfterReturn / remainingMonths / 12`
5. Apply desired withdrawal: `corpusEnd = corpusAfterReturn - (desiredMonthly × 12)`
6. Track if failure occurs (corpus ≤ 0 OR desired > supported)

**Result tracked**:
- `timeline`: Array of year-by-year records
- `failureAge`: Age when corpus depletes (NULL if sustainable)
- `sustainableTillAge`: Age where corpus runs out (set to lifespan if never runs out)
- `yearsSupported`: Years of full desired withdrawal (until failure)
- `totalYears`: Years in retirement (lifespan - retirementAge)
- `desiredMonthlyAtRetirementStart`: Inflation-adjusted target

### C. Affordability Status Classification

**Classification logic**:
```
if failureAge is NULL or yearsSupported >= totalYears:
  status = "Maintained"  (full lifestyle sustainable)
else if yearsSupported >= totalYears × 0.5:
  status = "Tight"  (≥50% of years sustainable)
else:
  status = "Not Maintained"  (<50% of years sustainable)
```

**Color codes**:
- Maintained: Emerald (✓)
- Tight: Amber (⚠️)
- Not Maintained: Rose/Red (✗)

### D. Lifestyle Tier Mapping

**Goal**: Map afforded monthly income to lifestyle tier.

**Tier boundaries** (relative to current monthly expenses):
- **Basic**: Afforded ≤ current × 1.1
- **Comfortable**: current × 1.1 < afforded ≤ current × 1.5
- **Premium**: Afforded > current × 1.5

**Logic**:
```javascript
getAffordableLifestyleTier(supportedMonthlyToday, currentMonthlyExpense):
  if (!currentMonthlyExpense):
    return "Comfortable"  (no baseline to compare)
  
  basicThreshold = currentMonthlyExpense × 1.1
  comfortableThreshold = currentMonthlyExpense × 1.5
  
  if supportedMonthlyToday <= basicThreshold:
    return "Basic"
  if supportedMonthlyToday <= comfortableThreshold:
    return "Comfortable"
  return "Premium"
```

### E. Supported Monthly Income Calculation

**Goal**: Calculate monthly withdrawal the corpus can actually support.

**For each year in retirement**:
- Supported monthly = corpusAfterReturn / remainingYears / 12
- Represents the "safe" withdrawal amount for that year

**Discounted to today's value**:
$$\text{supportedMonthlyToday} = \frac{\text{supportedMonthlyAtRetirement}}{(1 + \text{inflationRate})^{\text{yearsToRetirement}}}$$

---

## 3. Scoring Logic

**Not applicable** — Lifestyle Planner produces status flags, not a score.

**Output flags**:
- `affordanceStatus`: "Maintained", "Tight", or "Not Maintained"
- `affordableLifestyleTier`: "Basic", "Comfortable", or "Premium"
- `gap`: Monthly amount user cannot afford (0 if comfortable)

---

## 4. State Machine / Lifecycle

**Single-phase calculator** — No state machine.

**Lifecycle**:
1. **User fills form** → Income amount + lifestyle tier choice
2. **Financial Readiness results loaded** → Corpus passed to simulator
3. **User clicks "Calculate"** → `simulateRetirementTimeline()` executes
4. **Results displayed** → Tier classification, affordance status, year-by-year timeline
5. **User clicks "Save Reading"** → Persisted to localStorage:
   - `lifestylePlannerReading`
   - Also saved to `vincaUserJourney.readings.lifestylePlanner`

**No state transitions**: Results are static until user re-calculates with new inputs.

---

## 5. Persistence & Source of Truth

### localStorage Keys:
- **`lifestylePlannerReading`**: Saved results including affordability status, tier, timeline (JSON)
- **`vincaUserJourney`**: Master record with `readings.lifestylePlanner` sub-object

### File Ownership:
- **[lib/lifestylePlanner.js](../../src/lib/lifestylePlanner.js)** ← **AUTHORITATIVE**
  - `simulateRetirementTimeline()`
  - `deriveAffordabilityStatus()`
  - `getAffordableLifestyleTier()`

### Components:
- **[components/LifestylePlanner/LifestyleCharts.jsx](../../src/components/LifestylePlanner/LifestyleCharts.jsx)** ← Primary UI
- **[components/LifestylePlanner/LifestyleTierCards.jsx](../../src/components/LifestylePlanner/LifestyleTierCards.jsx)** ← Tier selector

---

## 6. Output Values

### Primary Outputs:
- **`sustainableTillAge`**: Age (integer) where corpus depletes
- **`yearsSupported`**: Years where full withdrawal is sustainable
- **`failureAge`**: Age when failure occurs (NULL if never)
- **`desiredMonthlyAtRetirementStart`**: Inflation-adjusted target monthly withdrawal
- **`affordanceStatus`**: "Maintained", "Tight", or "Not Maintained"
- **`affordableLifestyleTier`**: "Basic", "Comfortable", or "Premium"

### Secondary Outputs:
- **`timeline`**: Array of year-by-year objects:
  - `age`: Current age
  - `corpusStart`: Corpus at year start
  - `corpusAfterReturn`: After market returns
  - `desiredMonthly`: Target withdrawal
  - `supportedMonthly`: What corpus can support
  - `corpusEnd`: Corpus at year end
  - `isDepleted`: Boolean (corpus ≤ 0)

### Formatting Rules:
- Corpus amounts: Rounded to nearest rupee
- Monthly amounts: Rounded to nearest rupee
- Percentages: Whole numbers (e.g., 100% not 100.00%)
- Ages: Integer years

---

## 7. Edge Conditions

### Missing Data Behavior:
- **No Financial Readiness data**: Defaults used for corpus (large fallback value)
- **No desired income input**: Tier defaults inferred (Comfortable assumed)
- **Current expenses = 0**: Tier comparison skipped; Comfortable returned

### First-Time User Behavior:
- **User hasn't run Financial Readiness**: Lifestyle Planner uses mock corpus
- **User selects tier without filling income**: Tier used to estimate income

### Partial Completion Behavior:
- **User modifies one tier**: Entire simulation re-runs
- **User changes inflation rate**: Timeline recalculates

### Known Limitations:
- **Tier boundaries are fixed** (1.1x and 1.5x multipliers) — not customizable
- **No sequence-of-returns risk**: Constant returns assumed
- **No healthcare costs**: Lifestyle assumes basic expenses only (Health Stress Test separate)
- **No tax impact**: Withdrawals treated as after-tax

---

## 8. File Ownership

### Logic / Engines:
- **[lib/lifestylePlanner.js](../../src/lib/lifestylePlanner.js)** ← **AUTHORITATIVE**
  - `simulateRetirementTimeline()`
  - `deriveAffordabilityStatus()`
  - `getAffordableLifestyleTier()`

### Storage / Persistence:
- **[lib/userJourneyStorage.js](../../src/lib/userJourneyStorage.js)**
  - `saveUserReading('lifestylePlanner', ...)`

### Pages:
- **[app/tools/lifestyle-planner/page.js](../../src/app/tools/lifestyle-planner/page.js)**

### Components:
- **[components/LifestylePlanner/LifestyleCharts.jsx](../../src/components/LifestylePlanner/LifestyleCharts.jsx)** ← Primary UI
- **[components/LifestylePlanner/LifestyleTierCards.jsx](../../src/components/LifestylePlanner/LifestyleTierCards.jsx)** ← Interactive tier cards
- **[components/LifestylePlanner/LifestyleSummaryMetrics.jsx](../../src/components/LifestylePlanner/LifestyleSummaryMetrics.jsx)** ← Summary display

---

## Implementation Notes

**Dependency on Financial Readiness**: Corpus value required; defaults provided if missing.

**Monthly precision in timeline**: Year-by-year simulation respects both inflation and returns timing.

**Affordability is relative**: Tiers are defined relative to user's current spending, not absolute thresholds.

**No dynamic tier calculation**: User selects tier explicitly; engine validates affordability against selection.
