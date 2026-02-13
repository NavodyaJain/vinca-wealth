# Elevate PRD

## 1. Feature Overview

**Elevate** is a 1:1 expert guidance booking system located at `/dashboard/investor-hub/elevate/`. It displays eligibility requirements, expert services offered, and a booking flow for users to schedule sessions.

**No Payment Processing**: Booking is form submission only; payment is deferred to human follow-up or external system.

---

## 2. User Journey (As Implemented)

1. **Entry**: User navigates to `/dashboard/investor-hub/elevate/`
2. **View Eligibility Criteria**: 4-step readiness ladder:
   - Numbers, Sorted (understand income, expenses, goals, timelines)
   - Discipline, Built (stayed consistent through sprints)
   - Financial Maturity (understand the "why" behind decisions)
   - Ready to Elevate (expert guidance adds validation, confidence)
3. **View Expert Services** (4 cards):
   - Portfolio Review
   - Q&A on Your Plan
   - Retirement Roadmapping
   - Confidence Check
4. **Booking**: Click "Book a Session" button
5. **Booking Form Modal** (single-page):
   - Prefilled: Name, Email
   - User enters: Notes (optional)
   - User selects: Session date (calendar picker)
   - User selects: Session time (time picker)
   - Submit: "Confirm Booking"
6. **Success Modal**: Shows confirmation (booking submitted)
7. **Form Reset**: Modal closes, form resets
8. **Exit**: Return to Elevate page or navigate elsewhere

---

## 3. Visible Outputs

**Hero Eligibility Section:**
- Heading: "Who should book Elevate?"
- 4-step progression cards showing:
  - Step icon/number
  - Heading (e.g., "Numbers, Sorted")
  - Description (why step is important)
  - Progress indicator

**Expert Services Grid:**
- 4 service cards, each showing:
  - Icon (BarChart3, MessageSquare, BookOpen, Shield)
  - Title (e.g., "Portfolio Review")
  - Description (1-2 sentences about service)
  - Implied CTA link

**Booking Button:**
- Primary CTA: "Book a Session" (green, large)
- Hidden until scrolled down or prominently placed

**Booking Form Modal:**
- Form fields:
  - Name: Prefilled (read-only or editable)
  - Email: Prefilled (read-only or editable)
  - Notes/Message: Text area (optional)
  - Date Picker: Calendar UI (clickable dates)
  - Time Picker: Time slots (clickable times, or free-form input)
  - Buttons: "Cancel" / "Confirm Booking"

**Success Confirmation Modal:**
- Message: "Your session has been booked"
- Booking summary (date, time echoed back)
- Close button or auto-close

---

## 4. Inputs Used

**User-Provided Inputs:**
- Name (prefilled, assumed from user context)
- Email (prefilled, assumed from user context)
- Message/Notes (optional text, max 500 chars implied)
- Session Date (YYYY-MM-DD format)
- Session Time (HH:MM format or time slot selection)

**Data Sources:**
- User name/email: Hard-coded mock values in current code ("User Name", "user@example.com")
- Session availability: Not defined in current code (all dates/times can be selected)

**What Is Ignored:**
- User's financial profile or readiness score
- Availability calendar (no "booked slots" model)
- Expert assignment or preferences
- Session duration (assumed 1 hour)
- Pricing or payment terms
- Cancellation or rescheduling
- Session history or past bookings
- Time zone (no TZ conversion)
- Repeat bookings or package deals
- Integration with calendar (no sync to Google Calendar, Outlook, etc.)

---

## 5. Calculations & Scoring Logic

**No Calculations:**
- Eligibility is narrative/descriptive only (no scoring)
- Date/time validation: Basic (no slot availability checking)
- No matching algorithm between user and expert

---

## 6. Progress & State Transitions

**Data Persistence:**
- Current implementation: In-memory state only (no localStorage or backend)
- Form data reset on modal close
- No booking history stored

**State Flow:**

