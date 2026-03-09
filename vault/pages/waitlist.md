# Page: Waitlist (`/waitlist`)

**File:** `app/app/waitlist/page.tsx`
**CSS:** `app/app/waitlist/page.module.css`
**Status:** ✅ Complete (OAuth flows stubbed pending credentials)

---

## Purpose
The core onboarding flow. 4 quest cards that gate agent initialization. Users must complete cards in sequence (with the referral gate being a hard requirement).

## Architecture

```
WaitlistPage (default export, wraps in Suspense)
└── WaitlistContent (client component)
    ├── KatakanaBackground (z-index 1)
    ├── DiagonalAccent (z-index 2)
    ├── HudOverlay (z-index 30)
    ├── .layout (z-index 20, flex row)
    │   ├── .lPanel (196px left sidebar)
    │   │   ├── Header (STATUS / DIRECTIVES)
    │   │   ├── Banner rows (24 rows, dim/mid/lit cycling)
    │   │   └── Objective tracker (4 steps with dot states)
    │   └── .mPanel (flex: 1)
    │       ├── Section header
    │       └── Quest card stack (4 cards)
    └── FlowNav activeSlug="waitlist"
```

## Why Suspense Wrapper?
`useSearchParams()` requires a Suspense boundary in Next.js App Router. Pattern:
```tsx
function WaitlistContent() { /* actual component with useSearchParams */ }
export default function WaitlistPage() {
  return <Suspense><WaitlistContent /></Suspense>
}
```

## State

```typescript
// Wallet
address, isConnected          // from wagmi useAccount
connectors, connect           // from wagmi useConnect
signMessageAsync              // from wagmi useSignMessage

// Auth state
twitterLinked, twitterUsername, twitterVerifiedAt
discordLinked, discordUsername
isHolder                      // Discord holder role (from verify-roles API)

// Referral
referralCount                 // fetched from /api/waitlist/referrals
referralCode                  // generated client-side via generateReferralCode(address)
copied                        // clipboard state for copy button

// Init
agentInitialized, queueSlot, signing
```

## Gate Logic

```typescript
card1Complete = isConnected && twitterLinked
card2Complete = referralCount >= 3        // HARD GATE
card3Unlocked = card1Complete
card3Complete = discordLinked
card4Unlocked = card1Complete && card2Complete && card3Complete
```

## OAuth Stub Behavior
Since `NEXT_PUBLIC_AUTH_STUB=true` in `.env.local`:
- Clicking Twitter auth → GET `/api/auth/twitter` → redirect to `/waitlist?twitter_stub=true&username=R2AGENT`
- Clicking Discord auth → GET `/api/auth/discord` → redirect to `/waitlist?discord_stub=true&username=R2AGENT%230042`
- `useSearchParams` catches these and sets state accordingly

## Wallet Registration Flow (on connect)
1. Read `r2_referral_code` from localStorage (set by `/ref/[code]` page)
2. POST `/api/waitlist/register` with walletAddress + referralCode
3. Generate referral code client-side: `generateReferralCode(address)` (keccak256 → base36)
4. GET `/api/waitlist/referrals?wallet=...` → set referralCount

## Agent Initialization (Card 4)
1. `buildInitMessage(address, Date.now())` → `"R2 Markets Agent Init | wallet: 0x... | ts: 1234567890"`
2. `signMessageAsync({ message })` — wagmi opens wallet, user signs
3. POST `/api/waitlist/verify-sig` with `{ walletAddress, signature, message }`
4. Server verifies via viem `verifyMessage`, inserts to `pending_registrations`, updates user status to 'queued'
5. Returns `{ success: true, queueSlot: number }`
6. After 2s → `router.push('/profile')`

## Card State CSS Classes
State string → CSS class: `qcard_done`, `qcard_prog`, `qcard_avail`, `qcard_lock`
Child elements (bar, watermark, title) inherit state via parent CSS cascade.

## Known Issues / Gaps
- Discord `verify-roles` API is called but NOT yet hooked into Card 3 UI (stub just shows linked state)
- `pending_wallet` cookie not being set before OAuth redirects — server callbacks can't look up the wallet to update DB. **FIX NEEDED:** Set a cookie when wallet connects, before OAuth redirect.
- No persistence of twitter/discord state across page refreshes (lives only in React state)

## Related
- [[api/waitlist]]
- [[api/auth]]
- [[decisions/oauth-stub]]
- [[decisions/referral-gate]]
- [[components/HudOverlay]]
- [[pages/profile]]
