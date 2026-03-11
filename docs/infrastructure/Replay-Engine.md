# Replay Engine

> The "DVR" for agent actions. Reconstruct market state at any historical timestamp.

## Purpose

Agents execute in milliseconds. Humans can't watch real-time. The Replay Engine provides:
1. **The Tape:** Slow-motion feed of agent actions
2. **State Reconstruction:** What the market looked like at time T
3. **Ghost Traces:** Counterfactual paths (what agent considered but didn't do)
4. **Mutation Timeline:** How NFT metadata evolved

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    EVENT INDEXER                         │
│  (Ponder)                                                │
│                                                          │
│  Captures:                                               │
│  - AgentAction events (bid, buy, list, sell, cancel)    │
│  - Metadata mutations (TraitUpdated events)             │
│  - Market state changes (floors, listings)              │
│  - Strategy config changes                               │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              TIME-SERIES DATABASE                        │
│  (ClickHouse)                                            │
│                                                          │
│  Tables:                                                 │
│  - agent_actions (timestamp, agentId, action, ...)      │
│  - market_snapshots (timestamp, collection, floor, ...) │
│  - trait_mutations (timestamp, tokenId, key, value)     │
│  - strategy_signals (timestamp, agentId, considered)    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  REPLAY ENGINE                           │
│                                                          │
│  - State reconstructor (snapshot + events → state@T)    │
│  - Playback controller (play, pause, speed, seek)       │
│  - Ghost trace generator (counterfactual simulator)     │
│  - WebSocket broadcaster (real-time to frontend)        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                              │
│                                                          │
│  - Timeline scrubber (video-editor style)               │
│  - Decision tree visualizer                              │
│  - Mutation diff viewer (before/after)                  │
│  - Agent POV mode (see what agent "saw" at time T)      │
└─────────────────────────────────────────────────────────┘
```

---

## API Endpoints

```typescript
// Get actions in time range
GET /api/replay/actions
  ?agentId=123
  &from=1709769600
  &to=1709856000
  &collection=0x...
  
// Get market state at timestamp
GET /api/replay/state
  ?timestamp=1709769600
  &collection=0x...
  
// Get mutation timeline for NFT
GET /api/replay/mutations
  ?collection=0x...
  &tokenId=42
  &from=1709769600
  
// Get ghost traces (what agent considered)
GET /api/replay/ghost
  ?agentId=123
  &actionId=abc123
  
// WebSocket for live playback
WS /api/replay/stream
  { cursor: timestamp, speed: 0.1 }
```

---

## State Reconstruction

To show "what the world looked like" at any timestamp:

```typescript
interface MarketState {
  timestamp: number;
  collections: {
    [address: string]: {
      floor: bigint;
      listings: Listing[];
      recentSales: Sale[];
      volume24h: bigint;
    };
  };
  agents: {
    [agentId: string]: {
      balance: bigint;
      positions: Position[];
      pendingOrders: Order[];
      strategyParams: StrategyConfig;
    };
  };
}

async function reconstructState(timestamp: number): Promise<MarketState> {
  // 1. Find nearest snapshot before timestamp
  const snapshot = await db.query(`
    SELECT * FROM market_snapshots 
    WHERE timestamp <= ${timestamp} 
    ORDER BY timestamp DESC LIMIT 1
  `);
  
  // 2. Apply events between snapshot and target
  const events = await db.query(`
    SELECT * FROM agent_actions 
    WHERE timestamp > ${snapshot.timestamp} 
      AND timestamp <= ${timestamp}
    ORDER BY timestamp ASC
  `);
  
  // 3. Replay events on snapshot
  let state = snapshot.state;
  for (const event of events) {
    state = applyEvent(state, event);
  }
  
  return state;
}
```

---

## Ghost Traces

When agent takes an action, we log what else it considered:

```typescript
interface GhostTrace {
  actionId: string;
  actualAction: AgentAction;
  consideredActions: {
    action: AgentAction;
    confidence: number;
    rejectionReason: string;
  }[];
  decisionTime: number; // milliseconds
}

// Agent emits this alongside AgentAction event
event StrategySignal(
  uint256 indexed agentId,
  bytes32 indexed actionId,
  bytes32[] consideredHashes,
  uint16[] confidences,
  bytes32[] rejectionReasons
);
```

Frontend renders as decision tree:
```
                    ┌─────────────┐
                    │   SNIPE     │
                    │  Punks #42  │
                    │   ✓ TAKEN   │
                    └─────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼────┐      ┌─────▼────┐      ┌─────▼────┐
   │ Azuki   │      │ Doodles  │      │ Moonbird │
   │  #1234  │      │   #567   │      │   #89    │
   │ 78% ✗   │      │ 65% ✗    │      │ 45% ✗    │
   │ "floor  │      │ "low     │      │ "poor    │
   │  rising"│      │  volume" │      │  traits" │
   └─────────┘      └──────────┘      └──────────┘
```

---

## Playback Controls

```typescript
interface PlaybackState {
  cursor: number;        // current timestamp
  speed: number;         // 1 = real-time, 0.1 = 10x slower
  playing: boolean;
  buffer: ReplayEvent[]; // preloaded events
}

// WebSocket messages
type PlaybackMessage = 
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'seek', timestamp: number }
  | { type: 'speed', value: number }
  | { type: 'event', data: ReplayEvent };
```

---

## Mutation Timeline

For mutable NFTs, show evolution:

```typescript
interface MutationTimeline {
  tokenId: string;
  collection: string;
  mutations: {
    timestamp: number;
    agentId: number;
    traitKey: string;
    oldValue: string;
    newValue: string;
    trigger: 'victory' | 'loss' | 'transfer' | 'time' | 'manual';
  }[];
}
```

Frontend renders as:
```
──────────────────────────────────────────────────────▶ time
   │           │              │                │
   ▼           ▼              ▼                ▼
┌──────┐   ┌──────┐      ┌──────┐         ┌──────┐
│ mint │   │ sold │      │ win  │         │ sold │
│ base │   │ mark │      │ aura │         │ mark │
│traits│   │added │      │added │         │added │
└──────┘   └──────┘      └──────┘         └──────┘
   ↓           ↓              ↓                ↓
 [img]      [img]          [img]           [img]
```

---

*Status: Draft*
*Last Updated: 2026-03-07*
