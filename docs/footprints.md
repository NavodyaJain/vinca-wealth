# Footprints PRD

## 1. Feature Overview

**Footprints** is a community-driven financial journey sharing platform accessible at `/dashboard/reflections/`. It enables users to share their real financial challenges, progress milestones, and learn from others navigating similar retirement journeys.

Core Value:
- **Share Personal Financial Journeys**: Document challenges, decisions, and progress with optional photos
- **Community Learning**: Learn from curated default footprints and community stories
- **Progress-Focused Reflection**: Record how you handled challenges and what you learned
- **Peer Engagement**: Like, comment, and discuss stories with the community

---

## 2. User Journey (As Designed)

### Footprint Creation Flow:
1. **Navigation**: User clicks floating "+" button or "Share" CTA on landing page
2. **Create Footprint Form**: User submits their story with:
   - **Title**: Main headline (max 80 chars) inspired by rotating prompts
     - Example prompts: "A moment of clarity I didn't expect", "What changed my approach to money", "A risk I took that paid off"
   - **Photos** (Optional): Up to 2 photos of personal moments or memories
   - **Journey Context** (Optional visibility toggles):
     - Name (auto-filled from profile)
     - Monthly SIP range (auto-filled from Financial Readiness Calculator)
     - Retirement Goal Age (auto-filled from Financial Readiness Calculator)
   - **Tags**: Custom tags to categorize the footprint
   - **Story**: Narrative description of the challenge or moment
   - **Challenges**: Key challenges faced
   - **How They Handled It**: Approach taken to address challenges
   - **Reflection**: Personal lesson learned or key takeaway
3. **Submission**: User clicks "Post Footprint"
4. **Confirmation**: Footprint saved to localStorage and added to feed

### Footprint Discovery Flow:
1. **Landing Page**: See grid of community footprints and default stories
2. **Default Footprints**: 3 pre-built footprints from financial advisors (newest first)
3. **User Footprints**: All posted footprints appear above defaults, sorted by newest first
4. **Read Full Story**: Click "View" to see complete footprint with photos and context
5. **Engagement**: Like, comment with replies, or share the footprint
6. **Learn & Apply**: Use insights to inform personal retirement planning

### Footprint Management:
1. **View Footprint**: Click "View" to see full story, photos, and engagement
2. **Edit Footprint**: Owner can edit title and story content (button visible only to owner)
3. **Delete Footprint**: Owner can delete own footprints with confirmation modal
4. **Comments**: View and add comments with nested replies
5. **Likes**: Like individual footprint or comments

---

## 3. Visible Outputs

**Footprints Landing Page:**
- **Header Section**:
  - Subtitle: "Leave your financial readiness footprints and learn from others who've walked the path."
  - Floating "+" button (bottom-right): Opens create footprint form

**Feed Display:**
- **Grid Layout**: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- **Footprint Cards**:
  - Hero image (optional photo) or gradient placeholder (📝 icon)
  - Title text (from hook or custom title)
  - "View →" link button
  - Consistent styling: white background, rounded corners, shadow
  - Hover effect: Shadow increases
  - Default footprints displayed below user submissions

**Create Footprint Form:**
- **Title Input**: Text field with rotating placeholder prompts (max 80 chars)
  - Example prompts rotate every 4 seconds
  - "Choose a prompt" button to manually select from list
- **Photo Upload Section** (Optional):
  - Up to 2 image uploads
  - Dashed border upload areas (4:3 aspect ratio)
  - Emoji icon (📷) with instructions
  - Remove button (×) for uploaded photos
  - Preview of selected images
- **Tags Input** (Optional):
  - Text input that accepts comma or Enter
  - Displayed as tag chips
  - Remove with backspace or X button
- **Journey Context Section** (Optional visibility toggles):
  - Checkboxes to show/hide fields:
    - Name
    - Monthly SIP
    - Retirement Goal Age
  - Auto-populated from existing user data (localStorage)
- **Story Textarea** (Required):
  - Rich text editor or plain textarea
  - Character counter
