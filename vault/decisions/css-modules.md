# Decision: CSS Modules (No Tailwind)

**Why:** The design is a 1:1 port of HTML mockups with very specific CSS values (exact clip-path polygons, stroke-only text, specific gradient stops). Tailwind utility classes can't express most of these without heavy arbitrary-value overrides that become unreadable. Vanilla CSS modules map exactly to the mockup CSS.

---

## Conventions
- One `.module.css` per page/component file (colocated)
- CSS variables defined in `globals.css` — use `var(--pk)` etc. everywhere
- CSS class names: camelCase (e.g. `.qcardBody`, `.hudTl`)
- State variant classes: `qcard_done`, `qcard_prog`, `qcard_avail`, `qcard_lock` (underscore separator for state suffix)
- Nested state: parent class + child class via CSS cascade (not JS-driven inline styles)

## Font Loading
Fonts are loaded via Google Fonts `@import` in `globals.css` (not next/font). This is intentional — Noto Sans JP is only used in CSS for the katakana layer, not in any React component, so next/font can't provide it via variable.

## Global vs Module
Only truly global styles go in `globals.css`:
- CSS custom properties (`:root`)
- Reset (`*, *::before, *::after`)
- `html, body` baseline
- `button` base reset
- `.scrollable` utility class

Everything else lives in component-level CSS modules.
