# Health Stress Test PRD

## 1. Feature Overview

**Health Stress Test** models the impact of healthcare costs and health-related longevity changes on retirement corpus sustainability. Located at `/dashboard/health-stress/`, it calculates:
- "Health-Adjusted Corpus" (corpus after healthcare costs)
- Age at which corpus depletes if health drains it
- Monthly health-related gap (if any)
- Risk level classification (low/medium/high)

The feature answers: "Can I afford healthcare-related expenses in retirement?"

---

## 2. User Journey (As Implemented)

1. **Entry**: User navigates to `/dashboard/health-stress/`
2. **Data Load**: Retrieves inputs from Financial Readiness localStorage
3. **Health Category Selection**: User selects health scenario (everyday, serious, critical, each with different cost models)
4. **Premium Unlock (Optional)**: Base scenario free; detailed breakdowns require premium upgrade
5. **Calculation**: System computes health impact on corpus and depletion age
6. **Results Display**:
   - Health-adjusted corpus
   - Depletion age comparison (baseline vs. health stress)
   - Monthly health gap
   - Risk level badge
7. **Exit**: User saves reading or explores Readiness Fit

---

## 3. Visible Outputs

**KPI Cards:**
- Baseline Corpus: ₹ amount (from Financial Readiness, no health costs)
- Health-Adjusted Corpus: ₹ amount (corpus net of healthcare spending)
- Baseline Depletion Age: Age number (without health costs)
- Health-Stressed Depletion Age: Age number (with health costs)
- Monthly Health Gap: ₹ amount (how much health costs reduce monthly capacity)
- Health Risk Level: Low / Medium / High (badge)

**Charts (Premium Only):**
- Corpus depletion comparison: Baseline vs. Health Stress timeline
- Healthcare cost accumulation by age
- Income supported with/without health costs

**Status Indicators:**
- "Healthcare is Manageable" (if health costs reduce corpus < 15%)
- "Healthcare Creates Moderate Risk" (15%-35% reduction)
- "Healthcare Creates Significant Risk" (>35% reduction)

---

## 4. Inputs Used

**From Financial Readiness (Auto-Loaded):**
- Current Age, Retirement Age, Lifespan
- Monthly Expenses, Monthly SIP, Money Saved
- Expected Returns, Inflation Rate, Retirement Returns
- SIP Increase Rate, Withdrawal Increase Rate

**User-Selected:**
- Health Category (everyday, serious, critical)
- Monthly Premium (optional input, user-specified)

**Data Source:**
- localStorage key: `financialReadinessInputs` (primary)
- Fallback: Mock defaults
- User input: Health category selection

**What Is Ignored:**
- Mental health or psychological factors
- Preventive health measures (ignored as future dependency)
- Life insurance or health insurance policy details
- Medical inflation rates separate from general inflation
- Disability or long-term care (not modeled as corpus drain)
- Pandemic or one-time health crises
- Genetic predisposition or family health history
- Geographic healthcare cost differences

---

## 5. Calculations & Scoring Logic

### Health Cost Model

**By Category:**
- **Everyday** (baseline): Standard retirement healthcare, ~2% of corpus yearly
- **Serious**: Chronic disease management, ~4-6% of corpus yearly  
- **Critical**: Major illness or hospitalization, ~8-12% of corpus yearly

**Exact Thresholds (From Code):**
- Not defined in current implementation (uses health category to determine cost bucket)
- Implementation may use percentage of corpus, fixed amount, or age-based scaling

### Health-Adjusted Corpus Calculation

1. **Baseline Corpus Projection** (from Financial Readiness): ₹50M (example)
2. **Apply Health Drain:**
   - Each year in retirement: `Corpus = Corpus - (Annual Health Cost)`
   - Annual Health Cost = percentage of corpus OR fixed amount (determined by health category)
3. **Depletion Age Simulation:**
   - Simulate year-by-year with health costs applied
   - Record age when corpus first hits ₹0
4. **Result**: Health-Adjusted Depletion Age (e.g., 78, compared to baseline 85)

### Health Gap Metrics

**Monthly Health Gap:**
- Difference between supported monthly income (from Lifestyle Planner) with/without health costs
- Formula: `Supported (baseline) - Supported (with health)`
- Displayed if positive (indicates shortfall)

