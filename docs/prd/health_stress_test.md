# Health Stress Test

## Feature Overview

Health Stress Test shows a preview of how major healthcare costs during retirement could impact a user's corpus. It accepts the same financial inputs as Financial Readiness and displays a status banner indicating health readiness. Full dashboard analysis requires authentication. Currently displays only preview without detailed impact calculations.

## Visible Outputs

- **Status banner** showing:
  - Health readiness level or message
  - Color-coded background (emerald for supported health scenarios)
  - Affirmation message about healthcare cost preparedness
- **Health scenario selector** (deployed in detailed view, not in preview)
- **Sign-in prompt** to "Get Detailed Analysis" (paid feature lock)

## Inputs Used

**Form fields collected**: Same as Financial Readiness (current age, retirement age, money saved, monthly SIP, expected returns, lifespan, inflation, etc.)

**Data source**: User input via form. Stored to localStorage under key `vinca_tool_health_formData`.

**Data ignored**: Actual health history, insurance coverage, pre-existing conditions, family health records, journal entries, learning progress.

## Calculation & Scoring Logic

### Step 1: Estimate Health Cost Impact
Logic exists but not deployed in tool preview. Full calculation estimates:
- Scenario-based healthcare cost multipliers (4%-6% of annual expenses annually)
- 9% medical inflation rate
- One-time major event costs (₹300k-₹1.5M depending on scenario)

### Step 2: Simulate Retirement with Health Costs
Apply health costs to standard retirement corpus depletion to model:
- When corpus runs out (baseline vs. health-adjusted depletion age)
- Monthly health burden sustainability

### Step 3: Calculate Health Risk Level
- High risk: depletion age < 85 or corpus runs out before lifespan
- Low risk: funds sustain through expected lifespan

This logic is coded but displayed only in full dashboard, not in preview tool.

## Update Triggers

**Recalculation occurs when**:
- User submits form with "Analyze your Health Readiness" button
- Results banner displays after submission
- (Full dashboard: each health scenario selection triggers recalc)

**No recalculation on**:
- Page refresh without resubmit
- Tool abandonment
- Changes to other tools

## Constraints & Limits

**Hard-coded values** (in full implementation not deployed in preview):
- Medical inflation: 9% annually
- Scenario cost multipliers: 4%, 2%, 6% of annual expenses
- One-time costs: ₹300k or ₹1.5M per scenario
- Hospital daily rates: ₹20k-₹30k

**Input validation**: Same as Financial Readiness

**No personal data collection**: No health history, conditions, or family medical background requested


