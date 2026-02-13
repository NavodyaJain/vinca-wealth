# Readiness Fit PRD

## 1. Feature Overview

**Readiness Fit** diagnoses how well Vinca's features address a user's financial readiness needs. Located at `/dashboard/readiness-fit/`, it calculates a membership fit score (0-100) based on **gaps** identified in three calculators:

1. **Financial Readiness Gap**: Retirement timeline and SIP sustainability
2. **Lifestyle Gap**: Can corpus support desired spending throughout retirement?
3. **Health Sustainability Gap**: Do healthcare costs threaten retirement?

Only calculator outputs are used. Explicitly excludes sprints, learning, guidance, and Elevate data.

The feature answers: "How much would Vinca's tools and features help this user?"

---

## 2. User Journey (As Implemented)

1. **Entry**: User navigates to `/dashboard/readiness-fit/`
2. **Data Retrieval**: System loads calculator results from localStorage:
   - `financialReadinessResults`
   - `lifestylePlannerResults`
   - `healthStressResults`
3. **Calculation**: Score engine runs once, aggregating all three calculator gaps
4. **Display**: Shows:
   - Overall Fit Score (0-100)
   - Fit Level (No Fit / Moderate Fit / Strong Fit)
   - Three gap categories with visual breakdown
   - Why scores in each category
   - Recommended Vinca features for top 2-3 gaps
   - Closing message based on overall fit
5. **Exit**: View full calculators or explore recommended features

---

## 3. Visible Outputs

**Overall Score Card:**
- Large numeric score (0-100)
- Fit level badge (color-coded: red/yellow/green)
- Fit level label: "No Fit" / "Moderate Fit" / "Strong Fit"
- Subtitle: 1-line summary (e.g., "Vinca can help address your lifespan sustainability risk")

**Category Breakdown (3 Cards):**

**Category A - Financial Readiness Gap (max 33 points):**
- Icon/color: Blue
- Title: "Financial Readiness Gap"
- Score: X/33
- Key metrics:
  - Retirement Gap: Years difference between achievable age and target age
  - SIP Gap: ₹ amount insufficient
  - Corpus Gap: ₹ amount shortfall
- Signal: "Corpus gap of ₹5M means you need to save more or work longer"

**Category B - Lifestyle Gap (max 33 points):**
- Icon/color: Orange
- Title: "Lifestyle Gap"
- Score: X/33
- Key metrics:
  - Lifestyle Tier Gap: Difference between desired and affordable lifestyle
  - Income Gap: ₹ amount shortfall in monthly retirement income
- Signal: "Your retirement corpus supports ₹X/month but you need ₹Y/month for desired lifestyle"

**Category C - Health Sustainability Gap (max 34 points):**
- Icon/color: Red
- Title: "Health Sustainability Gap"
- Score: X/34
- Key metrics:
  - Corpus Impact: % reduction due to health costs
  - Depletion Age Gap: Years brought forward by health drain
  - Monthly Health Gap: ₹ amount reduction in monthly capacity
- Signal: "Healthcare costs reduce your corpus by X%, moving depletion from age 85 to 78"

**Recommended Features:**
- Show top 2-3 features based on highest gap score
- Each feature:
  - Feature name (e.g., "Sprints for Financial Readiness")
  - Why it helps (e.g., "Build consistency through progressive SIP increases")
  - Icon/CTA link to feature

**Closing Message:**
- Personalized based on fit level:
  - **No Fit** (score 0-25): "You're in good shape" / "Vinca is not essential"
  - **Moderate Fit** (score 26-60): "Vinca can help with specific areas"
  - **Strong Fit** (score 61-100): "Vinca's tools are highly relevant to your situation"

---

## 4. Inputs Used

**From Financial Readiness Calculator:**
- `isReady` (boolean)
- `retirementAgeAchievable` (age)
- `earlyRetirementGapYears` (years difference)
- `requiredSIP` (₹ amount)
- `currentSIP` (₹ amount)
- `surplusAvailable` (₹ amount after expenses)
- `lifespanSustainability` (boolean)
- `corpusAtRetirement` (₹ amount)
- `requiredCorpus` (₹ amount)
- `corpusGap` (₹ amount)

