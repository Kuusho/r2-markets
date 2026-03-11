# Agent Interface Standard v1.1

> The definitive specification for R2 Markets agent strategy configuration.

## Overview

Every R2 agent interprets a standardized set of 13 parameters across 5 groups. This document defines:
1. What each parameter means
2. How slider values map to behavior
3. The on-chain and off-chain schemas
4. Mode interactions

---

## Parameter Groups

| Group | Parameters | Purpose |
|-------|------------|---------|
| **ACQUISITION** | bid aggressiveness, slippage tolerance, gas priority, confidence threshold | How the agent buys |
| **POSITION SIZING** | max bid per tx, concurrent bids | Capital allocation |
| **VALUATION** | rarity weight, trait correlation | How agent values NFTs |
| **EXIT STRATEGY** | holding period, profit target, loss cut | When/how agent sells |
| **PORTFOLIO** | collection diversity, liquidity preference | Risk management |

---

## ACQUISITION Parameters

### 1. Bid Aggressiveness

**What it controls:** How much above floor/market price the agent is willing to bid to win.

| Value | Range | Behavior |
|-------|-------|----------|
| 0% | floor only | Agent only bids at or below current floor price |
| 25% | conservative | Bids up to 5% above floor |
| 50% | balanced | Bids up to 15% above floor |
| 75% | aggressive | Bids up to 30% above floor |
| 100% | max aggro | No ceiling — will outbid any competitor if capital allows |

**Formula:**
```
max_bid = floor_price × (1 + (aggressiveness / 100) × 0.5)
// at 80%: max_bid = floor × 1.4 (40% premium allowed)
```

---

### 2. Slippage Tolerance

**What it controls:** Maximum acceptable price movement between order creation and execution.

| Value | Range | Behavior |
|-------|-------|----------|
| 0.5% | tight | Abort if price moves >0.5% |
| 1.0% | normal | Abort if price moves >1% |
| 2.0% | loose | Abort if price moves >2% |
| 5.0% | degen | Abort if price moves >5% |
| 10%+ | yolo | Almost never abort |

**Formula:**
```
slippage_bps = slider_percent × 100
abort_if: current_price > order_price × (1 + slippage_bps / 10000)
```

---

### 3. Gas Priority Boost

**What it controls:** Extra gas paid for transaction priority.

| Value | Range | Behavior |
|-------|-------|----------|
| 0% | no boost | Use base gas price only |
| 25% | slight | +25% priority fee |
| 50% | medium | +50% priority fee |
| 75% | high | +75% priority fee |
| 100% | max | Double priority fee |

**Formula:**
```
priority_fee = base_priority × (1 + gas_boost / 100)
```

---

### 4. Confidence Threshold

**What it controls:** Minimum confidence score required before agent takes action.

| Value | Range | Behavior |
|-------|-------|----------|
| 50% | low bar | Acts on hunches — more trades, lower win rate |
| 70% | moderate | Balanced conviction |
| 85% | cautious | High conviction only |
| 95% | sniper | Near-certainty required |
| 99% | paranoid | Almost never acts |

**Formula:**
```
should_act = model_confidence >= confidence_threshold
```

**Confidence inputs:**
- Historical sale prices
- Trait floor differentials
- Collection momentum (volume trends)
- Seller behavior patterns
- Time on market

---

## POSITION SIZING Parameters

### 5. Max Bid Per TX

**What it controls:** Maximum ETH spent in single transaction.

| Value | Range | Behavior |
|-------|-------|----------|
| Ξ 0.1 | micro | Testing mode |
| Ξ 0.3 | small | Conservative |
| Ξ 0.6 | medium | Balanced |
| Ξ 1.0 | large | Significant |
| Ξ 5.0+ | whale | Major positions |

**Constraint:** Never exceeds 25% of pool balance.
```
actual_max = min(slider_value, pool_balance × 0.25)
```

---

### 6. Concurrent Bids

**What it controls:** Number of simultaneous active orders.

| Value | Range | Behavior |
|-------|-------|----------|
| 1 | single | One trade at a time |
| 3 | limited | Up to 3 concurrent |
| 5 | balanced | Moderate parallelism |
| 10 | active | Aggressive multi-targeting |
| 20+ | swarm | Maximum parallelism |

**Constraint:** `concurrent_bids × avg_bid_size <= pool_balance × 0.8`

---

## VALUATION Parameters

### 7. Rarity Weight

**What it controls:** Preference for rare traits over floor items.

| Value | Range | Behavior |
|-------|-------|----------|
| 0% | floor focus | Ignore rarity |
| 25% | slight preference | Mild rarity bonus |
| 50% | balanced | Equal weight |
| 75% | rarity hunter | Strong preference |
| 100% | trait sniper | Only top 10% rarity |

**Formula:**
```
score = price_score × (1 - rarity_weight) + rarity_score × rarity_weight
rarity_score = 1 - (item_rarity_rank / collection_size)
```

---

### 8. Trait Correlation

**What it controls:** Whether to evaluate trait synergies vs individual traits.

| Value | Range | Behavior |
|-------|-------|----------|
| OFF | individual | Each trait evaluated alone |
| 25% | weak | Slight combo bonus |
| 50% | moderate | Balanced analysis |
| 75% | strong | Heavy emphasis on synergies |
| MAX | full | Only buy "coherent" combos |

**Example:**
- OFF: "laser eyes" = +10% value (always)
- MAX: "laser eyes + cyber background" = +40% (synergy)
- MAX: "laser eyes + clown nose" = +5% (conflict)

---

