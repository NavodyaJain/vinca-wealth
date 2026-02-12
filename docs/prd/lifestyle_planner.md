# Lifestyle Planner

## Feature Overview

Lifestyle Planner shows users a preview of what retirement lifestyle tier (Basic, Comfortable, or Premium) their current retirement plan can afford. It accepts the same financial inputs as Financial Readiness and displays a status banner indicating affordability. Full dashboard requires authentication.

## Visible Outputs

- **Status banner** showing:
  - Affordability tier label (Basic / Comfortable / Premium)
  - Color-coded background (emerald green for supported tier)
  - Clear message: "Based on your current plan, you can afford a [Tier] retirement lifestyle"
- **Tier affordability guidance** with tooltips explaining each tier
- **Sign-in prompt** to "Get Detailed Analysis" (paid feature lock)

## Inputs Used

**Form fields collected**: Same as Financial Readiness (current age, retirement age, money saved, monthly SIP, expected returns, lifespan, inflation, etc.)

**Data source**: User input via form. Stored to localStorage under key `vinca_tool_lifestyle_formData`.

**Calculation inputs**: Monthly expenses converted to lifestyle tiers by thresholds.

**Data ignored**: Journal, learning progress, challenges, previous calculator results.

## Calculation & Scoring Logic

### Step 1: Determine Target Retirement Monthly Need
Use monthly expense from Financial Readiness form as proxy for desired lifestyle cost.

### Step 2: Calculate Supported Monthly Income
From retirement corpus, apply 4% safe withdrawal rule or year-by-year depletion simulation to derive monthly income sustainable through lifespan.

### Step 3: Map to Affordability Tier
Based on ratio of supported monthly to current monthly expenses:
- Basic tier: supported ≤ (current × 1.1) — minimal lifestyle growth
- Comfortable tier: supported ≤ (current × 1.5) — moderate lifestyle improvement
- Premium tier: supported > (current × 1.5) — significant lifestyle upgrade

### Step 4: Generate Affordability Message
Display tier name + confidence statement based on plan sustainability.

## Update Triggers

**Recalculation occurs when**:
- User submits form with "Analyze your Lifestyle Plan" button
- Results banner displays after submission

**No recalculation on**:
- Page refresh (unless form resubmitted)
- Changes to other tools
- Time passage or date changes

## Constraints & Limits

**Hard-coded values**:
- Basic threshold: 1.1× current expenses
- Comfortable threshold: 1.5× current expenses
- Safe withdrawal rate: 4% (if used)

**Input validation**: Same as Financial Readiness (all fields required)

**No caps**: Tier can be any level; no maximum


