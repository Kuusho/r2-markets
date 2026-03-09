# Design Patterns

> Reusable visual/CSS patterns used across all screens. Know these to stay consistent.

---

## 1. Chamfered Clip-Path

The signature "cut corner" shape on cards and buttons. Always use `clip-path: polygon(...)`.

```css
/* Large card (20px cut) */
clip-path: polygon(
  0 0,
  calc(100% - 20px) 0,
  100% 20px,
  100% 100%,
  20px 100%,
  0 calc(100% - 20px)
);

/* Medium button (12px cut) */
clip-path: polygon(
  0 0, calc(100% - 12px) 0, 100% 12px,
  100% 100%, 12px 100%, 0 calc(100% - 12px)
);

/* Small button (6px cut) */
clip-path: polygon(
  0 0, calc(100% - 6px) 0, 100% 6px,
  100% 100%, 6px 100%, 0 calc(100% - 6px)
);

/* Init button (14px cut) */
clip-path: polygon(
  0 0, calc(100% - 14px) 0, 100% 14px,
  100% 100%, 14px 100%, 0 calc(100% - 14px)
);
```

**Important:** clip-path clips the border too. Use SVG `<polygon>` overlaid on top for borders on clipped elements (see ID card on [[pages/profile]]).

---

## 2. HUD Corner Brackets

4 corner brackets, each 30×30px, different color per corner:

| Corner | Color | Border sides |
|--------|-------|-------------|
| TL | `var(--cy)` | top + left |
| TR | `var(--pk)` | top + right |
| BL | `var(--gr)` | bottom + left |
| BR | `var(--cy)` | bottom + right |

Border width: 3px. Position: absolute, z-index 31.
Component: [[components/HudOverlay]]

---

## 3. Katakana Noise Layer

- Position: `absolute inset-0`, z-index 1, pointer-events none
- Font: Noto Sans JP 900, 80–96px
- Color: `rgba(255,255,255,0.04)` (some screens use rgba(0,255,255,0.025) for darker bg)
- Line-height: 1.05, letter-spacing: -3px, word-break: break-all
- Component: [[components/KatakanaBackground]]

---

## 4. Diagonal SVG Accents

Two main diagonal slashes + horizontal scan lines:
- Pink diagonal: top-left zone (x1="-60" y1="430" to x2="560" y2="-80", stroke-width 4, opacity 0.09)
- Cyan diagonal: bottom-right echo (mirrored)
- Green horizontal scan: y=118, y=782

Component: [[components/DiagonalAccent]] — `variant="default"` vs `variant="minimal"`

---

## 5. Button States

All interactive buttons follow this pattern:
```css
/* Base */
border: 1.5px solid var(--color);
color: var(--color);
background: transparent;
clip-path: /* small chamfer */;
transition: background 0.08s, color 0.08s;

/* Hover */
background: var(--color);
color: #000;
```

Colors: `--gr` (success/copy), `--cy` (connect/auth), `--pk` (OAuth/primary action)

---

## 6. Quest Card States (Waitlist)

Cards have 4 state classes: `done`, `prog`, `avail`, `lock`

| State | Border | Left bar | Watermark stroke | Title color |
|-------|--------|----------|-----------------|-------------|
| done | `--gr` | green glow | green 6.5% | `--gr` |
| prog | `--gr` | green glow | green 6.5% | #fff |
| avail | `--cy` | cyan glow | cyan 6.5% | #fff |
| lock | rgba(65,65,65,0.35) | dim gray | gray 4% | rgba(80,80,80,0.45) |

CSS in: `app/app/waitlist/page.module.css`

---

## 7. Flow Nav Bar

Fixed bottom, 48px height. Pink 3px top border. Pink glow shadow. Share Tech Mono.
- Active item: green top indicator, green num, white label
- Pages need `padding-bottom: 48px` in their layout to avoid overlap

Component: [[components/FlowNav]]

## Related
- [[design/tokens]]
- [[components/HudOverlay]]
