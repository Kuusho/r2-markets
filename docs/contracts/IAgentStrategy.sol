// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IAgentStrategy
 * @notice Interface for R2 Markets agent strategy configuration and evaluation
 * @dev Implements the Agent Interface Standard v1.1
 */
interface IAgentStrategy {
    
    // ═══════════════════════════════════════════════════════════════
    // STRUCTS
    // ═══════════════════════════════════════════════════════════════
    
    struct AcquisitionParams {
        uint16 bidAggressiveness;     // bps (0-10000)
        uint16 slippageTolerance;     // bps (0-10000)
        uint16 gasPriorityBoost;      // bps (0-10000)
        uint16 confidenceThreshold;   // bps (0-10000)
    }
    
    struct PositionParams {
        uint256 maxBidPerTx;          // wei
        uint8 concurrentBids;         // 1-50
    }
    
    struct ValuationParams {
        uint16 rarityWeight;          // bps (0-10000)
        uint16 traitCorrelation;      // bps (0-10000)
    }
    
    struct ExitParams {
        uint32 holdingPeriodMin;      // seconds
        uint32 holdingPeriodMax;      // seconds
        uint16 profitTarget;          // bps (0-50000)
        uint16 lossCut;               // bps (0-10000, 10001 = disabled)
        bool lossCutTrailing;         // enable trailing stop
        uint16 lossCutTrailingDistance; // bps from peak
    }
    
    struct PortfolioParams {
        uint16 collectionDiversity;   // bps (max % per collection)
        uint16 liquidityPreference;   // bps (0=illiquid, 10000=max liquid)
    }
    
    struct FullStrategyParams {
        AcquisitionParams acquisition;
        PositionParams position;
        ValuationParams valuation;
        ExitParams exit;
        PortfolioParams portfolio;
        uint8 mode;                   // AgentMode enum index
    }
    
    // ═══════════════════════════════════════════════════════════════
    // ENUMS
    // ═══════════════════════════════════════════════════════════════
    
    enum AgentMode {
        SNIPE,      // 0 - Wait for specific opportunities, strike fast
        SWEEP,      // 1 - Accumulate floor NFTs rapidly
        HOLD,       // 2 - Stop all buying, maintain positions
        DUMP,       // 3 - Liquidate positions quickly
        IDLE,       // 4 - Pause all activity
        MONITOR,    // 5 - Observe only, log opportunities
        SCAN,       // 6 - Search for targets without acting
        LEARN,      // 7 - Backtest on historical data
        HYBRID      // 8 - Combine multiple modes
    }
    
    enum ExitReason {
        NONE,                   // 0
        PROFIT_TARGET_HIT,      // 1
        LOSS_CUT_TRIGGERED,     // 2
        TRAILING_STOP_HIT,      // 3
        MAX_HOLD_EXCEEDED,      // 4
        DIVERSITY_REBALANCE,    // 5
        DUMP_MODE_ACTIVE,       // 6
        MANUAL_OVERRIDE         // 7
    }
    
    enum ActionType {
        BID,        // 0
        BUY,        // 1
        LIST,       // 2
        CANCEL,     // 3
        ACCEPT      // 4
    }
    
    // ═══════════════════════════════════════════════════════════════
    // VIEWS
    // ═══════════════════════════════════════════════════════════════
    
    /// @notice Get current strategy parameters
    function getParams() external view returns (FullStrategyParams memory);
    
    /// @notice Get the agent's ERC-8004 ID
    function agentId() external view returns (uint256);
    
    /// @notice Get the agent's wallet address
    function agentWallet() external view returns (address);
    
    /// @notice Check if agent is currently active
    function isActive() external view returns (bool);
    
    // ═══════════════════════════════════════════════════════════════
    // EVALUATION
    // ═══════════════════════════════════════════════════════════════
    
    /// @notice Evaluate a buy opportunity
    /// @param opportunity Encoded (collection, tokenId, price, rarity, traits, volume)
    /// @return shouldBuy Whether to proceed with purchase
    /// @return bidAmount Recommended bid amount in wei
    /// @return confidence Model confidence 0-10000
    function evaluateBuy(bytes calldata opportunity) 
        external view 
        returns (bool shouldBuy, uint256 bidAmount, uint16 confidence);
    
    /// @notice Evaluate a sell opportunity for held NFT
    /// @param position Encoded (collection, tokenId, purchasePrice, purchaseTime, currentValue, peakValue)
    /// @return shouldSell Whether to list
    /// @return listPrice Recommended list price in wei
    /// @return reason Exit reason code
    function evaluateSell(bytes calldata position)
        external view
        returns (bool shouldSell, uint256 listPrice, ExitReason reason);
    
    // ═══════════════════════════════════════════════════════════════
    // MUTATIONS
    // ═══════════════════════════════════════════════════════════════
    
    /// @notice Update strategy parameters
    /// @param params New parameters
    function setParams(FullStrategyParams calldata params) external;
    
    /// @notice Set agent mode
    /// @param mode New mode
    function setMode(AgentMode mode) external;
    
    /// @notice Pause agent (equivalent to IDLE mode)
    function pause() external;
    
    /// @notice Resume agent to previous mode
    function resume() external;
    
    // ═══════════════════════════════════════════════════════════════
    // EVENTS
    // ═══════════════════════════════════════════════════════════════
    
    /// @notice Emitted when strategy parameters change
    event StrategyUpdated(
        uint256 indexed agentId,
        bytes32 indexed paramsHash,
        uint256 timestamp
    );
    
    /// @notice Emitted when agent mode changes
    event ModeChanged(
        uint256 indexed agentId,
        AgentMode indexed oldMode,
        AgentMode indexed newMode,
        uint256 timestamp
    );
    
    /// @notice Emitted on every agent action
    event AgentAction(
        uint256 indexed agentId,
        ActionType indexed actionType,
        address indexed collection,
        uint256 tokenId,
        uint256 price,
        bytes32 strategyHash,
        bytes32 confidenceData  // packed: confidence %, rarity score, trait score
    );
}
