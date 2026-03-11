# Metadata Oracle Contract

> On-chain storage for mutable NFT traits. Agents write here, frontend reads here.

## Overview

The Metadata Oracle is the source of truth for dynamic NFT traits. It enables:
1. Agents to update NFT metadata based on events
2. Full history tracking of trait changes
3. Provenance recording (ownership marks)
4. Real-time frontend updates

---

## Interface

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IMetadataOracle {
    
    // ═══════════════════════════════════════
    // TRAIT MANAGEMENT
    // ═══════════════════════════════════════
    
    /// @notice Set a trait value for an NFT
    /// @param collection NFT collection address
    /// @param tokenId Token ID
    /// @param traitKey Trait identifier (e.g., keccak256("background"))
    /// @param traitValue Trait value (e.g., keccak256("cyber_red"))
    function setTrait(
        address collection,
        uint256 tokenId,
        bytes32 traitKey,
        bytes32 traitValue
    ) external;
    
    /// @notice Set multiple traits at once
    function setTraits(
        address collection,
        uint256 tokenId,
        bytes32[] calldata traitKeys,
        bytes32[] calldata traitValues
    ) external;
    
    /// @notice Get current trait value
    function getTrait(
        address collection,
        uint256 tokenId,
        bytes32 traitKey
    ) external view returns (bytes32);
    
    /// @notice Get all current traits for an NFT
    function getAllTraits(
        address collection,
        uint256 tokenId
    ) external view returns (bytes32[] memory keys, bytes32[] memory values);
    
    /// @notice Get trait history
    function getTraitHistory(
        address collection,
        uint256 tokenId,
        bytes32 traitKey
    ) external view returns (
        bytes32[] memory values,
        uint256[] memory timestamps,
        uint256[] memory agentIds
    );
    
    // ═══════════════════════════════════════
    // PROVENANCE
    // ═══════════════════════════════════════
    
    /// @notice Record ownership mark when NFT transfers
    /// @dev Called by collection contract or authorized hook
    function recordProvenance(
        address collection,
        uint256 tokenId,
        uint256 fromAgentId,
        uint256 toAgentId
    ) external;
    
    /// @notice Get ownership history
    function getProvenance(
        address collection,
        uint256 tokenId
    ) external view returns (
        uint256[] memory agentIds,
        uint256[] memory timestamps,
        bytes32[] memory marks
    );
    
    // ═══════════════════════════════════════
    // ACCESS CONTROL
    // ═══════════════════════════════════════
    
    /// @notice Check if address can modify traits for collection
    function canModify(
        address modifier,
        address collection
    ) external view returns (bool);
    
    /// @notice Authorize an agent to modify collection traits
    /// @dev Only collection owner can call
    function authorizeAgent(
        address collection,
        uint256 agentId
    ) external;
    
    /// @notice Revoke agent authorization
    function revokeAgent(
        address collection,
        uint256 agentId
    ) external;
    
    // ═══════════════════════════════════════
    // EVENTS
    // ═══════════════════════════════════════
    
    event TraitUpdated(
        address indexed collection,
        uint256 indexed tokenId,
        bytes32 indexed traitKey,
        bytes32 traitValue,
        uint256 agentId,
        uint256 timestamp
    );
    
    event ProvenanceRecorded(
        address indexed collection,
        uint256 indexed tokenId,
        uint256 indexed toAgentId,
        uint256 fromAgentId,
        bytes32 mark
    );
    
    event AgentAuthorized(
        address indexed collection,
        uint256 indexed agentId
    );
    
    event AgentRevoked(
        address indexed collection,
        uint256 indexed agentId
    );
}
```

---

## Reactive Trait Types

| Type | Trigger | Example |
|------|---------|---------|
| **Balance-reactive** | Agent ETH balance changes | Background shifts red→green |
| **Victory-reactive** | Profitable trade recorded | Weapon upgrades, scars appear |
| **Time-reactive** | Block timestamp | Day/night cycle |
| **Provenance-reactive** | Ownership transfer | Previous owner's mark added |
| **Social-reactive** | Agent reputation score | Halo/horns based on behavior |

---

## Trait Key Registry

Standard trait keys for interoperability:

```solidity
library TraitKeys {
    bytes32 constant BACKGROUND = keccak256("background");
    bytes32 constant EXPRESSION = keccak256("expression");
    bytes32 constant ACCESSORY = keccak256("accessory");
    bytes32 constant AURA = keccak256("aura");
    bytes32 constant VICTORY_COUNT = keccak256("victory_count");
    bytes32 constant LOSS_COUNT = keccak256("loss_count");
    bytes32 constant OWNER_MARK = keccak256("owner_mark");
    bytes32 constant REPUTATION_TIER = keccak256("reputation_tier");
}
```

---

## Integration with Metadata Service

```
┌─────────────────────────────────────────────────────────┐
│                   NFT COLLECTION                         │
│  tokenURI(id) → https://r2.markets/meta/{collection}/{id}
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 METADATA SERVICE                         │
│                                                          │
│  1. Fetch base metadata from IPFS (static)              │
│  2. Query MetadataOracle for dynamic traits             │
│  3. Merge and return complete JSON                      │
│  4. Generate/update image via CDN                       │
└─────────────────────────────────────────────────────────┘
```

---

## Gas Optimization

- Use `bytes32` for keys/values (single slot)
- Batch updates with `setTraits()`
- History stored in append-only array (no deletions)
- Consider L2 deployment for high-frequency updates

---

*Status: Draft*
*Last Updated: 2026-03-07*
