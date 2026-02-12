# Learning Maturity Meter

## Feature Overview

Learning Maturity Meter tracks user progress through educational content via a points-based achievement system. Users earn fixed points for completing video series by difficulty level. Accumulated points unlock 10 progressive achievement levels displayed on a meter. Points are permanent and never decay.

## Visible Outputs

- **Three KPI cards**:
  - Total Learning Points (e.g., "125")
  - Latest Achievement (name + emoji badge + unlock threshold)
  - Next Achievement Progress (name + progress bar to next level + points remaining)
- **Achievement list** showing all 10 levels with:
  - Level name (e.g., "Consistent Learner")
  - Point threshold (e.g., "50 pts")
  - Lock/unlock status
  - Emoji badge
  - Description
- **Color scheme** changes based on achievement level (green → amber → blue gradient)

## Inputs Used

**Data source**: 
- Completed video series from user's learning activity
- Series difficulty: beginner, intermediate, advanced
- Persisted in localStorage under key `financialMaturity`

**Format**: `{ totalLearningPoints, completedSeries: [{seriesId, difficulty, pointsEarned}] }`

**Data ignored**: Journal, challenges, sprints, health data, community activity.

## Calculation & Scoring Logic

### Step 1: Determine Points Per Series
Look up series difficulty and award fixed points:
- Beginner = 10 points
- Intermediate = 20 points
- Advanced = 30 points

### Step 2: Add Points to Total
Check if series already completed (deduplication). If new:
- Add points to `totalLearningPoints`
- Record series in `completedSeries[]`

### Step 3: Map Total to Achievement Level
Iterate through 10 achievement levels in order. Find highest level where:
`totalLearningPoints ≥ pointsRequired`

Achievement levels (fixed):
1. First Step (10 pts)
2. Learning Starter (25 pts)
3. Consistent Learner (50 pts)
4. Knowledge Builder (75 pts)
5. Awareness Strong (100 pts)
6. Discipline Formed (150 pts)
7. Strategy Mindset (200 pts)
8. Financial Explorer (275 pts)
9. Advanced Learner (350 pts)
10. Financially Mature (450 pts)

### Step 4: Calculate Progress to Next Level
- Current level: highest unlocked
- Next level: current + 1 (or none if level 10)
- `pointsNeeded = next.threshold - totalPoints`
- `progressPercent = (earnedInThisRange / rangeSize) × 100` (capped at 99%)
- If level 10: `progressPercent = 100%`

### Step 5: Determine Unlock Status for All Levels
For each of 10 levels:
- `isUnlocked = totalPoints ≥ level.pointsRequired`

## Update Triggers

**Points earned when**:
- User marks video series completed via learning interface
- Difficulty determined from series metadata
- Checked against `completedSeries[]` to prevent duplicate points

**Achievement unlocked when**:
- SeriesCompleted triggers point addition
- Point total crosses achievement threshold
- Latest achievement updated automatically

**Meter refreshes on**:
- Page load (reads from localStorage)
- Series completion
- Manual page refresh

**No auto-triggers**:
- No time-based decay or expiration
- No loss of points
- No achievement re-locking

## Constraints & Limits

**Hard-coded values**:
- Point values: 10 / 20 / 30 (fixed per difficulty, no variation)
- Achievement levels: exactly 10 (not customizable)
- Point thresholds: 10, 25, 50, 75, 100, 150, 200, 275, 350, 450
- Color scheme: 3 progression stages (green → amber → blue)

**Data persistence**:
- Stored in localStorage (`financialMaturity`)
- No cloud sync
- No cross-device sync
- Survives page navigation and browser close

**Deduplication**:
- Each series only awards points once
- Already-completed series show 0 additional points

## What This Feature Does NOT Do

❌ Does not require quiz or knowledge assessment

❌ Does not provide difficulty recommendations based on profile

❌ Does not adjust point values based on performance


