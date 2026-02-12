# Retirement Sprints

## 1. Data Inputs

### Source: User sprint creation + Financial Readiness data
- **Sprint type**: One of three options:
  - `monthly`: 1-month sprint (30-31 days)
  - `quarterly`: 3-month sprint
  - `annual`: 12-month sprint
- **User data** (from Financial Readiness):
  - `currentAge`: Current age (years)
  - `retirementAge`: Target retirement age (years)
  - `currentCorpus`: Current savings (₹)
  - `requiredCorpus`: Target corpus (₹)
  - `monthlySIP`: Current monthly SIP (₹)

---

## 2. Core Calculations

### A. Active Sprint Tracking

**Goal**: Maintain exactly one active sprint at a time.

**Process**:
1. **Start sprint**: Create sprint object with:
   - `type`: "monthly", "quarterly", or "annual"
   - `startDate`: Current ISO timestamp
   - `endDate`: Calculated based on type:
     - monthly: startDate + 1 month
     - quarterly: startDate + 3 months
     - annual: startDate + 12 months
   - `status`: "in_progress"
2. **Store in localStorage**: `vinca_retirement_sprints_v1`
3. **Prevent overlaps**: Check before starting; error if sprint already active

**Result**: `activeSprint` object in storage.

### B. Sprint Completion

**Goal**: Move active sprint to history and reset active sprint.

**Process**:
1. Verify active sprint exists
2. Mark status as "completed"
3. Record `completedAt`: Current ISO timestamp
4. Push to `sprintHistory` array
5. Clear `activeSprint` field (set to NULL)

**Result**: Sprint moves from active to history; new active sprint can be started.

### C. KPI Calculation (Journey Completion & Corpus Progress)

**Goal**: Calculate retirement readiness metrics based on completed sprints.

**Inputs**:
- `sprintHistory`: Array of completed sprints
- `user.retirementAge`: Target retirement age
- `user.currentAge`: Current age
- `user.requiredCorpus`: Corpus goal (₹)
- `user.currentCorpus`: Current savings (₹)

**Process**:

#### 1. Journey Completion Percentage
```
completedMonths = sum of months from all completed sprints:
  - monthly sprint = 1 month
  - quarterly sprint = 3 months
  - annual sprint = 12 months

totalMonths = (retirementAge - currentAge) × 12

journeyCompleted = (completedMonths / totalMonths) × 100%
  (capped at 100%)
```

Example: 30 months of completed sprints ÷ 360 months total = 8.3% journey.

#### 2. Corpus Progress Percentage
```
corpusProgress = (currentCorpus / requiredCorpus) × 100%
  (capped at 100%)
```

Example: ₹50L saved ÷ ₹1Cr required = 50% progress.

#### 3. Delta (Change from Previous Sprint)
```
delta = journeyCompleted_now - journeyCompleted_previous

prevCompleted = sum of months from all but the most recent sprint
prevJourney = (prevCompleted / totalMonths) × 100%
delta = journeyCompleted - prevJourney
```

Indicates month(s) gained from completing most recent sprint.

---

## 3. Scoring Logic

**Not applicable** — Sprints produce progress metrics, not a score.

**Output metrics**:
- `journeyCompleted`: 0–100, represents % of time to retirement
- `corpusProgress`: 0–100, represents % of corpus target
- `delta`: Integer, months gained from last sprint

---

## 4. State Machine / Lifecycle

### States:
1. **No active sprint** (initial or after completion)
2. **Sprint in progress** (active sprint exists)
3. **Sprint completed** (moved to history)

### Transitions:

```
[No Active Sprint] 
  → startSprint(type) 
    → [Sprint In Progress]

[Sprint In Progress] 
  → completeSprint() 
    → [No Active Sprint] (new sprint can start)
```

### Data Written at Each Transition:

**On startSprint()**:
- Create new sprint object in `activeSprint`
- Lock out ability to start another sprint

**On completeSprint()**:
- Move sprint to `sprintHistory`
- Clear `activeSprint`
- KPIs recalculated (delta updated)

**Locked states**: 
- Cannot modify active sprint end date mid-sprint
- Cannot delete active sprint without completing it first

---

## 5. Persistence & Source of Truth