**From Lifestyle Planner:**
- `targetLifestyleTier` (1-10 scale)
- `affordableLifestyleTier` (1-10 scale)
- `monthlyIncomeRequired` (₹ amount)
- `monthlyIncomeSupported` (₹ amount)
- `lifestyleGap` (₹ amount)

**From Health Stress Test:**
- `healthAdjustedCorpus` (₹ amount after health drain)
- `baselineCorpus` (₹ amount without health drag)
- `depletionAge` (age when corpus runs out)
- `baselineDepletionAge` (age without health stress)
- `monthlyHealthGap` (₹ amount)
- `healthRiskLevel` (low/medium/high)

**Data Source:**
- localStorage keys: `financialReadinessResults`, `lifestylePlannerResults`, `healthStressResults`
- If missing: Treated as empty/zero (no error, graceful degradation)

**What Is Ignored:**
- Sprint status, completion, or progress
- Learning points or achievements
- Feedback or opinions submitted
- User guidance conversations
- Elevate booking or session history
- Premium subscription status
- User demographics (age, location, etc.)
- Risk tolerance or investment profile
- Market conditions or future returns

---

## 5. Calculations & Scoring Logic

### Category A: Financial Readiness Gap (0-33 points)

**Inputs:**
- Is user ready for target retirement age? (`isReady`)
- Gap to early retirement? (`earlyRetirementGapYears`)
- SIP gap? (`requiredSIP - currentSIP`)
- Lifespan sustainable? (`lifespanSustainability`)

**Scoring:**

| Condition | Points | Interpretation |
|-----------|--------|-----------------|
| isReady true + lifespan sustainable | 0 | No gap, fully ready |
| Corpus gap > 0, early retirement gap 5+ years | 23 | Moderate gap |
| Corpus gap > 0, early retirement gap 1-5 years | 15 | Small gap |
| SIP gap > 0, significant shortfall | 18 | Cannot retire at target age with current SIP |
| else (partial gaps or no data) | 8 | Baseline if unclear |

**Result:** Highest applicable score (0-33)

### Category B: Lifestyle Gap (0-33 points)

**Inputs:**
- Target lifestyle tier (`targetLifestyleTier`)
- Affordable lifestyle tier (`affordableLifestyleTier`)
- Monthly income required (`monthlyIncomeRequired`)
- Monthly income supported (`monthlyIncomeSupported`)

**Scoring:**

| Condition | Points | Interpretation |
|-----------|--------|-----------------|
| target > affordable, gap > ₹50K/month | 28 | Large lifestyle downgrade needed |
| target > affordable, gap ₹20-50K/month | 18 | Moderate lifestyle adjustment needed |
| target > affordable, gap < ₹20K/month | 10 | Minor lifestyle adjustment |
| target <= affordable | 0 | No gap, desired lifestyle sustainable |

**Result:** Score (0-33)

### Category C: Health Sustainability Gap (0-34 points)

**Inputs:**
- Corpus reduction % (`(baselineCorpus - healthAdjustedCorpus) / baselineCorpus`)
- Depletion age brought forward (`baselineDepletionAge - depletionAge`)
- Monthly health gap (`monthlyHealthGap`)

**Scoring:**

| Condition | Points | Interpretation |
|-----------|--------|-----------------|
| Corpus reduction > 35% | 28 | High health impact |
| Depletion age brought forward >10 years | 23 | Significant longevity risk |
| Corpus reduction 15-35% | 18 | Moderate health impact |
| Monthly health gap > ₹30K | 15 | Substantial monthly healthcare drain |
| Corpus reduction < 15% | 12 | Low health impact |

**Result:** Highest applicable score (0-34)

### Overall Fit Score

**Formula:**
```
Total Score = Category A + Category B + Category C
Scale: 0-100 (normalized)
```

**Fit Level:**
- 0-25: **No Fit** (user in good shape, Vinca not necessary)
- 26-60: **Moderate Fit** (Vinca can help with specific gaps)
- 61-100: **Strong Fit** (Vinca highly relevant to address gaps)

---

## 6. Progress & State Transitions

**Data Persistence:**
- Calculation runs once on page load
- Result cached in component state (not localStorage)
- If user updates calculator data, must return to Readiness Fit page to recalculate

**Recalculation Triggers:**
- Page load (automatic)
- User navigates back from other calculators