- **Challenges Input**:
  - For listing key challenges
- **How They Handled It** (Required):
  - Textarea for approach/solution
- **Reflection/Lesson Learned** (Optional):
  - Textarea for personal insights and takeaways
- **Submit Button**: "Post Footprint"

**Full Footprint View:**
- **Header**:
  - Title (large)
  - Creation date
  - Read time estimate (optional)
  - Edit button (visible only to owner)
  - Delete button (visible only to owner)
- **Photos**:
  - Carousel view if multiple photos
  - Navigation arrows (Left/Right) between photos
  - Full-width image display
- **Body Content**:
  - Story/narrative
  - Challenges section
  - How they handled it
  - Personal reflection/lesson learned
- **Journey Context** (if visible):
  - Name, Monthly SIP, Retirement Goal Age
- **Engagement Section**:
  - Like button with count (❤️)
  - Share button (Share2 icon)
  - Comments section (expandable)
  - Comments show:
    - Comment text
    - Creation date
    - Like count
    - Reply button
    - Nested replies with same structure
  - Comment input form at top
  - Reply input form (appears when replying to specific comment)
- **Owner Actions**:
  - Edit: Opens form to edit title and content
  - Delete: Shows confirmation modal before deletion
  - Save/Cancel: When in edit mode
- **Privacy Toggle**: "Share Publicly" / "Keep as Draft" (default public)
- **Action Buttons**: "Cancel", "Save Draft", "Post Footprint"

**Personal Dashboard:**
- **Summary Stats**:
  - Total footprints posted: "5"
  - Total engagement (likes + comments): "23"
  - Journey timeline: Visual progress from start to now
- **Footprint Timeline**:
  - Chronological list of all user's footprints
  - Edit/Delete buttons on each card
  - Badge showing if draft or published
  - Quick stats: likes, comments, saves

**Comments Section:**
- **Comment Input**: Text box + "Post" button
- **Comment Display**:
  - Author: "Anonymous Investor XYZ"
  - Date: "1 hour ago"
  - Comment text
  - Like count
  - Reply button (nested replies not shown initially)

---

## 4. Inputs Used

**User Submissions (Footprint Creation):**
- `retirementStage` (string, required): "accumulation" | "pre-retirement" | "retirement"
- `category` (string, required): "sip-discipline" | "healthcare" | "lifestyle" | "inflation" | "other"
- `challengeTitle` (string, required, max 60 chars)
- `challengeDescription` (string, required, max 1000 chars)
- `personJourneycounterpart` (string, optional): Text describing personal lesson or milestone
- `attachedMetrics` (object, optional):
  - `currentCorpus` (number): ₹ amount
  - `monthlySIP` (number): ₹ amount
  - `currentAge` (number): User's age
  - `retirementAge` (number): Target retirement age
  - `additionalNotes` (string): Any other relevant info
- `isPublished` (boolean, default: true): Whether footprint is shared to community

**User Interactions:**
- Like/Unlike: Boolean toggle
- Bookmark/Unbookmark: Boolean toggle
- Comment text (string, max 300 chars)
- Filter selections: retirementStage, category, sortBy
- Search query (string): Search in challenge titles and descriptions

**Data Sources:**
- User's Tool Readings: Financial Readiness (corpus, SIP), Lifestyle Planner (age, retirement age), Health Stress Test
- Personal Profile: Name (not shown), posting frequency, saved footprints
- Community Data: All published footprints from other users

**What Is Ignored:**
- User identity (always anonymous)
- Employment details or income source
- Asset allocation or specific fund names
- Tax implications or tax-loss harvesting info
- Investment returns or portfolio performance
- Social media integration or sharing
- User reputation or credibility scores
- Geographic location or demographics
- Full metadata (IP, device, browser)

---

## 4. Calculations & Sorting Logic

**Feed Sorting Logic:**
- Default order: User footprints (newest first) → Default footprints
- All footprints sorted by `createdAt` timestamp in descending order

