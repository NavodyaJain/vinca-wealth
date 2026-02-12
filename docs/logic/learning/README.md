# Learning

## 1. Data Inputs

### Source: Learning progress tracking + Series/Content library
- **User interaction**: 
  - Series ID (series completed by user)
  - Difficulty level: "beginner", "intermediate", "advanced"
  - Completion status: completed vs. in-progress

### Series Metadata:
- Series definitions with:
  - ID: Unique identifier
  - Difficulty: One of three levels
  - Tags: Array of topic tags (e.g., "SIP", "Asset Allocation", "Tax")
  - Content count: Number of articles/videos in series

### Default Values:
- Initial progress:
  ```javascript
  {
    completedSeriesByLevel: {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    },
    completedSeries: []  // Array of completed series IDs
  }
  ```

---

## 2. Core Calculations

### A. Maturity Score Calculation

**Goal**: Calculate financial maturity based on completed series.

**Process**:

#### 1. Count completed series by difficulty level
```
completedBeginner = count of completed series with level "beginner"
completedIntermediate = count of completed series with level "intermediate"
completedAdvanced = count of completed series with level "advanced"
```

#### 2. Calculate maturity score from completions
```
beginnerScore = completedBeginner × 10     (0–30+ points, scale flexible)
intermediateScore = completedIntermediate × 15
advancedScore = completedAdvanced × 25

totalMaturityScore = beginnerScore + intermediateScore + advancedScore
  capped at 100
```

Example: 
- 2 beginner = 20 points
- 1 intermediate = 15 points
- 0 advanced = 0 points
- Total = 35/100

#### 3. Determine maturity level
```
if totalMaturityScore >= 80:
  maturityLevel = "Expert"
else if totalMaturityScore >= 50:
  maturityLevel = "Intermediate"
else if totalMaturityScore >= 20:
  maturityLevel = "Beginner"
else:
  maturityLevel = "Novice"
```

### B. Tag-Based Weighting

**Goal**: Track proficiency by topic area.

**Process**:
1. Aggregate tags from all completed series
2. Count tag frequency:
   ```javascript
   tagCounts = {
     "SIP": 3,
     "Asset Allocation": 2,
     "Tax Planning": 1,
     ...
   }
   ```
3. Weight by difficulty of series containing that tag:
   ```
   tagScore = (beginner_count × 1 + intermediate_count × 2 + advanced_count × 3)
   ```
4. Rank tags by weighted score

**Result**: Topic proficiency order (most to least covered).

### C. Completion Threshold Tracking

**Goal**: Track series completion for deduplication and progression gates.

**Process**:
1. Maintain `completedSeries` array (series IDs only)
2. On series completion:
   - Add series ID to array
   - Increment level-specific counter
   - Recalculate maturity score
3. Check for duplicates:
   - If series ID already in array, don't double-count

**Result**: `completedSeries` array with unique IDs; no duplicates.

---

## 3. Scoring Logic

**Multi-level scoring**:

| Metric | Formula | Max Value |
|--------|---------|-----------|
| Beginner Score | completedBeginner × 10 | 30+ |
| Intermediate Score | completedIntermediate × 15 | 45+ |
| Advanced Score | completedAdvanced × 25 | 25 |
| **Total Maturity** | Sum of above | **100** |

**Maturity Levels** (finite progression):
- **Getting Started**: 0 series completed
- **Awareness Builder**: 1+ beginner series (25% progress meter)
- **Decision Ready**: 1+ beginner AND 1+ intermediate (50% progress meter)
- **Strategy Confident**: 2+ intermediate OR 1+ advanced (75% progress meter)
- **Readiness Mature**: 1+ beginner AND 1+ intermediate AND 1+ advanced (100% progress meter)

**Maturity Meter**: Displays percentage based on maturity level name mapping (0%, 25%, 50%, 75%, 100%). Meter caps at 100% when user reaches "Readiness Mature".

### Achievement System

**Purpose**: Unlock badges and recognition for continuous learning beyond base maturity levels. Provides incentive for users to continue learning even after reaching 100% maturity.

