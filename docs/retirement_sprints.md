# Retirement Sprints PRD

## 1. Feature Overview

**Retirement Sprints** are time-bound execution programs designed to build financial discipline through consistent action. Located at `/dashboard/challenges/`, there are three sprint types:

- **Monthly SIP Kickstart**: One-time, 1-month program to execute first SIP and confirm comfort level
- **Quarterly SIP Discipline**: 3-month program with monthly SIP execution.
- **Annual Retirement Consistency**: 12-month program with quarterly discipline tracking

Only one sprint is active at a time. Monthly cannot be restarted. Monthly completion triggers transition to Quarterly or Annual.

---

## 2. User Journey (As Implemented)

### Monthly Kickstart Flow:
1. **Entry**: User clicks "Start Monthly SIP Kickstart" on challenges page
2. **Sprint Active**: Status becomes "active", start/end dates set (exactly 1 month)
3. **Execution**: User confirms SIP execution and comfort level (1 question form)
4. **Completion**: Monthly marked "completed", shows transition card (2 button options)
5. **Decision**: User selects "Quarterly Sprint" or "Annual Sprint"
6. **Lock & Transition**: Monthly locked (cannot restart), selected sprint initialized with today as start date
7. **Redirect**: Navigate to new sprint page

### Quarterly / Annual Flow:
1. **Entry**: User selects Quarterly or Annual from landing page
2. **Sprint Active**: Calendar shows months/quarters, current one opens, others locked
3. **Monthly/Quarterly Units**: Each month (quarterly) or quarter (annual) shows reflection form:
   - "Did I do my SIP?" (yes/no toggle)
   - "How comfortable?" (1-5 scale, only if yes)
4. **Save Progress**: User confirms → unit marked "completed"
5. **Progress**: Completed units show summary (collapsed view)
6. **All Complete**: Final completion card shown with next sprint option or archive
7. **Transitions**: Can move to next sprint level only after full completion

### Sprint Stop Flow (When User Clicks "No"):
1. **User Selection**: User answers "No" to "Did I do my SIP?" and saves
2. **Sprint Stops**: Sprint status changes to "stopped" (not completed)
3. **Stop Message**: "Oops, your sprint got stopped" card appears with options
4. **Option 1 - Continue from Next Month**:
   - Sprint automatically restarts from the next month
   - Start date: Current sprint end date + 1 day
   - End date: Recalculated based on sprint type (1/3/12 months)
   - Status: "active" (fresh start)
   - All previous units cleared
   - Corpus and Journey metrics automatically recalculate based on new dates
5. **Option 2 - Pick a Start Date**:
   - User prompted to enter custom start date (YYYY-MM-DD format)
   - End date: Calculated from selected start date + sprint duration
   - Status: "active" (fresh start)
   - All previous units cleared
   - Corpus and Journey metrics adjust to new date range
   - Allows flexibility to restart on user's preferred date
6. **Metrics Adjustment**: 
   - Journey completion % updates based on months between new start date and retirement age
   - Corpus progress % recalculates with new SIP schedule aligned to dates
   - Previous partial progress is discarded (fresh start)

---

## 3. Visible Outputs

**Sprint Status Banner:**
- Sprint Name (Monthly SIP Kickstart / Quarterly SIP Discipline / Annual Retirement Consistency)
- Start Date, End Date (formatted: "Feb 2026 → May 2026")
- Current Status: Not Started / In Progress / Completed
- SIP Amount for this Sprint (₹ amount)

**Monthly/Quarterly Unit Cards:**
- Label: "February 2026" or "Q1 2026"
- Date Range: "Feb 1 → Feb 28" or "Jan 1 → Mar 31"
- Status Badge: "Current" / "Completed" / "Locked"
- Reflection Form (if open):
  - Radio: "Did I do my SIP? Yes/No"
  - Scale: "How comfortable? 1-5" (visible only if "Yes")
  - Button: "Save Progress"
  - Success Message: "Saved. This period is complete."

**Completion Card (Monthly Only):**
- Title: "Your journey has begun"
- Subtitle: "You've completed your first SIP. Choose how you want to continue."
- Two Buttons (equal width):
  - "Quarterly Sprint" / "Review progress every 3 months"
  - "Annual Sprint" / "Build long-term investing discipline"

**Comfort Score:**
- Displayed on sprint home page (challenges page)
- Shows average of all completed unit comfort levels
- Format: "Comfort Score: 3/5" (numeric) or "N/A" if no data
- Counts total units completed

---

