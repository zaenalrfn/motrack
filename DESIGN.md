---
name: Terracotta & Emerald Hearth
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#57423d'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#8a726c'
  outline-variant: '#ddc0ba'
  surface-tint: '#a13e28'
  primary: '#9e3c26'
  on-primary: '#ffffff'
  primary-container: '#be543c'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a3'
  secondary: '#2d6a48'
  on-secondary: '#ffffff'
  secondary-container: '#b0f1c7'
  on-secondary-container: '#33704e'
  tertiary: '#8d4b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#b15f00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad2'
  primary-fixed-dim: '#ffb4a3'
  on-primary-fixed: '#3d0600'
  on-primary-fixed-variant: '#822714'
  secondary-fixed: '#b0f1c7'
  secondary-fixed-dim: '#95d4ac'
  on-secondary-fixed: '#002111'
  on-secondary-fixed-variant: '#0f5132'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Epilogue
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Epilogue
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Epilogue
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Epilogue
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
---

## Brand & Style

This design system crafts a warm, human-first financial companion specifically tailored for collaborative family budgeting. Merging financial diligence with domestic warmth, the visual narrative avoids cold, intimidating corporate tropes in favor of an empathetic, grounded, and welcoming environment. 

### Design Movement: Tactile Humanist FinTech
The style blends contemporary tactile softness with geometric clarity. Pillowed cards, generous touch targets, and rhythmic micro-elevations emulate real-world tactile artifacts (such as physical bankbooks, family ledgers, and household envelopes). 

### Emotional Intent & Target Audience
- **Target Audience:** Modern households, multi-generational families, and domestic partners seeking transparent, stress-free money management.
- **Emotional Response:** Comfort, reliability, unity, and shared clarity. The interface strips anxiety away from personal finance, replacing tension with optimistic accountability and shared milestones.

## Colors

The color system centers around warm terracotta, anchored by deep forest green to create an organic balance between domestic hospitality and steadfast fiscal growth.

### Palette Architecture
- **Primary (`#E06D53` - Terracotta):** Represents the living hearth of the household. Deployed for primary interactive drivers, active states, milestone highlights, and energetic accents.
- **Secondary (`#0F5132` - Deep Emerald):** Symbolizes stability, savings growth, and financial health. Used for positive cash flow, confirmed states, security indicators, and grounding surfaces.
- **Tertiary (`#D97706` - Warm Amber):** Reserved for contextual warnings, budget thresholds nearing exhaustion (e.g., 80%+ limits), and attention-demanding household tasks.
- **Neutral (`#0F172A` - Midnight Slate):** Provides high-contrast legibility for primary text and structural data points.
- **Neutral Surface & Muted:** Canvas sits on `#F8FAFC`, with interactive cards elevated on pure `#FFFFFF`. Subtle secondary copy rests in cool slate `#64748B`, framed by delicate hair-line outlines in `#E2E8F0`.

## Typography

The type system pairs the architectural, geometric expressiveness of **Epilogue** for display and titling with the legible, refined neutrality of **Hanken Grotesk** for running text, tabular figures, and dense financial data.

### Tabular Figures Implementation
All financial figures (notably Indonesian Rupiah formatting `Rp xx.xxx.xxx`) must utilize OpenType tabular numbers (`font-variant-numeric: tabular-nums;` or `font-feature-settings: "tnum"`). This ensures vertical decimal and digit alignment across budget tables, comparison columns, and transaction manifests.

## Layout & Spacing

The layout is built on a responsive 12-column fluid grid system pinned inside a maximal layout width of `1440px`.

### Grid Rhythms
- **Desktop (1024px+):** 12 columns, `1.5rem` (24px) gutters, and `2.5rem` (40px) outer margins. Multi-pane panels (e.g., household budget allocation paired with active account stream) sit comfortably across 8-column and 4-column splits.
- **Tablet (768px – 1023px):** 8 columns, `1rem` (16px) gutters, `1.5rem` (24px) margins. Side-by-side transaction sheets stack into continuous flows.
- **Mobile (Below 768px):** 4 columns, `0.75rem` (12px) gutters, `1rem` (16px) margins. Interactive cards span full width, leveraging horizontal swipe carousels for discrete pocket envelopes.

