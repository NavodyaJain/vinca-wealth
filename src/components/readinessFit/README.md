# Readiness Fit Feature

## Overview

The **Readiness Fit** feature answers a critical question for Vinca users:

> "How well does Vinca support your financial readiness needs — based on your actual retirement data?"

This is a **diagnostic fit score** (not eligibility checking, not paywall pressure, not generic upsell). It honestly evaluates how much Vinca's existing features can help reduce uncertainty in the user's retirement plan.

---

## Key Principles

1. **Data-Driven**: Uses actual outputs from Financial Readiness Calculator, Lifestyle Planner, Health Stress Test, and Sprint Participation
2. **Honest**: Allows low scores. Does not inflate scores to sell
3. **Non-Salesy**: Focuses on solving real problems, not pressure
4. **Calm & Trustworthy**: Precise language, no fear-based messaging
5. **Educational**: SEBI-compliant—for awareness and planning, not recommendations

---

## Scoring Model

**Total Score = 100 points** across 5 categories:

| Category | Points | Measures |
|----------|--------|----------|
| **A. Retirement Clarity** | 0–25 | Uncertainty about achieving retirement and sustaining through lifespan |
| **B. Lifestyle Confidence** | 0–25 | Gap between desired and affordable retirement lifestyle |
| **C. Health Robustness** | 0–25 | Healthcare cost impact and longevity uncertainty |
| **D. Execution Discipline** | 0–15 | Action taken (sprint participation, structured planning) |
| **E. Guidance Need** | 0–10 | Whether external guidance would help close gaps |

### Score Interpretation

- **80–100**: Strong Fit — "Vinca actively helps reduce real uncertainty in your plan."
- **50–79**: Moderate Fit — "Vinca helps strengthen specific weak areas in your plan."
- **< 50**: Limited Fit — "Your plan is largely on track. Vinca may be useful for optimization, not necessity."

---

## Category Scoring Details

### Category A: Retirement Clarity (0–25 pts)

Answers: "Can the user retire when planned? Will the corpus sustain?"

| Condition | Score | Signal |
|-----------|-------|--------|
| `isReady === false` | 25 | Retirement goal not achievable at target age |
| `isReady === true` AND `lifespanSustainability === false` | 15 | Plan reaches retirement but doesn't sustain lifespan |
| `isReady === true` AND `lifespanSustainability === true` | 5 | Plan is on track and sustainable |

### Category B: Lifestyle Confidence (0–25 pts)

Answers: "Can the user afford their desired lifestyle in retirement?"

| Condition | Score | Signal |
|-----------|-------|--------|
| Target tier >> affordable tier (2+ tiers apart) | 25 | Desired lifestyle significantly exceeds what plan supports |
| Monthly income required > income supported (>20% gap) | 15 | Lifestyle sustainability gap exists |
| Minor gap or fully aligned | 5–10 | Lifestyle is affordable or nearly so |

### Category C: Health Robustness (0–25 pts)

Answers: "How much does healthcare uncertainty threaten the plan?"

| Condition | Score | Signal |
|-----------|-------|--------|
| `healthRiskLevel === 'high'` OR significant health gap | 25 | Healthcare costs create major uncertainty |
| `healthRiskLevel === 'medium'` | 15 | Moderate healthcare risk |
| Survival age < expected lifespan | 20 | Health-adjusted longevity is short |
| Corpus gap > 10% due to health | 12 | Healthcare significantly reduces corpus |
| `healthRiskLevel === 'low'` | 5 | Healthcare impact manageable |

### Category D: Execution Discipline (0–15 pts)

Answers: "Is the user taking structured action to improve readiness?"

| Condition | Score | Signal |
|-----------|-------|--------|
| `hasStartedSprint === false` | 15 | No structured planning initiated |
| `hasStartedSprint === true` AND `completedSprintsCount === 0` | 10 | Sprint started but not completed |
| `completedSprintsCount > 0` | 5 | Sprints completed; discipline demonstrated |

### Category E: Guidance Need (0–10 pts)

Answers: "Would external guidance be valuable?"

| Condition | Score | Signal |
|-----------|-------|--------|
| Early retirement desired but `retirementAgeAchievable` is later | 10 | Manager guidance could help optimize for early retirement |
| `requiredSIP > currentSIP` AND limited surplus | 7 | SIP increase needed; guidance helps navigate |
| Multiple uncertainties (readiness + health) | 7 | Conflicting signals suggest guidance value |
| Plan mostly clear | 3 | Optimization guidance may help, not urgent |

---

## Input Data Structure

The component expects data in this shape:

```javascript
{
  financialReadiness: {
    isReady: boolean,
    retirementAgeAchievable: number,
    earlyRetirementGapYears: number,
    requiredSIP: number,
    currentSIP: number,
    surplusAvailable: number,
    lifespanSustainability: boolean,
    corpusAtRetirement: number,
    requiredCorpus: number,
  },
  lifestyle: {
    targetLifestyleTier: number,
    affordableLifestyleTier: number,
    monthlyIncomeRequired: number,
    monthlyIncomeSupported: number,
    lifestyleGap: number,
  },
  health: {
    healthAdjustedCorpus: number,
    baselineCorpus: number,
    monthlyHealthGap: number,
    survivalAge: number,
    healthRiskLevel: 'low' | 'medium' | 'high',
  },
  sprints: {
    hasStartedSprint: boolean,
    completedSprintsCount: number,
    activeSprintType: string,
  },
  preferences: {
    desiredRetirementAge: number,
    lifespan: number,
  },
}
```