**Achievement Unlock Logic**:

| Achievement | Emoji | Unlock Condition | Description |
|---|---|---|---|
| Bronze Learner | 🥉 | beginner >= 1 | Completed your first financial learning series |
| Silver Scholar | 🥈 | intermediate >= 2 | Mastered 2 intermediate financial topics |
| Gold Expert | 🥇 | advanced >= 3 | Achieved expertise in 3 advanced financial strategies |
| Comprehensive Master | 🏅 | beginner >= 2 AND intermediate >= 2 AND advanced >= 2 | Mastered multiple topics across all difficulty levels |
| Lifetime Learner | ⭐ | total >= 5 | Completed 5+ financial learning series |
| Advanced Pioneer | 🚀 | advanced >= 3 | Ventured deep into advanced financial planning |
| Knowledge Guardian | 👑 | total >= 10 | Completed 10+ financial learning series (you are a financial expert) |

**Achievements Array**: Multiple achievements can be unlocked simultaneously. Each achievement object contains:
```javascript
{
  id: "unique-achievement-id",
  name: "Achievement Name",
  emoji: "🏆",
  description: "Human-readable description",
  unlockedAt: "condition-description"
}
```

**Calculation**: Achievements are derived from completion counts in `completedSeriesByLevel` at render time. No separate storage needed—purely computed from existing progress data.

**Tag Proficiency Ranking**: Topics ranked by completion frequency and difficulty, displayed as ordered list.

---

## 4. State Machine / Lifecycle

### Lifecycle:
1. **User accesses Learning page** → Load progress from localStorage
2. **User completes series** → Trigger completion handler:
   - Add series ID to `completedSeries`
   - Increment level counter
   - Recalculate maturity score
3. **Score badge updated** → Display new maturity level
4. **Progress persisted** → Save to `financialMaturity` localStorage key

### Data Locked: 
- Completed series IDs cannot be "un-completed" without clearing entire progress
- Progress is cumulative; deduplication prevents double-counting same series

---

## 5. Persistence & Source of Truth

### localStorage Key:
- **`financialMaturity`**: Master learner progress object
  ```javascript
  {
    completedSeriesByLevel: {
      beginner: N,
      intermediate: N,
      advanced: N
    },
    completedSeries: ["series_1", "series_2", ...],
    updatedAt: ISO timestamp
  }
  ```

### File Ownership:
- **[hooks/useLearningProgress.js](../../src/hooks/useLearningProgress.js)** ← **AUTHORITATIVE**
  - Reading: `getInitialProgress()`
  - Updating: `markSeriesAsComplete()`
  - Calculating: Score derivation

### Components:
- Learning page/component (referenced in Investor Hub)
  - Displays maturity score
  - Shows completed series count
  - Lists topic proficiency

---

## 6. Output Values

### Primary Outputs:
- **`maturityLevel`**: "Getting Started", "Awareness Builder", "Decision Ready", "Strategy Confident", or "Readiness Mature" (string, categorical)
- **`maturityPercentage`**: 0, 25, 50, 75, or 100 (integer, based on maturity level)
- **`completedByLevel`**: 
  ```javascript
  {
    beginner: N,
    intermediate: N,
    advanced: N
  }
  ```

### Secondary Outputs:
- **`achievements`**: Array of unlocked achievement objects
  ```javascript
  [
    {
      id: "bronze-learner",
      name: "Bronze Learner",
      emoji: "🥉",
      description: "Completed your first financial learning series",
      unlockedAt: "beginner >= 1"
    },
    ...
  ]
  ```
  - Length varies from 0 to 7 achievements depending on user progress
  - Array is recalculated on each page load based on completion counts

- **`topicProficiency`**: Array of topics ranked by competency
  ```javascript
  [
    { topic: "SIP", frequency: 3, avgDifficulty: "intermediate" },
    { topic: "Asset Allocation", frequency: 2, avgDifficulty: "beginner" },
    ...
  ]
  ```
- **`nextSuggestedTopics`**: Topics user hasn't covered yet, recommended based on level

