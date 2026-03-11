# R2 Markets — System Architecture

## High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  Browser/Mobile                                                  │
│  ├── Wallet Connection (RainbowKit)                             │
│  ├── Command & Control Dashboard                                │
│  ├── Strategy Configuration (13 sliders)                        │
│  ├── Replay/Tape Viewer                                         │
│  └── Heat Maps & Intelligence                                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  r2.markets API (Hono / Node.js)                                │
│  ├── /api/agent/*           Agent CRUD, config                  │
│  ├── /api/pool/*            Logic pool management               │
│  ├── /api/replay/*          Tape/timeline queries               │
│  ├── /api/meta/*            Mutable metadata service            │
│  └── /api/leaderboard/*     Rankings, seasons, points           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       AGENT RUNTIME                              │
├─────────────────────────────────────────────────────────────────┤
│  Agent Execution Engine                                          │
│  ├── Strategy Interpreter (params → decisions)                  │
│  ├── Market Monitor (floors, listings, traits)                  │
│  ├── Valuation Model (rarity, correlation, liquidity)           │
│  ├── Execution Layer (sign & submit txs)                        │
│  ├── Position Manager (inventory, P&L tracking)                 │
│  └── Event Emitter (AgentAction logs)                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────┤
│  ├── PostgreSQL (agent configs, user data, positions)          │
│  ├── ClickHouse (time-series: actions, prices, replays)        │
│  ├── Redis (market data cache, rate limiting, sessions)        │
│  ├── IPFS/Pinata (ERC-8004 registration, base metadata)        │
│  └── Ponder Indexer (on-chain events → queryable state)        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BLOCKCHAIN LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │     Base     │    │   Ethereum   │    │   MegaETH    │      │
│  │              │    │   Mainnet    │    │              │      │
│  │ • Logic Pools│    │ • ERC-8004   │    │ • Future     │      │
│  │ • NFT Trades │    │   Identity   │    │   expansion  │      │
│  │ • Metadata   │    │   Registry   │    │              │      │
│  │   Oracle     │    │              │    │              │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│  ├── Reservoir API (NFT aggregation, orders)                   │
│  ├── Alchemy/Infura (RPC nodes)                                 │
│  ├── OpenAI/Anthropic (valuation models, optional)              │
│  └── Pinata (IPFS pinning)                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### Frontend (Next.js 14)
- **Stack:** TypeScript, Tailwind, Framer Motion
- **Wallet:** RainbowKit + wagmi + viem
- **State:** TanStack Query + Zustand
- **Design:** Anime cyberpunk aesthetic (see mockups)

### Backend API (Hono)
- **Runtime:** Node.js 20+ or Bun
- **Auth:** SIWE (Sign-In With Ethereum)
- **Queue:** BullMQ (Redis-backed job processing)
- **Validation:** Zod schemas

### Agent Runtime
- **Execution:** Dedicated workers per agent (or batched)
- **Frequency:** Configurable per mode (100ms - 1hr)
- **Signing:** AWS KMS for key management
- **Monitoring:** Prometheus metrics, Grafana dashboards

### Event Indexer (Ponder)
- **Purpose:** Index AgentAction events, NFT transfers, metadata updates
- **Output:** PostgreSQL tables for API queries
- **Latency:** ~1 block behind chain head

### Replay Engine
- **Storage:** ClickHouse for time-series queries
- **Reconstruction:** Snapshot + event replay to any timestamp
- **Playback:** WebSocket streaming with cursor control

---

## Security Model

### Key Custody
- Agent private keys encrypted with AWS KMS
- Keys never leave backend
- HSM option for high-value agents

### Access Control
- User authenticates via SIWE
- Users can only access their own agents
- Admin endpoints require separate auth + MFA

### Transaction Safety
- All txs simulated before execution
- Spend limits enforced (maxBidPerTx, dailyLossLimit)
- Emergency pause capability per agent and global

---

## Data Flow: Buy Action

```
1. Market Monitor detects opportunity
   └─▶ (collection, tokenId, price, rarity, traits, volume)

2. Strategy Interpreter evaluates
   └─▶ evaluateBuy(opportunity) → (shouldBuy, bidAmount, confidence)

3. Position Manager checks constraints
   └─▶ diversity limit? concurrent limit? capital available?

4. Execution Layer submits
   └─▶ sign tx with agent wallet, apply gas boost

5. Event Emitter logs
   └─▶ AgentAction(agentId, BUY, collection, tokenId, price, strategyHash, confidence)

6. Indexer captures
   └─▶ Ponder indexes event → PostgreSQL → API queryable

7. Frontend updates
   └─▶ WebSocket push → Dashboard reflects new position
```

---

*Last Updated: 2026-03-07*
