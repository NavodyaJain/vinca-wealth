# Pricing PRD

## 1. Feature Overview

**Pricing** is a static membership information page located at `/dashboard/investor-hub/pricing/`. It displays:

- Annual membership fee: ₹2,500/year
- List of 6 membership inclusion categories
- Feature breakdown pages (Sprints, Footprints, Curations, Learning, Elevate)

No payment processing, subscription management, or user-state changes are implemented. It is an informational page only.

---

## 2. User Journey (As Implemented)

1. **Entry**: User navigates to `/dashboard/investor-hub/pricing/`
2. **View Hero Card**:
   - Pricing display: "₹2500 / year"
   - "Become a member" button (not functional in current state)
   - Inclusion checklist (6 items)
3. **View Feature Sections** (scroll down):
   - Sprints section: Description + 4 benefits
   - Footprints section: Description + 4 benefits
   - Curations section: Description + 4 benefits
   - Learning section: Description + 4 benefits
   - Elevate section: Description + 4 benefits
   - Professional Guidance section: Description + 3 benefits
4. **View Feature Callouts**:
   - Trust & Safety section: Privacy, no affiliation disclosures
5. **Exit**: Navigate to other Investor Hub pages or purchase recommendations

---

## 3. Visible Outputs

**Hero Card (Top Section):**
- **Left Side**:
  - Heading: "Membership fees & inclusions"
  - Price: "₹2500" large text
  - Subheading: "/ year"
  - Button: "Become a member" (green CTA, styling only)
  - Fine print: "Educational platform. No product selling. No stock tips."

- **Right Side**:
  - Heading: "Full membership includes"
  - 6-item checklist with checkmarks and feature descriptions:
    - Tools to understand your financial reality
    - Sprints for consistent, focused progress
    - Footprints to share and learn together
    - Curated resources to support your journey
    - Learning modules for financial clarity
    - Elevate: optional 1:1 guidance sessions

**Feature Section Cards:**
- **Sprints Card**:
  - Icon: ⚡ (Zap)
  - Title: "Sprints"
  - Description
  - 4 bullets: Consistency over intensity, Time-bound focus areas, Habit-building, Progress through participation

- **Footprints Card**:
  - Icon: 👣
  - Title: "Footprints"
  - Description
  - 4 bullets: Share real challenges, Learn from community, Perspective diversity, Anonymous participation

- **Curations Card**:
  - Icon: 📚
  - Title: "Curations"
  - Description
  - 4 bullets: Books, planning tools, Games, Retirement gifts

- **Learning Card**:
  - Icon: 📖
  - Title: "Learning"
  - Description
  - 4 bullets: Video series, point system, achievement tracking, Financial maturity meter

- **Elevate Card**:
  - Icon: 🚀
  - Title: "Elevate"
  - Description
  - 4 bullets: Portfolio review, Q&A on plan, Retirement roadmapping, Confidence check

- **Professional Guidance Card**:
  - Icon: 🔍
  - Title: "Professional Guidance"
  - Description
  - 3 bullets: Expert insights, Data-driven advice, Plan validation

**Trust Section:**
- Privacy disclosure
- No product affiliation statement
- Educational-only claim

---

## 4. Inputs Used

**Static Content Only:**
- Price: ₹2,500 (hard-coded)
- Feature lists: Hard-coded text
- Icons: Lucide React icons (imported components)

**No User Input:**
- No form fields
- No interaction beyond page navigation
- Button click is non-functional (no payment flow)

**What Is Ignored:**
- Current user subscription status
- Payment history or billing cycles
- Tax or GST calculations
- Currency conversion
- Regional pricing differences
- Promotional codes or discounts
- Volume pricing or family plans
- Refund policies (not displayed)
- Payment methods accepted
- Billing date or renewal information
- Usage limits or tier differentials

---

## 5. Calculations & Scoring Logic

**No Calculations:**
- Price is static display only
- No cost breakdown or prorated calculations
- No billing period calculations

---

## 6. Progress & State Transitions

**No State:**
- Page is stateless
- No localStorage or session state
- No redirect after "Become a member" click

**If Payment Flows Added:**
- Would link to payment processor (Razorpay, Stripe, etc.)
- Would set `isPremium` flag in user context
- Would unlock premium features globally

---

## 7. Constraints & Limits

**Hard-Coded Values:**
- Price: ₹2,500 (fixed annual, no monthly option)
- Feature count: 6 categories
- Feature cards: 5 main (Sprints, Footprints, Curations, Learning, Elevate) + 1 guidance

**Display-Only:**
- No payment processing
- No subscription management UI
- No discount application
- No seat management (single user only)

---

## 8. What This Feature Does NOT Do

- **No Payment Processing**: Does not accept payments or manage transactions
- **No Subscription Management**: Does not track billing cycle, renewal, or cancellation
- **No Plan Options**: Single static plan (no monthly, quarterly, or lifetime options)
- **No Tiering**: No basic/premium/professional tiers
- **No Discounts**: No coupon, promotional code, or loyalty pricing
- **No Tax Calculation**: Does not compute GST or other taxes
- **No Usage Limits**: Does not describe feature limits by plan
- **No Trial Period**: No free trial or money-back guarantee mentioned
- **No Comparison**: Does not compare Vinca pricing to competitors
- **No Custom Pricing**: No enterprise or bulk pricing options
- **No Billing History**: Does not show past invoices or upcoming charges
- **No Payment Methods**: Does not describe accepted payment options
- **No Refund Policy**: Does not display refund terms or procedure
- **No FAQ**: No pricing FAQs or common questions answered

---

## 9. Data Structure

**Static Content (Hard-Coded in Component):**

```javascript
const pricingContent = {
  price: "₹2500",
  period: "year",
  buttonText: "Become a member",
  disclaimer: "Educational platform. No product selling. No stock tips.",
  inclusions: [
    "Tools to understand your financial reality",
    "Sprints for consistent, focused progress",
    // ... 4 more items
  ],
  sections: [
    { 
      title: "Sprints", 
      description: "...",
      benefits: ["...", "...", "...", "..."]
    },
    // ... 5 more sections
  ]
};
```

---

## 10. Content Maintenance

**Current State:**
- All content embedded in JSX
- To update: Edit component source code
- Requires code deploy to push changes

**Future State (If CMS Added):**
- Would fetch pricing from API
- Could support A/B testing different prices
- Enable regional pricing variants
- Support multiple currencies
- Dynamic feature management
