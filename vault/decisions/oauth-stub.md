# Decision: OAuth Stub Pattern

**Status:** Active — neither Twitter nor Discord credentials are configured.

---

## Why We Stubbed
Neither Twitter/X API credentials nor Discord OAuth app credentials were ready at build time. Rather than block the entire waitlist flow, we built a stub pattern that:
1. Keeps all OAuth plumbing in place (routes, callbacks, DB updates)
2. Bypasses actual provider redirects in development
3. Requires only env var changes to activate — no code changes

## How It Works
```
NEXT_PUBLIC_AUTH_STUB=true  (in .env.local)
     ↓
GET /api/auth/twitter  →  immediate redirect to /waitlist?twitter_stub=true&username=R2AGENT
GET /api/auth/discord  →  immediate redirect to /waitlist?discord_stub=true&username=R2AGENT%230042
     ↓
WaitlistContent reads searchParams, sets twitterLinked/discordLinked state
```

## To Activate Real OAuth

### Twitter/X
1. Create app at developer.twitter.com
2. Enable OAuth 2.0 with PKCE
3. Add callback URL: `https://your-domain.com/api/auth/twitter/callback`
4. Set env vars: `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET`
5. Fix PKCE: replace hardcoded `"challenge"` with real code_verifier (stored in session/cookie)
6. Set `NEXT_PUBLIC_AUTH_STUB=false`

### Discord
1. Create app at discord.com/developers
2. Add OAuth2 redirect: `https://your-domain.com/api/auth/discord/callback`
3. Set env vars: `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`
4. For role verification: create Bot, enable Server Members Intent, get Bot Token
5. Set `DISCORD_BOT_TOKEN`, `DISCORD_HOLDER_ROLE_ID`, `DISCORD_GUILD_ID`

## Critical Fix Needed
The `pending_wallet` cookie is never set — the OAuth callbacks read it to know which wallet to update in DB. Fix: in the waitlist page, before doing the OAuth redirect, set a cookie via a server action or API call.

```typescript
// Before redirect in /waitlist
document.cookie = `pending_wallet=${address}; path=/; max-age=600`
// OR: call a route that sets it server-side with httpOnly
```

## Related
- [[api/auth]]
- [[tasks/pending]]