## 4. Inputs Used

**User Entries (Per Unit):**
- SIP Completed: Binary (yes/no)
- Comfort Level: 1-5 scale (only if SIP completed = yes)

**From Financial Readiness (Auto-Loaded):**
- Monthly SIP amount (for monthly kickstart)
- Monthly SIP amounts × 3 (for quarterly: step-up pattern)
- Monthly SIP amounts × 12 (for annual: with quarterly compounding)

**Data Sources:**
- Current sprint: Loaded from challengeStore localStorage
- Challenge catalog: Static definition (3 sprint types)
- Progress state: localStorage key `challengeState` with structure:
  ```
  {
    activeChallengeId: "monthly_sip_kickstart",
    progress: {
      "monthly_sip_kickstart": {
        status: "active|completed|completed_final",
        startDate: "2026-02-12",
        endDate: "2026-03-12",
        locked: false|true,
        units: { 0: { form: {sipCompleted: true, comfortLevel: 7}, isCompleted: true } }
      }
    }
  }
  ```

**What Is Ignored:**
- Market conditions or investment performance (SIP execution confirmed, not validated)
- Actual investment holdings or account confirmation
- Payment method or bank account linkage
- Missed payments or partial SIPs
- External income changes or employment status
- Tax implications of SIP
- Recommended SIP amounts (user decides)
- Historical sprint performance or trends

---

## 5. Calculations & Scoring Logic

### Comfort Level Aggregation

**Monthly Kickstart:**
- Single unit (month 1) → one comfort entry
- Average = that single entry

**Quarterly / Annual:**
- Each completed unit stores comfort level (1-5)
- Comfort Score = Average of all `form.comfortLevel` where `sipCompleted === true`
- Excludes units where SIP not completed (form.comfortLevel = null)
- Rounded to nearest integer for display

### Sprint Duration Calculation

**Monthly:** 
- Start date: Today (YYYY-MM-DD)
- End date: Today + 1 month (same day next month)

**Quarterly:** 
- Start date: Today
- End date: Today + 3 months

**Annual:** 
- Start date: Today
- End date: Today + 12 months

All dates calculated using JavaScript `Date.setMonth()` method.

### Phase Status Tracking

Each sprint maintains `phaseStatus` array:
- **Monthly**: 1 element [pending/completed]
- **Quarterly**: 3 elements [pending/completed, pending/completed, pending/completed] (one per month)
- **Annual**: 4 elements [pending/completed × 4] (one per quarter)

Status auto-updates when all phases marked "completed" → sprint status becomes "completed".

---

## 6. Progress & State Transitions

**State Machine:**

```
Not Started
    ↓ (user clicks Start)
Active
    ↓ (all units completed)
Completed
    ↓ (user selects next sprint)
Completed_Final (locked)
```

**Data Persistence:**
- All sprint progress saved to localStorage immediately on state change
- Active sprint ID tracked globally (only one active at a time)
- Monthly sprint status: Can be "completed" or "completed_final" (not restartable once final)

**Transitions Between Sprints:**

**Monthly → Quarterly:**
1. Monthly status set to "completed_final", locked: true
2. Quarterly initialized:
   - activeChallengeId = "quarterly_sip_discipline"
   - status = "active"
   - startDate = today, endDate = today + 3 months
   - phaseStatus = [pending, pending, pending]
   - units = {} (empty, will populate on first unit open)
3. User redirected to `/dashboard/challenges/quarterly_sip_discipline`

**Monthly → Annual:**
1. Monthly status set to "completed_final", locked: true
2. Annual initialized:
   - activeChallengeId = "annual_retirement_consistency"
   - status = "active"
   - startDate = today, endDate = today + 12 months
   - phaseStatus = [pending, pending, pending, pending]
   - units = {} (empty)
3. User redirected to `/dashboard/challenges/annual_retirement_consistency`

**Quarterly ↔ Annual:**
- No direct transition in code; quarterly → can transition to annual after completion
- Path: Quarterly completed → Transition card shown (same 2-button style) → Can choose annual

---

## 7. Constraints & Limits

**Hard Limits:**

- **Monthly**: One-time only (cannot restart after "completed_final")
- **Only One Active Sprint**: Cannot start new sprint while one is active (alert shown)
- **Only One Active SIP Unit Per Period**: Can't edit a completed unit (marked read-only)
- **Progressive Gating**: In Quarterly/Annual, can only access current month/quarter (previous ones locked until previous unit completed)
- **SIP Completion Required**: Cannot mark unit "completed" without answering "Did I do my SIP?"
- **Comfort Scale Required**: If "Yes" to SIP, must select comfort level (1-10) before save button enabled

