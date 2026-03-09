# Tasks: Pending

> What still needs to be built. Ordered by priority.

---

## 🔴 Critical (blocks live testing)

### Fix `pending_wallet` cookie for OAuth callbacks
**Where:** `app/app/waitlist/page.tsx` before OAuth redirect links
**Problem:** `/api/auth/twitter/callback` and `/api/auth/discord/callback` read `pending_wallet` cookie to know which user to update in DB. This cookie is never set.
**Fix:** Create a `POST /api/auth/set-wallet` route that sets an httpOnly cookie. Call it before any OAuth redirect.
```typescript
// In waitlist page, before OAuth button click
await fetch('/api/auth/set-wallet', { method: 'POST', body: JSON.stringify({ wallet: address }) })
```
**See:** [[decisions/oauth-stub]], [[api/auth]]

### ~~Supabase Project Setup~~ ✅ DONE
- Project live at `tmqbnezyfpysnjoaqdnb.supabase.co`
- Schema applied, all routes live

### WalletConnect Project ID
- Create project at cloud.walletconnect.com
- Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- **Blocks:** WalletConnect connector (MetaMask/injected still works without this)

---

## 🟡 High Priority (needed before real users)

### Persist Twitter/Discord state across page refresh
**Problem:** Twitter/Discord linked state lives only in React state. On refresh, cards reset.
**Fix:** Store linked state in DB after OAuth callback, fetch it from DB when wallet connects.
Add to `users` fetch in wallet registration flow.

### CONFIRM LOADOUT save to DB
**File:** `app/app/profile/page.tsx`
**Missing:** PATCH/PUT route for `/api/users/[wallet]` to update `display_name`, risk tier, etc.
Add `display_name` column to `users` table too.

### PKCE code_verifier for Twitter OAuth
Currently hardcoded as `"challenge"`. Must use a real random verifier stored in session.

### Tighten Supabase RLS
Current policies allow anon read/write to all tables. Before production:
- Users can only update their own record (check wallet against session or signed header)
- Or use Supabase Auth with wallet-based sessions (SIWE pattern)

---

## 🟢 Feature Completeness

### Add remaining FlowNav items when pages are built
Dashboard (05), Strategy (06), Manifest (07), Execute (08) — add to `FlowNav.tsx` items array when those pages exist.

### Databank: Wire markdown files for archive entries
Create `/content/databank/*.md` files, use `next-mdx-remote` or `gray-matter` + `remark` to read and render them.

### Profile: Show is_holder badge on ID card
Currently `is_holder` is fetched but not displayed on the card visual.

### Profile: Error state for unconnected wallet
Currently shows placeholder text. Should show a "connect wallet" prompt.

### Databank: Real LAST SYNC timestamp
Currently increments from 0 on mount. Should track actual last DB fetch time.

### Splash: Animate entrance
Logo and CTA could fade/slide in on load using CSS animations.

---

## 🔵 Future Phases

### Dashboard page (`/dashboard`) — `anime-screen-2-dashboard.html`
### Execute page (`/execute`) — `anime-screen-3-execute.html`
### Manifest page (`/manifest`) — `anime-screen-4-manifest.html`
### Strategy page (`/strategy`) — `anime-screen-6-strategy.html`

### Relayer: On-chain ERC-8004 submission
See [[decisions/relayer-scope]] and [[api/relayer]]

### Vercel deployment + custom domain
- `vercel.json` config
- Environment variables in Vercel dashboard
- Custom domain setup for `r2.markets`

### FORKUUSHO.md
Per `CLAUDE_PREAMBLE.md`, a plain-language explanation of the whole codebase for learning purposes. To be written after more features are stable.

## Related
- [[tasks/done]]
- [[tasks/blockers]]