**Engagement Metrics:**
- Like acknowledgment: Stored in localStorage by footprint ID
- Comments: Full nested replies support with timestamps
- Share: Uses native share API or clipboard fallback

---

## 5. Progress & State Transitions

**Data Persistence:**
- Footprints stored in localStorage (session-only in MVP)
- Likes stored by footprint ID
- Comments stored nested under footprint ID
- Backend integration planned for Phase 2:
  - Database: Store all footprints with timestamps
  - Authentication: Link to user account
  - Sync: Real-time updates across sessions

**Footprint Lifecycle:**

```
Create Footprint
    ↓ (user submits form)
Published
    ↓ (user clicks "Edit" or "Delete")
Updated/Deleted
```

**State Transitions:**

1. **Create Footprint**:
   - User fills form with title, story, photos (optional), journey context
   - Clicks "Post Footprint"
   - System validates required fields
   - Creates footprint object with unique ID and timestamp
   - Saves to localStorage (`vinca_reflections`)
   - Adds to community feed (newest first)

2. **Like Footprint**:
   - User clicks Like button (❤️)
   - If already liked → Unlike (removes like)
   - If not liked → Like (adds like)
   - Like state stored in localStorage (`reflection_likes`)
   - Card updates immediately

3. **Comment on Footprint**:
   - User types comment in input form
   - Clicks Send (Paper plane icon)
   - Comment added at top of thread
   - Stored in localStorage (`vinca_reflection_comments`) indexed by footprint ID
   - Real-time update (no page refresh needed)

4. **Reply to Comment**:
   - User clicks "Reply" on specific comment
   - Reply input appears
   - User types reply and clicks Send
   - Reply nested under parent comment
   - Stored in localStorage with parent comment ID

5. **Like Comment**:
   - User clicks Like on comment window
   - Toggles like state for that comment
   - Stored in localStorage (`vinca_reflection_comment_likes`)

6. **Edit Footprint**:
   - Owner clicks "Edit" button (visible only for own footprints)
   - Form opens pre-filled with current data
   - Owner modifies title and journey content
   - Clicks "Save Changes"
   - Footprint updated in localStorage
   - Success message displayed
   - Feed updates in real-time

7. **Delete Footprint**:
   - Owner clicks "Delete" button
   - Confirmation modal shown
   - Owner confirms "Are you sure?"
   - Footprint removed from localStorage
   - User redirected to footprints feed

---

## 6. Constraints & Limits

**Validation Rules:**
- **Title**: Required, max 80 chars
- **Story**: Required (min text length validated)
- **Challenges**: Optional text field
- **How They Handled It**: Optional text field
- **Reflection/Lesson**: Optional text field
- **Photos**: Optional, max 2 images
- **Tags**: Optional, comma-separated

**Hard Limits:**
- Title: Max 80 characters
- Story content: No strict character limit enforced (best practice: 500+ chars)
- Photo uploads: Max 2 images
- Tags: No strict limit enforced
- Comments: No character limit enforced
- Replies: No limit on nesting depth or count

**Current MVP Limitations:**
- No media/file attachments beyond photos
- No rich text formatting (plain text only)
- No search functionality
- No filtering by tags or other criteria
- No notifications for likes/comments
- No draft saving functionality
- Data only persists in localStorage (cleared on cache clear)

---

## 7. Data Structure (MVP - Session-Only Storage)

**Footprint Object:**
```javascript
{
  id: string (UUID format: 'reflection_YYYYMMDD_HHmmss...'),
  title: string (max 80 chars, from prompts or custom),
  story: string (narrative description),
  challenges: string (key challenges faced, optional),
  howTheyHandled: string (approach taken, optional),
  reflection: string (personal lesson learned, optional),
  tags: string[] (array of tag strings, optional),
  photos: string[] (array of base64 encoded images, max 2),
  journey: {
    context: {
      visibleFields: string[] (array of field IDs: 'name', 'monthlySip', 'retirementGoal'),
      name: string (optional, auto-filled from userProfile),
      monthlySip: string (optional, range like '₹25–50K', auto-filled),
      retirementGoal: string (optional, auto-filled from calculatorReading)
    },
    challenges: string (alias for challenges field),
    howTheyHandled: string (alias for howTheyHandled field),
    reflection: string (alias for reflection field)
  },
  createdAt: number (Unix timestamp in days, e.g., 1, 2, 3),
  isDefault: boolean (true for pre-filled default reflections, false for user-posted)
}
```

