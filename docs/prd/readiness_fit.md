# Readiness Fit

## Feature Overview

Readiness Fit diagnoses how well Vinca's tools support a user's financial readiness needs by aggregating outputs from three calculators: Financial Readiness, Lifestyle Planner, and Health Stress Test. It produces a single 0-100 fit score with a fit level label and dynamic reasoning based on gaps identified in each calculator.

## Visible Outputs

- **Fit Score** (0-100, centered, large): number with color gradient (green/amber/grey)
- **Fit Level** label: "Strong Fit" / "Moderate Fit" / "Limited Fit"
- **Score Card** with unified design showing score, label, and fit level text
- **Reasons section**: 3-5 dynamic reason items extracted from calculator gaps
  - Reason source (which calculator identified it)
  - Reason text (problem statement)
  - Alert icon per reason
- **Closing Message**: contextual statement based on fit level
- **"Join Membership" button** linking to investor hub (paid feature)

## Inputs Used

**Data sources** (read at page load, ONCE):
- `financialReadinessResults` from localStorage (Financial Readiness calculator output)
- `lifestylePlannerResults` from localStorage (Lifestyle Planner form data)
- `healthStressResults` from localStorage (Health Stress Test form data)

**Exact fields read from each**:
- Financial: `isReady`, `requiredSIP`, `currentSIP`, `corpusAtRetirement`, `requiredCorpus`, `lifespanSustainability`
- Lifestyle: `targetLifestyleTier`, `affordableLifestyleTier`, `monthlyIncomeRequired`, `monthlyIncomeSupported`
- Health: `healthRiskLevel`, `depletionAge`

**Data ignored**: Sprint history, learning progress, challenges, journal, feedback.

## Calculation & Scoring Logic

### Step 1: Extract Calculator Outputs
Read from localStorage. If missing, use defaults (false, 0, null).

### Step 2: Calculate Financial Readiness Gap Score (0-33 pts)
- If `isReady = false`: 33 pts (cannot retire at target age)
- Else if `isReady = true` AND `lifespanSustainability = false`: 22 pts (can retire but won't last)
- Else if `isReady = true` AND `lifespanSustainability = true`: 11 pts (on track)
- Else (unknown): 11 pts

### Step 3: Calculate Lifestyle Gap Score (0-33 pts)
- If `targetLifestyleTier > affordableLifestyleTier`: 33 pts (desired > supported)
- Else if `monthlyIncomeRequired > monthlyIncomeSupported`: 22 pts (income shortfall)
- Else: 11 pts (lifestyle supported)

### Step 4: Calculate Health Gap Score (0-34 pts)
- If `healthRiskLevel = 'high'` OR `depletionAge < 85`: 34 pts (health creates uncertainty)
- Else: 11 pts (health impact manageable)

### Step 5: Calculate Total Fit Score
`totalScore = min(100, max(0, categoryA + categoryB + categoryC))`

### Step 6: Determine Fit Level
- If score >= 80: "Strong Fit"
- Else if score >= 50: "Moderate Fit"
- Else: "Limited Fit"

### Step 7: Generate Reasons
Extract 1-2 key signals from each category:
- From Financial: gap reason or sustainability reason
- From Lifestyle: affordability or income gap reason
- From Health: risk acknowledgment

Format each as: `{source: "Financial Readiness", reason: "Your plan does not yet achieve your retirement goal..."}`

## Update Triggers

**Calculation occurs when**:
- User navigates to `/dashboard/readiness-fit/` page
- Page loads, reads localStorage ONCE
- Engine called once at mount time
- Result persists for session

**No recalculation on**:
- Other tool updates (requires new page visit)
- Time passage
- User interactions within Readiness Fit page

**Result persistence**:
- Displayed result valid for current session
- Page refresh re-reads localStorage and recalculates

## Constraints & Limits

**Hard-coded values**:
- Fit level thresholds: 80 (strong), 50 (moderate)
- Category point ranges: A & B (0-33), C (0-34) for 100 total
- Health risk threshold: `depletionAge < 85` = high risk
- Color scheme: green (strong), amber (moderate), grey (limited)

**Calculation limits**:
- Score capped: 0-100 (min/max)
- Reason extraction: dynamic but limited to identified gaps only
- Achievement selection: selects only top signals, not all

**Dependencies**:
- Reads ONLY from three calculators
- Does NOT read from sprints, challenges, learning, or guidance systems
- Fails gracefully with empty calculator data (uses defaults)

**No historical tracking**: Does not save fit score changes over time


