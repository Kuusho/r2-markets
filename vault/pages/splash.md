# Page: Splash (`/`)

**File:** `app/app/page.tsx`
**CSS:** `app/app/page.module.css`
**Status:** ✅ Complete

---

## Purpose
Entry point. Anime aesthetic reveal with cityscape, perspective grid, centered logo, and a single skewed CTA button routing to `/waitlist`.

## Architecture

```
page.tsx (server component)
├── KatakanaBackground        (z-index 1)
├── DiagonalAccent            (z-index 2, variant="default")
├── citySvg (inline SVG)      (z-index 3) — perspective grid + buildings
├── HudOverlay                (z-index 30) — 4 HUD corners
├── SplashCta                 (z-index 20) — CLIENT COMPONENT
└── FlowNav                   (z-index 100, fixed)
```

## SplashCta Component
File: `app/components/splash/SplashCta.tsx` (client component)
- Uses `useRouter` from next/navigation
- Renders: sys-label → R2 (giant stroke text) → MARKETS (pink stroke) → gradient rule → tagline → skewed button
- Button transform: `skewX(-20deg)` on wrapper, `skewX(20deg)` on inner text (counter-skew for readability)

## Key CSS Details
- `.logoR2`: 180px Anton italic, color transparent, `-webkit-text-stroke: 5px var(--gr)`
- `.logoMarkets`: 68px Anton italic, `-webkit-text-stroke: 3px var(--pk)`
- `.logoRule`: 420px × 4px, gradient `pink → cyan → green`
- `.accessBtn` hover: fill pink, text black, `translateX(-5px)`

## Cityscape SVG
Inline in page.tsx (not a separate component — it's static and heavy).
Key elements:
- Perspective floor grid: horizontal lines + vanishing-point verticals to (720, 300)
- Left building cluster: 5 buildings with neon-lit window rects
- Right building cluster: mirrored
- Central spire: thin diamond polygon + green circle at top
- Fade overlay: gradient from transparent to #1A0B2E

## HUD Text
- TL: `SYS.VER // 1.0.4` / `CONN // BASE_NET` / `STATUS // STANDBY`
- TR: `R2-OS KERNEL` / `ERC-8004 NODE` / `BLOCK #27491842`
- BL: `PHASE 1 // ACTIVE` / `SLOTS // 3,241 REMAIN`
- BR: `© 2026 R2-SYSTEMS CORP.`

## Flow
Click ACCESS.GRID → `router.push('/waitlist')`

## Related
- [[components/SplashCta]]
- [[components/HudOverlay]]
- [[design/patterns]]
- [[pages/waitlist]]
