# Discount Calculator Web App - Project Plan

## Overview

A modern, minimalist interactive discount calculator web application built with Astro JS, Svelte 5, and Tailwind CSS v4. The app allows users to calculate discounts quickly with pre-made percentage buttons and custom percentage amount input, with real-time results display.

---

## Tech Stack

| Technology       | Version | Purpose                              |
| ---------------- | ------- | ------------------------------------ |
| **Astro JS**     | Latest  | Static site framework, page routing  |
| **Svelte**       | 5.x     | Interactive UI components with runes |
| **Tailwind CSS** | 4.x     | Utility-first styling                |
| **TypeScript**   | Latest  | Type safety                          |
| **pnpm**         | Latest  | Package management                   |

### Why These Technologies?

- **Astro**: Minimal JavaScript shipped to client, excellent performance
- **Svelte 5**: Modern reactivity with runes (`$state`, `$derived`), smaller bundle size
- **Tailwind v4**: Simplified setup with Vite plugin, no config file needed
- **pnpm**: Fast, disk-efficient package manager

---

## Features

### Core Features (MVP)

1. **Price Input Field**
   - Numeric input with currency formatting
   - Validates for positive numbers
   - Auto-formats as currency (€, $, etc.)

2. **Pre-made Discount Buttons**
   - 10% discount button
   - 20% discount button
   - 30% discount button
   - One-click application

3. **Custom Discount Input**
   - Text/number input for any percentage (0-100)
   - Real-time validation
   - Updates results instantly

4. **Results Display**
   - Shows discounted final price
   - Shows amount saved
   - Shows percentage applied
   - Auto-updates on any input change

### Additional Features

1. **Currency Formatting**
   - Displays all prices with appropriate currency symbols (€, $, etc.)
   - 2 decimal places precision
   - Comma separators for thousands

2. **Dark Mode Toggle**
   - Manual toggle button in header
   - Detects system preference on load
   - Persists user choice in localStorage
   - Smooth transitions between themes

3. **Calculation History**
   - Stores last 10 calculations
   - Displays: original price → final price (% off)
   - Stored in localStorage
   - Clear all button
   - Click to reapply calculation

---

## Project Structure

```
discount-app/
├── docs/
│   └── PROJECT_PLAN.md              # This file
├── public/
│   └── favicon.svg                  # App favicon
├── src/
│   ├── components/
│   │   ├── DiscountCalculator.svelte  # Main calculator component
│   │   ├── ThemeToggle.svelte         # Dark mode toggle
│   │   └── CalculationHistory.svelte  # History component
│   ├── layouts/
│   │   └── Layout.astro               # Base layout with dark mode
│   ├── pages/
│   │   └── index.astro                # Home page
│   ├── styles/
│   │   └── global.css                 # Tailwind imports & custom styles
│   └── utils/
│       ├── formatCurrency.ts          # Currency formatting utility
│       └── storage.ts                 # localStorage utilities
├── astro.config.mjs                   # Astro configuration
├── svelte.config.js                   # Svelte preprocessor config
├── tsconfig.json                      # TypeScript configuration
├── package.json                       # Dependencies & scripts
└── .gitignore                         # Git ignore rules
```

---

## Implementation Phases

### Phase 1: Project Initialization ✓

**Goal**: Set up the development environment

- [x] Create new Astro project with minimal template
- [x] Install pnpm (if not already installed)
- [x] Initialize git repository
- [x] Add Svelte integration
- [x] Add Tailwind CSS v4 with Vite plugin
- [x] Configure TypeScript
- [x] Create project structure (folders)

**Commands**:

```bash
pnpm create astro@latest discount-app --template minimal
cd discount-app
pnpm astro add svelte
pnpm add tailwindcss @tailwindcss/vite
```

---

### Phase 2: Configuration Setup ✓

**Goal**: Configure all tools and integrations

#### 2.1 Astro Configuration (`astro.config.mjs`)

```javascript
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

#### 2.2 Svelte Configuration (`svelte.config.js`)

```javascript
import { vitePreprocess } from '@astrojs/svelte';

export default {
  preprocess: vitePreprocess(),
};
```

#### 2.3 Tailwind Setup (`src/styles/global.css`)

```css
@import 'tailwindcss';
```

#### 2.4 TypeScript Configuration

- Ensure strict mode is enabled
- Add path aliases if needed

---

### Phase 3: Base Layout & Dark Mode ✓

**Goal**: Create responsive layout with dark mode support

#### 3.1 Layout Component (`src/layouts/Layout.astro`)

Features:

- HTML boilerplate
- Meta tags for SEO
- Dark mode class toggle on `<html>` element
- Import global CSS
- Responsive viewport meta tag

#### 3.2 Dark Mode Implementation

- Use `prefers-color-scheme` media query for initial detection
- Store preference in `localStorage`
- Add dark mode toggle component
- Apply Tailwind dark mode classes (`dark:`)

#### 3.3 Theme Toggle Component (`src/components/ThemeToggle.svelte`)

- Sun/Moon icon toggle
- Smooth transition animation
- Accessible button with aria-label
- Persist state to localStorage

---

### Phase 4: Discount Calculator Component ✓

**Goal**: Build the core calculator functionality using Svelte 5 runes

#### 4.1 Component Structure (`src/components/DiscountCalculator.svelte`)

**State Management** (using Svelte 5 runes):

```javascript
let price = $state(0);
let discountPercent = $state(0);

