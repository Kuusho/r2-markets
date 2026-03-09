# API: Waitlist Routes

---

## POST `/api/waitlist/register`
**File:** `app/app/api/waitlist/register/route.ts`

**Request:**
```json
{ "walletAddress": "0x...", "referralCode": "ABC12345" }
```

**Behavior:**
1. Check if user already exists → return early with `{ alreadyExisted: true }`
2. Generate deterministic referral code: `generateReferralCode(walletAddress)` (keccak256 → base36)
3. If `referralCode` provided, find referrer in DB
4. Insert new user record
5. If referrer found, insert into `referrals` table

**Response:**
```json
{ "user": { ...userRecord }, "alreadyExisted": false }
// When Supabase not configured:
{ "user": { wallet_address, referral_code, status: "pending" }, "alreadyExisted": false, "stub": true }
```

---

## GET `/api/waitlist/referrals`
**File:** `app/app/api/waitlist/referrals/route.ts`

**Query params:** `?wallet=0x...`

**Response:**
```json
{ "count": 2 }
// When Supabase not configured:
{ "count": 0, "stub": true }
```
Uses Supabase count query with `{ count: 'exact', head: true }`.
**Stub resilience:** All three routes wrapped in try-catch — if `createServerClient` throws (missing env vars), returns safe stub JSON instead of crashing with empty body. Fixed 2026.03.09.

---

## POST `/api/waitlist/verify-sig`
**File:** `app/app/api/waitlist/verify-sig/route.ts`

**Request:**
```json
{
  "walletAddress": "0x...",
  "signature": "0x...",
  "message": "R2 Markets Agent Init | wallet: 0x... | ts: 1234567890"
}
```

**Behavior:**
1. `verifyInitSignature(walletAddress, signature, message)` — viem `verifyMessage`
2. If invalid → 401
3. Insert into `pending_registrations` (status: 'pending')
4. Update `users.status = 'queued'`
5. Count all queued+upgraded users → this is the queue slot number

**Response:**
```json
{ "success": true, "queueSlot": 247 }
```

---

## Lib Functions Used

### `generateReferralCode(walletAddress)` — `app/lib/referral.ts`
```typescript
keccak256(toBytes(walletAddress.toLowerCase()))
  → slice first 8 bytes (16 hex chars)
  → BigInt('0x' + hexBytes).toString(36).toUpperCase().slice(0, 8)
```
Example: `0x742d35...` → `"X4F9QR2M"`

### `buildInitMessage(address, timestamp)` — `app/lib/signature.ts`
```
"R2 Markets Agent Init | wallet: 0x... | ts: 1712345678901"
```

### `verifyInitSignature(address, signature, message)` — `app/lib/signature.ts`
Wraps viem `verifyMessage`. Returns boolean.

## Related
- [[api/auth]]
- [[pages/waitlist]]
- [[decisions/supabase-schema]]