**Comment Object:**
```javascript
{
  id: string (format: 'comment_YYYYMMDD_HHmmss...'),
  text: string (comment text),
  createdAt: string (ISO timestamp),
  likes: number (like count),
  replies: Reply[] (array of nested replies)
}
```

**Reply Object:**
```javascript
{
  id: string (format: 'reply_YYYYMMDD_HHmmss...'),
  text: string (reply text),
  createdAt: string (ISO timestamp),
  likes: number (like count)
}
```

**LocalStorage Keys:**
- `vinca_reflections`: JSON stringified array of all user reflections
- `reflection_likes`: JSON object mapping reflection IDs to boolean like state
- `vinca_reflection_comments`: JSON object mapping reflection IDs to arrays of comments
- `vinca_reflection_comment_likes`: JSON object mapping reflection IDs to objects mapping comment IDs to like counts
- `calculatorReading`: Financial Readiness calculator data (auto-populated fields)
- `lifestylePlannerReading`: Lifestyle Planner data
- `userProfile`: User profile data (name, DOB for age)

**Default Footprints (Hardcoded):**
Three pre-built sample footprints shown in feed:
1. "My biggest win wasn't higher returns — it was peace of mind."
2. "I stopped waiting for motivation and focused on consistency instead."
3. "I thought saving was enough — until I realised I had no direction."

---

## 8. What This Feature Does NOT Do (MVP)

- **No Filtering**: Cannot filter by tags, date ranges, or fields
- **No Search**: No full-text search of footprint content
- **No Draft Saving**: All submissions are published immediately
- **No Bookmarking/Saving**: Cannot save footprints for later reading
- **No Personal Dashboard**: No dedicated "My Footprints" page
- **No Notifications**: No alerts for likes, comments, or replies
- **No User Profiles**: No ability to view other users' footprint history
- **No Social Graph**: Cannot follow other users
- **No Expert Curation**: All footprints are equal in feed (no promoted/featured)
- **No Rich Text**: No markdown, links, or text formatting
- **No Media Attachments**: Only photos up to 2 images
- **No Video**: Video testimonials not supported
- **No External Sharing**: Cannot share to social media (native share only)
- **No Monetization**: No tipping, donations, or sponsorships
- **No SEO**: Reflections not indexed by search engines
- **No AI/ML**: No automated suggestions or recommendations
- **No Moderation Tools**: No spam detection or reporting mechanism (MVP)

---

## 9. Routes & Navigation

**Pages (Implemented):**
- `/dashboard/reflections/` → Main feed with user + default footprints
- `/dashboard/reflections/post` → Create new footprint form
- `/dashboard/reflections/[id]` → View single footprint (full details + engagement)

**Pages (Not Implemented in MVP):**
- `/dashboard/reflections/my-footprints` → Planned: Personal dashboard
- `/dashboard/reflections/drafts` → Planned: Unpublished drafts
- `/dashboard/reflections/bookmarks` → Planned: Saved footprints
- `/dashboard/reflections/search` → Planned: Search & filter

**Navigation Integration:**
- Sidebar: Link to `/dashboard/reflections/` (if included in dashboard navigation)
- Floating button: Opens `/dashboard/reflections/post` form
- Dashboard: Can add shortcut card "Share Your Footprint" → `/dashboard/reflections/post`

---

## 10. Feature Lifecycle & Future Phases

**Phase 1 (MVP - Current):**
- ✅ Create/Edit/Delete footprints
- ✅ Browse community feed (all footprints + defaults)
- ✅ Like footprints
- ✅ Comment with nested replies
- ✅ Share footprints (native share API)
- ✅ Optional photo uploads (max 2)
- ✅ Auto-filled journey context from other tools
- ✅ localStorage persistence

