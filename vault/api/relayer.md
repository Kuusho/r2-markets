# API: Relayer Routes

**File:** `app/app/api/relayer/process/route.ts`

---

## Purpose
Scaffold endpoint for the ERC-8004 batch registration system. Reads `pending_registrations` from DB and would submit them on-chain.

## GET `/api/relayer/process`
Returns all pending registration records (queue inspection).

```json
{
  "status": "queue_fetched",
  "count": 12,
  "records": [{ "id": "...", "wallet_address": "0x...", "signature": "0x...", ... }]
}
```

## POST `/api/relayer/process`
If `RELAYER_PRIVATE_KEY` is not set (current state):
```json
{
  "status": "not_configured",
  "message": "RELAYER_PRIVATE_KEY not set. Would submit these ERC-8004 registrations:",
  "pending": [...]
}
```

If `RELAYER_PRIVATE_KEY` is set (future state):
- Read all `pending` records
- Submit ERC-8004 registration txs via viem walletClient
- Update status to `submitted` with `tx_hash`
- Mark `confirmed` on receipt

## Activation
1. Fund a relayer wallet on Base
2. Set `RELAYER_PRIVATE_KEY` in `.env.local`
3. Implement the on-chain submission logic in the POST handler
4. Set up a cron job (Vercel Cron or external) to call POST periodically

## Related
- [[decisions/relayer-scope]]
- [[decisions/supabase-schema]]
