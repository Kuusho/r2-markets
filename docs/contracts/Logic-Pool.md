# Logic Pool Contract

> Smart contract vault where users deposit ETH and subscribe to agent strategies.

## Overview

```
USER A ──┐
         │
USER B ──┼──▶ LOGIC POOL (Strategy: "Aggressive Sweeper")
         │         │
USER C ──┘         │
                   ▼
              AGENT WALLET (ERC-8004)
                   │
                   ▼
              MARKETPLACE ACTIONS
```

Users don't run agents directly. They deposit ETH and "subscribe" to a strategy logic. Multiple users can back the same agent.

---

## Interface

```solidity
interface ILogicPool {
    // ═══════════════════════════════════════
    // USER DEPOSITS
    // ═══════════════════════════════════════
    
    /// @notice Deposit ETH into the pool
    function deposit() external payable;
    
    /// @notice Withdraw ETH from the pool
    /// @param amount Amount in wei to withdraw
    function withdraw(uint256 amount) external;
    
    /// @notice Get user's share of the pool
    function getShare(address user) external view returns (uint256);
    
    /// @notice Get user's current value (share × NAV)
    function getValue(address user) external view returns (uint256);
    
    // ═══════════════════════════════════════
    // POOL STATE
    // ═══════════════════════════════════════
    
    /// @notice Total deposits in pool
    function totalDeposits() external view returns (uint256);
    
    /// @notice Current pool NAV (including NFT holdings)
    function netAssetValue() external view returns (uint256);
    
    /// @notice Pool's ERC-8004 agent ID
    function agentId() external view returns (uint256);
    
    /// @notice Pool's agent wallet address
    function agentWallet() external view returns (address);
    
    // ═══════════════════════════════════════
    // STRATEGY BINDING
    // ═══════════════════════════════════════
    
    /// @notice Set the strategy contract (onlyOwner)
    function setStrategy(address strategyContract) external;
    
    /// @notice Get current strategy contract
    function strategy() external view returns (address);
    
    // ═══════════════════════════════════════
    // AGENT EXECUTION
    // ═══════════════════════════════════════
    
    /// @notice Execute an action (onlyAgent)
    function execute(bytes calldata action) external;
    
    /// @notice Batch execute multiple actions
    function executeBatch(bytes[] calldata actions) external;
    
    // ═══════════════════════════════════════
    // SAFETY
    // ═══════════════════════════════════════
    
    /// @notice Pause all pool operations
    function pause() external;
    
    /// @notice Resume pool operations
    function unpause() external;
    
    /// @notice Set maximum drawdown before auto-pause (bps)
    function setMaxDrawdown(uint256 bps) external;
    
    /// @notice Set daily loss limit (wei)
    function setDailyLossLimit(uint256 amount) external;
    
    /// @notice Emergency withdraw all (returns ETH, may leave NFTs)
    function emergencyWithdraw() external;
}
```

---

## Events

```solidity
event Deposited(address indexed user, uint256 amount, uint256 shares);
event Withdrawn(address indexed user, uint256 amount, uint256 shares);
event StrategySet(address indexed oldStrategy, address indexed newStrategy);
event ActionExecuted(bytes32 indexed actionHash, bool success);
event DrawdownTriggered(uint256 currentNav, uint256 peakNav, uint256 drawdownBps);
event EmergencyPaused(address indexed triggeredBy, string reason);
```

---

## Share Accounting

Uses standard vault share model:

```solidity
// On deposit
shares = (depositAmount * totalShares) / totalAssets
// If first deposit: shares = depositAmount

// On withdraw
amount = (shares * totalAssets) / totalShares
```

Where `totalAssets = ETH balance + sum(NFT valuations)`.

---

## NFT Valuation

Pool needs to value held NFTs for NAV calculation:

```solidity
interface INFTValuator {
    /// @notice Get current value of NFT in wei
    function getValue(address collection, uint256 tokenId) 
        external view returns (uint256);
}
```

Options:
1. **Floor price oracle** - Conservative, uses collection floor
2. **Trait-adjusted** - Applies rarity multiplier to floor
3. **Last sale** - Uses NFT's last sale price
4. **TWAP** - Time-weighted average of recent sales

Default: Floor price with 10% haircut for safety margin.

---

## Execution Flow

```
1. Agent runtime detects opportunity
2. Agent calls evaluateBuy() on strategy contract
3. If shouldBuy, agent calls pool.execute(buyAction)
4. Pool validates:
   - Caller is registered agent wallet
   - Action within strategy constraints
   - Sufficient balance
   - Not paused
5. Pool executes marketplace tx
6. Pool updates internal accounting
7. Emits ActionExecuted event
```

---

## Safety Mechanisms

### Max Drawdown
```solidity
// If NAV drops X% below peak, auto-pause
if (currentNav < peakNav * (10000 - maxDrawdownBps) / 10000) {
    _pause();
    emit DrawdownTriggered(currentNav, peakNav, actualDrawdownBps);
}
```

### Daily Loss Limit
```solidity
// Track daily P&L, pause if exceeds limit
if (dailyLoss > dailyLossLimit) {
    _pause();
    emit EmergencyPaused(address(this), "Daily loss limit exceeded");
}
```

### Single Trade Limit
```solidity
// Never risk more than 25% of pool on single trade
require(tradeAmount <= totalAssets / 4, "Trade too large");
```

---

## Deployment

```solidity
constructor(
    uint256 _agentId,           // ERC-8004 agent ID
    address _agentWallet,       // Agent's signing wallet
    address _strategy,          // Initial strategy contract
    uint256 _maxDrawdownBps,    // Max drawdown before pause
    uint256 _dailyLossLimit     // Daily loss limit in wei
)
```

---

## Related

- [[Agent-Interface-Standard]]
- [[IAgentStrategy.sol]]
- [[../infrastructure/Metadata-Oracle]]

---

*Status: Draft*
*Last Updated: 2026-03-07*
