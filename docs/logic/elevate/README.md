# Elevate

## 1. Data Inputs

### Source: Wealth manager selection + booking form
- **Selected manager**:
  - ID: Unique manager identifier
  - Name: Manager full name
  - Experience: Years of experience (integer)
  - Avatar: Photo/headshot (URL or Base64)
  - Tags: Array of specializations (e.g., "Retirement Planning", "Tax Optimization", "Insurance")
  - Expertise areas: List of competencies

- **User booking details**:
  - Preferred session date/time (user selection)
  - Session type: "30-min consultation", "60-min deep dive", "quarterly review" (optional)
  - Topics for discussion: Array of topics user wants to cover
  - Budget/pricing: Session cost (₹)

- **Optional user context**:
  - Retirement age goal
  - Corpus target
  - Current financial situation summary (auto-populated from Financial Readiness if available)

---

## 2. Core Calculations

### A. Manager Availability & Booking Slot

**Goal**: Track booking states and prevent double-booking.

**Process**:
1. **Check availability**:
   - Load manager's availability calendar
   - Available slots: Determine from manager's work hours (e.g., 9 AM–5 PM, Mon–Fri, excluding holidays)
   - Booked slots: Compare against existing bookings (in storage)
2. **Verify slot availability**:
   ```
   isSlotAvailable = slot NOT IN bookedSlots AND slot IN managerAvailability
   ```
3. **Create booking**:
   - Generate booking ID: `booking_${managerId}_${timestamp}`
   - Record: `{ bookingId, managerId, userId, dateTime, sessionType, status }`
   - Save to localStorage

**Result**: Booking confirmed or rejected based on availability.

### B. Booking State Transitions

**Goal**: Track booking lifecycle from submission to completion.

**States**:
1. **Pending**: Booking submitted, awaiting manager confirmation
2. **Confirmed**: Manager confirmed availability
3. **Completed**: Session occurred
4. **Cancelled**: User or manager cancelled

**State diagram**:
```
[Pending] 
  → Manager confirms 
    → [Confirmed] 
      → Session occurs 
        → [Completed]

[Pending/Confirmed] 
  → User cancels 
    → [Cancelled]
```

**Data written at each transition**:
- **On submission**: Record all booking details + `status: "pending"`
- **On confirmation**: Set `status: "confirmed"` + timestamp
- **On completion**: Set `status: "completed"` + timestamp
- **On cancellation**: Set `status: "cancelled"` + reason (optional)

### C. Booking Confirmation Logic

**Goal**: Validate booking submission before persistence.

**Validation steps**:
1. **Manager exists**: Check manager ID against manager database
2. **Slot available**: Confirm no conflict with existing bookings
3. **User authenticated**: (Optional) Verify user identity
4. **Required fields present**: Topic, date/time, session type (if required)
5. **Payment info valid**: (If applicable) Verify payment method

**On validation failure**: Return error; prevent booking creation.

### D. Submission Confirmation

**Goal**: Communicate successful booking to user.

**Process**:
1. On successful booking creation:
   - Create `submissionConfirm` object:
     ```javascript
     {
       bookingId: "booking_...",
       managerName: "Manager Name",
       dateTime: ISO timestamp,
       sessionType: "30-min consultation",
       topics: ["Retirement", "Tax Planning"],
       confirmationCode: "BOOKING_CODE_123"
     }
     ```
   - Display confirmation message with booking code
   - Offer options: "View details", "Share with family", "Schedule follow-up"

**Result**: User receives confirmation + actionable next steps.

---

## 3. Scoring Logic

**Not applicable** — Elevate is a transactional booking system, not scored.

**Booking metrics** (for admin/analytics):
- Booking completion rate: Booked → Completed / Total bookings
- Manager utilization: Time booked / Available time
- User satisfaction: (Optional, if feedback collected)

---

## 4. State Machine / Lifecycle

### Main State: Booking Lifecycle

```
1. [Browse Managers]
   User views manager profiles
   
2. [Select Manager]
   → Click "Book session"
   → Opens booking form

3. [Fill Booking Form]
   User selects date/time, session type, topics

4. [Submit Booking]
   → Validate availability
   → Create booking record

5. [Pending Confirmation]
   status = "pending"
   User sees: "Awaiting manager confirmation"
   Manager sees: Request to confirm/decline

6. [Confirmation Decision]
   Manager confirms → status = "confirmed"
   Manager declines → status = "cancelled" (auto-cancel)

7. [Session Scheduled]
   status = "confirmed"
   User sees: Booking details + manager contact info
   Calendar notification (optional)

8. [Session Completed]
   User marks complete (or auto on date/time)
   → status = "completed"
   Optional: Request feedback/review

9. [Post-Booking]
   User can: Schedule follow-up, leave review, share experience
```

### Data Locked:
- Once `status = "completed"`, booking cannot be modified
- Once `status = "cancelled"`, booking cannot be reactivated (must create new booking)

---

## 5. Persistence & Source of Truth