1. **Modal Closed** (initial)
2. **Modal Open** → User enters form data
3. **Submit Click** → Validate fields
4. **Booking Submitted** → Success modal shows
5. **Modal Closed** → Reset to step 1

**If Backend Added:**
- Would POST /api/bookings with form data
- Would receive booking ID or confirmation token
- Could email confirmation to user
- Could integrate with scheduling system (Calendly, etc.)

---

## 7. Constraints & Limits

**Hard Limits:**
- Single session type (no tiered pricing or duration selection)
- Name and email required (non-blank)
- Date required (futureDate implied, no past dates)
- Time required (24-hour format)
- Notes optional (no max length enforced in code)

**No Availability Model:**
- All dates appear available
- All times appear selectable
- No "expert fully booked" state
- No "minimum booking lead time" (can book same day)
- No booking cap (unlimited simultaneous bookings possible)

**Session Model:**
- Assumed 1-hour duration per session
- No option to select duration
- No recurring/package deals

---

## 8. What This Feature Does NOT Do

- **No Payment Processing**: Does not collect payment or manage transactions
- **No Expert Matching**: Does not pair user with specific expert
- **No Availability Sync**: Does not sync with expert calendars
- **No Confirmation Email**: Does not send confirmation or reminder emails
- **No Integration with Video Call**: Does not provision Zoom, Teams, or video meeting link
- **No Pre-Session Questionnaire**: Does not collect detailed information before session
- **No Session Recording**: Does not record or transcribe sessions
- **No Follow-Up Notes**: Does not create action items or post-session notes
- **No Eligibility Checking**: Does not verify user meets readiness criteria before booking
- **No Time Zone Handling**: Does not convert times to user's time zone
- **No Waitlist**: Does not manage queue if expert fully booked
- **No Rescheduling**: User cannot modify or cancel booked sessions
- **No Pricing Display**: Does not show session cost
- **No Package Deals**: Does not offer multi-session bundles at discount
- **No Expert Profile**: Does not show expert name, credentials, bio, or ratings
- **No FAQs**: Does not answer common questions about Elevate service

---

## 9. Data Structure (Current Session-Only)

**Booking Form State:**
```javascript
{
  name: "User Name",       // Prefilled
  email: "user@example.com", // Prefilled
  note: string,            // User input
  selectedDate: YYYY-MM-DD, // User input (nullable)
  selectedTime: HH:MM      // User input (nullable)
}
```

**No Backend Persistence:**
- If added, would store:
  ```javascript
  {
    id: UUID,
    userId: string,
    name: string,
    email: string,
    notes: string,
    scheduledDate: ISO timestamp,
    scheduledTime: HH:MM,
    status: "confirmed|pending|cancelled",
    createdAt: ISO timestamp,
    expertId: string (assigned)
  }
  ```

---

## 10. Booking Workflow Example

**User Journey:**

| Step | Action | State | System Response |
|------|--------|-------|-----------------|
| 1 | Navigate to Elevate | Page loads | Display eligibility criteria, services, CTA |
| 2 | Click "Book a Session" | Modal opens | Form pre-filled with name/email |
| 3 | (Optional) Edit notes | Form active | User types message |
| 4 | Click date picker | Calendar visible | Dates all appear available |
| 5 | Select Feb 20, 2026 | Date selected | selectedDate = "2026-02-20" |
| 6 | Click time picker | Times visible | All hours appear available |
| 7 | Select 2:00 PM | Time selected | selectedTime = "14:00" |
| 8 | Click "Confirm Booking" | Validation runs | Form submitted |
| 9 | Success modal shown | Modal displays | "Your session is booked for Feb 20 at 2:00 PM" |
| 10 | Close modal | Modal closes | Return to Elevate page, form reset |
| 11 | (Backend) Manual follow-up | Out-of-app | Booking coordinator emails user with payment link/Zoom link |

**Current Gap** (if full implementation desired):
- No payment collection on booking
- No Zoom or meeting link generated
- No expert assignment
- No reminder emails
- No booking confirmation stored
