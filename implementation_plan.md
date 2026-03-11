# R2 Markets — Implementation Plan

> Agentic NFT marketplace where autonomous programs trade mutable JPEGs.

**Status:** Active Development  
**Created:** 2026-03-07  
**Last Updated:** 2026-03-07

---

## 1. Vision Summary

R2 Markets is a **Command & Control Dashboard** for agent-native NFT trading.

**Core differentiators:**
- Only agent-deployed collections (ERC-8004 verified)
- All NFTs have mutable metadata
- Blur-style liquidity incentives adapted for agents
- Game-like UX optimized for oversight, not trading

**Paradigm:** Humans don't trade. Humans deploy agents, configure strategies, and review replays.

---

## 2. Agreed Specifications

### 2.1 Agent Interface Standard v1.1

**13 parameters across 5 groups:**

| Group | Parameters |
|-------|------------|
| **ACQUISITION** | Bid Aggressiveness, Slippage Tolerance, Gas Priority, Confidence Threshold |
| **POSITION SIZING** | Max Bid Per TX, Concurrent Bids |
| **VALUATION** | Rarity Weight, Trait Correlation |
| **EXIT STRATEGY** | Holding Period, Profit Target, Loss Cut (+ trailing toggle) |
| **PORTFOLIO** | Collection Diversity, Liquidity Preference |

**8 operational modes:**
SNIPE, SWEEP, HOLD, DUMP, IDLE, MONITOR, SCAN, LEARN, HYBRID

**Documentation:** `/docs/contracts/Agent-Interface-Standard.md`

---

### 2.2 Core Contracts

| Contract | Purpose | Status |
|----------|---------|--------|
| `IAgentStrategy.sol` | Strategy interface with all 13 params | ✅ Spec complete |
| `ILogicPool.sol` | User deposits + strategy binding | ✅ Spec complete |
| `IMetadataOracle.sol` | On-chain mutable trait storage | ✅ Spec complete |
| `AgentFactory.sol` | ERC-8004 agent deployer | 📋 Planned |
| `ReputationRegistry.sol` | Merkle root for off-chain scores | 📋 Planned |

---

### 2.3 Infrastructure

| Component | Tech | Purpose | Status |
|-----------|------|---------|--------|
| Event Indexer | Ponder | Index AgentAction events | 📋 Planned |
| Time-series DB | ClickHouse | Replay/tape storage | 📋 Planned |
| Metadata Service | Hono + R2 | Dynamic tokenURI resolver | 📋 Planned |
| Reputation Engine | Node.js | Scoring + slashing | 📋 Planned |
| Replay Engine | WebSocket | State reconstruction + playback | 📋 Planned |

---

### 2.4 Frontend

| Screen | File | Status |
|--------|------|--------|
| Splash | `anime-screen-1-splash.html` | ✅ Complete |
| Dashboard | `anime-screen-2-dashboard.html` | ✅ Complete |
| Execute | `anime-screen-3-execute.html` | ✅ Complete |
| Manifest | `anime-screen-4-manifest.html` | ✅ Complete |
| Databank | `anime-screen-5-databank.html` | ✅ Complete |
| Strategy | `anime-screen-6-strategy.html` | ✅ Updated v1.1 |
| Profile | `anime-screen-7-profile.html` | ✅ Complete |
| Waitlist | `anime-screen-8-waitlist.html` | ✅ Complete |

**Design system:** Anime cyberpunk (pink/cyan/green), chamfered panels, katakana noise

---

## 3. Architecture Decisions

### 3.1 Chain Selection
- **Primary:** Base (cheap gas, strong NFT ecosystem, terminal.markets precedent)
- **Identity:** Ethereum Mainnet (ERC-8004 registry)
- **Future:** MegaETH expansion

### 3.2 Key Custody
- Agent private keys encrypted with AWS KMS
- Platform holds keys initially (simpler UX)
- Future: User-controlled keys via MPC

### 3.3 Mutable Metadata Pattern
```
tokenURI → https://r2.markets/meta/{collection}/{tokenId}
              │
              ▼
        Metadata Service
              │
       ┌──────┼──────┐
       ▼      ▼      ▼
    Base   Oracle   CDN
    IPFS   (live)   (art)
```

### 3.4 Reputation System
- Off-chain computation, on-chain Merkle commitment
- Metrics: spread tightness, fill rate, profitability, volume, mutations, longevity
- Slashing: self-trading, wash trading, liquidity abandonment

### 3.5 Point System (Season 1)

**Revenue-aligned incentives.** Points reward actions that generate platform revenue and highlight R2 differentiators.

| Category | % of Points | S1 Status |
|----------|-------------|-----------|
| Trading Activity | 35% | ✅ Active |
| Liquidity Provision | 15% | ✅ Active |
| Strategy Quality | 12% | ✅ Active |
| Agent Creation & Retention | 10% | ✅ Active |
| Collection Deployment | 8% | ✅ Active |
| Metadata Mutations | 8% | ✅ Active |
| Farcaster/Social | 7% | ✅ Active |
| Analytics/Data Skills | 5% | ⚠️ Basic only |

**Key mechanics:**
- Royalty multiplier: 1.7x for full royalty, 0.7x penalty for skipping
- Spread tightness bonus: up to 2x for bids within 1% of floor
- Strategy adherence: up to 500 pts/day for following configured params
- Farcaster verification: 1.1-1.5x multiplier for verified accounts

**Documentation:** `/docs/core/Point-Mechanics.md`

### 3.6 Season Structure

