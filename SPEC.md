# R2 Markets — Specification

> The NFT marketplace where AI agents trade for you.

**Status:** Planning  
**Last Updated:** 2026-03-04

---

## Table of Contents

1. [Vision](#vision)
2. [Key Decisions](#key-decisions)
3. [The Name](#the-name)
4. [Agent Identity (ERC-8004)](#agent-identity-erc-8004)
5. [The Two-Key Model](#the-two-key-model)
6. [Onboarding Options](#onboarding-options)
7. [Hybrid Approach](#hybrid-approach)
8. [Easter Eggs](#easter-eggs)
9. [Phases](#phases)
10. [Open Questions](#open-questions)

---

## Vision

Build the **terminal.markets equivalent for NFTs**.

Users create AI agents that autonomously trade NFTs based on natural language strategies.

### Core Thesis

- NFT trading is illiquid and requires constant attention
- AI agents can snipe floor breaks, spot trait arbitrage, front-run meta shifts
- Leaderboard + gamification creates engagement loop
- ERC-8004 registration gives agents verifiable on-chain identity

### Terminal.markets Reference

DX Terminal Pro (terminal.markets) is the primary inspiration:
- 21-day trading competition where AI agents trade tokens on Base
- Users configure agents via natural language
- Agents execute trades 24/7
- NFT-gated participation (one NFT = one agent = one vault)

**What R2 adapts:**

| Terminal.markets | R2 Markets |
|------------------|------------|
| Token trading | NFT trading |
| Fungible assets | Non-fungible (illiquid) |
| Single chain (Base) | Base first, multi-chain later |
| Time-limited event | Persistent marketplace |
| ERC-721 for access | ERC-8004 for identity |

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| First chain | Base | Match terminal.markets, cheap gas, strong NFT ecosystem |
| Agent identity | ERC-8004 | On-chain reputation, interop with agent ecosystem |
| Waitlist approach | Gasless → NFT upgrade | Max conversion, then premium layer |
| Agent key custody | Platform-held initially | Simpler UX, hand off at launch |
| Bunny Intel connection | Hidden easter eggs | Family finds the rabbit hole |

---

## The Name

**R2** = R2D2 inspiration + "Round 2"

- R2-D2: The loyal, autonomous helper that gets things done
- Round 2: Second iteration of terminal.markets concept, applied to NFTs

---

## Agent Identity (ERC-8004)

ERC-8004 is an Ethereum standard for trustless agent identity and reputation.

### Why ERC-8004?

1. Verifiable identity — Agents have on-chain proof of existence
2. Reputation building — Trading history creates trust signals
3. Interoperability — Agents can interact with broader agent ecosystem
4. Discoverability — Other platforms can find and verify R2 agents

### Contract Addresses

| Chain | Identity Registry |
|-------|-------------------|
| Ethereum Mainnet | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |
| Sepolia Testnet | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |

### Registration File Structure

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "Agent Name",
  "description": "...",
  "image": "https://...",
  "services": [
    { "name": "web", "endpoint": "https://..." }
  ],
  "x402Support": false,
  "active": true,
  "supportedTrust": ["reputation"]
}
```

---

## The Two-Key Model

Separation of **ownership** and **operation**.

```
USER (Human)
├── Holds: EOA wallet
├── Controls: ERC-8004 NFT ownership
└── Can: Transfer agent, update config, withdraw funds
          │
          │ owns
          ▼
    ERC-8004 NFT
    ├── agentId: 123
    ├── owner: 0xUser...
    └── agentWallet: 0xAgent... (verified via EIP-712)
          │
          │ references
          ▼
    AGENT WALLET
    ├── Private Key: held by R2 backend
    ├── Can: Sign txs, hold NFTs
    └── Cannot: Transfer ERC-8004 NFT
```

### Why This Separation?

- **Security:** If agent wallet compromised, identity (NFT) is safe
- **Revocability:** User can revoke agent wallet and set a new one
- **Autonomy:** Agent operates independently within wallet scope
- **Accountability:** All agent actions signed by agentWallet → auditable

---

## Onboarding Options

We evaluated three approaches:

### Option 1: Gasless Waitlist

User signs message (no gas) → Agent created in DB → R2 handles ERC-8004 registration in batches.

**Pros:**
- Zero gas for users
- High conversion rate
- Instant feedback

**Cons:**
- R2 pays all gas (~$15-20 per agent)
- Centralized key custody
- Async registration

### Option 3: NFT Mint

User mints R2 Agent NFT on Base → Cross-chain message to Mainnet → ERC-8004 registration.

**Pros:**
- User owns NFT immediately
- Tradeable from day 1
- On-chain proof of waitlist

**Cons:**
- User pays gas (even if small ~$0.03)
- Cross-chain complexity
- ~30 min for full registration

---

## Hybrid Approach

**Chosen approach:** Combine gasless waitlist with optional NFT upgrade.

### Flow

1. **Phase 1 - Waitlist:** Gasless signature creates agent in DB + queues ERC-8004 registration
2. **Phase 2 - NFT Upgrade:** Waitlisted users can optionally mint NFT that links to their agent
3. **Phase 3 - Launch:** NFT holders get priority access; waitlist users follow

### Why Hybrid?

| Approach | Conversion | Collectibility | Cost |
|----------|------------|----------------|------|
| Gasless only | High | None | R2 pays |
| NFT only | Lower | Tradeable | User pays |
| **Hybrid** | High | Optional | Flexible |

### Benefits Matrix

| Feature | Waitlist Only | NFT Upgraded |
|---------|---------------|--------------|
| ERC-8004 Identity | ✓ | ✓ |
| Tradeable NFT | ✗ | ✓ |
| Priority Access | ⭐ | ⭐⭐⭐ |
| Gas Cost | $0 | ~$0.03 |
| Profile Badge | Standard | "OG Collector" |

---

## Easter Eggs

> r2.markets is the front door. bunny intel is for family.

Multiple discovery layers connecting Bunny Intel to R2 Markets.

### Discovery Ladder

| Layer | Target | Mechanic |
|-------|--------|----------|
| 1 | Curious visitors | ASCII bunny click |
| 2 | Gamers | Konami code |
| 3 | Protardio holders | Wallet-gate |
| 4 | Farcaster users | Frame easter egg |

### Philosophy

- No explicit instructions — discovery is the reward
- "Found the rabbit hole" messaging
- Bunny motif throughout
- Terminal/ASCII aesthetic

---

## Phases

### Phase 1: Waitlist
- Gasless agent creation
- Community building
- ERC-8004 registration (batched)

### Phase 2: NFT Upgrade
- Optional premium mint on Base
- Links to existing ERC-8004 agent
- Tradeable collectible

### Phase 3: Product Launch
- Trading engine goes live
- Agent configuration UI
- Leaderboard

### Phase 4: Multi-chain
- Expansion beyond Base

---

## Open Questions

*To be filled as discussions continue.*

---

## References

- [EIP-8004 Spec](https://eips.ethereum.org/EIPS/eip-8004)
- [8004.org](https://www.8004.org)
- [Terminal.markets](https://terminal.markets)
