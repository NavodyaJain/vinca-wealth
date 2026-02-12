# Curations

## 1. Data Inputs

### Source: Investor Hub resource library
- **Resource metadata**:
  - ID: Unique identifier
  - Title: Resource name
  - Category: "Article", "Video", "Podcast", "Guide", etc.
  - Life stage: "earning", "milestone", "transition", "security"
  - Topics: Array of tags (e.g., "SIP", "Emergency Fund", "Tax")
  - Difficulty: "beginner", "intermediate", "advanced"
  - URL/link: Resource location
  - Author/source: Creator attribution
  - Description: Brief summary
  - Reading time: Estimated minutes

### User Context:
- Saved resources (user's bookmarks/favorites)
- View history (implicit; if tracked)
- User's life stage (from Financial Readiness or Lifestyle Planner)

---

## 2. Core Calculations

### A. Resource Filtering & Ranking

**Goal**: Surface relevant curations based on user profile.

**Process**:

1. **Life stage matching**:
   - Load user's current life stage (from saved readings)
   - Filter resources tagged with that stage
   - Secondary: Resources tagged "all-stages" included

2. **Topic relevance** (if topics tracked):
   - Extract topics from user's saved readings (e.g., "SIP", "Asset Allocation")
   - Rank resources by topic overlap:
     ```
     relevanceScore = count(resource.topics ∩ user.topics)
     ```
   - Sort by relevance (descending)

3. **Difficulty alignment** (optional):
   - Match resource difficulty to user's maturity level:
     - Novice learner → beginner resources prioritized
     - Intermediate learner → intermediate resources prioritized
     - Expert learner → all difficulties available

4. **Freshness**:
   - Resources recently added/updated promoted
   - Evergreen content also available

**Result**: Curated list of resources ranked by relevance.

### B. Saved Resources Tracking

**Goal**: Track user's bookmarked resources.

**Process**:
1. On "Save" action:
   - Add resource ID to `savedResources` array
   - Record timestamp
2. On "Unsave" action:
   - Remove resource ID from array
3. Persist to localStorage:
   - Key: `vinca_saved_resources`

**Result**: Array of saved resource IDs with save timestamps.

### C. Collection Organization

**Goal**: Organize resources into readable collections by category/stage.

**Process**:
1. Group resources by:
   - **Primary**: Life stage (earning, milestone, transition, security)
   - **Secondary**: Topic category (SIP, Emergency Fund, Taxes, etc.)
2. Within each group, sort by:
   - Saved status (saved resources first)
   - Difficulty (beginner → advanced)
   - Recency

**Result**: Hierarchical display of resources (stage → topic → resource).

---

## 3. Scoring Logic

**Not applicable** — Curations are ranked by relevance, not scored.

**Relevance ranking**:
- **Stage match**: 3 points if user's stage
- **Topic overlap**: 1 point per matching topic (max 5 points)
- **Difficulty alignment**: 1 point if matches user's level
- **Save status**: Pinned to top if saved
- **Freshness**: Recent resources (+1 boost)

**Final rank**: Sort by total relevance score (descending).

---

## 4. State Machine / Lifecycle

### States:
1. **Not saved**: Resource visible in library
2. **Saved**: Bookmarked to user's collection
3. **Viewed**: User has clicked through to resource (implicit, not tracked)

### Transitions:

```
[Not Saved] 
  → Click "Save" 
    → [Saved, added to savedResources array]

[Saved] 
  → Click "Unsave" 
    → [Not Saved, removed from array]

[Saved or Not Saved] 
  → Click "View" 
    → [External link, no state change]
```

### Data Locked:
- Resource metadata is read-only (set by admin/library curator)
- User can only toggle save/unsave status

---

## 5. Persistence & Source of Truth

### localStorage Key:
- **`vinca_saved_resources`**: Array of saved resource IDs + metadata
  ```javascript
  [
    {
      resourceId: "resource_id",
      savedAt: ISO timestamp,
      userNotes: "optional personal note"  // if feature added
    },
    ...
  ]
  ```

### Resource Library (Source of Truth):
- **Likely location**: JSON file in `/data/` or API endpoint
  - Example: `[data/investorHubResources.js](../../src/data/investorHubResources.js)` or similar
- Contains all resource definitions (title, URL, difficulty, stage, topics)

### File Ownership:
- **No dedicated engine** — Simple filtering + localStorage
- **[lib/investorHubStorage.js](../../src/lib/investorHubStorage.js)**
  - `saveResource()`, `getId()`, manage saved resources
- **Resource library** (static data file)
  - AUTHORITATIVE for resource metadata

### Components:
- Curations browse/search page
- Resource card component (for display)
- Resource detail/preview component
- Save/bookmark button component

---

## 6. Output Values

### Curated Resource Display:
- **Organized by stage**: Separate sections for each life stage
- **Within stage, by topic**: Resources grouped by topic
- **Sorted by relevance**: Higher relevance first

### Resource Card Fields:
- **Title**: Resource name
- **Category**: Article, video, guide, etc.
- **Difficulty**: Badge showing beginner/intermediate/advanced
- **Reading time**: "5 min read" or "15 min video"
- **Topics**: Array of tags (clickable for filtering)
- **Description**: Brief summary (2–3 lines)
- **Save button**: Toggle state (filled if saved, outlined if not)

### Collections:
- **My saved resources**: Filtered to only saved items
- **Resources for [stage]**: Filtered by user's current stage
- **New resources**: Recently added/updated

### Formatting Rules:
- Title: Plain case (capitalize key words)
- Category: Icon + label (e.g., 📄 Article)
- Difficulty: Badge color (green=beginner, blue=intermediate, purple=advanced)
- Time: "N min" format
- Topics: Lowercase, comma-separated

---

## 7. Edge Conditions

### Missing Data Behavior:
- **No saved resources**: "Save resources to your collection" prompt shown
- **No resources for user's stage**: "No resources yet" message, show related stage
- **No user stage data**: Display all resources without filtering (fallback to full library)

### First-Time User Behavior:
- **User hasn't saved anything**: All resources shown unsaved
- **User hasn't run Financial Readiness**: No stage filtering applied

### Partial Completion Behavior:
- **User saves mid-scroll**: Save reflected immediately in UI
- **User filters by topic**: UI updates instantly; filtered resources highlighted

### Known Limitations:
- **No search functionality**: Only filtering by stage/topic available (search could be added)
- **No user ratings**: Resources not ranked by user feedback
- **No recommendation engine**: Relevance is rule-based, not ML-driven
- **Static library**: Resources must be manually added/updated (no dynamic sourcing)
- **No premium gating**: All resources equally visible (premium feature possible)
- **No read tracking**: User's history not recorded (privacy feature)

---

## 8. File Ownership

### Data / Library:
- **Resource definitions**: Likely in `/data/` folder (JSON or JS file)
  - AUTHORITATIVE source for resource metadata

### Logic / Storage:
- **[lib/investorHubStorage.js](../../src/lib/investorHubStorage.js)**
  - Save/unsave functions
  - localStorage management
- **No dedicated engine**: Filtering logic in component

### Pages:
- **Curations browsing page** (e.g., `/dashboard/investor-hub/curations`)

### Components:
- Curations list/grid component
- Resource card component
- Filter/sort controls
- Save button component

---

## Implementation Notes

**Library-first approach**: Curations are a curated collection of external resources, not original content.

**Filtering over ranking**: Relevance based on user stage + topics, not algorithm-driven.

**Bookmarking is social**: Saved resources feature enables sharing/collaboration.

**Extensible metadata**: Resource structure can accommodate new fields (author, review, etc.) without refactoring.

**localStorage for saves**: User-specific saved list stored locally; full library can be static/CDN-served.
