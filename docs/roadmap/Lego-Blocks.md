# Lego Blocks — Core Primitives

> Essential building blocks for R2 Markets, in dependency order.

## Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│   ┌──────────────────┐                                          │
│   │ 1. ERC-8004      │                                          │
│   │    Agent Factory │                                          │
│   └────────┬─────────┘                                          │
│            │                                                     │
│            ▼                                                     │
│   ┌──────────────────┐    ┌──────────────────┐                  │
│   │ 2. AgentAction   │    │ 3. Metadata      │                  │
│   │    Event Standard│    │    Oracle        │                  │
│   └────────┬─────────┘    └────────┬─────────┘                  │
│            │                       │                             │
│            ▼                       │                             │
│   ┌──────────────────┐            │                             │
│   │ 4. Logic Pool    │◄───────────┘                             │
│   │    Contract      │                                          │
│   └────────┬─────────┘                                          │
│            │                                                     │
│            ▼                                                     │
│   ┌──────────────────┐                                          │
│   │ 5. Event Indexer │                                          │
│   │    (Ponder)      │                                          │
│   └────────┬─────────┘                                          │
│            │                                                     │
│            ├───────────────┬───────────────┐                    │
│            ▼               ▼               ▼                    │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│   │ 6. Metadata  │ │ 7. Reputation│ │ 8. Replay    │           │
│   │    Service   │ │    Engine    │ │    Frontend  │           │
│   └──────────────┘ └──────────────┘ └──────────────┘           │
│            │               │               │                    │
│            └───────────────┼───────────────┘                    │
│                            ▼                                     │
│                   ┌──────────────────┐                          │
│                   │ 9. Trading Engine│                          │
│                   └──────────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Block Details

### 1. ERC-8004 Agent Factory
**Dependencies:** None
**Complexity:** Medium
**Output:** Contract that deploys agents with verified identity

```solidity
interface IAgentFactory {
    function createAgent(string calldata name, bytes calldata registrationData) 
        external returns (uint256 agentId, address agentWallet);
}
```

**Deliverables:**
- [ ] Factory contract
- [ ] Registration JSON generator
- [ ] IPFS upload integration
- [ ] Agent wallet generation (deterministic)

---

### 2. AgentAction Event Standard
**Dependencies:** #1
**Complexity:** Low
**Output:** Standardized event schema for all agent actions

```solidity
event AgentAction(
    uint256 indexed agentId,
    uint8 indexed actionType,
    address indexed collection,
    uint256 tokenId,
    uint256 price,
    bytes32 strategyHash,
    bytes32 confidenceData
);
```

**Deliverables:**
- [ ] Event interface definition
- [ ] Action type enum
- [ ] Confidence data packing spec
- [ ] Strategy hash computation

---

### 3. Metadata Oracle
**Dependencies:** #1
**Complexity:** Medium
**Output:** On-chain trait storage for mutable NFTs

**Deliverables:**
- [ ] Oracle contract
- [ ] Trait key registry
- [ ] Access control (agent authorization)
- [ ] Provenance recording

---

### 4. Logic Pool Contract
**Dependencies:** #1, #2, #3
**Complexity:** High
**Output:** Vault for user deposits + strategy execution

**Deliverables:**
- [ ] Pool contract
- [ ] Share accounting
- [ ] Strategy binding
- [ ] Safety limits (drawdown, daily loss)
- [ ] Emergency functions

---

### 5. Event Indexer (Ponder)
**Dependencies:** #2
**Complexity:** Medium
**Output:** Indexed, queryable event data

**Deliverables:**
- [ ] Ponder schema
- [ ] AgentAction handler
- [ ] Market snapshot aggregation
- [ ] API endpoints

---

### 6. Metadata Service
**Dependencies:** #3, #5
**Complexity:** Medium
**Output:** Dynamic tokenURI resolver

**Deliverables:**
- [ ] HTTP service
- [ ] Oracle integration
- [ ] Image generation/CDN
- [ ] Cache invalidation

---

### 7. Reputation Engine
**Dependencies:** #5
**Complexity:** High
**Output:** Scoring system + leaderboard

**Deliverables:**
- [ ] Scoring algorithm
- [ ] Slashing detection
- [ ] Season management
- [ ] Merkle root commitment
- [ ] API endpoints

---

### 8. Replay Frontend
**Dependencies:** #5, #6
**Complexity:** High
**Output:** Tape viewer + ghost traces

**Deliverables:**
- [ ] State reconstructor
- [ ] Playback controls
- [ ] Timeline UI
- [ ] Ghost trace visualizer
- [ ] Mutation timeline

---

### 9. Trading Engine
**Dependencies:** #4, #5
**Complexity:** Very High
**Output:** Agent execution runtime

**Deliverables:**
- [ ] Strategy interpreter
- [ ] Market monitor
- [ ] Valuation model
- [ ] Order execution
- [ ] Position tracking

---

## Priority Matrix

| Block | Impact | Effort | Priority |
|-------|--------|--------|----------|
| Agent Factory | High | Medium | P0 |
| AgentAction Events | High | Low | P0 |
| Metadata Oracle | Medium | Medium | P1 |
| Logic Pool | High | High | P1 |
| Event Indexer | High | Medium | P0 |
| Metadata Service | Medium | Medium | P2 |
| Reputation Engine | Medium | High | P2 |
| Replay Frontend | Medium | High | P3 |
| Trading Engine | Critical | Very High | P1 |

---

*Status: Planning*
*Last Updated: 2026-03-07*
