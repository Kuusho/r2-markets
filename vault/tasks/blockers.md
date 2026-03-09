# Tasks: Blockers

> Things that are blocked on external inputs. Track these to unblock.

---

## 🔒 No Twitter/X OAuth Credentials
**Blocks:** Real Twitter authentication in Card 1
**What's needed:** Twitter Developer App with OAuth 2.0, callback URL registered
**Current state:** Stubbed — clicking auth returns mock data
**How to unblock:** See activation checklist in [[decisions/oauth-stub]]
**Env vars needed:** `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET`

---

## 🔒 No Discord OAuth Credentials
**Blocks:** Real Discord authentication in Card 3, holder role verification
**What's needed:** Discord Developer App, OAuth2 redirect configured, Bot with Server Members Intent
**Current state:** Stubbed — clicking auth returns mock data, holder check returns `{ isHolder: false, stub: true }`
**How to unblock:** See activation checklist in [[decisions/oauth-stub]]
**Env vars needed:** `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_BOT_TOKEN`, `DISCORD_HOLDER_ROLE_ID`, `DISCORD_GUILD_ID`

---

## 🔒 No Discord Server / Role IDs
**Blocks:** Holder role verification (even with bot token)
**What's needed:** Discord server created, "Holder" role created, role ID recorded
**Env vars needed:** `DISCORD_GUILD_ID`, `DISCORD_HOLDER_ROLE_ID`

---

## ✅ Supabase — UNBLOCKED (2026.03.09)
**Project:** `https://tmqbnezyfpysnjoaqdnb.supabase.co`
**Schema:** Applied — `users`, `referrals`, `pending_registrations` with RLS
**Env vars:** Set in `.env.local`

---

## 🔒 No WalletConnect Project ID
**Blocks:** WalletConnect connector (mobile wallet scanning)
**Note:** MetaMask/injected still works without this
**What's needed:** Account at cloud.walletconnect.com → Create Project
**Env vars needed:** `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

---

## 🔒 ERC-8004 Contract Address Unknown
**Blocks:** Actual on-chain agent registration
**What's needed:** ERC-8004 registry contract deployed on Base, address known
**Current state:** Signatures are collected and stored as pending_registrations, but nothing submits them

---

## 🔒 No Funded Relayer Wallet
**Blocks:** On-chain ERC-8004 registration batch submissions
**What's needed:** Wallet with ETH on Base mainnet, private key in env
**Env vars needed:** `RELAYER_PRIVATE_KEY`

## Related
- [[tasks/pending]]
- [[decisions/oauth-stub]]
- [[decisions/relayer-scope]]
