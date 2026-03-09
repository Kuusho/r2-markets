# Decision: Wagmi + Next.js SSR Fix

**Problem:** Wagmi v2 reads `localStorage` on initialization, which throws during Next.js static page generation (SSR context has no `window`/`localStorage`).

---

## Error Seen
```
TypeError: this.localStorage.getItem is not a function
```
During `next build` → `Generating static pages using 7 workers`

## Solution: Dynamic Import with ssr: false

The fix requires two files because `next/dynamic({ ssr: false })` can only be called inside a **Client Component**, but `layout.tsx` is a Server Component.

```
layout.tsx (Server Component)
└── ClientProviders.tsx (Client Component — 'use client')
    └── dynamic(() => import('./Web3Provider'), { ssr: false })
        └── Web3Provider.tsx (actual wagmi/react-query providers)
```

## Files
- `app/components/providers/ClientProviders.tsx` — the dynamic import wrapper
- `app/components/providers/Web3Provider.tsx` — wagmi + QueryClient providers
- `app/app/layout.tsx` — imports ClientProviders (not Web3Provider directly)

## Why Not Use Web3Provider Directly?
Tried: `import dynamic from 'next/dynamic'` in `layout.tsx` → error:
> `ssr: false` is not allowed with `next/dynamic` in Server Components.

The fix is to move the `dynamic()` call into a Client Component.

## Second Fix: Suspense for useSearchParams
`useSearchParams()` requires a Suspense boundary in App Router. Pattern:
```tsx
function WaitlistContent() { /* uses useSearchParams */ }
export default function WaitlistPage() {
  return <Suspense><WaitlistContent /></Suspense>
}
```

## Related
- [[components/Web3Provider]]