```
SEASON 1: Core Trading
├── Point system: Trading, liquidity, strategy quality
├── No token (points accumulate)
├── Goal: Prove volume thesis
└── Duration: 30-60 days

SEASON 2: Skill Marketplace
├── Skill creation and sharing
├── 5x multiplier for "Verified Alpha" skills
├── Review/rating system
└── Dependency: S1 volume success

SEASON 3: x402 Monetization
├── Gate proven skills with micropayments
├── 20x multiplier for monetized skills
├── R2 revenue share on skill payments
└── Full skill-to-capital pipeline
```

**Documentation:** `/docs/roadmap/Skill-Marketplace.md`

---

## 4. Lego Blocks (Dependency Order)

```
1. ERC-8004 Agent Factory ─────────────────┐
                                            │
2. AgentAction Event Standard ──────────────┤
                                            │
3. Metadata Oracle ─────────────────────────┤
                                            │
4. Logic Pool Contract ◄────────────────────┘
         │
         ▼
5. Event Indexer (Ponder)
         │
         ├─────────────┬─────────────┐
         ▼             ▼             ▼
6. Metadata      7. Reputation  8. Replay
   Service          Engine         Frontend
         │             │             │
         └─────────────┴─────────────┘
                       │
                       ▼
              9. Trading Engine
```

---

## 5. Phase Plan

### Phase 1: Foundation (Week 1-2)
- [ ] Deploy Agent Factory contract (Base testnet)
- [ ] Define AgentAction event schema
- [ ] Deploy Metadata Oracle contract
- [ ] Set up Ponder indexer
- [ ] Basic API endpoints

### Phase 2: Core Mechanics (Week 3-4)
- [ ] Strategy config storage (on-chain or hybrid)
- [ ] Metadata Service v1
- [ ] Frontend: Connect wallet + agent creation
- [ ] Point tracking infrastructure (off-chain)
- [ ] Leaderboard API

### Phase 3: Trading (Week 5-6)
- [ ] Integration with Reservoir/Seaport
- [ ] Agent execution runtime
- [ ] Position tracking
- [ ] Basic dashboard with live data
- [ ] Trading points active

### Phase 4: Intelligence (Week 7-8)
- [ ] Replay Engine + tape UI
- [ ] Reputation scoring + slashing detection
- [ ] Heat maps
- [ ] Farcaster verification integration
- [ ] Strategy quality scoring

### Phase 5: Season 1 Launch (Week 9-10)
- [ ] Mainnet deployment
- [ ] Season 1 kickoff (all S1 point categories active)
- [ ] Public waitlist → access
- [ ] Leaderboard public
- [ ] Marketing push

### Future: Season 2-3
- [ ] Skill marketplace infrastructure
- [ ] Skill publishing and installation
- [ ] Review/rating system
- [ ] x402 skill gating
- [ ] Revenue share contracts

**Note:** Logic Pools (user capital delegation to agents) deferred. Season 1 focuses on agents using their own capital, earning points. Simpler, proven model.

---

## 6. Open Questions

| Question | Options | Decision |
|----------|---------|----------|
| Strategy storage | Fully on-chain vs IPFS + hash | TBD |
| Valuation oracle | Floor only vs trait-adjusted | TBD |
| Agent runtime | Centralized workers vs decentralized | TBD |
| First collection | Asciitardio vs new collection | TBD |
| Token economics | Points-only vs $R2 token | TBD |

---

## 7. Team / Alliances

| Role | Owner | Notes |
|------|-------|-------|
| Architecture | Pan | Agent interface, specs |
| Smart Contracts | TBD | Solidity implementation |
| Frontend | TBD | Next.js + anime aesthetic |
| Indexing | TBD | Ponder setup |
| Design | ✅ | Mockups complete |

---

## 8. Documentation Index

### Core
- `/docs/core/Vision.md` — Paradigm and thesis
- `/docs/core/Glossary.md` — Term definitions
- `/docs/core/Architecture.md` — System diagram
- `/docs/core/Point-Mechanics.md` — **NEW** Season 1 point system

### Contracts
- `/docs/contracts/Agent-Interface-Standard.md` — Full parameter spec
- `/docs/contracts/IAgentStrategy.sol` — Solidity interface
- `/docs/contracts/Logic-Pool.md` — Vault spec (deferred)
- `/docs/contracts/Metadata-Oracle.md` — Trait storage

### Infrastructure
- `/docs/infrastructure/Replay-Engine.md` — Tape system
- `/docs/infrastructure/Reputation-Engine.md` — Scoring

### Frontend
- `/docs/frontend/Dashboard-Spec.md` — UI patterns

### Roadmap
- `/docs/roadmap/Lego-Blocks.md` — Dependency graph
- `/docs/roadmap/Skill-Marketplace.md` — **NEW** Season 2-3 skill system

---

## 9. Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-03-07 | Initial spec session | Pan + Human |
| 2026-03-07 | Agent Interface Standard v1.1 (13 params) | Pan |
| 2026-03-07 | Knowledge graph structure created | Pan |
| 2026-03-07 | Strategy mockup updated with grouped params | Pan |
| 2026-03-07 | Point Mechanics v1 spec added | Pan |
| 2026-03-07 | Skill Marketplace roadmap (S2-3) documented | Pan |
| 2026-03-07 | Logic Pools deferred to post-MVP | Pan |
| 2026-03-07 | Season structure defined (S1: core, S2: skills, S3: x402) | Pan |

---

## 10. Next Steps

1. **Human decision needed:** Alliance assignments (who builds what)
2. **Human decision needed:** First collection choice (Asciitardio integration?)
3. **Pan action:** Begin Agent Factory contract implementation
4. **Pan action:** Set up Ponder schema for AgentAction indexing

---

*This is a living document. Update as decisions are made.*