## EXIT STRATEGY Parameters

### 9. Holding Period

**What it controls:** Min/max time before considering sale.

| Value | Range | Behavior |
|-------|-------|----------|
| FLASH | 0-1 blocks | Immediate flip allowed |
| QUICK | 1-60 min | Short-term trades |
| HOURS | 1-24 hours | Intraday |
| DAYS | 1-7 days | Swing trading |
| WEEKS | 1-4 weeks | Medium-term |
| DIAMOND | 30+ days | Long-term accumulation |

**Behavior:**
- `t < minHold`: Ignore sell signals
- `minHold <= t <= maxHold`: Normal exit evaluation
- `t > maxHold`: Aggressively seek exit (profit target -50%)

---

### 10. Profit Target

**What it controls:** Minimum profit % required before listing.

| Value | Range | Behavior |
|-------|-------|----------|
| 5% | micro gains | List at 5% profit |
| 15% | modest | Wait for 15% |
| 30% | standard | Target 30% returns |
| 50% | ambitious | Only sell for 50%+ |
| 100% | 2x or bust | Hold until doubling |

**Formula:**
```
min_list_price = purchase_price × (1 + profit_target / 100)
```

**Dynamic decay:** Profit target reduces by up to 80% when exceeding maxHold.

---

### 11. Loss Cut

**What it controls:** Maximum acceptable loss before dumping.

| Value | Range | Behavior |
|-------|-------|----------|
| 5% | tight | Dump at -5% |
| 10% | cautious | Allow 10% drawdown |
| 20% | moderate | Standard stop-loss |
| 35% | loose | High volatility tolerance |
| 50% | diamond | Only dump if halved |
| OFF | disabled | Never auto-dump |

**Formula:**
```
should_dump = current_value < purchase_price × (1 - loss_cut / 100)
```

**Trailing stop option:** Stop moves up with price to lock in gains.
```
trailing_stop = peak_value × (1 - trailing_distance / 100)
```

---

## PORTFOLIO Parameters

### 12. Collection Diversity

**What it controls:** Max % of portfolio in single collection.

| Value | Range | Behavior |
|-------|-------|----------|
| 10% | highly diversified | Max 10% per collection |
| 25% | balanced | Max 25% |
| 50% | concentrated | Up to half in one |
| 75% | focused | High conviction |
| 100% | yolo | No limit |

**Enforcement:** Agent checks before every bid. If limit reached, collection enters monitor-only mode.

---

### 13. Liquidity Preference

**What it controls:** Preference for high-volume vs low-volume collections.

| Value | Range | Behavior |
|-------|-------|----------|
| 0% | illiquid hunter | Prefer <10 daily trades |
| 25% | contrarian | Slight quiet market preference |
| 50% | neutral | No preference |
| 75% | liquid | Prefer 50+ daily trades |
| 100% | max liquidity | Only top 10 most liquid |

**Formula:**
```
liquidityScore = collection.dailyVolume / maxDailyVolume
preferenceNormalized = (liquidityPreference - 50) / 50  // -1 to 1
liquidityBonus = liquidityScore × preferenceNormalized × 0.3
adjustedScore = baseScore × (1 + liquidityBonus)
```

---

## TypeScript Schema

```typescript
interface StrategyConfig {
  // ACQUISITION
  bidAggressiveness: number;      // 0-10000 bps
  slippageTolerance: number;      // 0-10000 bps
  gasPriorityBoost: number;       // 0-10000 bps
  confidenceThreshold: number;    // 0-10000 bps
  
  // POSITION SIZING
  maxBidPerTx: bigint;            // wei
  concurrentBids: number;         // 1-50
  
  // VALUATION
  rarityWeight: number;           // 0-10000 bps
  traitCorrelation: number;       // 0-10000 bps
  
  // EXIT STRATEGY
  holdingPeriodMin: number;       // seconds
  holdingPeriodMax: number;       // seconds
  profitTarget: number;           // 0-50000 bps
  lossCut: number;                // 0-10000 bps (10001 = disabled)
  lossCutTrailing: boolean;
  lossCutTrailingDistance: number; // bps
  
  // PORTFOLIO
  collectionDiversity: number;    // 0-10000 bps
  liquidityPreference: number;    // 0-10000 bps
  
  // MODE
  mode: AgentMode;
  hybridModes?: AgentMode[];
  
  // TARGETING
  targetCollections: Address[];
  excludeCollections: Address[];
  minFloorPrice: bigint;
  maxFloorPrice: bigint;
  
  // SAFETY
  maxDrawdownPercent: number;
  dailyLossLimit: bigint;
  
  // METADATA
  version: number;
  updatedAt: number;
  updatedBy: Address;
}
```

---

## Solidity Interface

See: [[IAgentStrategy.sol]]

---

## Preset Strategies

| Preset | Description | Key Settings |
|--------|-------------|--------------|
| **FLOOR SWEEPER** | Accumulate cheapest NFTs | aggression=30%, rarity=0%, profit=15% |
| **TRAIT SNIPER** | Hunt rare traits | aggression=90%, rarity=100%, profit=50% |
| **FLIP BOT** | Fast arbitrage | aggression=60%, hold=FLASH, profit=5% |
| **DIAMOND HANDS** | Long-term hold | aggression=50%, hold=30d+, profit=100% |
| **CAUTIOUS** | Low risk | aggression=25%, confidence=95%, loss=10% |
| **DEGEN** | Max aggression | aggression=100%, loss=50%, gas=100% |

---

*Version: 1.1*
*Last Updated: 2026-03-07*
