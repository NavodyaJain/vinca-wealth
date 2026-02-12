# Retirement Sprints

---

## 1. Feature Purpose

Retirement Sprints divides the journey from today to retirement into measurable time-based milestones (monthly, quarterly, or annual "sprints"). It tracks progress toward retirement by measuring how many sprint periods have been completed and calculating key performance indicators (journey completion percentage and corpus progress percentage). This allows users to visualize retirement planning as a series of achievable checkpoints rather than one distant goal.

---

## 2. What Inputs Are Used

**From User Selection**:
- **Sprint type** — "Monthly" (1-month sprints), "Quarterly" (3-month), or "Annual" (12-month)

**From Financial Readiness Calculator**:
- **Current age** (years)
- **Target retirement age** (years)
- **Current retirement corpus** (₹)
- **Required retirement corpus** (₹ to sustain retirement)

**From System**:
- **Current date** (to calculate sprints elapsed)
- **Sprint start date** (date user selected the sprint type)

---

## 3. How the Score / Number Is Built

### Step 1: Calculate Total Sprint Duration

Convert the years from today to retirement into sprint periods:
- **Monthly sprints**: (Retirement age - Current age) × 12 = total months
- **Quarterly sprints**: (Retirement age - Current age) × 4 = total quarters
- **Annual sprints**: (Retirement age - Current age) = total years

Example: If user is age 30 and retirement age is 65, that's 35 years = 420 monthly sprints, 140 quarterly sprints, or 35 annual sprints.

### Step 2: Calculate Completed Sprints

Count the number of sprint periods that have fully elapsed since the sprint start date:
- **Monthly**: Months elapsed since sprint start date
- **Quarterly**: Complete quarters elapsed (e.g., Jan-Mar, Apr-Jun)
- **Annual**: Complete years elapsed

Example: User started sprints 18 months ago, so 18 monthly sprints completed, 6 quarters completed (with some incomplete), or 1 annual sprint completed (with some incomplete).

### Step 3: Calculate Journey Completion Percentage

$$\text{Journey Completion \%} = \frac{\text{Completed Sprints}}{\text{Total Sprints}} \times 100$$

This represents what percentage of the retirement timeline has "elapsed" from today toward the retirement date.

Example: 18 months completed ÷ 420 total months = 4.3% journey completion.

### Step 4: Calculate Corpus Progress Percentage

$$\text{Corpus Progress \%} = \frac{\text{Current Corpus}}{\text{Required Corpus}} \times 100$$

This represents how much of the financial target has been accumulated relative to the required amount.

Example: Current ₹10L corpus ÷ Required ₹25L = 40% corpus progress.

### Step 5: Assign Progress Delta

Calculate the change in corpus progress since the last sprint period completed:
$$\text{Delta} = \text{Current Corpus Progress \%} - \text{Previous Sprint Corpus Progress \%}$$

Positive delta indicates corpus grew in the most recent sprint period; negative indicates decline.

---

## 4. What the Score Means

**Journey Completion Percentage** (0-100%):
- **0-25%**: Early stage; Less than one-quarter of the retirement timeline has elapsed
- **25-50%**: Mid-journey; Approaching halfway to retirement
- **50-75%**: Advanced; More than halfway through the retirement planning timeline
- **75-100%**: Final stretch; Approaching or at retirement age

**Corpus Progress Percentage** (0-100%+):
- **0-33%**: Significant funding gap; need to accelerate savings or adjust retirement expectations
- **33-66%**: Moderate progress; on track to meet a substantial portion of retirement corpus goal
- **66-99%**: Near target; retirement corpus nearly sufficient
- **100%+**: Target met or exceeded; retirement corpus meets or exceeds required amount

**Progress Delta** (positive/negative):
- **Positive delta**: Corpus grew in the most recent sprint period (favorable trend)
- **Negative delta**: Corpus declined in the most recent sprint period (unfavorable trend)
- **Zero delta**: Corpus unchanged in the most recent sprint period (stagnant)

---

## 5. What the Score Does NOT Mean

- **Does NOT predict retirement success** — High journey completion does not guarantee financial security; depends on actual corpus accumulation
- **Does NOT model actual market returns** — Assumes fixed returns; real returns vary month-to-month and year-to-year
- **Does NOT account for inflation** — Journey and corpus percentages do not adjust for purchasing power erosion
- **Does NOT measure engagement or effort** — Completion percentage is time-based only; does not reflect user's actions, learning, or savings rate increases
- **Does NOT track actual spending behavior** — Assumes user will spend as modeled; does not track discretionary changes or emergency expenses
- **Does NOT include tax impact** — Corpus and progress calculations assume tax-adjusted values; actual returns may differ after-tax
- **Does NOT measure financial literacy** — Journey completion is independent of financial knowledge or decision-making quality
- **Does NOT guarantee milestone achievement** — Completing a sprint period does not mean financial readiness has improved; only time has passed

---

## 6. Boundaries & Constraints

- **Only one active sprint allowed** — User can have only one sprint type active at a time (cannot run monthly + quarterly simultaneously)
- **No pause or resume** — Once started, a sprint runs continuously; cannot pause, freeze, or skip sprint periods
- **Binary completion model** — Sprints are either fully completed or not; no partial credit for incomplete sprint periods
- **Fixed sprint durations** — Monthly = 30 days (approximate), Quarterly = 90 days, Annual = 365 days; does not account for leap years or calendar variations
- **No sprint skipping** — Cannot jump to future sprint periods or retroactively apply past dates
- **Current date-based calculation** — Sprint count resets if system date changes backward; only forward time progression counts
- **Local storage only** — Sprint data persisted in browser only; not synced to server or accessible across devices
- **Retirement age assumption** — Assumes retirement occurs at exactly the selected retirement age; does not model early retirement, delayed retirement, or date changes
- **No multi-person households** — Sprint tracking is per individual; does not model couples or household-wide retirement goals

---

**Document Version**: 1.0  
**Last Updated**: February 2026
