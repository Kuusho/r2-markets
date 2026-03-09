# Design Tokens

> Source of truth for all visual values. These are defined in `app/app/globals.css` and referenced via CSS variables throughout all CSS modules.

---

## CSS Variables

```css
:root {
  --bg: #1A0B2E;       /* deep purple — splash, waitlist, profile bg */
  --bg-black: #000000; /* pure black — databank panels, waitlist cards */
  --pk: #FF007F;       /* neon pink — primary accent, borders, CTA */
  --gr: #CCFF00;       /* acid green — success states, active, logo */
  --cy: #00FFFF;       /* cyan — secondary accent, HUD text, globe */
}
```

## Typography

| Role | Font | Size | Style | Notes |
|------|------|------|-------|-------|
| Hero logos | Anton | 68–180px | italic | negative letter-spacing, stroke text |
| Card titles | Anton | 29px | italic | |
| HUD headings | Anton | 14–18px | italic | |
| Buttons (large) | Anton | 22–26px | italic | |
| Mono HUD text | Share Tech Mono | 7–11px | normal | 0.2–0.45em letter-spacing |
| Button labels | Share Tech Mono | 9px | normal | 0.32em letter-spacing |
| Katakana noise | Noto Sans JP 900 | 80–96px | normal | ~4% opacity, pointer-events none |

## Background Variants

| Screen | Background | Notes |
|--------|-----------|-------|
| Splash | `var(--bg)` #1A0B2E | Deep purple |
| Waitlist | `var(--bg)` #1A0B2E | Deep purple, cards are black |
| Profile | `var(--bg)` #1A0B2E | Deep purple |
| Databank | `#000000` | Pure black |

## Related
- [[design/patterns]] — how tokens are applied
- [[design/screens]] — per-screen design reference
