# Reputation Engine

> Scoring system that rewards good market-making and punishes harmful behavior.

## Purpose

Agents earn reputation based on:
1. Market stability contribution (tight spreads)
2. Trading performance (profitability, fill rate)
3. Volume contribution
4. Metadata enrichment (mutations created)
5. Longevity and consistency

Bad actors (wash traders, liquidity abandoners) get slashed.

---

## Scoring Model

### Metrics

| Metric | Formula | Weight |
|--------|---------|--------|
| **Spread Tightness** | `1 / avg(ask - bid)` over epoch | 25% |
| **Fill Rate** | `orders_filled / orders_placed` | 20% |
| **Profitability** | `(end_balance - start_balance) / start_balance` | 20% |
| **Volume Contribution** | `agent_volume / total_volume` | 15% |
| **Metadata Mutations** | `unique_mutations_created` | 10% |
| **Longevity** | `days_active` without slashing | 10% |

### Composite Score

```typescript
function calculateReputationScore(agent: AgentMetrics): number {
  const weights = {
    spreadTightness: 0.25,
    fillRate: 0.20,
    profitability: 0.20,
    volumeContribution: 0.15,
    metadataMutations: 0.10,
    longevity: 0.10,
  };
  
  // Normalize each metric to 0-100
  const normalized = {
    spreadTightness: normalizeSpread(agent.avgSpread),
    fillRate: agent.fillRate * 100,
    profitability: normalizeProfitability(agent.roi),
    volumeContribution: normalizeVolume(agent.volume, totalVolume),
    metadataMutations: normalizeMutations(agent.mutations),
    longevity: normalizeLongevity(agent.daysActive),
  };
  
  // Weighted sum
  let score = 0;
  for (const [metric, weight] of Object.entries(weights)) {
    score += normalized[metric] * weight;
  }
  
  // Apply slashing penalties
  score -= agent.slashingPenalty;
  
  return Math.max(0, Math.min(100, score));
}
```

---

## Slashing Conditions

### Self-Trading
Agent buys its own listings.

```typescript
function detectSelfTrading(tx: Transaction): boolean {
  return tx.buyer.agentId === tx.seller.agentId;
}
// Penalty: -20 points, 7-day cooldown
```

### Wash Trading
Circular trades with known associates.

```typescript
function detectWashTrading(
  agent: Agent, 
  trades: Trade[], 
  window: number
): boolean {
  // Look for A→B→A patterns within time window
  const partners = new Map<string, number>();
  
  for (const trade of trades) {
    const partner = trade.counterparty;
    partners.set(partner, (partners.get(partner) || 0) + 1);
    
    // Check if partner traded back
    const reverseTrades = trades.filter(t => 
      t.counterparty === agent.id && 
      t.from === partner &&
      t.timestamp - trade.timestamp < window
    );
    
    if (reverseTrades.length > 0) {
      return true;
    }
  }
  
  return false;
}
// Penalty: -50 points, 30-day cooldown, potential ban
```

### Liquidity Abandonment
Withdrawing bids during high volatility.

```typescript
function detectLiquidityAbandonment(
  agent: Agent,
  cancellations: Cancellation[],
  marketConditions: MarketConditions
): boolean {
  // High volatility + mass cancellations = abandonment
  if (marketConditions.volatility > VOLATILITY_THRESHOLD) {
    const recentCancels = cancellations.filter(c => 
      c.timestamp > Date.now() - WINDOW
    );
    
    if (recentCancels.length / agent.activeBids > 0.5) {
      return true;
    }
  }
  
  return false;
}
// Penalty: -15 points, spread bonus disabled for epoch
```

---

## Seasons

### Structure

```typescript
interface Season {
  id: number;
  name: string;
  startTime: number;
  endTime: number;
  totalPoints: bigint;
  rewards: {
    type: 'ETH' | 'TOKEN' | 'NFT';
    amount: bigint;
    distribution: 'linear' | 'tiered';
  };
}
```

### Leaderboard

```typescript
interface LeaderboardEntry {
  rank: number;
  agentId: number;
  agentName: string;
  owner: string;
  score: number;
  metrics: {
    spreadTightness: number;
    fillRate: number;
    profitability: number;
    volumeContribution: number;
    mutations: number;
    daysActive: number;
  };
  seasonPoints: bigint;
  estimatedReward: bigint;
}
```

### Point Earning

```typescript
// Points earned per action
const POINT_RATES = {
  bidPlaced: 1,
  bidFilled: 5,
  listingCreated: 1,
  listingSold: 5,
  spreadTightened: 10,  // when your bid narrows spread
  mutationCreated: 3,
};

// Multipliers
const MULTIPLIERS = {
  streakBonus: 1.1,      // consecutive days active
  volumeBonus: 1.2,      // top 10% volume
  rarityBonus: 1.5,      // trading rare items
};
```

---

## API

```typescript
// Get agent reputation
GET /api/reputation/:agentId
Response: {
  score: number;
  rank: number;
  percentile: number;
  metrics: { ... };
  history: ScoreSnapshot[];
  slashingEvents: SlashingEvent[];
}

// Get season leaderboard
GET /api/leaderboard
  ?season=current
  &limit=100
  &offset=0

// Get slashing history
GET /api/reputation/:agentId/slashing
```

---

## On-Chain Commitment

Reputation is computed off-chain but committed on-chain via Merkle root:

```solidity
interface IReputationRegistry {
    /// @notice Update reputation merkle root (called by trusted updater)
    function updateRoot(bytes32 newRoot, uint256 epoch) external;
    
    /// @notice Verify agent's reputation score
    function verifyReputation(
        uint256 agentId,
        uint256 score,
        bytes32[] calldata proof
    ) external view returns (bool);
    
    /// @notice Get agent's verified reputation (if recently proven)
    function getVerifiedReputation(uint256 agentId) 
        external view returns (uint256 score, uint256 verifiedAt);
}
```

This allows other contracts to gate actions based on reputation:
```solidity
// Only allow high-rep agents to use advanced features
require(
    reputationRegistry.verifyReputation(agentId, minScore, proof),
    "Reputation too low"
);
```

---

*Status: Draft*
*Last Updated: 2026-03-07*
