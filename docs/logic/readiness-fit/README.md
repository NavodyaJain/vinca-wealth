# Readiness Fit

## 1. Data Inputs

### Source: Three calculator outputs (Financial Readiness, Lifestyle Planner, Health Stress Test)

**From Financial Readiness**:
- `isReady`: Boolean, whether retirement age target is achievable
- `retirementAgeAchievable`: Age at which plan becomes ready (if not ready at target)
- `earlyRetirementGapYears`: Years needed to reach readiness (if early retirement target)
- `requiredSIP`: Monthly SIP needed (₹)
- `currentSIP`: Current monthly SIP (₹)
- `surplusAvailable`: Monthly surplus available to invest (₹)
- `lifespanSustainability`: Boolean, whether corpus sustains full lifespan
- `corpusAtRetirement`: Projected corpus (₹)
- `requiredCorpus`: Target corpus (₹)

**From Lifestyle Planner**:
- `targetLifestyleTier`: User's desired lifestyle (Basic=1, Comfortable=2, Premium=3)
- `affordableLifestyleTier`: What plan can support (1, 2, or 3)
- `monthlyIncomeRequired`: Target monthly withdrawal (₹)
- `monthlyIncomeSupported`: Achievable monthly withdrawal (₹)
- `lifestyleGap`: Monthly shortfall (₹)

**From Health Stress Test**:
- `healthAdjustedCorpus`: Corpus after health costs (₹)
- `baselineCorpus`: Corpus without health costs (₹)
- `depletionAge`: Age when corpus runs out with health costs (age)
- `baselineDepletionAge`: Age when corpus runs out without health costs (age)
- `healthRiskLevel`: "low", "medium", or "high" (inferred)

---

## 2. Core Calculations

### A. Three-Category Gap Scoring (0–100 points total)

**Goal**: Measure how much support user needs across three dimensions.

#### Category A: Financial Readiness Gap (0–33 points)

**Logic**:
```
if isReady == FALSE:
  score = 33  (critical: can't achieve target retirement age)
  reason = "Your plan does not reach retirement goal at target age"

else if isReady == TRUE and lifespanSustainability == FALSE:
  score = 22  (moderate: reaches retirement but sustainability risk)
  reason = "Your plan may not sustain your full expected lifespan"

else if isReady == TRUE and lifespanSustainability == TRUE:
  score = 11  (low: fully ready)
  reason = "Your retirement plan is on track and sustainable"

else:
  score = 11  (fallback)
```

**Interpretation**: Higher score = larger gap = greater need for Vinca support.

#### Category B: Lifestyle Gap (0–33 points)

**Logic**:
```
if targetLifestyleTier exists AND affordableLifestyleTier exists AND targetLifestyleTier > affordableLifestyleTier:
  score = 33  (critical: desired lifestyle unaffordable)
  reason = "Your desired lifestyle [tier] exceeds what your plan supports [tier]"

else if monthlyIncomeRequired > 0 AND monthlyIncomeSupported > 0 AND monthlyIncomeRequired > monthlyIncomeSupported:
  score = 22  (moderate: income shortfall)
  reason = "Your lifestyle needs ₹X exceed projected income ₹Y"

else:
  score = 11  (low: lifestyle supported)
  reason = "Your desired lifestyle is supported by your retirement income"
```

**Interpretation**: Planning gaps indicate need for Vinca guidance.

#### Category C: Health Sustainability Gap (0–34 points)

**Logic**:
```
if healthRiskLevel == "high" OR (depletionAge exists AND depletionAge < 85):
  score = 34  (critical: health costs severely impact longevity)
  reason = "Healthcare costs reduce corpus sustainability to age [age], creating uncertainty"

else if healthRiskLevel == "medium":
  score = 23  (moderate: some health uncertainty)
  reason = "Moderate healthcare risk introduces uncertainty"

else if healthAdjustedCorpus > 0 AND baselineCorpus > 0:
  corpusReduction = 1 - (healthAdjustedCorpus / baselineCorpus)
  if corpusReduction > 15%:
    score = 23  (moderate: >15% corpus reduction)
  else:
    score = 12  (low: <15% reduction)

else:
  score = 12  (low: manageable health costs)
```