All fields are optional. The engine uses safe defaults (nulls, 0s, false) for missing data.

---

## UI Structure

### 1. **Header**
- Title: "How well does Vinca support your financial readiness?"
- Subtitle: "Based on your actual retirement data (education-only)"

### 2. **Fit Score Card**
- Large circular score display (gradient color based on tier)
- Label: "Readiness Fit Score"
- Subtext: "Reflects how much Vinca helps reduce uncertainty in your plan"

### 3. **Why This Score (2–4 bullets)**
- Each bullet references an actual signal from user's data
- Examples:
  - "Your retirement plan does not fully sustain your expected lifespan."
  - "Your desired lifestyle exceeds what your current plan supports."
  - "Health costs reduce survivability beyond age 67."

### 4. **How Vinca Helps You (Feature Cards)**
Shows 2–3 most relevant features based on highest-scoring categories:

- **Feature Icon** + **Feature Name**
- **One-line description** of what it does
- **"This helps you because..."** — specific reason tied to actual data

Example:
> "**Health Stress Test**  
> See how healthcare costs impact your retirement corpus  
> *This helps you because*: Healthcare costs create significant uncertainty in your retirement plan."

### 5. **Honest Closing Message**
- **Strong fit**: "Vinca helps you make informed decisions without guesswork."
- **Moderate fit**: "Vinca supports specific areas where clarity and discipline matter."
- **Limited fit**: "Your plan is largely on track. Vinca may help with optimization, not necessity."

---

## Implementation Notes

### File Structure

```
src/
├── lib/
│   └── readinessFit.js                    # Pure calculation engine
├── components/
│   └── readinessFit/
│       └── ReadinessFitDashboard.jsx      # UI component
└── app/dashboard/
    └── readiness-fit/
        └── page.js                        # Page wrapper
```

### Key Functions

#### `calculateReadinessFitScore(data)`
- **Input**: Aggregated data object
- **Output**: Full result with score, fit level, signals, features, message
- **Side effects**: None (pure function)

#### `getScoreDisplay(score)`
- **Input**: Numeric score (0–100)
- **Output**: { score, color, label }
- Used for displaying the circular score

### Data Retrieval (Page Level)

The page (`readiness-fit/page.js`) attempts to retrieve data from localStorage:
- `financialReadinessResults`
- `lifestylePlannerResults`
- `healthStressResults`
- `sprintsProgress`
- `userPreferences`

In production, these could be fetched from a backend or context provider.

---

## Strict Constraints

❌ **Do NOT**:
- Invent new metrics or override calculator logic
- Use fear-based language ("You must..." "You could lose...")
- Hardcode messaging or outcomes
- Change submission handlers or data flow
- Inflate scores to sell features
- Make assumptions about missing data

✓ **DO**:
- Use actual data outputs as-is
- Allow low scores
- Explain reasoning with user's actual numbers
- Keep tone calm and trustworthy
- Distinguish uncertainty from bad outcomes

---

## Integration Checklist

- [ ] Verify Financial Readiness, Lifestyle Planner, Health Stress Test pages save results to localStorage
- [ ] Add "Readiness Fit" link to dashboard navigation
- [ ] Test with sample data sets (high score, low score, mixed)
- [ ] Verify feature card links work (should navigate to relevant tool)
- [ ] Check mobile responsiveness
- [ ] Validate no hardcoded thresholds leak through

---

## Testing Scenarios

### Scenario 1: Fully Ready (Score ~10–20)
- `isReady: true`, `lifespanSustainability: true`
- No lifestyle gap
- Low health risk
- Completed sprints
- **Expected message**: Limited Fit

### Scenario 2: Uncertain Retirement (Score ~70–85)
- `isReady: false`
- Medium lifestyle gap
- Medium health risk
- No sprints started
- **Expected message**: Moderate Fit

### Scenario 3: Complex Plan (Score ~80–95)
- `isReady: true` but `lifespanSustainability: false`
- Major lifestyle gap
- High health risk
- No sprints
- Early retirement desired
- **Expected message**: Strong Fit

---

## Future Enhancements

- Integration with context providers instead of localStorage
- Scenario comparison ("What if I save ₹5K more per month?")
- Historical tracking ("Score improved from 45 to 65 after completing sprints")
- Personalized action recommendations
- Integration with Elevate (manager) feature
- Export/share fit analysis

---

## References

- Financial Readiness Engine: `src/lib/financialReadiness/financialReadinessEngine.js`
- Lifestyle Planner: `src/lib/lifestylePlanner.js`
- Health Stress Test: `src/lib/healthStressEngine.js`
- Retirement Sprints: `src/lib/retirementSprintEngine.js`