## Elevation & Depth

Visual hierarchy uses warm ambient lighting paired with delicate boundaries, avoiding harsh dark drop shadows. Depth mimics plush, pillowy card decks resting upon a matte canvas.

### Ambient Shadow Spectrum
- **Base / Flat:** `0 0 0 1px #E2E8F0` — Flat outline treatment for secondary list rows and disabled containers.
- **Level 1 (Pillow Resting):** `0 4px 14px -2px rgba(224, 109, 83, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04), 0 0 0 1px #E2E8F0` — Standard presentation for household account cards and modular widgets.
- **Level 2 (Hover / Active Float):** `0 12px 24px -4px rgba(224, 109, 83, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(224, 109, 83, 0.2)` — Triggered on cursor hover over clickable transactions and cards.
- **Level 3 (Modals & Command Dialogs):** `0 24px 48px -8px rgba(15, 23, 42, 0.16), 0 8px 16px -4px rgba(224, 109, 83, 0.08)` — Applied to destructive confirmation overlays (e.g., Member Deletion, Backup Restores).

## Shapes

The design system embraces a pillowy, highly rounded geometry (`roundedness: 3`) to soften data density and alleviate financial stress.

### Radii Hierarchy
- **Pills / Full Radius (`rounded-full`):** Filter tags, role badges (Admin, Member), financial status indicators, and primary action buttons.
- **Containers & Cards (`3rem` / `rounded-3xl` for parents, `2rem` / `rounded-2xl` for children):** Envelope containers, analytical charts, and balance tiles.
- **Controls (`1rem` / `rounded-xl`):** Input text fields, select inputs, and date pickers.

## Components

### Buttons
- **Primary:** High-warmth solid `#E06D53` with crisp `#FFFFFF` typography. Features pill-shaped geometry (`rounded-full`), padded `0.75rem 1.75rem`, offering a gentle tactile bounce on active press (`scale(0.98)`).
- **Secondary:** Deep emerald `#0F5132` surface with white text, used for approving budgets or initiating family savings goals.
- **Subtle / Ghost:** Transparent surface, slate border `#E2E8F0`, dark text `#0F172A`. Hover shifts to `#F8FAFC` with a terracotta border tint.

### Status Pills & Badges
- Encased in `rounded-full` with uppercase `label-sm` tracking.
- **Active / Approved:** Soft mint background (`rgba(25, 135, 84, 0.12)`) with `#0F5132` text.
- **Soft-Deleted / Revoked:** Slate tint (`rgba(100, 116, 139, 0.12)`) with `#64748B` text.
- **Pending Approval / Warning:** Amber glow (`rgba(217, 119, 6, 0.12)`) with `#D97706` text.
- **Role Pills (Admin / Member):** Terracotta blush (`rgba(224, 109, 83, 0.12)`) with `#E06D53` text.

### Budget Utilization Progress Bars
- Continuous pill tracks (`height: 8px` or `12px`, `rounded-full`) on slate wash `#F1F5F9`.
- Dynamic filling:
  - `< 70%`: Deep Emerald (`#198754`)
  - `70% - 90%`: Warm Amber (`#D97706`)
  - `> 90%`: Terracotta (`#E06D53`) with subtle animated pulse for threshold overflows.

### Cards & Financial Envelopes
- Pure white surfaces with Level 1 pillow elevation and structural border `#E2E8F0`. 
- Internal padding is generous (`1.5rem` to `2rem`).

### Inputs & Household Selector
- Fields feature `1rem` corner rounding, inset subtle borders `#E2E8F0`, and focus rings glowing in `rgba(224, 109, 83, 0.25)`.
- Tabular numeric alignment configured by default for all monetary entries.

### Modals & Dialog Overlays
- Overlays use backdrop blur (`backdrop-blur-md`) with a tinted slate veil (`rgba(15, 23, 42, 0.45)`). Dialog boxes use `2rem` rounded corners and explicit dual-action buttons (dismissive secondary vs destructive/affirmative primary).