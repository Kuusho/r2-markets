# Decision: Supabase Schema

**Status: LIVE** — `tmqbnezyfpysnjoaqdnb.supabase.co`, schema applied 2026.03.09

**File:** `app/lib/supabase/schema.sql`
**Deploy:** Paste into Supabase SQL Editor to initialize.

---

## Tables

### `users`
| Column | Type | Notes |
|--------|------|-------|
| wallet_address | TEXT (PK) | lowercase, e.g. `0x742d35...` |
| twitter_username | TEXT | @handle without @ |
| twitter_id | TEXT | Twitter numeric user ID |
| discord_id | TEXT | Discord snowflake ID |
| discord_username | TEXT | `username#discriminator` |
| is_holder | BOOLEAN | true if Discord Holder role verified |
| referral_code | TEXT (UNIQUE) | 8-char base36, from keccak256(wallet) |
| referred_by | TEXT (FK → users) | wallet_address of referrer |
| status | TEXT | 'waitlisted' \| 'queued' \| 'upgraded' |
| created_at | TIMESTAMPTZ | auto |
| updated_at | TIMESTAMPTZ | manually updated on changes |

### `referrals`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | gen_random_uuid() |
| referrer_wallet | TEXT (FK → users) | who shared the link |
| referred_wallet | TEXT (FK → users) | who used the link |
| created_at | TIMESTAMPTZ | auto |

### `pending_registrations`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | gen_random_uuid() |
| wallet_address | TEXT (FK → users) | who signed |
| signature | TEXT | EIP-191 personal_sign result |
| message | TEXT | the signed message string |
| status | TEXT | 'pending' \| 'submitted' \| 'confirmed' \| 'failed' |
| tx_hash | TEXT | set when submitted on-chain |
| created_at | TIMESTAMPTZ | auto |
| processed_at | TIMESTAMPTZ | set when relayer handles it |

## RLS Policies
All tables have RLS enabled. Policies are open (anon can read/write) — **tighten before production** by adding wallet-based auth or using Supabase Auth sessions.

## Supabase Clients
- Browser: `app/lib/supabase/client.ts` → `createBrowserClient()` from `@supabase/ssr`
- Server: `app/lib/supabase/server.ts` → `createServerClient()` with Next.js `cookies()`

## Env Vars Needed
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Related
- [[api/waitlist]]
- [[api/auth]]
- [[api/relayer]]
