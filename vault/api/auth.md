# API: Auth Routes (OAuth)

**All currently stubbed** — `NEXT_PUBLIC_AUTH_STUB=true` in `.env.local` bypasses real OAuth.

---

## Twitter OAuth

### GET `/api/auth/twitter`
**File:** `app/app/api/auth/twitter/route.ts`

Stub mode: redirect to `/waitlist?twitter_stub=true&username=R2AGENT`
Prod mode: build Twitter OAuth 2.0 PKCE URL, set `twitter_oauth_state` cookie, redirect to Twitter.

### GET `/api/auth/twitter/callback`
**File:** `app/app/api/auth/twitter/callback/route.ts`

Stub mode: redirect to `/waitlist?twitter_stub=true&username=R2AGENT`
Prod mode:
1. Exchange code for access token (Basic auth with clientId:clientSecret)
2. Fetch `https://api.twitter.com/2/users/me`
3. Read `pending_wallet` cookie → update user in DB
4. Redirect to `/waitlist?twitter_verified=true&username={username}`

**BLOCKER:** `pending_wallet` cookie must be set before OAuth redirect. Currently no code sets this cookie. See [[tasks/pending]].

---

## Discord OAuth

### GET `/api/auth/discord`
**File:** `app/app/api/auth/discord/route.ts`

Stub mode: redirect to `/waitlist?discord_stub=true&username=R2AGENT%230042`
Prod mode: Discord OAuth2 authorize URL, `discord_oauth_state` cookie, redirect.

### GET `/api/auth/discord/callback`
**File:** `app/app/api/auth/discord/callback/route.ts`

Prod mode:
1. Exchange code for token
2. Fetch `https://discord.com/api/users/@me`
3. Read `pending_wallet` cookie → update user in DB (discord_id, discord_username)

### GET `/api/auth/discord/verify-roles`
**File:** `app/app/api/auth/discord/verify-roles/route.ts`

**Query params:** `?wallet=0x...&discord_id=123456`

Checks env for `DISCORD_BOT_TOKEN`, `DISCORD_HOLDER_ROLE_ID`, `DISCORD_GUILD_ID`.
If missing → `{ isHolder: false, stub: true }`
If present → fetch Discord guild member, check role array.

**Response:**
```json
{ "isHolder": false, "stub": true }
```

---

## Activation Checklist (when real creds land)

| Step | Action |
|------|--------|
| Twitter | Set `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET` in `.env.local` |
| Twitter | Create OAuth 2.0 app at developer.twitter.com, add callback URL |
| Twitter | Set `NEXT_PUBLIC_AUTH_STUB=false` |
| Discord | Set `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` |
| Discord | Set `DISCORD_BOT_TOKEN`, `DISCORD_HOLDER_ROLE_ID`, `DISCORD_GUILD_ID` |
| Both | Fix `pending_wallet` cookie — set it in the waitlist page before OAuth redirect |
| Both | Add PKCE code_verifier (currently hardcoded as "challenge") |

## Related
- [[decisions/oauth-stub]]
- [[api/waitlist]]
- [[pages/waitlist]]
