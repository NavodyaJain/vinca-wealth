# Retirement Sprints

## Feature Overview

Retirement Sprints tracks user progress through three time-based, SIP-discipline focused challenges: monthly (1 month), quarterly (3 months), and annual (12 months). Each sprint measures journey progress (months completed toward retirement) and corpus progress (savings toward required goal). Only one active sprint allowed at a time.

## Visible Outputs

- **You have covered [X]%**: Journey Completed percentage card showing progress toward retirement (months completed / total months × 100, capped at 100%)
- **You have built [X]%**: Corpus Progress percentage card showing savings progress (current corpus / required corpus × 100, capped at 100%)
- **You are currently focused on**: Active sprint card displaying sprint type (Monthly/Quarterly/Annual), start date, end date, and days remaining
- **You feel [X]/5**: Confidence meter showing user's self-assessed confidence across their completed sprint (scale 1-5 stars)
- **Financial Readiness Sprint section**: Display of sprint challenges with "Choose Mindset" action button for sprint-related challenges

## Inputs Used

**Data sources**:
- Current age, retirement age, required corpus, current corpus, monthly SIP from Financial Readiness form results
- Sprint state: active sprint data + completion history from localStorage (`vinca_retirement_sprints_v1`)

**Data ignored**: Journal entries, health data, learning progress, challenges, community activity.

## Calculation & Scoring Logic

### Step 1: Calculate Total Journey Months
`totalMonths = (retirementAge - currentAge) × 12`

### Step 2: Count Completed Sprint Months
Loop through completed sprints in history:
- Monthly sprint = +1 month
- Quarterly sprint = +3 months
- Annual sprint = +12 months

### Step 3: Calculate Journey Completed %
`journeyCompleted = min(100, round((completedMonths / totalMonths) × 100))`
Capped at 100%.

### Step 4: Calculate Corpus Progress %
`corpusProgress = min(100, round((currentCorpus / requiredCorpus) × 100))`
Capped at 100%.

### Step 5: Calculate Confidence Rating
- User self-assesses confidence on a 1-5 star scale upon completing each sprint
- KPI card displays the average confidence rating across all completed sprints: `averageConfidence = sum(allSprintRatings) / numberOfCompletedSprints`
- Rounded to nearest 0.5 for display (e.g., 4.2 → 4/5)

## Update Triggers

**Sprint creation triggered by**:
- User clicks "Start [Type] Sprint" button
- System checks no active sprint exists
- Sets start date to today
- Calculates end date based on type (+1/3/12 months)

**Sprint completion triggered by**:
- User clicks "Complete Sprint" button while sprint active
- Records completion timestamp
- Moves sprint from active to history
- Enables new sprint enrollment

**KPI recalculation triggered by**:
- Sprint start
- Sprint completion
- Page refresh (reads from localStorage)

**No Auto-triggers**:
- Sprints do NOT auto-complete on end date
- Manual completion required

## Constraints & Limits

**Hard-coded values**:
- Sprint types: monthly, quarterly, annual only
- Max active sprints: 1
- Min/max journey: 0%-100% (capped both ends)
- Min/max corpus: 0%-100% (capped both ends)
- Month counting: linear (monthly = 1, quarterly = 3, annual = 12)

**Data persistence**:
- Stored in localStorage (`vinca_retirement_sprints_v1`)
- Format: `{activeSprint, sprintHistory[]}`
- Survives page navigation and browser close
- No cloud sync