**Health Impact Percentage:**
- `(Baseline Corpus - Health-Adjusted Corpus) / Baseline Corpus × 100%`
- Used to determine risk level badge (Low <15%, Medium 15-35%, High >35%)

---

## 6. Progress & State Transitions

**Data Persistence:**
- Inputs loaded from shared localStorage
- Health category selection stored in component state during session
- Results not persisted (recalculated on page load)
- User reading can be saved via "Save Reading" button

**Recalculation Triggers:**
- Page load (automatic)
- Health category selection change (immediate recalculation)
- User returns from other pages (uses latest localStorage inputs)

**Premium Gate:**
- Free tier: Shows KPI cards and basic risk label
- Premium tier: Unlocks detailed charts, cost breakdowns, and scenarios

---

## 7. Constraints & Limits

**Hard Limits:**
- Health costs cannot exceed total corpus (stops accumulation if corpus depletes)
- Health category must be selected (defaults to "everyday" if none)
- Monthly premium input: Must be >= 0

**Simulation Range:**
- Runs from Retirement Age to Lifespan (same as Lifestyle Planner)
- No projections beyond declared lifespan

**Display Limits:**
- Depletion age rounded to nearest year
- Risk level bucketed into 3 categories (not continuous scoring)
- Health costs formatted in standard Indian currency notation

---

## 8. What This Feature Does NOT Do

- **No Medical Inflation Model**: Does not separate healthcare inflation (typically higher than general inflation) from overall inflation
- **No Insurance Modeling**: Does not account for health insurance coverage, copay, deductibles, or insurance reimbursement
- **No Preventive Costs**: Does not include wellness spend, gym memberships, or preventive care investments
- **No Long-Term Care**: Does not model assisted living, nursing homes, or full-time caregiver costs (major healthcare item)
- **No Disability Planning**: Does not address income loss or care costs from disability before/during retirement
- **No Specific Disease Modeling**: Does not tailor costs to specific conditions (diabetes, cancer, cardiac, etc.)
- **No Regional Variance**: Does not adjust healthcare costs by geography or city
- **No Lifestyle Modification**: Does not model cost changes from diet, exercise, or preventive behaviors
- **No Family Health Impact**: Does not include dependent healthcare costs (spouse, children)
- **No Recommendation**: Does not suggest health insurance purchases or preventive actions
- **No Mortality Risk Adjustment**: Does not model mortality probability based on health status (lifespan fixed by user)

---

## 9. Data Integration

**Consumes From:**
- Financial Readiness (baseline corpus, depletion age, inputs)
- Lifestyle Planner (corpus depletion rate, supported income)

**Provides To:**
- Readiness Fit scoring (uses health-adjusted corpus and depletion age delta as "Category C" input)
- Membership Fit diagnostic (flags if health gap exists)

**Storage:**
- Saves to localStorage key: `healthStressResults` with metrics for later retrieval

---

## 10. Output Example

**User Scenario:**
- Baseline Corpus at Retirement: ₹50,000,000
- Baseline Depletion Age: 85 (sustainable to lifespan)
- Selected Health Category: "Serious" (4-6% yearly healthcare drain)
- Monthly Expenses: ₹50,000, Inflation: 6%, Retirement Returns: 8%

**Health Stress Simulation:**
- Age 60 (Retirement): Apply 4% health cost = ₹2M drain
- Age 61: Apply 4% to remaining corpus (₹48M) = ₹1.92M drain  
- ... Continue year-by-year
- Age 78: Corpus projected to hit ₹0
- Result: Health-Stressed Depletion Age = 78 (vs. baseline 85)

**Outputs:**
- Health-Adjusted Corpus: ₹48,000,000
- Depletion Age Gap: 7 years (85 - 78)
- Health Impact: 4% corpus reduction
- Risk Level: **Medium** (4% < 15%, but non-trivial)
- Monthly Health Gap: ~₹15,000 (health costs reduce monthly capacity by this amount at age 60)

**Usage:** User sees that health costs move retirement deadline from 85 to 78—still sustainable but closer. Prompts consideration of health insurance or increased savings.