### localStorage Keys:
- **`vinca_elevate_bookings`**: Array of all booking records
  ```javascript
  [
    {
      bookingId: "booking_${managerId}_${timestamp}",
      managerId: "manager_id",
      userId: "user_id" | null,
      dateTime: ISO timestamp,
      sessionType: "30-min consultation" | "60-min deep dive" | "quarterly review",
      topics: ["topic1", "topic2", ...],
      status: "pending" | "confirmed" | "completed" | "cancelled",
      createdAt: ISO timestamp,
      confirmedAt: ISO timestamp | null,
      completedAt: ISO timestamp | null,
      notes: "optional user notes",
      feedback: { rating, comment } | null  // post-booking
    },
    ...
  ]
  ```

- **`vinca_elevate_managers`**: Static manager profiles (if cached)
  - Or loaded from `/data/` or API

### File Ownership:
- **No dedicated engine** — Simple booking CRUD logic
- **[components/elevate/ElevateManagerCard.jsx](../../src/components/elevate/ElevateManagerCard.jsx)** ← Manager display
- **[components/elevate/ElevateTimeline.jsx](../../src/components/elevate/ElevateTimeline.jsx)** ← Timeline/confirmation display
- **Booking form component** (to be determined)
- **localStorage direct read/write** for bookings

### Manager Database:
- **Static source** (likely `/data/` JSON file or hardcoded in component)
  - AUTHORITATIVE for manager metadata

---

## 6. Output Values

### Booking Record Fields:
- **`bookingId`**: Unique identifier (string)
- **`managerId`**: Manager being booked (string)
- **`dateTime`**: Session timestamp (ISO 8601)
- **`sessionType`**: Type of session (string)
- **`topics`**: Array of discussion topics
- **`status`**: Current lifecycle state
- **`createdAt`**: Submission timestamp
- **`confirmedAt`**: Manager confirmation timestamp (null if pending/cancelled)
- **`completedAt`**: Session completion timestamp (null if not yet completed)
- **`feedback`**: Optional user review post-session

### Confirmation Display:
- **Booking code**: Alphanumeric code for reference (e.g., "BOOK-ABC123")
- **Manager details**: Name, photo, expertise
- **Session details**: Date, time, duration, topics
- **Next steps**: Confirmation message + action buttons

### Manager Profiles:
- **Name**, **experience** (years), **avatar**
- **Tags**: Specializations (Retirement Planning, Tax, Healthcare, etc.)
- **Availability**: Working hours, days
- **Cost**: Session pricing (if applicable)

### Formatting Rules:
- Date/time: Display as "DD MMM YYYY, HH:MM AM/PM"
- Booking code: "BOOK-" + 6-char alphanumeric
- Status badges: Color-coded (pending=amber, confirmed=green, cancelled=red)
- Topics: Bulleted list

---

## 7. Edge Conditions

### Missing Data Behavior:
- **No manager availability data**: Show "Manager availability not published yet" message
- **User hasn't completed Financial Readiness**: Booking form proceeds without pre-filled context
- **No email/contact info provided**: Allow anonymous booking (contact via booking code)

### First-Time User Behavior:
- **User browsing managers first time**: All managers shown (no filters)
- **User submits first booking**: Confirmation page shown with encouragement to share/schedule follow-up

### Partial Completion Behavior:
- **User fills form but doesn't submit**: Form state lost on page reload (no draft save)
- **User confirms booking but doesn't complete session**: Booking remains "pending" indefinitely (must be manually completed or cancelled)

### Known Limitations:
- **No payment processing**: Booking submission does not charge; payment handled separately (or offline)
- **No calendar sync**: Booking dates not synced to Outlook/Google Calendar (integration possible)
- **No automatic confirmation**: No auto-response emails (manual manager confirmation required)
- **No rescheduling**: User must cancel + rebook to change date/time
- **No group bookings**: One manager per booking (no family sessions from single booking)
- **No follow-up scheduling**: User must manually create follow-up booking (templates possible)
- **No availability auto-sync**: Manager availability hardcoded or requires manual update
- **No cancellation deadlines**: User can cancel at any time (no minimum notice required)

---

## 8. File Ownership

### Booking Logic:
- **No dedicated engine file** — Logic embedded in components/forms
- **Form component**: Handles booking submission + validation
- **localStorage direct read/write**: For booking persistence

### Manager Database:
- **Static definition** (location TBD, likely `/data/` folder)
  - AUTHORITATIVE for manager metadata

### Pages:
- **[app/dashboard/investor-hub/elevate/](../../src/app/dashboard/investor-hub/elevate/)** (if separate page)
  - Could be part of Investor Hub structure

### Components:
- **[components/elevate/ElevateManagerCard.jsx](../../src/components/elevate/ElevateManagerCard.jsx)** ← Manager card display
- **[components/elevate/ElevateTimeline.jsx](../../src/components/elevate/ElevateTimeline.jsx)** ← Booking timeline/confirmation
- **[components/elevate/ElevateWhyCard.jsx](../../src/components/elevate/ElevateWhyCard.jsx)** ← Informational card
- Booking form component (location TBD)
- Confirmation component (location TBD)

---

## Implementation Notes

**Booking is stateful**: Each booking transitions through states; state determines available actions.

**No payment integration yet**: Booking is form submission; payment orthogonal.

**Manager availability is simple**: Binary (available/booked); no complex scheduling rules.

**Confirmation is manual**: No auto-confirmation; manager reviews + confirms.

**localStorage is browser-only**: No server persistence; bookings lost on browser clear.

**Post-session feedback optional**: Booking can be marked complete without review.
