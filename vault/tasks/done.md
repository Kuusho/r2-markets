# Tasks: Done

> Completed implementation phases. Do not re-implement these.

---

## ✅ Phase 1 — Project Scaffold
- `npx create-next-app@latest app --typescript --eslint --app --no-tailwind`
- All deps installed: wagmi, viem, @tanstack/react-query, @supabase/supabase-js, @supabase/ssr, @walletconnect/ethereum-provider
- `globals.css` — design tokens, font import, reset
- `app/layout.tsx` — root layout with ClientProviders

## ✅ Phase 2 — Supabase Setup
- `lib/supabase/client.ts` — browser client
- `lib/supabase/server.ts` — server client with Next.js cookies()
- `lib/supabase/schema.sql` — full schema with RLS
- `.env.local` — all env var placeholders documented

## ✅ Phase 3 — Wagmi Config + Web3 Provider
- `lib/wagmi/config.ts` — base + baseSepolia, injected + walletConnect connectors
- `components/providers/Web3Provider.tsx` — wagmi + react-query
- `components/providers/ClientProviders.tsx` — SSR-safe dynamic wrapper

## ✅ Phase 4 — Layout Components
- `components/layout/HudOverlay.tsx` + CSS module
- `components/layout/KatakanaBackground.tsx` + CSS module
- `components/layout/DiagonalAccent.tsx` + CSS module (2 variants)
- `components/layout/FlowNav.tsx` + CSS module

## ✅ Phase 5 — Splash Page (`/`)
- `app/page.tsx` — server component with cityscape SVG, all layers
- `app/page.module.css`
- `components/splash/SplashCta.tsx` + CSS — skewed button, client routing

## ✅ Phase 6 — Utility Libs
- `lib/referral.ts` — `generateReferralCode(wallet)` via keccak256 → base36
- `lib/signature.ts` — `buildInitMessage()` + `verifyInitSignature()` via viem

## ✅ Phase 7 — API Routes
- `/api/waitlist/register` — upsert user, handle referral chain
- `/api/waitlist/referrals` — count by referrer wallet
- `/api/waitlist/verify-sig` — EIP-191 verify + insert pending_registration
- `/api/auth/twitter` — OAuth initiate (stubbed)
- `/api/auth/twitter/callback` — OAuth callback (stubbed)
- `/api/auth/discord` — OAuth initiate (stubbed)
- `/api/auth/discord/callback` — OAuth callback (stubbed)
- `/api/auth/discord/verify-roles` — bot role check (stubbed, ready for activation)
- `/api/relayer/process` — GET (queue inspect) + POST (scaffold)
- `/ref/[code]/page.tsx` — localStorage set + redirect to /waitlist

## ✅ Phase 8 — Waitlist Page (`/waitlist`)
- Full 4-card quest flow
- Gate logic: card1Complete && card2Complete (3 refs) && card3Complete = init unlock
- wagmi wallet connect + signMessageAsync
- OAuth stub detection via searchParams
- Referral URL display + clipboard copy
- Suspense wrapper for useSearchParams

## ✅ Phase 9 — Profile Page (`/profile`)
- ERC-8004 ID card with chamfered clip-path + SVG border overlay
- Barcode strip (CSS repeating-gradient)
- Robot avatar SVG (inline)
- Biometric thumbprint SVG
- Right edit panel: display name, risk tier toggles, protocol tags
- CONFIRM LOADOUT button (pink → cyan hover)
- Supabase data fetch on mount

## ✅ Phase 10 — Databank Page (`/databank`)
- Split diagonal panels with clip-path
- Wireframe globe SVG (420×420)
- 4 hardcoded archive entries with redacted spans
- CLASSIFIED banners (striped gradient)
- Live user count from Supabase
- Last sync timer

## ✅ Build
- `npm run build` — clean, 16 routes, 0 TypeScript errors
- Two bugs fixed:
  1. wagmi localStorage SSR crash → ClientProviders dynamic wrapper
  2. useSearchParams needs Suspense → WaitlistPage wrapper
  3. TypeScript `dim` property on const array → typed as mutable array

## ✅ Supabase Live (2026.03.09)
- Project URL: `https://tmqbnezyfpysnjoaqdnb.supabase.co`
- Anon key set in `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Schema applied via SQL editor — all 3 tables created with RLS
- Verified: register writes real row, referrals queries real count, delete works
- All API routes fully live — no more stub responses

## ✅ Dev Environment Test (ngrok)
- `npm run dev` on port 3000, exposed via `ngrok http 3000`
- Runtime error found: `/api/waitlist/referrals` returning empty body (not JSON) when Supabase env vars are placeholders → `createServerClient` throws on init before any response sent

## ✅ Supabase Stub Resilience (all 3 waitlist routes)
All Supabase-touching API routes now wrapped in try-catch to handle unconfigured DB:
- `POST /api/waitlist/register` → returns `{ user: stubRecord, alreadyExisted: false, stub: true }`
- `GET /api/waitlist/referrals` → returns `{ count: 0, stub: true }`
- `POST /api/waitlist/verify-sig` → returns `{ success: true, queueSlot: 1, stub: true }`
The waitlist UI now functions end-to-end without a Supabase project.

## ✅ Databank: Real Article Content
Replaced 4 fictional `ARCHIVE_ENTRIES` with 3 real entries from `../../databank/*.md`:
- `ARC-0001` — "The Two-Audience Problem" (2026.03.07) — two-audience architecture, humans deploy / agents trade
- `ARC-0002` — "Agents Need Faces" (2026.03.08) — identity gap, mutable metadata, agent-deployed rule
- `ARC-0003` — "NFTs Are Dead. Long Live NFTs." (2026.03.08) — 10ms blocks, 13 strategy params, fee structure
Content uses `highlight` and `redacted` span types to match the classified-intel aesthetic.

## ✅ Profile: Unconnected Wallet State
Added pink warning banner: `⚠ NO AGENT LINKED — CONNECT WALLET TO LOAD CREDENTIALS ⚠`
- Appears below HUD stripe when `!isConnected`
- CSS: `walletBanner` class in profile module, `position: absolute; top: 50px`
- Communicates empty state clearly instead of silently showing placeholder card
