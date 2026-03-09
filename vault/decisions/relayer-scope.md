# Decision: Relayer Scope

**Decision:** Build the DB endpoint fully + scaffold the relayer script. Do NOT wire live on-chain submission yet.

---

## What's Built
- `POST /api/waitlist/verify-sig` — fully functional: verifies EIP-191 sig, inserts to `pending_registrations`, marks user as 'queued'
- `GET /api/relayer/process` — reads the pending queue, returns records
- `POST /api/relayer/process` — scaffold that explains what it would do if `RELAYER_PRIVATE_KEY` was set

## What's NOT Built Yet
- On-chain ERC-8004 registration transaction
- Funded relayer wallet
- Cron job to trigger the relayer
- Status updates (submitted → confirmed) via tx receipt polling

## Architecture When Fully Built
```
User signs message
     ↓
POST /api/waitlist/verify-sig → inserts pending_registration
     ↓ (async, triggered by cron)
POST /api/relayer/process
     ↓
  read pending records
     ↓
  viem walletClient.writeContract(ERC8004Registry, 'register', [wallet])
     ↓
  update pending_registration.status = 'submitted', tx_hash = '0x...'
     ↓
  poll for receipt → update status = 'confirmed'
```

## Who Pays Gas?
The R2 backend (the relayer wallet). Users sign a gasless message; the relayer submits the actual on-chain transaction. This means R2 pays Base gas for each registration — needs funding strategy.

## Activation Steps
1. Deploy or identify ERC-8004 registry contract address on Base
2. Fund relayer wallet with ETH on Base
3. Set `RELAYER_PRIVATE_KEY` in Vercel env vars
4. Implement viem `walletClient.writeContract` in POST handler
5. Set up Vercel Cron to call POST `/api/relayer/process` every N minutes

## Related
- [[api/relayer]]
- [[decisions/supabase-schema]]
- [[tasks/pending]]