### localStorage Key:
- **`vinca_retirement_sprints_v1`**: Master state object containing:
  ```javascript
  {
    activeSprint: { type, startDate, endDate, status },
    sprintHistory: [{ type, startDate, endDate, status, completedAt }, ...]
  }
  ```

### File Ownership:
- **[lib/retirementSprintEngine.js](../../src/lib/retirementSprintEngine.js)** ← **AUTHORITATIVE**
  - `getActiveSprint()`
  - `startSprint()`
  - `completeSprint()`
  - `getSprintKPIs()`
  - `getSprintHistory()`
  - `loadState()`
  - `saveState()`

### Components:
- **[components/MonthlySprintExecution.jsx](../../src/components/MonthlySprintExecution.jsx)** ← Monthly view
- **[components/QuarterlySprintExecution.jsx](../../src/components/QuarterlySprintExecution.jsx)** ← Quarterly view
- **[components/AnnualSprintExecution.jsx](../../src/components/AnnualSprintExecution.jsx)** ← Annual view
- **[components/ViewSprintPage.jsx](../../src/components/ViewSprintPage.jsx)** ← Primary UI

---

## 6. Output Values

### Primary Outputs (from getSprintKPIs):
- **`journeyCompleted`**: 0–100 (%)
- **`corpusProgress`**: 0–100 (%)
- **`delta`**: Integer, months gained from previous sprint
- **`activeSprint`**: Current sprint object or NULL

### Secondary Outputs (from getSprintHistory):
- **`sprintHistory`**: Array of completed sprint objects with:
  - `type`: "monthly", "quarterly", or "annual"
  - `startDate`: ISO timestamp
  - `endDate`: ISO timestamp
  - `status`: "completed"
  - `completedAt`: ISO timestamp

### Formatting Rules:
- Percentages: Whole numbers (e.g., 50%)
- Dates: ISO 8601 format (internal), displayed as "DD MMM YYYY" (UI)
- Months/Duration: Integer

---

## 7. Edge Conditions

### Missing Data Behavior:
- **No active sprint**: `activeSprint` = NULL
- **Empty sprint history**: `journeyCompleted` = 0%
- **No Financial Readiness data**: Uses fallback values (journey assumes 360 months to retirement at age 60)

### First-Time User Behavior:
- **User has no sprints**: All metrics = 0%
- **User starts first sprint**: Can see active sprint but delta = 0 (no previous sprint)

### Partial Completion Behavior:
- **User starts sprint but doesn't complete**: Sprint remains in `activeSprint`
- **User prevents starting new sprint**: Error message shown; must complete existing sprint first

### Known Limitations:
- **Only one active sprint allowed**: Queue/multiple sprints not supported
- **No pause/resume functionality**: Sprint must be completed or abandoned
- **No partial credit**: Sprint completion is binary (all-or-nothing)
- **Date boundaries are fixed**: Sprint end date cannot be modified mid-sprint
- **No skip functionality**: Cannot skip a sprint; must start → complete sequence

---

## 8. File Ownership

### Logic / Engines:
- **[lib/retirementSprintEngine.js](../../src/lib/retirementSprintEngine.js)** ← **AUTHORITATIVE**
  - `getActiveSprint()`
  - `startSprint(type, user)`
  - `completeSprint()`
  - `getSprintKPIs(user)`
  - `getSprintHistory()`
  - State management (`loadState()`, `saveState()`)

### Pages:
- **[app/dashboard/sprints/page.js](../../src/app/dashboard/sprints/page.js)**

### Components:
- **[components/ViewSprintPage.jsx](../../src/components/ViewSprintPage.jsx)** ← Primary UI
- **[components/MonthlySprintExecution.jsx](../../src/components/MonthlySprintExecution.jsx)** ← Monthly variant
- **[components/QuarterlySprintExecution.jsx](../../src/components/QuarterlySprintExecution.jsx)** ← Quarterly variant
- **[components/AnnualSprintExecution.jsx](../../src/components/AnnualSprintExecution.jsx)** ← Annual variant

---

## Implementation Notes

**KPI updates ONLY after sprint completion**: Metrics are not recalculated mid-sprint.

**Delta calculation is retroactive**: Compares current sprint completion against all previous sprints.

**localSt age is single source of truth**: No server sync; browser-based only.

**Time calculation is calendar-based**: Actual elapsed days don't matter; only sprint type duration.