**Interpretation**: Healthcare uncertainty quantifies longevity risk.

### B. Total Fit Score Calculation

**Formula**:
$$\text{totalScore} = \min(100, \max(0, categoryA + categoryB + categoryC))$$

**Range**: 0–100

**Thresholds**:
```
if totalScore >= 80:
  fitLevel = "Strong Fit"      (multiple major gaps)
else if totalScore >= 50:
  fitLevel = "Moderate Fit"    (some gaps)
else:
  fitLevel = "Limited Fit"     (mostly on track)
```

### C. Dynamic Reasoning Generation

**Goal**: Create personalized reasons from actual calculator outputs (not static templates).

**Process**:
1. Collect all signals from three categories (array of strings)
2. Sort by score magnitude (highest score reason first)
3. Return top 2–3 reasons (most impactful gaps)
4. Include source tool in each reason (e.g., "Financial Readiness:")

**Result**: 2–3 reason statements explaining gaps.

### D. Feature Recommendation Engine

**Goal**: Recommend Vinca features based on identified gaps.

**Mapping**:
```
If Financial Gap high (score 33):
  → Recommend "Early Retirement Optimizer"
  → Recommend "SIP Increase Calculator"

If Lifestyle Gap high (score 33):
  → Recommend "Lifestyle Planner Premium"
  → Recommend "Expense Optimization"

If Health Gap high (score 34):
  → Recommend "Health Stress Test Review"
  → Recommend "Healthcare Planning"

If no major gaps (all low):
  → Recommend "Learning & Development"
  → Recommend "Community & Mentoring"
```

**Result**: Array of 2–3 most relevant feature recommendations.

---

## 3. Scoring Logic

**Multi-category weighted sum**:
- Category A: 0–33 points (financial readiness)
- Category B: 0–33 points (lifestyle affordability)
- Category C: 0–34 points (health sustainability)
- **Total**: 0–100 points

**Fit levels**:
| Score Range | Fit Level | Interpretation |
|------------|-----------|-----------------|
| 80–100 | Strong Fit | Multiple critical gaps; high need for support |
| 50–79 | Moderate Fit | Some gaps; targeted support helpful |
| 0–49 | Limited Fit | Plan mostly on track; learning/growth focus |

**Logic is **additive**: Each gap independently contributes to total score.

---

## 4. State Machine / Lifecycle

**Single-phase calculator** — No state machine.

**Lifecycle**:
1. **User completes Financial Readiness** → Store results to localStorage
2. **User completes Lifestyle Planner** → Store results to localStorage
3. **User completes Health Stress Test** → Store results to localStorage
4. **Readiness Fit page loads** → Fetch all three readings → Calculate fit score
5. **Results displayed** → Show score, fit level, reasons, feature recommendations
6. **Optional: Save reading** → Persist fit score to localStorage (optional)

**No dynamic updates**: Fit score static until user re-runs any of the three calculators.

---

## 5. Persistence & Source of Truth

### localStorage Keys (consumed):
- **`financialReadinessResults`**: Financial Readiness output
- **`lifestylePlannerReading`**: Lifestyle Planner output
- **`healthStressReading`**: Health Stress Test output
- **`vincaUserJourney`**: Master journey record with readings sub-object

### Optional localStorage Key (written):
- **`readinessFitReading`**: Optional saved Readiness Fit calculation

### File Ownership:
- **[lib/readinessFit.js](../../src/lib/readinessFit.js)** ← **AUTHORITATIVE**
  - `calculateReadinessFitScore()`
  - `calculateRetirementGap()`, `calculateLifestyleGap()`, `calculateHealthGap()`
  - `generateDynamicReasons()`
  - `recommendFeatures()`
  - `generateClosingMessage()`

### Storage / Persistence:
- **[lib/userJourneyStorage.js](../../src/lib/userJourneyStorage.js)**
  - Read readings from journey: `getUserJourney().readings.*`
  - Optional save: `saveUserReading('readinessFit', ...)`