// Derived values (auto-calculated)
let discountedPrice = $derived(price - (price * discountPercent) / 100);
let savedAmount = $derived((price * discountPercent) / 100);
```

**UI Elements**:

1. **Price Input**
   - Label: "Enter Original Price"
   - Type: number
   - Min: 0
   - Placeholder: "100.00"
   - Currency prefix: `$`

2. **Quick Discount Buttons**
   - Three buttons: 10%, 20%, 30%
   - Active state highlighting
   - Click to apply discount

3. **Custom Discount Input**
   - Label: "Custom Discount"
   - Type: number
   - Min: 0, Max: 100
   - Suffix: `%`

4. **Results Display**
   - Final Price (large, prominent)
   - Savings amount and percentage
   - Highlighted with different background

**Event Handlers**:

- `onPriceChange()`: Update price state
- `onDiscountChange()`: Update discount percent
- `applyQuickDiscount(percent)`: Set discount to preset value
- `saveToHistory()`: Store calculation in history

---

### Phase 5: Calculation History ✓

**Goal**: Track and display recent calculations

#### 5.1 History Component (`src/components/CalculationHistory.svelte`)

**Features**:

- Display last 10 calculations
- Format: `$100 → $75 (25% off)`
- Click to reapply calculation
- "Clear All" button
- Empty state message

**Storage**:

```typescript
// utils/storage.ts
interface Calculation {
  id: string;
  originalPrice: number;
  discountPercent: number;
  finalPrice: number;
  timestamp: number;
}

function saveCalculation(calc: Calculation): void;
function getHistory(): Calculation[];
function clearHistory(): void;
```

**localStorage key**: `discount-calc-history`

---

### Phase 6: Styling with Tailwind v4 ✓

**Goal**: Create a beautiful, responsive UI

#### 6.1 Design System

**Colors**:

- Primary: Blue (`blue-500`, `blue-600`)
- Success: Green (`green-500`)
- Dark mode: Zinc palette (`zinc-800`, `zinc-900`)

**Typography**:

- Headings: Bold, larger sizes
- Body: System font stack
- Numbers: Tabular figures for alignment

**Spacing**:

- Container: Max width 4xl, centered
- Padding: Consistent 4, 6, 8 units
- Gap: 4-6 units between elements

#### 6.2 Component Styles

**Calculator Card**:

- White background (light mode)
- Dark gray background (dark mode)
- Rounded corners (`rounded-2xl`)
- Shadow (`shadow-xl`)
- Padding: `p-8`

**Input Fields**:

- Border: `border-2`
- Focus ring: `focus:ring-2 focus:ring-blue-500`
- Rounded: `rounded-lg`
- Large text size
- Dark mode variants

**Buttons**:

- Pre-made discounts: Gradient backgrounds
- Hover: Scale up slightly (`hover:scale-105`)
- Active state: Different color
- Transition: All 200ms

**Results Display**:

- Background: Light blue (light mode), Dark blue (dark mode)
- Large, bold numbers
- Green text for savings amount

#### 6.3 Responsive Design

**Breakpoints**:

- Mobile: Default (< 640px)
- Tablet: `sm:` (≥ 640px)
- Desktop: `md:` (≥ 768px)

**Layout Adjustments**:

- Mobile: Stack vertically, full width
- Tablet: 2-column for discount buttons
- Desktop: Calculator centered, max width

---

### Phase 7: Utilities & Helpers ✓

**Goal**: Create reusable utility functions

#### 7.1 Currency Formatting (`src/utils/formatCurrency.ts`)

```typescript
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
}
```

#### 7.2 LocalStorage Utilities (`src/utils/storage.ts`)

- Type-safe storage operations
- Error handling for quota exceeded
- JSON serialization/deserialization
- Validation of stored data

---

### Phase 8: Homepage Integration ✓

**Goal**: Assemble all components on the main page

#### 8.1 Index Page (`src/pages/index.astro`)

```astro
---
import Layout from '../layouts/Layout.astro';
import DiscountCalculator from '../components/DiscountCalculator.svelte';
import CalculationHistory from '../components/CalculationHistory.svelte';
---

