# Footprints

## 1. Data Inputs

### Source: User submission form
- **Journey context** (user-provided):
  - Name/user identifier
  - Life stage: "earning", "milestone", "transition", "security"
  - Key financial challenges faced (array of strings)
  - How challenges were handled (narrative text)
  - What was learned/reflection (narrative text)
  - Photo/avatar (optional)
  - Email/contact (optional; for community engagement)

### Visibility Settings:
- Privacy level: "public" or "anonymous"
- Visible fields: Subset of journey details user chooses to share
- Can include: Name, challenges, solutions, reflection, photo

---

## 2. Core Calculations

### A. Entry Creation

**Goal**: Convert form submission into persistent footprint record.

**Process**:
1. Generate unique ID: `footprint_${timestamp}`
2. Capture metadata:
   - `createdAt`: Current ISO timestamp
   - `lifeStage`: Selected stage category
   - `isAnonymous`: Boolean from privacy setting
3. Parse form data:
   - Extract challenges (array)
   - Extract narrative (how handled + reflection)
   - Store photo if provided
4. Concatenate for searchability:
   ```
   fullText = challenges.join(" ") + " " + howTheyHandled + " " + reflection
   ```

**Result**: Footprint record with full metadata and indexed content.

### B. Storage & Indexing

**Goal**: Enable discovery by life stage and topic.

**Process**:
1. **Life stage categorization**: Assign to one of four bins:
   - "earning": High income phase, building corpus
   - "milestone": Pre-retirement transition planning
   - "transition": Early retirement adjustments
   - "security": Late retirement, wealth preservation

2. **Challenge tagging** (auto-derived):
   - Parse challenges text for keywords:
     - "SIP", "tax", "investment", "expense", "health", "goal", etc.
   - Create tag array: `tags = ["SIP", "Investment", ...]`

3. **Sort by recency**: Newer footprints appear first in feeds

**Result**: Footprints indexed by stage + tags + timestamp.

### C. Visibility Rules

**Goal**: Control what data is exposed to community.

**Rules**:
- **Anonymous footprints**: Name hidden, "Someone in [stage]" shown
- **Public footprints**: Full detail visible
- **Selected fields**: User can hide specific fields (e.g., show challenge but hide solution)

**Process**:
1. Load `visibleFields: ["challenge", "howTheyHandled", "reflection"]`
2. At display time, omit non-visible fields
3. If anonymous, replace name with stage tag

**Result**: Curated view of footprint respects privacy choices.

---

## 3. Scoring Logic

**Not applicable** — Footprints are qualitative journey records, not scored.

**Relevance ranking** (for feed):
- **Recency**: Most recent first (primary sort)
- **Stage match**: Footprints from user's current stage ranked higher (secondary)
- **Challenge alignment**: Footprints containing user's tags ranked higher (tertiary)

---

## 4. State Machine / Lifecycle

### States:
1. **Draft** (optional): User composing entry
2. **Submitted**: Entry persisted to localStorage
3. **Published**: Entry visible in community feed (based on visibility setting)

### Transitions:

```
[Composing] 
  → Save as Draft 
    → [Draft, saved locally]
  → Submit 
    → [Published]

[Draft] 
  → Edit & Resubmit 
    → [Published, updated]
  → Delete 
    → [Removed]
```

### Data Written at Transitions:
- **On Submit**: Write to `vinca_footprints` localStorage array
- **On visibility change**: Update privacy field (no timestamp change)
- **On delete**: Remove from array

---

## 5. Persistence & Source of Truth

### localStorage Key:
- **`vinca_footprints`**: Array of footprint records
  ```javascript
  [
    {
      id: "footprint_${timestamp}",
      createdAt: ISO timestamp,
      lifeStage: "earning" | "milestone" | "transition" | "security",
      challenges: ["challenge 1", "challenge 2", ...],
      howTheyHandled: "narrative text",
      reflection: "narrative text",
      isAnonymous: boolean,
      visibleFields: ["challenge", "howTheyHandled", ...],
      photo: "data:image/..." or null,
      tags: ["SIP", "Investment", ...],  // auto-derived
      searchText: "concatenated challenges + narrative"  // for searching
    },
    ...
  ]
  ```

### File Ownership:
- **No dedicated engine** — Simple localStorage wrapper
- **[lib/journalStore.js](../../src/lib/journalStore.js)** contains helpers (though primarily for Journal, not Footprints)

### Components:
- **Footprints submission page**: Form capture
- **Footprints feed page**: Display with privacy rules applied
- **Footprints detail page**: Full entry view (if public)

---

## 6. Output Values

### Footprint Record Fields:
- **`id`**: Unique identifier (string)
- **`createdAt`**: Timestamp (ISO 8601)
- **`lifeStage`**: One of four stage categories
- **`challenges`**: Array of challenge strings
- **`howTheyHandled`**: Solution narrative
- **`reflection`**: Learned/outcome narrative
- **`isAnonymous`**: Boolean
- **`visibleFields`**: Array of field names to display
- **`photo`**: Base64 image data or null
- **`tags`**: Array of auto-derived topic tags
- **`searchText`**: Concatenated text for full-text search

### Feed Display Rules:
- **For public footprints**: Show all visible fields
- **For anonymous footprints**: Replace name with "Someone in [stage]"
- **Hidden fields**: Omit entirely (don't show placeholder)

### Formatting Rules:
- Life stage: Capitalized single word
- Challenges: Display as bullet list
- Solution/reflection: Display as paragraphs
- Photo: Thumbnail at 100×100px, full size on detail page

---

## 7. Edge Conditions

### Missing Data Behavior:
- **No challenges provided**: Skip challenge section, show only narrative
- **No photo**: Default avatar shown (e.g., initials or stage icon)
- **No visible fields selected**: Default to challenge + reflection (hide solution)
- **localStorage corruption**: Non-fatal; load [] (empty footprints)

### First-Time User Behavior:
- **User hasn't posted footprint**: Footprints feed empty or shows community examples
- **User submits first footprint**: Immediately visible (if public privacy setting)

### Partial Completion Behavior:
- **User starts but doesn't submit**: Draft not saved (no draft feature)
- **User navigates away mid-form**: Form state lost (confirm before exit)

### Known Limitations:
- **No comments/replies**: Footprints are read-only (community interaction happens elsewhere)
- **No edit after submission**: User must delete and resubmit to change
- **No sorting/filtering**: Feed always shows by recency (no stage/tag filters in feed)
- **No duplicate prevention**: User can submit identical footprints multiple times
- **No moderation**: No flagging or removal by community
- **Auto-tagging is keyword-based**: May miss nuanced topics or create false positives

---

## 8. File Ownership

### Storage:
- **localStorage key `vinca_footprints`**: Direct read/write

### Pages/Components:
- **[app/dashboard/footprints/page.js](../../src/app/dashboard/footprints/page.js)** (if exists)
  - Footprints feed/listing
- **[app/dashboard/footprints/post/page.js](../../src/app/dashboard/footprints/post/page.js)** (if exists)
  - Footprints submission form
- **Components**:
  - Submission form component
  - Footprint card component (for feed)
  - Detail view component

---

## Implementation Notes

**Community-driven learning**: Footprints are qualitative stories, not calculations.

**Privacy-first design**: All sharing is opt-in; anonymous option available.

**Full-text search ready**: `searchText` field pre-computed for fast filtering.

**No real-time sync**: Community feed is simulated from localStorage (no server).

**Lifecycle is simple**: Submit → Display → Delete (no drafts, no edits).
