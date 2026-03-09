# Component: Web3Provider + ClientProviders

**Files:**
- `app/components/providers/Web3Provider.tsx` — the actual wagmi provider
- `app/components/providers/ClientProviders.tsx` — dynamic wrapper (SSR fix)

---

## Problem Solved
Wagmi reads `localStorage` during initialization, which crashes during Next.js SSR (static page generation). Solution: dynamically import with `ssr: false`.

## Architecture
```
layout.tsx (Server Component)
└── ClientProviders (Client Component)  ← dynamic import wrapper
    └── Web3Provider (lazy loaded, ssr: false)
        ├── WagmiProvider (from wagmi)
        └── QueryClientProvider (from @tanstack/react-query)
            └── {children}
```

## Why Two Files?
`next/dynamic({ ssr: false })` can only be called inside a **Client Component** (`'use client'`). `layout.tsx` is a Server Component, so we can't call dynamic() there. `ClientProviders.tsx` is a Client Component that wraps the dynamic import.

## Wagmi Config
File: `app/lib/wagmi/config.ts`
```typescript
createConfig({
  chains: [base, baseSepolia],
  connectors: [injected(), walletConnect({ projectId })],
  transports: { [base.id]: http(), [baseSepolia.id]: http() }
})
```
WalletConnect projectId: from `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` env var.

## Related
- [[decisions/wagmi-ssr]]
