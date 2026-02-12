# Learning

---

## 1. Feature Purpose

The Learning feature tracks user progress through financial education video series and awards points based on series completion. Points accumulate over time and unlock achievement levels that reflect learning consistency and depth. The system provides transparent feedback: watch videos → earn points → unlock achievements → see progress.

---

## 2. What Inputs Are Used

**From User Actions**:
- **Series completion** — User finishes all videos in a series
- **Series difficulty** — One of three: Beginner, Intermediate, or Advanced

**From System**:
- **Completed series tracking** — Array of series IDs already completed (prevents duplicate points)
- **Total accumulated points** — Sum from all previously completed series

---

## 3. How the Score / Number Is Built

### Step 1: Award Points for Completed Series

When user completes all videos in a series, points are awarded based only on difficulty:
- **Beginner series** → +10 points (awarded once per series)
- **Intermediate series** → +20 points (awarded once per series)
- **Advanced series** → +30 points (awarded once per series)

Example: User completes 1 beginner series = 10 points. User then completes 1 intermediate series = 20 additional points. Total = 30 points.

### Step 2: Accumulate Total Learning Points

Sum all points from completed series (deduplication prevents counting same series twice):
$$\text{Total Learning Points} = \sum \text{points from all unique completed series}$$

Example: If user has completed 2 beginner (20 pts), 1 intermediate (20 pts), and 0 advanced (0 pts) = 40 total points.

### Step 3: Unlock Achievements at Point Thresholds

Achievements unlock automatically when total points reach defined thresholds (10 levels):

| Achievement Level | Points Required | Name |
|---|---|---|
| 1 | 10 | First Step |
| 2 | 25 | Learning Starter |
| 3 | 50 | Consistent Learner |
| 4 | 75 | Knowledge Builder |
| 5 | 100 | Awareness Strong |
| 6 | 150 | Discipline Formed |
| 7 | 200 | Strategy Mindset |
| 8 | 275 | Financial Explorer |
| 9 | 350 | Advanced Learner |
| 10 | 450 | Financially Mature |

Once an achievement is unlocked at a point threshold, it remains unlocked permanently.

### Step 4: Calculate Next Achievement Progress

For users below level 10 (not all achievements unlocked):
- Determine the next locked achievement threshold
- Calculate progress: (Current Points / Next Threshold) × 100%

Example: User has 120 points. Next achievement (Discipline Formed) requires 150 points. Progress = (120 / 150) × 100% = 80%.

---

## 4. What the Score Means

**Total Learning Points** (accumulating number):
- Reflects the cumulative effort and breadth of financial learning
- Higher points = more series completed at higher difficulty levels
- No upper limit; points continue accumulating as more series are learned

**Achievement Level** (10 levels):
- Marks milestone progress through learning journey
- Each level represents increasing engagement and depth
- Example: "Awareness Strong" (Level 5) = achieved 100+ points, indicating consistent learning across series

**Latest Achievement** (most recent unlock):
- Shows the highest achievement currently unlocked
- Displayed with achievement name, milestone number, and emoji icon
- Persists permanently once unlocked

**Next Achievement Progress** (progress bar):
- Shows how many more points needed to unlock next achievement
- Displays both current and target points (e.g., "120 / 150 pts")
- Includes thin linear progress bar for visual clarity
- Auto-hides when all 10 achievements are unlocked

---

## 5. What the Score Does NOT Mean

- **Does NOT measure expertise** — Point totals reflect completion volume, not knowledge depth or competency
- **Does NOT predict financial readiness** — Learning points are independent of retirement corpus, affordability, or financial security assess menus
- **Does NOT measure understanding** — System counts series completion; does not assess comprehension or knowledge retention
- **Does NOT rank users** — No leaderboards, comparisons, or ranking against other users
- **Does NOT include time factor** — Old completions count equally with recent completions; no time-decay or recency weighting
- **Does NOT require series sequence** — User can complete series in any order; no prerequisites or learning path enforced
- **Does NOT gamify behavior** — Achievements are transparent progress milestones, not reward mechanics; no urgency, streaks, or competitive pressure
- **Does NOT guarantee learning outcomes** — Completing series does not guarantee financial decision-making quality or positive outcomes

---

## 6. Boundaries & Constraints

- **Points awarded once per series** — Same series cannot earn points twice; deduplication prevents duplicate rewards
- **Fixed points per difficulty** — Beginner = 10 pts, Intermediate = 20 pts, Advanced = 30 pts; not customizable or variable
- **10 fixed achievement levels** — Achievement thresholds are hardcoded: 10, 25, 50, 75, 100, 150, 200, 275, 350, 450 points
- **No point decay or expiration** — Points never expire or decrease; cumulative only
- **Local storage only** — All progress stored in browser; not synced to server or available across devices
- **No partial series credit** — Series completion is binary (all-or-nothing); no credit for partially watched series
- **No topic-based tracking** — System does not track which financial topics user has learned; only counts series completion
- **Linear achievement progression** — Must reach point threshold to unlock; no alternative paths or bonus multipliers
- **No catch-up mechanics** — Users who complete series late receive same points as those who completed early

---

**Document Version**: 1.0  
**Last Updated**: February 2026
