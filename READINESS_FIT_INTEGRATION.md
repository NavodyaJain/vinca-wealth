# Readiness Fit Integration Guide

## Quick Start

The Readiness Fit feature is now ready to use. Here's how to integrate it into your Vinca Wealth dashboard.

---

## Files Created

1. **`src/lib/readinessFit.js`** — Calculation engine (pure functions, no side effects)
2. **`src/components/readinessFit/ReadinessFitDashboard.jsx`** — React component
3. **`src/app/dashboard/readiness-fit/page.js`** — Page wrapper
4. **`src/components/readinessFit/README.md`** — Detailed documentation

---

## Usage

### Basic Integration

The component expects aggregated data from multiple sources:

```jsx
import ReadinessFitDashboard from '@/components/readinessFit/ReadinessFitDashboard';

export default function MyPage() {
  const data = {
    financialReadiness: {
      isReady: true,
      lifespanSustainability: false,
      // ... other fields
    },
    lifestyle: { /* ... */ },
    health: { /* ... */ },
    sprints: { /* ... */ },
    preferences: { /* ... */ },
  };

  return <ReadinessFitDashboard data={data} />;
}
```

### Data Flow

```
Financial Readiness Page → Save results to localStorage
Lifestyle Planner Page   → Save results to localStorage
Health Stress Test Page  → Save results to localStorage
Retirement Sprints Page  → Save progress to localStorage
                              ↓
                    readiness-fit/page.js
                    (retrieves from localStorage)
                              ↓
                  ReadinessFitDashboard
                  (displays results)
```

---

## Calculation Logic

The engine calculates a 0–100 score across 5 categories:

| Category | Max Points | What It Measures |
|----------|------------|------------------|
| Retirement Clarity | 25 | Can you retire when planned? Will it sustain? |
| Lifestyle Confidence | 25 | Can you afford your desired lifestyle? |
| Health Robustness | 25 | How much does healthcare uncertainty threaten the plan? |
| Execution Discipline | 15 | Are you taking structured action? |
| Guidance Need | 10 | Would external guidance help? |

**Higher score = More areas where Vinca helps reduce uncertainty**

---

## Key Features

✅ **Honest Scoring**
- Allows low scores (< 50)
- Does not inflate to pressure sales
- Explains reasoning with actual user data

✅ **Data-Driven**
- Uses only outputs from existing tools
- No assumptions or hardcoded outcomes
- Safe defaults for missing data

✅ **Feature Recommendations**
- Shows 2–3 most relevant features based on scoring
- Each feature card explains "Why this helps you" with actual data
- Only shows applicable features

✅ **Educational Tone**
- Calm, trustworthy language
- No fear-based messaging
- SEBI-compliant (education only, not advice)

---

## Testing

### Test with Sample Data

```javascript
const testData = {
  financialReadiness: {
    isReady: false,
    lifespanSustainability: null,
    corpusAtRetirement: 5000000,
    requiredCorpus: 8000000,
  },
  lifestyle: {
    targetLifestyleTier: 3,
    affordableLifestyleTier: 2,
  },
  health: {
    healthRiskLevel: 'high',
    survivalAge: 70,
    baselineCorpus: 5000000,
    healthAdjustedCorpus: 4000000,
  },
  sprints: {
    hasStartedSprint: false,
    completedSprintsCount: 0,
  },
};

const result = calculateReadinessFitScore(testData);
console.log(result);
// Expected score: ~75–85 (Moderate to Strong Fit)
// Expected fit level: 'moderate' or 'strong'
```

### Verify Output

The result object contains:
- `totalScore` (0–100)
- `fitLevel` ('strong' | 'moderate' | 'limited')
- `categories` (breakdown by category)
- `signals` (2–4 user-facing bullets)
- `recommendedFeatures` (list of feature cards)
- `closingMessage` (final message based on fit level)

---

## Dashboard Navigation

To add Readiness Fit to the dashboard navigation:

1. Update the dashboard's tab bar or sidebar
2. Add a link to `/dashboard/readiness-fit`
3. Use the label: "Readiness Fit" or "How Fit Are You?"

---

## Data Retrieval Patterns

### Current (localStorage)

```javascript
const financialReadiness = JSON.parse(localStorage.getItem('financialReadinessResults') || '{}');
```

### Future (Context Provider)

```javascript
const { financialReadiness } = useRetirementData();
```

### Future (Backend API)

```javascript
const { data: financialReadiness } = await fetch('/api/user/financial-readiness');
```

---

## Customization

### Change Score Thresholds

Edit `src/lib/readinessFit.js`:

```javascript
// Current
let fitLevel = 'limited';
if (totalScore >= 80) fitLevel = 'strong';
else if (totalScore >= 50) fitLevel = 'moderate';

// New
if (totalScore >= 75) fitLevel = 'strong';
else if (totalScore >= 45) fitLevel = 'moderate';
```

### Add Custom Messaging

Edit the `generateClosingMessage()` function in `src/lib/readinessFit.js`.

### Adjust Colors

Edit the `getScoreDisplay()` function or the component's CSS.

---

## Troubleshooting

### Score seems wrong
- Check that input data fields match the expected structure
- Verify localStorage keys match expectations
- Use test data to verify calculation logic

### Feature cards not showing
- Verify `recommendedFeatures` array is populated
- Check that feature names match the cards in `createFeatureCard()`
- Ensure at least one category scored > 0

### Missing icons
- Verify lucide-react is installed and imported
- Feature icons are emojis, which should display in all browsers

---

## Performance

- Calculation is synchronous and instant (< 1ms)
- No API calls or async operations
- Safe for re-renders

---

## Accessibility

- Semantic HTML (headings, sections, buttons)
- Color-blind safe (gradients combined with text labels)
- Responsive design (mobile, tablet, desktop)
- Alt text on all icons (via aria-labels)

---

## Next Steps

1. **Wire up data sources** — Ensure Financial Readiness, Lifestyle Planner, Health Stress Test, and Sprints pages save results
2. **Add navigation** — Link to `/dashboard/readiness-fit` from dashboard
3. **Test with real data** — Walk through a user journey and verify scoring
4. **Customize messaging** — Adjust copy to match Vinca brand voice
5. **Integrate with Elevate** — Add manager feature recommendations

---

## Support

For questions or issues:
- Review `src/components/readinessFit/README.md` for detailed documentation
- Check test scenarios in the README
- Verify input data structure matches expected shape
- Ensure localStorage keys match page defaults
