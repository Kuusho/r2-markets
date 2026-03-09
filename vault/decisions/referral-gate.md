# Decision: Referral Gate — Hard vs Soft

**Decision:** 3 referrals = hard gate to Cards 3 and 4.
**Chosen by:** User (confirmed in interview session).

---

## Gate Logic
```
card1Complete = isConnected && twitterLinked
card2Complete = referralCount >= 3          ← HARD GATE
card3Unlocked = card1Complete               (Discord unlocks after card1, NOT after card2)
card3Complete = discordLinked
card4Unlocked = card1Complete && card2Complete && card3Complete
```

## UI Representation
- 3 pink squares: filled = referral confirmed, empty = pending
- Counter: `{count} / 3 RECRUITS`
- Referral URL block: `r2.markets/ref/{code}` + COPY_LINK button
- Card 4 init button: locked/dim until all 4 conditions met

## Referral Code Generation
Deterministic from wallet address — no DB write needed to generate the code:
```typescript
keccak256(toBytes(walletAddress.toLowerCase()))
  → first 8 bytes → BigInt → base36 → 8 chars uppercase
```
Code is also stored in DB (`users.referral_code`) for lookup in the register route.

## Referral Flow
1. User A shares `r2.markets/ref/ABCD1234`
2. User B visits `/ref/ABCD1234` → stores code in localStorage → redirects to `/waitlist`
3. User B connects wallet → register route called with `referralCode: "ABCD1234"`
4. Server finds User A via referral_code → inserts into `referrals` table → User A's count +1

## Note
The 3-referral requirement is a **gate to agent initialization**, not just a priority boost. This creates stronger viral incentive than soft-priority-only systems.

## Related
- [[api/waitlist]]
- [[pages/waitlist]]