**Phase 2 (Planned Enhancements):**
- Personal footprint dashboard ("My Footprints")
- Draft saving functionality
- Save/bookmark footprints feature
- Search and filtering (by tags, date, keywords)
- 30-day trash/recovery bin
- Backend persistence (database storage)
- Real-time sync across devices
- Email digest of trending footprints
- Comment moderation tools
- Spam detection and reporting mechanism

**Phase 3 (Future):**
- Rich text editor (markdown, formatting)
- More media support (videos, audio)
- Expert curated collections ("Stories from the Field")
- Integration with Sprints (post progress milestones)
- Community challenges based on footprint themes
- Insights dashboard (aggregate statistics, trending topics)
- Recommendations engine (suggest related footprints)
- Verified expert footprints/standouts

---

## 11. Compliance & Safety

**Content Guidelines:**
- Personal financial stories only (no investment advice)
- No specific stock recommendations
- No SEBI-regulated product recommendations
- No spam or marketing content
- Respectful community tone required

**Privacy:**
- No personally identifiable information required to post
- Comments visible to all users (semi-anonymous)
- No email or authentication required (MVP)
- Data stored locally in browser localStorage
- No server-side tracking or profiling

**Data Retention:**
- Active reflections: Kept indefinitely (in localStorage)
- Deleted reflections: Permanently removed immediately
- Comments: Also removed when reflection deleted
- localStorage: User-controlled (cleared when cache cleared)

**Disclaimer Message (To Be Added):**
> "Footprints are personal financial stories shared by community members. They are educational perspectives and not investment advice. Always consult a SEBI-registered financial advisor for personalized guidance on your investments."


---

## 12. User Personas & Use Cases

### Persona 1: Early Career Investor (Age 25-35)
- **Story**: "Started my SIP but I'm uncertain if ₹5,000/month is enough"
- **Action**: Posts reflection about SIP anxiety, reads stories from mid-career investors
- **Benefit**: Gains perspective that consistency matters more than amount, feels less alone

### Persona 2: Pre-Retiree (Age 55-60)
- **Story**: "My corpus seems sufficient but healthcare costs really worry me"
- **Action**: Shares healthcare planning concerns, reads recent retirees' experiences
- **Benefit**: Adjusts healthcare buffer, validates concerns are normal

### Persona 3: Lifestyle Optimizer (Any age)
- **Story**: "I reduced my expenses by 30% and increased SIP capacity — here's how"
- **Action**: Shares specific strategies with family situation details
- **Benefit**: Becomes community resource, learns from comments and replies

### Persona 4: Reader & Learner (Any age)
- **Story**: "Exploring retirement planning strategies before making major decisions"
- **Action**: Reads multiple reflections, gains exposure to different approaches
- **Benefit**: Reduces decision anxiety through pattern recognition from real stories

### Persona 5: Recent Success (Any age)
- **Story**: "Achieved my first ₹10L corpus — documenting the journey"
- **Action**: Posts milestone reflection with photos and context
- **Benefit**: Celebrates milestone, inspires others with similar goals


---

## 13. Success Metrics

**Engagement:**
- Footprints created per month: Target 20+ (MVP baseline)
- Monthly active posters: Target 15+
- Monthly active readers: Target 50+
- Average likes per footprint: Target 2+
- Average comments per footprint: Target 1+

**Content Quality:**
- Average footprint length: Target 100+ words (meaningful stories)
- % with attached photos: Target 30%+
- % with journey context revealed: Target 40%+
- % with tags: Target 50%+
- Comment sentiment (positive/constructive): Target 85%+

**Retention:**
- Repeat posters (2+ footprints): Target 50%+
- Return readers (visit 2+ times): Target 60%+
- Footprint edit rate: Indicates engagement refinement

**Other Metrics:**
- Feed load time: < 1000ms
- Form completion rate: Target 80%+
- Error rate during posting: Target < 2%
- localStorage stability: No data loss over sessions

