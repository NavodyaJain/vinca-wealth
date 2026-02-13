# Learning (Investor Hub Resources) PRD

## 1. Feature Overview

**Learning** is a points-based video course system accessible at `/dashboard/investor-hub/resources/`. Users watch video series (organized by modules), earn points per series completion, and unlock achievement levels. The **Financial Maturity Meter** displays total points, latest unlocked achievement, and progress to next achievement.

The feature answers: "How much financial knowledge has the user gained?"

---

## 2. User Journey (As Implemented)

1. **Entry**: User navigates to `/dashboard/investor-hub/resources/`
2. **Browse**: See grid of video series (categorized by difficulty: Beginner, Intermediate, Advanced)
3. **Select Series**: Click series card → navigate to `/dashboard/investor-hub/resources/video-series/[seriesId]`
4. **View Series**: See modules (chapters) and video list with completion status
5. **Watch Video**: Click video → embedded player, mark as "complete" when done
6. **Series Completion**: After all videos completed → Achievement check
7. **Achievement Unlock**: If points cross threshold, toast notification shows new achievement unlocked
8. **Maturity Score Display**: Financial Maturity Meter shows updated total points, achievement, progress bar
9. **Repeat**: User can continue watching more series
10. **Exit**: Navigate to other resources or Investor Hub features

---

## 3. Visible Outputs

**Financial Maturity Meter Card (KPI-style):**
- **KPI 1**: Total Learning Points (numeric, e.g., "120 points")
- **KPI 2**: Latest Achievement Unlocked (e.g., "Knowledge Builder" with icon/badge)
- **KPI 3**: Progress to Next Achievement (circular progress bar, 0-100%)

**Series Grid:**
- Card per series showing:
  - Series title
  - Difficulty badge (Beginner/Intermediate/Advanced)
  - Tags (e.g., "Retirement", "SIP")
  - Description (1-2 lines)
  - Progress indicator (if in progress)
  - Status badge ("Not Started", "In Progress", "Completed")

**Series Detail Page:**
- Module Accordion (expandable by chapter)
- Video list within each module:
  - Checkbox (completed/not completed)
  - Video title and duration
  - Playback indicator
- Achievement Contribution Hint (shows points this series will earn)
- Video Player (when video selected)
- Completion Modal (when series finishes)

**Achievement Toast (Temporary):**
- Appears when new achievement unlocked
- Shows achievement name, icon, and unlock message
- Auto-dismisses after 4-5 seconds

---

## 4. Inputs Used

**User Actions:**
- Series Selection: Click to view details
- Video Playback: Play video (timestamps tracked, not required to watch full)
- Mark Complete: Click "Mark as Complete" or auto-mark on video end

**Video Series Data (Static):**
- `videoSeries` array from `/data/investorHub/resourcesData.js`
- Each series: id, title, difficulty, description, modules[], tags
- Each module: title, videos[]
- Each video: videoId, title, duration, content/URL

**User Progress State (localStorage):**
- Key: `financialMaturity`
- Stores:
  - `totalLearningPoints` (cumulative, never decreases)
  - `completedSeries` (array of {seriesId, difficulty, pointsEarned})

**What Is Ignored:**
- Video watch time or percentage viewed (completion is binary)
- Quiz or assessment results
- Comments or community interaction
- Save later / bookmarking (not implemented)
- Download or offline access
- Preferred playback speed
- Closed captions or transcript interaction
- Device type or screen size optimization

---

## 5. Calculations & Scoring Logic

### Points Per Series Completion

**Fixed Points by Difficulty:**
- **Beginner**: +10 points
- **Intermediate**: +20 points
- **Advanced**: +30 points

**Rules:**
- Points awarded once per series (deduplication by seriesId)
- Completing same series twice = points awarded only once
- Achievement unlocks are permanent (never lock again)

### Achievement Levels

**10 Progressive Milestones (Points-Required):**

| Level | Achievement | Points Required | Description |
|-------|-------------|-----------------|-------------|
| 1 | First Step | 10 | Begin your learning journey |
| 2 | Learning Starter | 25 | Build initial momentum |
| 3 | Consistent Learner | 50 | Demonstrate learning consistency |
| 4 | Knowledge Builder | 75 | Expand your financial knowledge |
| 5 | Awareness Strong | 100 | Develop strong financial awareness |
| 6 | Discipline Formed | 150 | Apply disciplined learning approach |
| 7 | Strategy Mindset | 200 | Think strategically about finances |
| 8 | Financial Explorer | 275 | Explore advanced financial topics |
| 9 | Advanced Learner | 350 | Master advanced concepts |
| 10 | Financially Mature | 450 | Achieve comprehensive financial maturity |

