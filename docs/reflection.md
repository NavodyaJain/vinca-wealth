# Reflection (Review & Raises) PRD

## 1. Feature Overview

**Reflection** is a review collection system accessible at `/dashboard/feedback-opinions/`. It has two modes:

- **Review Tab**: Collect star ratings and comments on overall platform and specific features
- **Raise Tab**: Community "problems to solve" where users vote on challenges others raise

No backend persistence visible; reviews and raises are stored in component state (session-only in current implementation).

---

## 2. User Journey (As Implemented)

### Review Mode:
1. **Entry**: User clicks "Review" tab
2. **Overall Review Form**:
   - Click stars (1-5 rating)
   - Type comment (text input)
   - Click "Submit Review"
3. **Feature Review Form**:
   - Select feature dropdown (Sprints, Reflections, Curations, Calculators, Dashboard, Others)
   - Click stars (1-5 rating)
   - Type comment
   - Click "Submit Review"
4. **Confirmation**: Toast shows "Review saved" and form resets
5. **History**: All submitted reviews appears in list below forms (if feature is implemented to display)

### Raises Mode:
1. **Entry**: User clicks "Raises" tab
2. **Raise Modal**: Click button to open form
3. **Submit Raise**:
   - Enter problem title (short statement)
   - Enter problem description (longer explanation)
   - Click "Post Raise"
4. **Raise Posted**: Added to community list, sorted by votes
5. **Vote on Raises**: Click thumbs-up (vote) on any raise in list
6. **Sorting**: Raises sorted by:
   - Vote count (descending)
   - Creation date (newest first, tiebreaker)

---

## 3. Visible Outputs

**Review Tab:**
- **Overall Rating Section**:
  - "How would you rate Vinca overall?" label
  - 5-star click UI
  - Text input: "Any additional review?"
  - Submit button
- **Feature Rating Section**:
  - Dropdown: "Select a feature"
  - "Rate this feature" 5-star UI
  - Text input: "Tell us more"
  - Submit button
- **Review Summary** (optional):
  - List of past reviews (if persistence added)

**Raises Tab:**
- **Raise Button**: Opens modal form
- **Raise Modal Form**:
  - Title input: "What's the problem?"
  - Description input: "Give us more details"
  - Cancel/Post buttons
- **Raises List**:
  - Raise card with:
    - Title
    - Description
    - Vote count (with thumbs-up icon)
    - Created date
    - User who posted (anonymous)
  - Sorted by votes descending, then date

**No Indicators:**
- No loading spinners (operations are synchronous)
- No error messages (input validated before submit)
- No confirmation dialogs for opinion deletion

---

## 4. Inputs Used

**User Submissions:**
- **Review**:
  - `overallRating` (1-5 stars, required)
  - `overallComment` (text, optional)
  - `selectedFeature` (dropdown, required for feature review)
  - `featureRating` (1-5 stars, required for feature review)
  - `featureComment` (text, optional)
- **Raise**:
  - `problemTitle` (text, required)
  - `problemDescription` (text, required)

**Data Sources:**
- Component state only (no localStorage)
- Initial raises: `initialRaises` array (empty in current code)

**What Is Ignored:**
- User identity (no name or email collected)
- Timestamp precision (date only, no time)
- Attachments or file uploads
- User's financial profile or risk score
- Previous review history or patterns
- Contextual data (which page user was on when review given)
- Follow-up or threading (no raise replies)
- Moderation or spam detection
- Review categorization beyond feature category

---

## 5. Calculations & Scoring Logic

**No Calculations:**
- Review: Stored as-is, no scoring or aggregation
- Raises: Sorted by vote count (simple comparison)

**Raise Sorting:**
```javascript
raises.sort((a, b) => {
  if (b.votes !== a.votes) return b.votes - a.votes; // Higher votes first
  return new Date(b.createdAt) - new Date(a.createdAt); // Newer first, tiebreaker
});
```

**Vote Toggle:**
- User clicks raise vote button
- Toggles vote state: if already voted → remove vote (votes--), else add vote (votes++)
- Raise card updates immediately

---

## 6. Progress & State Transitions

**Data Persistence:**
- Current implementation: Component state only (resets on page reload)
- No localStorage or backend save
- Reviews and raises lost when user leaves page

**State Flow:**

**Review:**
1. User enters rating and comment
2. Clicks Submit
3. Internal loading state (brief 900ms delay for UX)
4. Clears form fields
5. Shows success toast (1.5s)
6. Form ready for next submission

**Raise:**
1. User enters title and description
2. Clicks Post
3. Modal closes
4. Raise added to list (in-memory array)
5. List re-sorts by votes
6. User can immediately vote on new raise

---

## 7. Constraints & Limits

**Validation Rules:**
- **Review**: Rating required (1-5 stars), comment optional
- **Raise**: Title and description both required, no empty submissions

**Hard Limits:**
- Star rating: 1-5 only (no 0 or 6)
- Feature dropdown: 6 options (Sprints, Reflections, Curations, Calculators, Dashboard, Others)
- Raise title: No max length defined (browser-dependent)
- Raise description: No max length defined
- Image/media: Not supported
- Duplicate submissions: Not prevented (user can submit same review twice)

**Non-Reversible Actions:**
- None in current session (can refresh page to reset state)
- In persistent backend (if added): Review deletion not available to users

---

## 8. What This Feature Does NOT Do

- **No Authentication**: Does not require login or user identity
- **No Persistence**: Data not saved to backend or localStorage (current code)
- **No Email Confirmation**: Does not send receipt or follow-up
- **No Sentiment Analysis**: Does not analyze or score review sentiment
- **No Prioritization**: All reviews treated equally (not scored or ranked)
- **No Responsiveness**: Does not reply to or acknowledge reviews
- **No Moderation**: Does not filter profanity, spam, or misinformation
- **No Trend Analysis**: Does not track review patterns over time
- **No Categorization**: Reviews not auto-tagged or routed (except manual feature dropdown)
- **No Public Display**: Reviews not shown to other users or public
- **No Discussion Threads**: Raises are standalone, no nested replies
- **No Badges or Rewards**: Users not recognized for helpful reviews
- **No Integration with Sprints**: Reviews does not affect sprint recommendations
- **No Follow-ups**: User cannot edit or delete submitted reviews

---

## 9. Data Structure (Current Session-Only)

**Review Array:**
```javascript
{
  id: timestamp,
  type: 'overall' | 'feature',
  rating: 1-5,
  comment: string,
  feature: string (if feature review),
  isAnonymous: true,
  createdAt: ISO timestamp
}
```

**Raises Array:**
```javascript
{
  id: timestamp,
  title: string,
  description: string,
  votes: number (default 0),
  userVoted: boolean,
  createdAt: ISO timestamp
}
```

**No Backend:**
- If persistence added, would need API endpoints:
  - POST /api/reviews
  - POST /api/raises
  - PUT /api/raises/:id/vote

---

## 10. Feature Lifecycle

**Current State:**
- Reviews/Raises collected but not stored
- Useful for testing UI/UX only
- Production use requires backend integration

**If Backend Added:**
- Reviews routed to support/product team
- Raises become collaborative problem discovery
- Vote system surfaces top community concerns
- Review dashboard shows trends and patterns

**Not Planned (Explicit Exclusions):**
- Public raise browsing (closed review loop)
- User reputation based on raise votes
- Reward system for helpful reviews
- Feature request voting or upvoting
