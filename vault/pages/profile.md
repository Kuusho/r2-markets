# Page: Profile (`/profile`)

**File:** `app/app/profile/page.tsx`
**CSS:** `app/app/profile/page.module.css`
**Status:** ✅ Built — basic data fetching wired, wallet empty state added

---

## Purpose
Displays the agent's ERC-8004 identity card after initialization. Also shows edit panel for display name, risk tier, and active protocols.

## Architecture

```
ProfilePage (client component)
├── KatakanaBackground (z-index 1)
├── DiagonalAccent variant="minimal" (z-index 2)
├── HUD stripe (top bar, 50px, pink bottom border)
├── BG grid SVG (corner bracket lines, z-index 2)
├── Corner info text (TL + BR)
├── .main (flex row, centered)
│   ├── ID Card (600×400px)
│   │   ├── SVG border overlay (chamfered polygon stroke)
│   │   ├── Barcode strip (left 48px, pink repeating-gradient)
│   │   ├── Card body grid (1fr 170px)
│   │   │   ├── Card fields (left): header stripe + 5 field groups
│   │   │   └── Card right (avatar SVG + thumbprint)
│   │   ├── Holo shimmer overlay
│   │   └── Security strip (bottom, cyan repeating gradient)
│   └── Right edit panel
│       ├── Display name (editable input + blinking cursor)
│       ├── Wallet label (read-only)
│       ├── Webhook (read-only placeholder)
│       ├── Risk tier (3 toggle buttons: AGGRESSIVE / MODERATE / CONSERVATIVE)
│       ├── Active protocols (4 tags: SNIPE green, SWEEP cyan, LEARN pink, DUMP dim)
│       └── CONFIRM LOADOUT button (pink gradient → cyan on hover)
└── FlowNav activeSlug="profile"
```

## Data Fetching
On mount (when address available):
```typescript
supabase.from('users').select('*').eq('wallet_address', address.toLowerCase()).single()
supabase.from('users').select('*', { count: 'exact', head: true }).in('status', ['queued', 'upgraded'])
```

Display name derived: `R2-ALPHA-${wallet.slice(-4).toUpperCase()}`

## ID Card Details
- Background: `linear-gradient(135deg, #0a041a 0%, #1A0B2E 50%, #0a0015 100%)`
- Clip-path: 20px chamfer on all 4 corners
- SVG border: polygon stroke `#FF007F` 3px opacity 0.8 + inner echo at 20% opacity
- Barcode: CSS `repeating-linear-gradient(90deg, ...)` with 12 different pink stripe widths

## Robot Avatar SVG (130×160 viewBox)
Inline SVG robot head with:
- Body (cyan stroke rect) + chest panels (pink stroke rects)
- Head (dark fill, cyan stroke 1.5px)
- Eyes (pink rects + white inner glow rects)
- Mouth grill (3 cyan horizontal lines)
- Antenna (green line + circle)
- Chamfer lines at head corners (green)
- "ALPHA-01" text on chest

## Blinking Cursor
```css
@keyframes blink {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0; }
}
```
Applied to `.editCursor` (14×20px pink block).

## Wallet Empty State (added 2026.03.09)
When `!isConnected`, a pink banner renders below the HUD stripe:
```
⚠  NO AGENT LINKED — CONNECT WALLET TO LOAD CREDENTIALS  ⚠
```
CSS class: `.walletBanner` (position: absolute; top: 50px; pink bg/border).

## Known Issues / Gaps
- CONFIRM LOADOUT doesn't save to DB yet — no PATCH/PUT route exists
- `is_holder` badge not shown anywhere on the card yet
- Avatar is static — eventually should reflect NFT metadata or user upload

## Related
- [[pages/waitlist]]
- [[decisions/supabase-schema]]
- [[design/patterns]]