**Non-Reversible Actions:**
- Monthly sprint marked "completed_final" → Cannot be restarted or deleted
- Unit marked "completed" → Cannot be re-edited (read-only view)
- Transition selection (Quarterly vs. Annual from Monthly) → Cannot go back (monthly locked)

---

## 8. What This Feature Does NOT Do

- **No SIP Validation**: Does not verify actual investment execution or bank confirmation
- **No Auto-Debit Setup**: Does not set up automatic monthly debit or SIP mandate
- **No Payment Processing**: Does not process payment or collect money
- **No Investment Recommendations**: Does not suggest which funds or schemes to pick
- **No Performance Tracking**: Does not track returns on SIPs already executed
- **No Habit Scoring**: Does not model habit formation or addiction/consistency scoring
- **No Coaching or Motivation**: Does not provide motivational messages, reminders, or penalties
- **No Content Unlocking**: Completing sprints does not unlock new features or content
- **No Reward/Gamification**: No badges, streaks, leaderboards, or prizes
- **No Reminder System**: Does not send push notifications or email reminders
- **No Analytics**: Does not track completion rates or user retention metrics

**✅ Sprint Stop Handling (When User Says "No"):**
- When user clicks "No" to SIP execution, sprint **stops** (transitions to "stopped" status)
- Sprint **does NOT auto-continue**; user must explicitly decide:
  1. **Continue from Next Month**: Automatically restarts sprint from next calendar month
  2. **Pick a Start Date**: User selects custom date to restart sprint
- **Corpus & Journey Adjust**: Metrics recalculate based on new sprint dates and duration
- **Clean Restart**: Previous partial progress discarded; all units reset to "pending"
- **No Penalty/Pressure**: User simply restarts when ready (no negative scoring or messaging)

---

## 9. Data Storage & Integration

**Sprint Definition (Static Catalog):**
- 3 sprints defined in `challengeCatalog.js`
- Each has: id, title, type (monthly/quarterly/yearly), durationLabel, and getPlan() function

**User Progress Storage:**
- Key: `challengeState` in localStorage
- Migrated to Vinca Readings for persistence across sessions

**Consumed By:**
- Challenges home page (displays all 3 sprint cards with current status)
- Readiness Fit (does NOT use sprint data—explicitly excluded per design)
- Membership Fit (does NOT use sprint data)

---

## 10. Execution Example

**Monthly Kickstart:**
1. User starts: activeChallengeId = "monthly_sip_kickstart"
2. Displays form: "Did I do my SIP?" + "How comfortable?"
3. User selects: Yes, Comfort = 8
4. User saves: units[0] = {form: {sipCompleted: true, comfortLevel: 8}, isCompleted: true}
5. Status updates: "completed" → Completion card shown
6. User clicks "Quarterly Sprint"
7. Monthly locked: status = "completed_final", locked = true
8. Quarterly initialized: startDate = 2026-02-12, endDate = 2026-05-12
9. Redirect to quarterly page

**Quarterly Continuation:**
1. Three months (Feb, Mar, Apr) visible
2. February (current) opens with form
3. User confirms SIP for Feb, comfort = 7
4. February marked complete
5. March becomes available (current)
6. After all 3 complete, Completion card shown with Annual option
7. Selection triggers Annual initialization
**Sprint Stop Scenario (Monthly Example):**
1. User starts Monthly SIP Kickstart: startDate = 2026-02-12, endDate = 2026-03-12
2. Sprint page opens with form: "Did I do my SIP?"
3. User clicks "No" and saves
4. System saves: form = {completed: "no", comfortLevel: null}
5. Sprint stops: status = "stopped"
6. "Oops, your sprint got stopped" card appears with 2 options
7. **Option A - Continue from Next Month**: 
   - New startDate = 2026-03-13, endDate = 2026-04-13
   - Sprint resets: status = "active", units = {}, all previous data cleared
   - Journey recalculates: months remaining = (retirementAge - currentAge) × 12, adjusted to new dates
   - Corpus recalculates: projected corpus based on new sprint schedule
8. **Option B - Pick a Start Date**:
   - User enters: "2026-04-01"
   - New startDate = 2026-04-01, endDate = 2026-05-01
   - Sprint resets: status = "active", units = {}, all previous data cleared
   - Journey & Corpus adjust accordingly
9. User can now execute from the new start date