**Unlock Logic:**
- Achievement unlocks when `totalLearningPoints >= pointsRequired`
- Unlocks are permanent; user stays unlocked even if points stayed same
- User can see all achievements, locked and unlocked

### Latest Achievement

**Definition**: Highest-level achievement currently unlocked

**Calculation:**
- Sort achievements by level (ascending)
- Find first achievement where `totalLearningPoints >= pointsRequired`
- Return that achievement

### Progress to Next Achievement

**Calculation:**
- Find next locked achievement (first one not yet reached)
- If all unlocked: progress = 100%, message = "All achieved!"
- If none unlocked: progress = (totalLearningPoints / firstLevelRequired) × 100%
- Otherwise: progress = (totalLearningPoints - previousLevelRequired) / (nextLevelRequired - previousLevelRequired) × 100%
- Rounded to whole percentage

---

## 6. Progress & State Transitions

**Data Persistence:**
- Stored in localStorage key `financialMaturity`
- Synced on every series completion
- Persists across sessions (user returns and sees same points)

**Recalculation Triggers:**
- Series completion (immediate update to totalLearningPoints)
- Page load (restores from localStorage)

**State Changes:**
- Beginner → ...→ Financially Mature (one-way progression, no regression)
- Completed series cannot be uncompleted (no removal from `completedSeries`)

**Notifications:**
- Toast appears when new achievement unlocked
- No notifications for series completion without achievement unlock
- No reminder notifications for unwatched series

---

## 7. Constraints & Limits

**Hard Limits:**
- Maximum 10 achievement levels (not extensible without code change)
- Points always increment (no point loss mechanism)
- Series completion is all-or-nothing (must complete all videos in module)
- No partial credit for partial series completion

**Display Limits:**
- Maturity Meter displays total points (no upper cap shown)
- Progress bar maxes at 100% (even if points exceed next achievement)
- Achievement name limited to ~30 characters display width

**Non-Reversible Actions:**
- Series marked complete → Cannot be unmarked
- Points acquired → Cannot be reset or removed

---

## 8. What This Feature Does NOT Do

- **No Quizzes or Assessments**: Does not test knowledge with questions or exams
- **No Certificates**: Does not issue downloadable or shareable certificates
- **No Progression Requirements**: Watching videos in any order (no prerequisites)
- **No Content Gating**: All series visible regardless of points (premium not blocked)
- **No Personalization**: Recommendations not based on user's financial situation
- **No Spaced Repetition**: Does not suggest reviewing past series
- **No Discussion/Community**: No comments, Q&A, or user forums
- **No Bookmarking or Playlists**: Cannot save or group series for later
- **No Analytics for User**: Does not show watch time, days since completion, or learning gaps
- **No Coaching or Feedback**: No instructor interaction or personalized guidance
- **No Adaptive Learning**: Content difficulty same for all users regardless of background
- **No Download/Offline**: Requires internet connection, no offline playback
- **No Point Decay**: Points never decrease over time
- **No Rewards or Prizes**: Achievements are badges only, no unlocks for tools or features

---

## 9. Data Integration

**Consumes From:**
- Static video catalog (`videoSeries` data)
- User identity (localStorage, no auth required)

**Provides To:**
- Investor Hub Resources page (displays maturity meter)
- No other features use learning points directly
- Readiness Fit does NOT use learning data (explicitly excluded)

**Storage:**
- Saved to localStorage `financialMaturity`
- Not synced to backend (session-local only)

---

## 10. Progression Example

**User Journey:**

| Action | Series | Difficulty | Points Earned | Total Points | Achievement Unlocked |
|--------|--------|------------|---------------|--------------|----------------------|
| Watch Series 1 | Retirement Basics | Beginner | +10 | 10 | First Step ✓ |
| Watch Series 2 | SIP Planning | Beginner | +10 | 20 | — |
| Watch Series 3 | Conservative Investing | Beginner | +10 | 30 | — |
| Watch Series 4 | Tax Strategies | Intermediate | +20 | 50 | Consistent Learner ✓ |
| Watch Series 5 | Lifestyle Planning | Intermediate | +20 | 70 | — |
| Watch Series 6 | Advanced Equity | Intermediate | +20 | 90 | — |
| Watch Series 7 | Healthcare Costs | Intermediate | +20 | 110 | — |
| Re-Watch Series 1 | Retirement Basics | Beginner | +0 | 110 | — (already counted) |
| Watch Series 8 | Risk Management | Advanced | +30 | 140 | Knowledge Builder ✓ |

**Maturity Meter Display (at 140 points):**
- Total Points: 140
- Latest Achievement: Knowledge Builder
- Next Achievement: Awareness Strong (needs 100, has 140, > 100, so already unlocked)
- Progress: 140/150 = 93% toward Discipline Formed
- Display: Shows "93% to Discipline Formed" on progress bar
