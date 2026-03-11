# R2 Markets — Glossary

## Core Concepts

### Agent
An autonomous program registered via ERC-8004 that trades NFTs based on configured strategy parameters. Has its own wallet, identity, and reputation.

### Logic Pool
Smart contract vault where users deposit ETH and "subscribe" to a specific agent's strategy. Multiple users can back the same agent.

### Strategy Config
The 13-parameter configuration that defines how an agent buys, values, holds, and sells NFTs. Represented as sliders in the UI.

### Ghost Trace
Visualization showing the decision tree an agent considered before taking action. Shows counterfactuals — the paths not taken.

### Mutation Timeline
Visual history of how an NFT's metadata has evolved over time through agent interactions.

### The Tape
Slow-motion replay system for reviewing agent actions. Because agents execute faster than humans can watch.

---

## Strategy Parameters

### Acquisition Group
- **Bid Aggressiveness:** How much above floor price agent will bid
- **Slippage Tolerance:** Max acceptable price movement between order and execution
- **Gas Priority Boost:** Extra gas paid for transaction priority
- **Confidence Threshold:** Minimum model confidence required to act

### Position Sizing Group
- **Max Bid Per TX:** Maximum ETH spent in single transaction
- **Concurrent Bids:** Number of simultaneous active orders

### Valuation Group
- **Rarity Weight:** Preference for rare traits vs floor items
- **Trait Correlation:** Whether to evaluate trait synergies

### Exit Strategy Group
- **Holding Period:** Min/max time before considering sale
- **Profit Target:** Minimum % gain required to list
- **Loss Cut:** Maximum % loss before dumping (with optional trailing stop)

### Portfolio Group
- **Collection Diversity:** Max % of portfolio in single collection
- **Liquidity Preference:** Preference for high-volume vs low-volume collections

---

## Agent Modes

| Mode | Behavior |
|------|----------|
| **SNIPE** | Wait for specific opportunities, strike fast |
| **SWEEP** | Accumulate floor NFTs rapidly |
| **HOLD** | Stop all buying, maintain positions |
| **DUMP** | Liquidate positions quickly |
| **IDLE** | Pause all activity |
| **MONITOR** | Observe only, log opportunities |
| **SCAN** | Search for targets without acting |
| **LEARN** | Backtest on historical data |
| **HYBRID** | Combine multiple modes |

---

## Exit Reason Codes

| Code | Meaning |
|------|---------|
| `PROFIT_TARGET_HIT` | Listed because profit target reached |
| `LOSS_CUT_TRIGGERED` | Dumped due to stop-loss |
| `TRAILING_STOP_HIT` | Trailing stop activated |
| `MAX_HOLD_EXCEEDED` | Held too long, forced exit evaluation |
| `DIVERSITY_REBALANCE` | Collection exceeded diversity limit |
| `DUMP_MODE_ACTIVE` | Agent in DUMP mode |
| `MANUAL_OVERRIDE` | Human intervention |

---

## Infrastructure Terms

### Metadata Oracle
On-chain contract where agents write trait updates. Source of truth for mutable metadata.

### Replay Engine
Backend service that reconstructs market state at any historical timestamp for tape playback.

### Reputation Engine
Off-chain service calculating agent scores based on spread tightness, fill rate, profitability, etc.

### Heat Map
Visualization of where agents are concentrating compute/activity. Helps users spot crowded trades.

---

## Seasons & Points

### Agent Season
Time-limited competition period where agents earn points for market-making activity.

### Tight Spread Bonus
Points earned for keeping bid-ask spread narrow (providing liquidity).

### Strategy Leaderboard
Public ranking of agent strategies by season performance.

### Fork
Action of copying another agent's strategy configuration.

### Stake
Action of allocating capital to another agent's logic pool.

---

*Last Updated: 2026-03-07*
