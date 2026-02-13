# Curations (Investor Hub Perks) PRD

## 1. Feature Overview

**Curations** is a static editorial collection of curated products, books, planning tools, games, and retirement gifts available at `/dashboard/investor-hub/perks/`. The feature displays pre-selected external products with links to purchase or view.

No user interaction, purchase, or state tracking is implemented. It is a read-only catalog.

---

## 2. User Journey (As Implemented)

1. **Entry**: User navigates to `/dashboard/investor-hub/perks/`
2. **Browse**: See grid of product cards (books, planning tools, games, retirement gifts)
3. **Filter**: Click category filter (All, Books, Planning, Games, Retirement Gifts)
4. **View Card**: Each card shows:
   - Product title
   - Purpose/description (why this product is relevant)
   - Category icon (📘, 📓, 🎲, 🎁)
   - "View" button
5. **Click View**: External link opens in new tab (Amazon or retailer)
6. **Exit**: Return to Investor Hub or browse other products

---

## 3. Visible Outputs

**Product Cards (Grid Layout):**
- Icon (top right corner, subtle)
- Title (bold, ~3-4 words typically)
- Purpose Description (2-3 sentences explaining relevance)
- Category Badge (implicit in icon)
- "View" Button (green CTA, links to external)

**Filter Tabs:**
- All (shows 40+ products)
- Books (shows ~5-8 titles)
- Planning (shows ~2-3 planners)
- Games (shows ~4 board games)
- Retirement Gifts (shows ~3-4 gift items)

**No Status Indicators:**
- No "saved", "purchased", "available" status
- No pricing displayed
- No ratings or reviews
- No user count or popularity metrics

---

## 4. Inputs Used

**Product Data (Static):**
- Located in component code as `PRODUCTS` array
- Fields per product:
  - `title` (string)
  - `purpose` (string, 1-3 sentences)
  - `link` (URL, typically Amazon.in)
  - `category` (string: "Books", "Planning", "Games", "Retirement Gifts")
  - `icon` (emoji string: 📘, 📓, 🎲, 🎁)

**User Input:**
- Filter selection (category tab click)
- Link click (external, no tracking)

**What Is Ignored:**
- Stock/availability status
- Pricing and discounts
- User reviews or ratings
- Purchase history
- Wishlist or cart functionality
- Related products
- Search/keyword filtering (only category tabs available)
- Inventory alerts
- User recommendations based on profile

---

## 5. Calculations & Scoring Logic

**No Calculations:**
- This feature has zero scoring, ranking, or algorithmic logic
- Filter logic is simple array `.filter()` by category

**Filter Implementation:**
- Selected category stored in component state
- Display all products where `product.category === selectedCategory`
- OR if "All" selected, display all products

---

## 6. Progress & State Transitions

**No State Persistence:**
- Selected filter tab is component state only (resets on page reload)
- No localStorage or backend state
- User browsing history not tracked

**No Transitions:**
- External links open in new tab (user stays on page or goes to retailer)
- No follow-up actions or CTAs based on link click

---

## 7. Constraints & Limits

**Hard Limits:**
- Fixed product list (not dynamic or user-updated)
- 4 category options only
- Display is grid-only (no list view or other layouts)
- External links only (no in-app purchasing)

**Update Mechanism:**
- Products updated via code edit only (no CMS or content management)
- No ability for product removal, reordering, or real-time inventory sync

---

## 8. What This Feature Does NOT Do

- **No E-Commerce**: Does not process purchases or payments
- **No Inventory Tracking**: Does not check stock or availability
- **No Pricing Integration**: Does not fetch live prices from retailers
- **No Personalization**: Same catalog shown to all users
- **No Recommendations**: Does not suggest products based on user profile or calculations
- **No Wishlist or Cart**: Cannot save or compare products
- **No Reviews or Ratings**: Does not display community feedback
- **No Search**: Only category filtering, no keyword search
- **No Tracking**: Does not track click-through rate or user engagement
- **No Affiliate Programs**: Link is direct Amazon URL (no commission tracking visible)
- **No Analytics**: Does not report which products are popular
- **No User Feedback**: Cannot rate, review, or suggest products to add
- **No Purchasing History**: Does not show what user has previously purchased
- **No Alternative Products**: Does not show variants or similar options

---

## 9. Data Structure

**Static Product Catalog (Hard-Coded):**

```javascript
const PRODUCTS = [
  {
    title: "The Simple Path to Wealth",
    purpose: "A practical framework for long-term investing and financial independence thinking.",
    link: "https://www.amazon.in/dp/1533667926",
    category: "Books",
    icon: "📘"
  },
  // ... 40+ products
];
```

**No Backend Integration:**
- All data embedded in component
- No API calls, fetch, or external data source
- No authentication or user-specific data

---

## 10. Feature Characteristics

- **Static**: All content hard-coded, no updates without code change
- **Read-Only**: Users can only view and click external links
- **No Persistence**: No user interaction is stored
- **External-Focused**: Acts as directory pointing to external retailers
- **Editorial**: Human-curated selection, not algorithmic
- **Low-Maintenance**: No backend dependencies, no real-time sync needed
- **Fallback Content**: If link breaks, user sees outdated link in new tab
