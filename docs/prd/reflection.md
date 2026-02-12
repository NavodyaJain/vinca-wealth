# Reflection

## Feature Overview

Reflection provides two feedback mechanisms: "Review" (rate and comment on features) and "Raise" (suggest feature prioritization and problems). Users can rate overall experience or specific features (Sprints, Reflections, Curations, Calculators, Dashboard, Others) with 1-5 stars and optional text comments. The "Raise" tab allows voting on feature problems, community-style.

## Visible Outputs

**Review Tab**:
- Overall rating section: 5-star selector + comment textarea + submit button
- Feature rating section: feature dropdown + 5-star selector + comment textarea + submit button
- Success message on submission (1.5 sec)
- Historical feedback list (rating, comment, feature name, timestamp)

**Raise Tab**:
- Feature problem suggestions in ranked order (sorted by votes descending, then newest first)
- Vote count per problem with toggle upvote/downvote
- "Suggest a Problem" button opening modal with title + description fields
- Modal for submitting new problem suggestions
- Success feedback on submission

## Inputs Used

**Review inputs**:
- Overall rating (1-5 stars)
- Overall comment (freeform text)
- Feature selection (dropdown: Sprints, Reflections, Curations, Calculators, Dashboard, Others)
- Feature rating (1-5 stars)
- Feature comment (freeform text)

**Raise inputs**:
- Problem title (text)
- Problem description (text)
- Votes (user upvote/downvote toggle state)

**Data storage**: In-memory state (localStorage not explicitly used in component code; resets on page refresh).

**Data ignored**: Journal, learning progress, actual sprint/feature data, personal profile.

## Calculation & Scoring Logic

### Review Section
**Validation**:
- Overall rating: must be > 0
- Feature rating: requires both rating > 0 AND feature selected

**Submission**:
- Records feedback object: `{id: timestamp, type, rating, comment, feature?, isAnonymous: true, createdAt}`
- Adds to feedback list
- Resets form fields
- Shows 1.5s success message

### Raise Section
**Problem ranking**:
Sort by: votes (descending), then createdAt (newest first)
- `votes` counter tracks user toggles
- `userVoted` boolean tracks if current user voted on this problem

**Vote toggle**:
- If user already voted: `votes--`, `userVoted = false`
- If user not voted: `votes++`, `userVoted = true`

**Problem submission**:
- Records object: `{id: timestamp, title, description, votes: 0, userVoted: false, type: 'user-suggested', createdAt}`
- Inserts at top, then re-sorts entire list
- Resets modal fields
- Closes modal
- Shows 1.5s success message

## Update Triggers

**Review submission triggered by**:
- Click "Submit" on overall rating (if rating > 0)
- Click "Submit" on feature rating (if rating > 0 AND feature selected)

**Raise submission triggered by**:
- Click "Submit" in problem suggestion modal (if title AND description non-empty)
- Problem appears immediately at top of list (highest votes)

**Vote effects**:
- Upvote/downvote immediate (no network call)
- List re-sorted after vote

**No auto-triggers**:
- Feedback/opinions do not submit automatically
- No form validation errors block submission (only empty field check)
- No timeout or session limits

## Constraints & Limits

**Hard-coded values**:
- Feature options: 6 fixed categories (Sprints, Reflections, Curations, Calculators, Dashboard, Others)
- Rating scale: 1-5 stars
- Success message display: 1.5 seconds
- isAnonymous: always true (no user identification collected)
- Modal open state: controlled by `isModalOpen` boolean

**Input limits**:
- Star ratings: 0-5 (0 = not rated)
- Comments: unlimited text length
- Problem title/description: no stated limit

**Tab state**:
- Two tabs: "Review" or "Raise"
- Persists in component state during session
- Resets to "feedback" on page reload

**Feedback persistence**:
- Not persisted across page refresh (in-memory only)
- Simulated 900ms loading delay on submit