### Formatting Rules:
- Level: Plain text (no abbreviations)
- Percentage: 0–100 integer, displayed as "25%", "100%" etc.
- Achievement emoji: Unicode emoji character (🥉, 🏆, etc.)
- Achievement descriptions: Friendly, motivational tone

---

## 7. Edge Conditions

### Missing Data Behavior:
- **No progress saved**: All counts = 0, maturity = "Getting Started", achievements array = []
- **Corrupted localStorage**: Fallback to default state (no crash)

### First-Time User Behavior:
- **User hasn't completed any series**: 
  - maturityLevel = "Getting Started"
  - maturityPercentage = 0%
  - achievements = [] (empty; no badge unlocks)
  - Recommendations show all beginner topics

### Partial Completion Behavior:
- **User completes single beginner series**: 
  - maturityLevel updates to "Awareness Builder" (25%)
  - "Bronze Learner" achievement unlocks immediately
- **User completes 5 total series**:
  - "Lifetime Learner" achievement unlocks
  - Maturity level may be capped at "Readiness Mature" (100%), but achievements continue accumulating

### Known Limitations:
- **No time-based decay**: Old progress never "expires"; always cumulative
- **No module sequencing**: User can complete series in any order
- **No prerequisites**: No gating based on previous series (linear progression not enforced)
- **No difficulty adaptation**: Algorithm doesn't adjust recommendations based on user's recent completions
- **Static weighting**: Achievement unlock conditions are hardcoded, not configurable
- **No achievement persistence**: Achievements are computed on-demand from completion counts; not stored separately

---

## 8. File Ownership

### Logic / Hooks:
- **[hooks/useLearningProgress.js](../../src/hooks/useLearningProgress.js)** ← **AUTHORITATIVE**
  - `getInitialProgress()`
  - `markSeriesAsComplete(seriesId, difficultyLevel)`
  - `getMaturityLevel()` - returns level name (categorical)
  - `getMaturityLevelIndex()` - returns numeric index 0-4
  - `getMaturityDescription()` - returns friendly level description
  - `getAchievements()` - returns array of unlocked achievement objects
  - Score/achievement calculations

### Storage / Persistence:
- **localStorage key**: `financialMaturity`
  - Stores: `completedSeriesByLevel` (beginner, intermediate, advanced counts) + `completedSeries` array
  - Direct read/write from hook
  - Achievements NOT stored (computed on-demand)

### Pages/Components:
- **[app/dashboard/investor-hub/resources/page.js](../../src/app/dashboard/investor-hub/resources/page.js)**
  - Calls `getMaturityLevel()`, `getCompletedSeriesByLevel()`, `getAchievements()`
  - Passes data to FinancialMaturityCard

- **[components/investorHub/resources/FinancialMaturityCard.jsx](../../src/components/investorHub/resources/FinancialMaturityCard.jsx)**
  - Displays maturity meter (percentage + level name + color badge)
  - Accepts `maturityLevel`, `completedSeriesByLevel`, `achievements` props
  - Imports and renders AchievementBadges component

- **[components/investorHub/resources/AchievementBadges.jsx](../../src/components/investorHub/resources/AchievementBadges.jsx)** ← **NEW**
  - Renders grid of achievement badges (emoji + name + description)
  - Accepts `achievements` array prop
  - Displays motivational message: "Keep learning to unlock more achievements!"
  - Hover tooltips show full achievement descriptions

---

## Implementation Notes

**Pure accumulative scoring**: No subtraction or reset unless user manually clears progress.

**Deduplication prevents gaming**: Series IDs tracked to avoid double-counting.

**Achievement computation**: Achievements are derived from completion counts at render time—no separate persistence needed. This keeps localStorage lightweight and achievements always in sync with completion data.

**Achievement unlocking is immediate**: User sees new badges upon page reload after completing a series (no delay, no batch processing).

**Maturity meter caps at 100%**: Once user reaches "Readiness Mature", the percentage stays at 100% even if more series are completed. Achievements are the primary incentive for continued learning beyond this cap.