### Pages:
- **[app/dashboard/readiness-fit/page.js](../../src/app/dashboard/readiness-fit/page.js)** (if exists)

### Components:
- Readiness Fit score display component
- Gap visualization component (3-part pie or stacked bar)
- Reasons/signals list component
- Feature recommendations component

---

## 6. Output Values

### Primary Outputs:
- **`score`**: 0–100 (numeric fit score)
- **`fitLevel`**: "Strong Fit", "Moderate Fit", or "Limited Fit" (string)
- **`reasons`**: Array of 2–3 reason statements (string array)
  ```javascript
  [
    "Financial Readiness: Your plan does not reach retirement goal at target age",
    "Lifestyle Planner: Your desired lifestyle exceeds what your plan supports",
    ...
  ]
  ```
- **`relevantFeatures`**: Array of recommended feature names (string array)
  ```javascript
  ["Premium Lifestyle Optimizer", "Health Stress Test Pro", ...]
  ```

### Secondary Outputs:
- **`categoryScores`**: Breakdown of three categories
  ```javascript
  {
    retirement: 33,
    lifestyle: 22,
    health: 12
  }
  ```
- **`closingMessage`**: Personalized call-to-action based on fit level

### Formatting Rules:
- Score: Integer 0–100
- Fit level: Title case ("Strong Fit", not "STRONG_FIT")
- Reasons: Full sentences, action-oriented
- Features: Feature names exact as defined in system

---

## 7. Edge Conditions

### Missing Data Behavior:
- **Not all calculators completed**: Skip missing categories (use safe defaults)
  - Example: No Health Stress Test → Skip Category C, score from A+B only
  - Capped to 100 but scored proportionally
- **Null values in inputs**: Treated as "unknown"; score conservatively (assume gap exists)

### First-Time User Behavior:
- **User hasn't run any calculator**: Readiness Fit page shows prompt to complete calculators first
- **User completes only Financial Readiness**: Score based on 33% of total scale (Financial gap only)

### Partial Completion Behavior:
- **User modifies one calculator**: Fit score recalculates automatically on page load
- **User ignores some calculators**: UI shows "incomplete data" warning with encouragement to complete all three

### Known Limitations:
- **No weighting customization**: All three categories equally weighted (can be parameterized)
- **No user preference input**: Fit determination purely from calculator outputs
- **No comparison**: No "before/after" tracking of fit score over time
- **No goal setting**: Cannot set target fit level (aspiration-based goals not tracked)
- **Static thresholds**: 80/50 boundaries hardcoded (not user-adjustable)

---

## 8. File Ownership

### Logic / Engines:
- **[lib/readinessFit.js](../../src/lib/readinessFit.js)** ← **AUTHORITATIVE**
  - `calculateReadinessFitScore(data)`
  - `calculateRetirementGap(data)`
  - `calculateLifestyleGap(data)`
  - `calculateHealthGap(data)`
  - `generateDynamicReasons(data, catA, catB, catC)`
  - `recommendFeatures(data, catA, catB, catC)`
  - `generateClosingMessage(fitLevel, data)`

### Storage / Persistence:
- **[lib/userJourneyStorage.js](../../src/lib/userJourneyStorage.js)**
  - `getUserJourney()` (read all readings)
  - `saveUserReading('readinessFit', ...)` (optional save)

### Pages:
- **Readiness Fit results page**
  - Fetches from engine
  - Displays score + reasons + recommendations

### Components:
- Fit score badge/card component
- Category breakdown visualization
- Reasons/signals list component
- Feature recommendations component
- Call-to-action component

---

## Implementation Notes

**Readiness Fit ≠ Each Calculator**: This feature aggregates and interprets three outputs; no independent calculations.

**Dynamic reasons are key**: Personalized messaging sourced from actual user data, not templates.

**Three calculators are independent**: Fit score depends on their completion; no circular dependencies.

**Fit level is diagnostic, not prescriptive**: Identifies gaps but doesn't mandate solutions.

**Feature recommendations are suggestions**: User can engage with Vinca features in any order.
