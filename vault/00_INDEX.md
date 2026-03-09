# R2 MARKETS — Knowledge Graph Index

> **READ THIS FIRST in a cold session.** This vault is the persistent brain for the R2 Markets build. Start here, follow the links relevant to what you're working on.

---

## What Is This Project?
Agent-only NFT marketplace on Base. Think Terminal.markets aesthetic, but anime. Agents register via ERC-8004 identity tokens (gasless, batched by backend relayer). Users join a waitlist, earn queue priority via referrals, link Twitter + Discord, then sign to initialize their agent.

**Repo root:** `/home/kuusho/ideation-labs/r2-markets/`
**Next.js app:** `/home/kuusho/ideation-labs/r2-markets/app/`
**HTML mockups:** `/home/kuusho/ideation-labs/r2-markets/mockups/anime-screen-*.html`
**This vault:** `/home/kuusho/ideation-labs/r2-markets/vault/`

---

## Quick Context

| Item | Value |
|------|-------|
| Stack | Next.js 15 (App Router), TypeScript, Vanilla CSS Modules, Wagmi v2, Viem, Supabase |
| Chain | Base mainnet (+ Base Sepolia for dev) |
| Wallets | MetaMask/injected + WalletConnect |
| Auth | Supabase (Postgres + RLS), OAuth stubbed (no live creds yet) |
| Deploy target | Vercel |
| Dev server | `npm run dev` in `/app/` |
| Build status | ✅ Clean build (16 routes, 0 errors) |

---

## Graph Nodes

### Design System
- [[design/tokens]] — colors, fonts, CSS variables
- [[design/patterns]] — clip-path, HUD brackets, katakana layer, chamfered buttons
- [[design/screens]] — mockup reference map

### Pages (implemented)
- [[pages/splash]] — `/` entry point with cityscape SVG + ACCESS.GRID CTA
- [[pages/waitlist]] — `/waitlist` 4-card quest flow (the main feature)
- [[pages/profile]] — `/profile` ERC-8004 ID card + edit panel
- [[pages/databank]] — `/databank` split diagonal layout + wireframe globe

### Components (shared)
- [[components/HudOverlay]] — corner brackets + 4 HUD text zones
- [[components/KatakanaBackground]] — full-screen Japanese noise layer
- [[components/DiagonalAccent]] — SVG diagonal slash lines (2 variants)
- [[components/FlowNav]] — fixed bottom navigation bar
- [[components/Web3Provider]] — wagmi + react-query provider tree
- [[components/SplashCta]] — client CTA button with skew animation

### API Routes
- [[api/waitlist]] — register, referral count, verify-sig
- [[api/auth]] — Twitter OAuth, Discord OAuth (both stubbed)
- [[api/relayer]] — scaffold endpoint + process route

### Architecture Decisions
- [[decisions/oauth-stub]] — why OAuth is stubbed, how to activate
- [[decisions/referral-gate]] — 3 refs = hard gate to Cards 3+4
- [[decisions/wagmi-ssr]] — how we solved wagmi localStorage crashing SSR
- [[decisions/relayer-scope]] — DB endpoint + scaffold, not live on-chain
- [[decisions/css-modules]] — vanilla CSS over Tailwind

### Database
- [[decisions/supabase-schema]] — users, referrals, pending_registrations tables

### Tasks
- [[tasks/done]] — completed implementation phases
- [[tasks/pending]] — what remains to be built
- [[tasks/blockers]] — things blocked on external inputs

---

## Session Reset Protocol

When starting a cold session on this project:
1. Read `00_INDEX.md` (this file) — 2 minutes
2. Read [[tasks/pending]] — know what's next
3. Read [[tasks/blockers]] — know what's gated
4. Read the specific page/component node for whatever you're working on
5. Check `app/` build status: `cd /home/kuusho/ideation-labs/r2-markets/app && npm run build`