**No Transitions:**
- Readiness Fit is read-only diagnostic
- Does not block feature access
- Does not modify user state
- No enrollment or onboarding flow triggered

---

## 7. Constraints & Limits

**Hard Limits:**
- Score: 0-100 only
- Fit level: 3 categories only
- Max 3 recommended features displayed
- All three calculator results must be loaded (missing data degrades gracefully)

**Category Point Caps:**
- Category A: 33 points maximum
- Category B: 33 points maximum
- Category C: 34 points maximum (total = 100)

**No Thresholds:**
- Score does not trigger enrollment or paywalls
- Score does not restrict feature access
- Vinca available to all users regardless of fit

---

## 8. What This Feature Does NOT Do

- **No Recommendations**: Does not recommend specific funds or investments
- **No Action Items**: Does not prescribe SIP increases or spending cuts
- **No Personalized Plan**: Does not create a custom retirement plan
- **No Enrollment Trigger**: Does not auto-enroll user in Vinca or charge fees based on score
- **No Advice**: Educational only, no fiduciary guidance
- **No Predictions**: Does not forecast market returns or life events
- **No Sensitivity Analysis**: Does not show "what if" scenarios
- **No Comparison**: Does not compare user to others or benchmarks
- **No Scoring of Sprints**: Sprints explicitly excluded from fit calculation
- **No Scoring of Learning**: Learning progress explicitly excluded
- **No Risk Tolerance Assessment**: Does not measure investor profile or appetite
- **No Integration with Other Pages**: Score does not affect features, pricing, or access
- **No Persistence Across Sessions**: Calculation re-runs on each page load
- **No Notifications**: Does not send alerts if score changes

---

## 9. Data Integration

**Consumes From:**
- Financial Readiness (calculator output and gap metrics)
- Lifestyle Planner (lifestyle gap and income projection)
- Health Stress Test (health-adjusted corpus and depletion age)

**Provides To:**
- No other features depend on Readiness Fit output
- Readiness Fit is terminal analysis (not used to trigger downstream changes)

**Explicitly Excluded:**
- Sprints (sprint completion does NOT affect fit score)
- Learning (points and achievements NOT used)
- Membership (fit score does NOT trigger purchase recommendation or blocking)
- User guidance (no behavioral data used)

---

## 10. Scoring Example

**User Scenario:**

| Data Point | Value |
|------------|-------|
| **Financial Readiness** | |
| Target Retirement Age | 60 |
| Achievable Retirement Age | 65 |
| Early Retirement Gap | 5 years |
| Expected Corpus | ₹4,000,000 |
| Required Corpus | ₹5,000,000 |
| Corpus Gap | -₹1,000,000 shortfall |
| SIP Gap | ₹15,000/month insufficient |
| Lifespan Sustainable | NO |
| **Lifestyle** | |
| Target Tier | 7/10 |
| Affordable Tier | 4/10 |
| Monthly Income Required | ₹80,000 |
| Monthly Income Supported | ₹50,000 |
| Lifestyle Gap | ₹30,000/month |
| **Health** | |
| Baseline Corpus | ₹5,000,000 |
| Health-Adjusted Corpus | ₹4,300,000 |
| Corpus Reduction | 14% |
| Baseline Depletion | 85 |
| Health-Stressed Depletion | 82 |
| Age Gap Brought Forward | 3 years |

**Score Calculation:**

```
Category A (Financial):
  - Corpus gap > 0, years gap = 5  → 23 points
Category B (Lifestyle):
  - Target > affordable, gap ₹30K  → 28 points
Category C (Health):
  - Corpus reduction 14% < 15%     → 12 points

Total: 23 + 28 + 12 = 63 points
Fit Level: STRONG FIT (61-100)
```

**Outputs:**
- Overall Score: **63/100**
- Fit Level: **Strong Fit**
- Message: "Vinca's tools are highly relevant. Address the corpus and lifestyle gaps through disciplined SIP growth and expense management. Health risks are manageable but monitor."
- Recommended Features:
  1. **Sprints** → Build consistent SIP discipline to close ₹15K monthly gap
  2. **Lifestyle Planner** → Model spending flexibility to close ₹30K monthly income gap  
  3. **Health Stress Test** → Monitor healthcare costs (currently 14% corpus impact, manageable)
