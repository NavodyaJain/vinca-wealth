# Reflections

## 1. Data Inputs

### Source: User submission form + optional journey context
- **Reflection content** (user-provided):
  - Title/hook: Brief headline (required)
  - Photo/image: Optional visual (stored as Base64)
  - Full text: Multi-paragraph narrative
  - Topic tags: Optional categorization

### Optional Journey Context:
- If user completed a challenge, auto-populate:
  - Challenge name
  - How challenge was handled (pre-filled from challenge completion data)
  - Reflection prompt (e.g., "What did you learn?")

---

## 2. Core Calculations

### A. Reflection Entry Creation

**Goal**: Convert form submission into persistent reflection record.

**Process**:
1. Generate unique ID: `reflection_${timestamp}`
2. Capture metadata:
   - `createdAt`: Current ISO timestamp
   - `name`: User's name (from profile or form input)
   - `avatar`: Photo provided or null
3. Extract content:
   - `hook`: Brief headline (max 120 chars preview)
   - `preview`: First 120 characters of full text + "..."
   - `full`: Full text split into paragraphs (array of strings)
4. Optional: Store journey context:
   ```javascript
   journey: {
     context: { ...lifecycle context },
     challenges: ["challenge 1", "challenge 2", ...],
     howTheyHandled: "narrative text",
     reflection: "reflection text"
   }
   ```

**Result**: Reflection record with preview + full content + context.

### B. Feed Sorting

**Goal**: Display most recent and most relevant reflections.

**Sorting order**:
1. **Recency**: Newest first (by createdAt timestamp)
2. **Engagement** (if tracked): Likes/views per reflection (not currently implemented)
3. **Topic relevance** (if tags exist): Match user's interests (optional feature)

**Feed display**:
- Show 3 most recent reflections in main feed
- Show full history on "View all" page

**Result**: Chronological feed with most recent prominent.

### C. Storage & Indexing

**Goal**: Index reflections for search and discovery.

**Process**:
1. Extract searchable text:
   ```
   searchText = hook + " " + full.join(" ")
   ```
2. Tag auto-generation (optional):
   - Parse text for keywords: "challenge", "goal", "learned", "struggle", etc.
   - Create tags array
3. Store with metadata:
   - Author (name or anonymous)
   - Timestamp
   - Life stage (if embedded in journey context)

**Result**: Indexed reflections searchable by text and tags.

---

## 3. Scoring Logic

**Not applicable** — Reflections are qualitative narratives, not scored.

**Relevance metrics** (for feed ranking):
- **Recency**: Most recent first
- **Theme resonance**: Reflections about topics user engaged with (secondary)
- **Completeness**: Full reflections ranked above short ones (tertiary)

---

## 4. State Machine / Lifecycle

### States:
1. **Composing**: User filling form
2. **Submitted**: Entry persisted to localStorage
3. **Published**: Visible in community feed

### Transitions:

```
[Composing] 
  → Click "Submit" 
    → [Published, added to vinca_reflections array]

[Published] 
  → User views
  → [Read, no state change]

[Published] 
  → User deletes
  → [Removed from array]
```

### Data Locked:
- Once submitted, reflection cannot be edited (must delete and re-submit)
- Timestamp immutable (creation date fixed)

Parameters:
- `vinca_reflections` is append-only (new reflections prepended)

---

## 5. Persistence & Source of Truth

### localStorage Key:
- **`vinca_reflections`**: Array of reflection records
  ```javascript
  [
    {
      id: "reflection_${timestamp}",
      name: "User Name or 'Anonymous'",
      avatar: "data:image/..." or "",
      hook: "Brief headline (max 120 chars)",
      preview: "First 120 chars of content...",
      full: ["Paragraph 1", "Paragraph 2", ...],
      createdAt: ISO timestamp,
      journey: {  // optional
        context: { name, lifeStage, age, ... },
        challenges: ["..."],
        howTheyHandled: "...",
        reflection: "..."
      },
      searchText: "concatenated hook + full text for search"
    },
    ...
  ]
  ```

### File Ownership:
- **No dedicated engine** — Simple localStorage CRUD
- **[app/dashboard/reflections/post/page.jsx](../../src/app/dashboard/reflections/post/page.jsx)** ← Submission form (AUTHORITATIVE for form logic)
- **localStorage direct read/write** for persistence

### Components:
- **Reflections feed component**: Display list of reflections
- **Reflection card component**: Preview view (hook + photo + first para)
- **Reflection detail component**: Full view with context

---

## 6. Output Values

### Reflection Record Fields:
- **`id`**: Unique identifier (string)
- **`name`**: Author name (string)
- **`avatar`**: Base64 image string or empty
- **`hook`**: Brief headline (string, max 120 chars)
- **`preview`**: Preview text (string, ~120 chars + "...")
- **`full`**: Full text as array of paragraphs (string array)
- **`createdAt`**: Timestamp (ISO 8601)
- **`journey`**: Optional nested context object
- **`searchText`**: Concatenated searchable text

### Display Rules:
- **Feed view**: Show hook + avatar + first paragraph + timestamp
- **Detail view**: Show full text + author name + journey context (if available)
- **Anonymous reflections**: Show "Someone shared..." instead of name

### Formatting Rules:
- Hook: Title case, no trailing punctuation
- Body text: Preserve paragraph breaks (split on `\n\n`)
- Timestamp: Display as "N days ago" or "DD MMM YYYY"
- Photo: Thumbnail 80×80px in feed, full size in detail

---

## 7. Edge Conditions

### Missing Data Behavior:
- **No avatar provided**: Show default avatar (initials or icon)
- **No journey context**: Show only reflection (skip context section)
- **Empty full text**: Possible (hook-only reflection); show as single line
- **localStorage full**: Browser throws quota error; user prompted to clear old reflections

### First-Time User Behavior:
- **User hasn't posted**: Reflections section shows empty or community examples
- **User submits first reflection**: Immediately visible in feed (no moderation delay)

### Partial Completion Behavior:
- **User fills hook but no body**: Form validation prevents submit (body required)
- **User navigates away mid-form**: Form state lost (no auto-save)

### Known Limitations:
- **No editing**: Must delete + re-submit to change content
- **No threading**: Reflections are standalone (no replies/comments)
- **No visibility control**: All submitted reflections are public
- **No duplication check**: User can submit identical reflections multiple times
- **Auto-generated tags not stored**: Tags computed at display time if needed
- **No moderation**: No reporting/flagging system

---

## 8. File Ownership

### Storage:
- **localStorage key `vinca_reflections`**: Direct read/write

### Pages:
- **[app/dashboard/reflections/page.jsx](../../src/app/dashboard/reflections/page.jsx)**
  - Reflections feed (list view)
- **[app/dashboard/reflections/post/page.jsx](../../src/app/dashboard/reflections/post/page.jsx)** ← **FORM LOGIC AUTHORITY**
  - Submission form

### Components:
- Reflection card (for feed)
- Reflection detail (full view)
- Form components (text input, photo upload, etc.)

---

## Implementation Notes

**Reflection ≠ Journal**: Reflections are shareable narratives; Journal is private tracking.

**Hook-first design**: Brief headline drives discovery before user reads full text.

**Journey context optional**: Reflections can stand alone or embed challenge/solution context.

**Community-focused**: All reflections published immediately (no draft state).

**localStorage is storage**: No backend sync; browser-only persistence.
