<!-- d55246ac-92a5-463f-942b-17cf4d59df0c 74c2532b-5d9b-4470-9f52-9a6ee0e04982 -->
# Mobile Responsiveness Implementation Plan

## Overview

Fix mobile responsiveness issues across the Next.js app with focus on z-index layering for the hamburger menu and comprehensive mobile layout improvements.

## Issues Identified

### 1. **Header Mobile Menu Overlap** (`Header.tsx` + `Header.css`)

- Mobile hamburger menu at z-index 9999 (line 153 in Header.css)
- Header itself at z-index 1100 (line 10 in Header.css)
- Mobile menu dropdown opens but can be overlapped by page content

### 2. **Properties Page Sticky Elements** (`page.tsx`)

- Sticky search/filter bar at z-index 1000 (line 282)
- Filter drawer at default z-index
- Desktop filter dropdowns at z-index 1000 (lines 867, 964, 1072, 1182)

### 3. **Hero Section Mobile Elements** (`HeroSection.tsx`)

- Mobile menu at z-index 9997 (line 426)
- Search bar at z-index [100] and [200] (lines 499, 501)
- City dropdown at z-index 9000 and 9999 (lines 538, 559)

## Implementation Steps

### Step 1: Establish Z-Index Hierarchy

Create a consistent z-index system:

- Base page content: 0-10
- Sticky headers/filters: 1000-1099
- Header component: 1100-1199
- Dropdowns/popovers: 1200-1299
- Mobile menu: 1300-1399
- Modals/drawers: 1400-1499
- Toast/notifications: 1500+

### Step 2: Fix Header Component

**File: `new-nextjs-app/src/components/common/Header.css`**

- Update header z-index to 1100
- Update mobile-menu z-index to 1350 (above all other elements)
- Ensure menu button is always clickable

**File: `new-nextjs-app/src/components/common/Header.tsx`**

- Add backdrop/overlay when mobile menu is open
- Ensure proper stacking context

### Step 3: Fix Properties Page Z-Index

**File: `new-nextjs-app/src/app/properties/page.tsx`**

- Update sticky search bar z-index to 1050 (below header)
- Update filter drawer z-index to 1400
- Update desktop filter dropdowns to 1200
- Ensure mobile drawer doesn't overlap header

### Step 4: Fix Hero Section Z-Index

**File: `new-nextjs-app/src/components/home/HeroSection.tsx`**

- Update mobile menu to z-index 1350 (consistent with header)
- Update search bar to z-index 100-200 (appropriate for hero section)
- Update city dropdown to z-index 300

### Step 5: Mobile Layout Improvements

**Files: Multiple components**

- Ensure proper touch targets (minimum 44x44px)
- Fix horizontal overflow issues
- Improve spacing on mobile devices
- Test on various screen sizes (320px, 375px, 414px, 768px)

### Step 6: CSS Mobile Optimizations

**File: `new-nextjs-app/src/app/globals.css`**

- Add mobile-specific utility classes if needed
- Ensure no horizontal scroll on mobile

## Key Changes Summary

1. **Header.css**: Update z-index values (lines 10, 153)
2. **Header.tsx**: Add mobile menu overlay/backdrop
3. **properties/page.tsx**: Update all z-index values (lines 282, 524, 867, 964, 1072, 1182)
4. **HeroSection.tsx**: Update z-index values (lines 426, 499, 501, 538, 559)
5. **Responsive testing**: Verify on multiple devices

## Testing Checklist

- [ ] Hamburger menu opens and closes properly on mobile
- [ ] Hamburger menu stays on top of all page content
- [ ] Search/filter bar doesn't overlap menu button
- [ ] Filter drawer opens properly on mobile
- [ ] No horizontal scrolling on mobile devices
- [ ] All interactive elements have proper touch targets
- [ ] Layouts work on 320px, 375px, 414px, 768px, 1024px widths

### To-dos

- [ ] Create consistent z-index hierarchy and document it
- [ ] Update Header.css and Header.tsx with proper z-index values and mobile menu overlay
- [ ] Update properties page z-index values for sticky elements and drawers
- [ ] Update HeroSection z-index values for mobile menu and search elements
- [ ] Improve mobile layouts, spacing, and touch targets across components
- [ ] Test mobile responsiveness on multiple screen sizes and verify no overlaps