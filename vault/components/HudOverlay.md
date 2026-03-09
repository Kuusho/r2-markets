# Component: HudOverlay

**Files:**
- `app/components/layout/HudOverlay.tsx`
- `app/components/layout/HudOverlay.module.css`

---

## Props
```typescript
interface HudOverlayProps {
  tl?: string[]   // top-left lines
  tr?: string[]   // top-right lines
  bl?: string[]   // bottom-left lines
  br?: string[]   // bottom-right lines
}
```

## What It Renders
1. Four corner bracket divs (`.cornerTl/Tr/Bl/Br`) — absolute positioned, no pointer events
2. Four HUD text overlays (`.hudTl/Tr/Bl/Br`) — each renders its string array as `<span>{line}<br /></span>`

## Color Assignment
- TL text: `rgba(0, 255, 255, 0.4)` — cyan
- TR text: `rgba(255, 0, 127, 0.45)` — pink
- BL text: `rgba(204, 255, 0, 0.35)` — green
- BR text: `rgba(255, 255, 255, 0.18)` — white dim

## Usage
Server component (no client hooks). Drop anywhere inside a `position: relative` container.

```tsx
<HudOverlay
  tl={['SYS.VER // 1.0.4', 'CONN // BASE_NET']}
  tr={['R2-OS KERNEL', 'ERC-8004 NODE']}
  bl={['PHASE 1 // ACTIVE']}
  br={['© 2026 R2-SYSTEMS CORP.']}
/>
```

## Related
- [[design/patterns]] — corner bracket spec
- [[pages/splash]], [[pages/waitlist]], [[pages/profile]]
