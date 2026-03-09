# Page: Databank (`/databank`)

**File:** `app/app/databank/page.tsx`
**CSS:** `app/app/databank/page.module.css`
**Status:** ✅ Built — static archive entries, live user count

---

## Purpose
Lore + intelligence hub. Classified archive with redacted text entries. Left side: wireframe globe. Right side: scrollable archive. Live stat chips at bottom.

## Architecture

```
DatabankPage (client component)
├── HUD stripe (50px, GREEN bottom border — not pink like other pages)
├── .leftPanel (55% width, diagonal right clip)
│   ├── KatakanaBackground variant (cyan at 2.5% opacity, inline)
│   ├── Corner TL info text
│   ├── Wireframe globe SVG (420×420)
│   └── Corner BL info text
├── .rightPanel (52% width, diagonal left clip)
│   ├── CLASSIFIED banner (pink stripes)
│   ├── Scrollable text window
│   │   ├── Ghost "ARCHIVE" text (rotated 90°, huge, stroke only)
│   │   └── 4 archive entries (with redacted spans)
│   ├── CLASSIFIED banner (green stripes)
│   └── Bottom stat chips (live count)
├── .dividerLine (diagonal gradient stripe between panels)
├── Corner TR info text
└── FlowNav activeSlug="databank"
```

## Diagonal Panel Clip-Paths
```css
/* Left panel: right edge slants inward */
.leftPanel { clip-path: polygon(0 0, 100% 0, 70% 100%, 0 100%); }

/* Right panel: left edge slants inward */
.rightPanel { clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%); }
```
The 30%/70% creates a 25% overlap zone — the divider line sits in this overlap.

## Divider Line
```css
.dividerLine {
  position: absolute;
  left: calc(55% - 2px);
  width: 4px;
  background: linear-gradient(180deg, var(--pk), var(--cy), var(--gr));
  box-shadow: 0 0 20px rgba(255, 0, 127, 0.4);
  transform: skewX(-10deg);
}
```

## Wireframe Globe SVG
Elements:
- 2 outer glow rings (faint cyan circles)
- Main sphere outline (cyan, 1.5 stroke, 60% opacity)
- 5 latitude ellipses (horizontal, flattening from equator to poles)
- 5 longitude ellipses (vertical, narrowing)
- 2 diagonal ellipses (pink, rotated 30° and 45°, low opacity)
- 8 data nodes (green/cyan/pink circles)
- 3 connector lines between nodes (green, 30% opacity)
- Center reticle (pink circle r=12 + r=4 fill + 4 crosshair lines)
- Scan arc indicator (green arc + circle)
- "GLOBE" ghost label below (Anton 100px, stroke-only)

## Archive Entry Structure
```typescript
type BodyPart =
  | { text: string }
  | { redacted: string }   // renders as green-on-green (invisible)
  | { highlight: string }  // renders in var(--gr) color
```

Redacted CSS: `background: var(--gr); color: var(--gr);` — text is there but invisible.

## Live Data
- Fetches `COUNT(*)` from `users` table on mount → shown as ENTRIES chip
- Local timer increments `lastSync` every second → "Xs AGO" display

## Archive Entries — Real Content
**Updated 2026.03.09:** Archive entries now use real articles from `../../databank/*.md`:

| ID | File | Title |
|----|------|-------|
| ARC-0001 | `2026-03-07-the-two-audience-problem.md` | THE TWO-AUDIENCE PROBLEM |
| ARC-0002 | `2026-03-08-r2-intro-agents-need-faces.md` | AGENTS NEED FACES |
| ARC-0003 | `2026-03-08-r2-overview-nfts-are-dead.md` | NFTS ARE DEAD. LONG LIVE NFTS. |

Content is hand-excerpted into `{ text }` / `{ redacted }` / `{ highlight }` body parts.
**Note:** Still hardcoded — not read from filesystem at build time. See [[tasks/pending]] for markdown pipeline task.

## Known Issues / Gaps
- Archive entries still hardcoded (content is now real, format is not dynamic)
- LAST SYNC timer resets to 0 on mount (doesn't track actual last DB sync)
- Left panel content overflows on shorter screens (globe is 420px, fixed)
- No search/filter for archive entries yet

## HUD Stripe Color
Note: Databank uses **green** (`var(--gr)`) bottom border on HUD stripe, not pink. All other pages use pink. This is intentional — matches mockup.

## Related
- [[design/patterns]]
- [[decisions/supabase-schema]]
- [[tasks/pending]]