<Layout title="Discount Calculator">
  <main class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-8">
      Discount Calculator
    </h1>

    <div class="grid gap-8 md:grid-cols-2">
      <DiscountCalculator client:load />
      <CalculationHistory client:load />
    </div>
  </main>
</Layout>
```

**Client Directives**:

- `client:load`: Loads and hydrates immediately
- Necessary for interactive Svelte components

---

### Phase 9: Testing & Refinement ✓

**Goal**: Ensure everything works correctly

#### 9.1 Manual Testing Checklist

- [ ] Price input accepts valid numbers
- [ ] Price input rejects invalid input
- [ ] Quick discount buttons apply correctly
- [ ] Custom discount input works (0-100%)
- [ ] Results update in real-time
- [ ] Currency formatting displays correctly
- [ ] Dark mode toggle works
- [ ] Dark mode preference persists
- [ ] History saves calculations
- [ ] History displays correctly
- [ ] History "Clear All" works
- [ ] Clicking history item reapplies calculation
- [ ] Responsive layout on mobile
- [ ] Responsive layout on tablet
- [ ] Responsive layout on desktop

#### 9.2 Edge Cases

- [ ] Price = 0
- [ ] Discount = 0%
- [ ] Discount = 100%
- [ ] Very large prices
- [ ] Decimal percentages
- [ ] Negative numbers (should be prevented)

---

### Phase 10: Optimization & Polish ✓

**Goal**: Performance and UX improvements

#### 10.1 Performance

- Ensure minimal JavaScript shipped
- Check bundle size with `astro build`
- Lazy load non-critical components if needed
- Optimize images (if any)

#### 10.2 Accessibility

- [ ] All inputs have labels
- [ ] Buttons have accessible names
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Focus indicators visible

#### 10.3 User Experience

- [ ] Add loading states if needed
- [ ] Smooth transitions and animations
- [ ] Clear error messages
- [ ] Helpful placeholder text
- [ ] Tooltips for buttons
- [ ] Mobile-friendly touch targets (min 44x44px)

---

## UI/UX Design Specifications

### Color Palette

**Light Mode**:

- Background: `#ffffff`
- Card Background: `#f9fafb`
- Text Primary: `#111827`
- Text Secondary: `#6b7280`
- Primary Color: `#3b82f6` (Blue)
- Success Color: `#10b981` (Green)
- Border: `#e5e7eb`

**Dark Mode**:

- Background: `#0f172a`
- Card Background: `#1e293b`
- Text Primary: `#f1f5f9`
- Text Secondary: `#94a3b8`
- Primary Color: `#60a5fa` (Light Blue)
- Success Color: `#34d399` (Light Green)
- Border: `#334155`

### Typography

**Font Family**: System font stack

```css
font-family:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
  Cantarell, sans-serif;
```

**Font Sizes**:

- Page Title: `2.25rem` (36px)
- Section Title: `1.5rem` (24px)
- Input Text: `1.125rem` (18px)
- Result Price: `2rem` (32px)
- Body Text: `1rem` (16px)
- Small Text: `0.875rem` (14px)

### Component Specifications

#### Calculator Card

- Width: `100%` mobile, `600px` max desktop
- Padding: `2rem` (32px)
- Border Radius: `1rem` (16px)
- Shadow: `0 20px 25px -5px rgb(0 0 0 / 0.1)`

#### Input Fields

- Height: `3rem` (48px)
- Font Size: `1.125rem` (18px)
- Padding: `0.75rem` (12px)
- Border Width: `2px`
- Border Radius: `0.5rem` (8px)

#### Buttons (Quick Discount)

- Height: `3.5rem` (56px)
- Font Size: `1.125rem` (18px)
- Font Weight: `600` (Semi-bold)
- Border Radius: `0.75rem` (12px)
- Transition: `all 200ms ease-in-out`

#### Results Display

- Background: Gradient or solid color
- Padding: `1.5rem` (24px)
- Border Radius: `0.75rem` (12px)
- Margin Top: `1.5rem` (24px)

---

## Data Models

### Calculation State

```typescript
interface CalculatorState {
  price: number; // Original price
  discountPercent: number; // Discount percentage (0-100)
  finalPrice: number; // Calculated (derived)
  savedAmount: number; // Calculated (derived)
}
```

### History Entry

```typescript
interface HistoryEntry {
  id: string; // Unique identifier (timestamp or UUID)
  originalPrice: number; // Price before discount
  discountPercent: number; // Discount applied
  finalPrice: number; // Price after discount
  timestamp: number; // When calculation was made
}
```

### Dark Mode State

```typescript
interface ThemeState {
  isDark: boolean; // Current theme
  preference: 'light' | 'dark' | 'system'; // User preference
}
```

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm astro check

