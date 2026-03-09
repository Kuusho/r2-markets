# Component: FlowNav

**Files:**
- `app/components/layout/FlowNav.tsx`
- `app/components/layout/FlowNav.module.css`

---

## Props
```typescript
interface FlowNavProps {
  activeSlug: 'splash' | 'waitlist' | 'profile' | 'databank'
}
```

## Nav Items (current build scope)
```typescript
const items = [
  { num: '01', label: 'SPLASH',   slug: 'splash',   href: '/' },
  { num: '02', label: 'WAITLIST', slug: 'waitlist', href: '/waitlist' },
  { num: '03', label: 'PROFILE',  slug: 'profile',  href: '/profile' },
  { num: '08', label: 'DATABANK', slug: 'databank', href: '/databank' },
]
```
Items 04–07 (STRATEGY, DASHBOARD, MANIFEST, EXECUTE) will be added when those pages are built.

## Active Item Behavior
Active item gets:
- Green top 3px indicator bar (`::after` pseudo-element)
- Green num color
- White label color
- `rgba(204, 255, 0, 0.06)` background

## PREV/NEXT Arrows
Auto-calculated from `activeSlug` index. Wraps around (last → first).
- PREV arrow: cyan color, right border separator
- NEXT arrow: green color, left border separator

## Important: Page Padding
All pages must have `padding-bottom: 48px` on their main layout div to prevent FlowNav from covering content.

## Related
- [[design/patterns]]
