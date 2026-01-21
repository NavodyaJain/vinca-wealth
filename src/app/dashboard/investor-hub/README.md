# Investor Hub Module – Vinca Wealth

## Overview
Investor Hub is the education-led retirement planning community inside Vinca Wealth. It is strictly SEBI-compliant: **no stock tips, no portfolio advice, no investment recommendations**. The Hub offers awareness, community discussions, events, learning resources, and retirement planning guidance using Vinca's existing tools.

## Goals
- Foster a safe, educational, and supportive retirement planning community.
- Help users learn, discuss, and plan using calculators and curated resources.
- Match users to groups based on their retirement personality (derived from tool usage).

## Key Features & Pages

### 1. Landing Banner & Intro
- Prominent banner at the top of all Investor Hub pages.
- Explains the purpose: "Your SEBI-compliant retirement planning community. No investment advice."
- Displayed above sub-navigation tabs.

### 2. Sub-Navigation (Tabs)
- **Tabs:** Overview | Events | Resources | Groups
- **Desktop:** Tabs are sticky at the top of the main content area (never inside sidebar).
- **Mobile:** Tabs become a horizontally scrollable bar below the banner.

### 3. Overview Page (`/dashboard/investor-hub/overview`)
- What is Investor Hub? How to use it?
- Steps: Use tools → Save readings → Unlock personality → Join group → Access events/resources/discussions.
- Show user's group recommendation if available.

### 4. Events Page (`/dashboard/investor-hub/events`)
- List of upcoming events (cards: image, title, date/time, speaker, register button).
- Registration state: show 'Registered' if already joined.

### 5. Resources Page (`/dashboard/investor-hub/resources`)
- Curated learning library: retirement basics, FIRE, lifestyle planning, healthcare costs, checklists.
- Cards with title, description, and link/download.

### 6. Groups Page (`/dashboard/investor-hub/groups`)
- Show 3 fixed groups (remove old clubs logic from UI).
- Each group: name, description, join CTA.
- If joined: show discussion thread (post/read messages).
- If not joined: show read-only preview + join CTA.
- Show user's recommended group at top if available.

### 7. Group Detail View (`/dashboard/investor-hub/groups/[groupId]`)
- Group description, join/leave button, and discussion thread.
- If not joined: read-only preview + join CTA.
- If joined: can post/read messages.

### 8. Profile-to-Group Recommendation
- After user completes all tools and saves readings, map their personality to a recommended group.
- Show recommendation on Overview and Groups pages.
- If not complete: show 'Complete all tools to unlock personality'.

## UI/UX Requirements
- Use existing components: Button, Card, Banner, Sidebar, Layout wrappers.
- Cards must be clean, modern, and easy to scan.
- No overwhelming content. Prioritize clarity and fast scanning.
- Disclaimers: Show small text disclaimers on all hub pages (e.g., 'Educational community. No investment recommendations.').

## Compliance
- No stock recommendations or portfolio advice.
- All content is educational/awareness only.
- Show disclaimers where required.

## Data & Logic
- Use existing saved readings/personality mapping logic.
- If no personality: show prompt to complete all tools.
- Groups: fixed set of 3 only (remove old clubs logic from UI).

## Component Responsibilities
- **InvestorHubNav:** Renders sub-navigation tabs. Handles sticky/horizontal scroll logic.
- **Events/Resources/Groups/Overview Pages:** Fetch and display relevant data. Use cards and CTAs.
- **GroupDetail:** Handles join/leave, discussion thread, and preview state.
- **Profile/Personality:** Use existing logic to recommend group.

## State Handling
- Track joined/not joined state for groups per user.
- Registration state for events.
- Personality state (complete/incomplete).

## Routes
- `/dashboard/investor-hub/overview`
- `/dashboard/investor-hub/events`
- `/dashboard/investor-hub/resources`
- `/dashboard/investor-hub/groups`
- `/dashboard/investor-hub/groups/[groupId]`

## Implementation Notes
- Do not change tool logic/calculation logic.
- Only use/extend UI and state logic as needed for the hub.
- Remove any legacy 'clubs' UI logic.
- Ensure all pages are mobile responsive and match dashboard layout conventions.

---

## Example Prompt for Implementation

> Implement the Investor Hub module in Vinca Wealth as described above. Use Next.js (app router) and Tailwind CSS. Reuse existing UI components (Button, Card, Banner, Sidebar, Layout). Ensure all features and compliance requirements are met. Pages/routes, state handling, and UI/UX must match the specification. No investment advice or stock tips. All content is educational and SEBI-compliant.
