# Implementation Plan: EventSphere Frontend Theme Refactoring & Motion Upgrades

Comprehensive visual styling and motion update across the EventSphere frontend. Single-source-of-truth CSS custom properties, modern typography pairing (Plus Jakarta Sans + Inter), Framer Motion on public pages, and cohesive micro/macro interactions.

## Proposed Changes

### 1. Fonts & CSS Design System (`client/src/index.css`)
- Import Google Fonts:
  `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');`
- Define `:root` variables:
  - Font families:
    `--font-heading: 'Plus Jakarta Sans', system-ui, sans-serif;`
    `--font-body: 'Inter', system-ui, sans-serif;`
  - Color palette:
    `--color-bg: #0B0E14;`
    `--color-surface: #161B26;`
    `--color-surface-alt: #1C2333;`
    `--color-border: #1E2A3B;`
    `--color-border-light: #263347;`
    `--color-primary: #2563EB;`
    `--color-primary-hover: #1D4ED8;`
    `--color-primary-muted: #2563EB26;`
    `--color-accent: #06B6D4;`
    `--color-accent-muted: #06B6D426;`
    `--color-text: #FFFFFF;`
    `--color-text-muted: #94A3B8;`
    `--color-text-dim: #64748B;`
    `--color-success: #10B981;`
    `--color-success-muted: #10B98126;`
    `--color-warning: #F59E0B;`
    `--color-warning-muted: #F59E0B26;`
    `--color-danger: #EF4444;`
    `--color-danger-muted: #EF444426;`
    `--color-sidebar: #0F1319;`
- Configure `body` with `font-family: var(--font-body)`, `background-color: var(--color-bg)`, `color: var(--color-text)`.
- Apply `font-family: var(--font-heading)` to `h1, h2, h3, h4, .font-heading`.
- Add utility classes for micro-interactions:
  - Primary button hover lift (`translateY(-1px)`), brightness, and soft shadow (`0 4px 15px var(--color-primary-muted)`).
  - Card hover lift (`translateY(-2px)`) and border highlight (`var(--color-border-light)`).
  - Input field focus ring (3px `var(--color-primary-muted)`).
  - Table header and hover styles.
  - Modal animations (`@keyframes modalIn`).

### 2. Dependencies
- Install `framer-motion` in `client/` for public marketing pages.

### 3. Public Pages & Motion (`framer-motion` ONLY)
- `client/src/layouts/PublicLayout.jsx`:
  - Navbar entrance animation (y: -20 → 0, opacity 0 → 1).
  - Staggered navigation links.
- `client/src/pages/public/HomePage.jsx`:
  - Hero badge fade (y: -10 → 0, delay 0.1s).
  - Main heading clamp(2.5rem, 5vw, 4rem), font-weight 800 (y: 20 → 0, duration 0.5s, delay 0.2s).
  - Subheading (delay 0.35s).
  - Buttons (y: 10 → 0, delay 0.5s, stagger 0.1s).
  - Feature cards `whileInView` (y: 30 → 0, stagger 0.15s, `viewport: { once: true }`).
  - How it Works steps `whileInView` (stagger 0.2s, `viewport: { once: true }`).
  - CTA banner `whileInView` (scale: 0.97 → 1, opacity 0 → 1, `viewport: { once: true }`).
- `client/src/pages/public/AboutPage.jsx`:
  - Sections fade in on scroll with `whileInView`.
  - Role cards stagger 0.15s.
- `client/src/pages/public/ContactPage.jsx`:
  - Info card slide from left (x: -30 → 0, opacity 0 → 1).
  - Form card slide from right (x: 30 → 0, opacity 0 → 1).
- `client/src/pages/public/PublicExposPage.jsx`:
  - Grid cards stagger fade in with `whileInView`.
  - Subtle hover scale (1 → 1.02) using `whileHover`.
- `client/src/pages/public/PublicExpoDetailPage.jsx`:
  - Detail panels fade in smoothly with `whileInView`.

### 4. Component Refinements
- `client/src/components/StatusBadge.jsx`:
  - Approved/Active/Published → Success (`var(--color-success-muted)`, `var(--color-success)`).
  - Pending/Reserved/Draft → Warning (`var(--color-warning-muted)`, `var(--color-warning)`).
  - Rejected/Cancelled → Danger (`var(--color-danger-muted)`, `var(--color-danger)`).
  - Available → Accent cyan (`var(--color-accent-muted)`, `var(--color-accent)`).
  - Default → Muted.
- `client/src/components/StatCard.jsx`:
  - Top border `2px solid var(--color-primary)`.
  - Icon container `var(--color-primary-muted)`.
  - Stat value in `var(--font-heading)` with font-weight 700.
- `client/src/components/EmptyState.jsx`:
  - 2px dashed border circle around icon with `var(--color-border-light)` and padding.
- `client/src/components/Modal.jsx`:
  - Backdrop `rgba(0,0,0,0.7)` with `backdrop-filter: blur(4px)`.
  - Top border `2px solid var(--color-primary)` and `@keyframes modalIn`.
- `client/src/components/LoadingSpinner.jsx`:
  - Border color defaults to `var(--color-primary)`.
- `client/src/components/NotificationCenter.jsx` & `InquiryList.jsx`:
  - Notification unread counter badge: `var(--color-accent)` with `#0B0E14` text.
  - Colors updated to variables.

### 5. Layouts & Application Portals
- `AdminLayout.jsx`, `ExhibitorLayout.jsx`, `AttendeeLayout.jsx`, `AuthLayout.jsx`:
  - Sidebar background: `var(--color-sidebar)`.
  - Active nav: `border-left: 2px solid var(--color-primary)`, background `var(--color-primary-muted)`.
  - Hover nav: `background: var(--color-surface-alt)`.
  - Center auth card in `AuthLayout.jsx`: `border-top: 2px solid var(--color-primary)`.
  - All portal pages and subcomponents updated to replace legacy hex colors with CSS variable tokens.

---

## Verification Plan
- Run `npm run build` in `client/` to verify zero errors and clean bundle.
- Verify framer-motion animations on public pages.
- Verify no JS or API logic has been modified.