# Format code (if Prettier is configured)
pnpm format
```

---

## Browser Support

### Target Browsers

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari: iOS 14+
- Chrome Android: Last 2 versions

### Required Features

- CSS Grid
- CSS Custom Properties
- LocalStorage
- ES2020+ JavaScript
- Proxy (for Svelte 5 reactivity)

---

## Future Enhancements (Post-MVP)

### Potential Features

1. **Multiple Currencies**
   - Currency selector dropdown
   - Real-time exchange rates (API)
   - Format based on locale

2. **Tax Calculator**
   - Calculate tax on discounted price
   - Support different tax rates
   - Toggle tax on/off

3. **Comparison Mode**
   - Compare multiple discount scenarios
   - Side-by-side comparison
   - Best deal highlighting

4. **Share Calculations**
   - Generate shareable link
   - QR code generation
   - Export as PDF

5. **Batch Calculator**
   - Multiple items at once
   - CSV import/export
   - Bulk discount application

6. **Advanced Discounts**
   - Stacked discounts
   - Buy X Get Y free
   - Tiered pricing

7. **PWA Features**
   - Offline support
   - Install to home screen
   - Push notifications for deals

8. **Analytics**
   - Track popular discount percentages
   - Average savings
   - Usage statistics

---

## Dependencies

### Core Dependencies

```json
{
  "dependencies": {
    "astro": "^5.0.0",
    "svelte": "^5.0.0",
    "@astrojs/svelte": "^6.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

---

## Success Criteria

### Performance Metrics

- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Time to Interactive (TTI) < 2.5s
- [ ] Total Bundle Size < 100KB
- [ ] Lighthouse Score > 90

### Functionality

- [ ] All core features working
- [ ] All additional features working
- [ ] Calculations are accurate
- [ ] No console errors

### User Experience

- [ ] Intuitive interface
- [ ] Fast, responsive interactions
- [ ] Accessible to all users
- [ ] Works on all target browsers

---

## Timeline Estimate

| Phase     | Tasks                  | Estimated Time |
| --------- | ---------------------- | -------------- |
| Phase 1   | Project initialization | 30 minutes     |
| Phase 2   | Configuration          | 30 minutes     |
| Phase 3   | Layout & dark mode     | 1 hour         |
| Phase 4   | Calculator component   | 2 hours        |
| Phase 5   | History feature        | 1 hour         |
| Phase 6   | Styling                | 2 hours        |
| Phase 7   | Utilities              | 30 minutes     |
| Phase 8   | Integration            | 30 minutes     |
| Phase 9   | Testing                | 1 hour         |
| Phase 10  | Polish                 | 1 hour         |
| **Total** |                        | **~10 hours**  |

---

## Notes & Considerations

### Technical Decisions

1. **Why Svelte 5 Runes?**
   - Modern, ergonomic API
   - Better performance than stores
   - Cleaner code with `$state` and `$derived`
   - Smaller bundle size

2. **Why Tailwind v4?**
   - No config file needed (simpler setup)
   - Better performance with Vite plugin
   - Modern CSS features (cascade layers)
   - Smaller CSS output

3. **Why Astro?**
   - Zero JS by default (only hydrate what's needed)
   - Excellent developer experience
   - Fast builds
   - SEO-friendly

4. **Why localStorage?**
   - No backend needed
   - Instant persistence
   - Simple API
   - Sufficient for this use case

### Potential Challenges

1. **Svelte 5 is newer**
   - Less documentation available
   - Community resources still catching up
   - Solution: Refer to official Svelte 5 docs

2. **Tailwind v4 is newer**
   - Different setup process
   - Some v3 resources outdated
   - Solution: Follow official v4 migration guide

3. **Number Input Handling**
   - Browsers handle decimals differently
   - Currency formatting can be tricky
   - Solution: Use Intl.NumberFormat API

4. **Dark Mode Flash**
   - Page might flash before dark mode applies
   - Solution: Inline script to set class before render

---

## Resources

### Documentation

- [Astro Docs](https://docs.astro.build/)
- [Svelte 5 Docs](https://svelte.dev/docs/svelte/overview)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)

### Tools

- [Astro Playground](https://astro.new/)
- [Svelte Playground](https://svelte.dev/playground)
- [Tailwind Play](https://play.tailwindcss.com/)

### Community

- [Astro Discord](https://astro.build/chat)
- [Svelte Discord](https://discord.com/invite/yy75DKs)
- [Tailwind Discord](https://tailwindcss.com/discord)

---

## Version History

| Version | Date       | Changes                      |
| ------- | ---------- | ---------------------------- |
| 1.0     | 2026-01-29 | Initial project plan created |

---

**Project Start Date**: January 29, 2026  
**Author**: Development Team  
**Status**: Ready for Implementation 🚀
