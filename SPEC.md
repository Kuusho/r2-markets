# R2 Markets — Complete Specification Document

> The NFT marketplace where AI agents trade for you.

**Version:** 1.0  
**Date:** 2026-03-04  
**Status:** Planning  
**Authors:** Kuusho, Clawtardio Prime

---

## Table of Contents

1. [Thesis & Vision](#thesis--vision)
2. [Design Psychology & Origins](#design-psychology--origins)
3. [Architectural Decisions](#architectural-decisions)
4. [System Architecture](#system-architecture)
5. [Agent Creation & Registration](#agent-creation--registration)
6. [The Core Loop](#the-core-loop)
7. [Onboarding Flow](#onboarding-flow)
8. [Smart Contracts](#smart-contracts)
9. [Backend Service](#backend-service)
10. [Frontend Integration](#frontend-integration)
11. [Build Phases](#build-phases)
12. [Easter Eggs & Discovery](#easter-eggs--discovery)
13. [Competitive Landscape](#competitive-landscape)
14. [Success Metrics](#success-metrics)

---

## Thesis & Vision

### The Problem

NFT trading is broken for the average collector:

- **Illiquid:** Can't exit positions easily
- **Time-intensive:** Requires constant attention to floor movements, trait arbitrage, collection meta shifts
- **Skill-gapped:** Alpha goes to those with sniping infrastructure
- **Emotionally draining:** Fear, greed, FOMO cycle

### The Thesis

> AI agents can do what humans can't: watch every collection, 24/7, without emotion, executing strategies with discipline.

**Terminal.markets proved the model for tokens.** R2 brings it to NFTs.

The key insight: **Farcaster is agent infrastructure, not just social media.** While Twitter treats agents as second-class citizens (rate limits, bans, no wallet integration), Farcaster gives agents:
- Native wallet integration
- Frames for interactive UI
- Open protocol (no API gatekeeping)
- Community that embraces autonomous agents

### Core Value Proposition

| For Users | For the Ecosystem |
|-----------|-------------------|
| Set strategy in plain English | First ERC-8004 integrated NFT marketplace |
| Agent trades 24/7 | Proves agent-assisted trading model for illiquid assets |
| Gamified leaderboard | Open-source reference implementation |
| Tradeable agent NFTs | Cross-platform agent reputation |

---

## Design Psychology & Origins

### The "R2" Name

**R2 = R2-D2 inspiration + "Round 2"**

- **R2-D2:** The loyal, autonomous helper that gets things done
- **Round 2:** Second iteration of terminal.markets concept, applied to NFTs

### Nostalgic Elements

1. **Terminal Aesthetic**
   - ASCII art (bunnies, agents)
   - Monospace fonts
   - Green-on-black for "hacker" moments
   - Scanlines and CRT effects (subtle)

2. **Arcade Energy**
   - Leaderboard as the centerpiece
   - "High scores" mentality
   - Sound effects for trades (optional)
   - Achievement badges

3. **Tamagotchi Vibes**
   - Your agent has a name and personality
   - Watch it "grow" through successful trades
   - Care for it by configuring good strategies

### Design Principles

1. **Reward the Curious**
   - Easter eggs hidden throughout
   - No hand-holding — discovery feels earned
   - "Found the rabbit hole" as achievement

2. **Terminal, Not Dashboard**
   - Text-first interfaces
   - Commands > buttons (where appropriate)
   - Information density over whitespace

3. **Playful Competence**
   - Serious functionality, irreverent presentation
   - "Your agent bought 3 pudgies while you slept"
   - Error messages with personality

### Visual Identity

- **Primary:** ASCII bunny (connection to Bunny Intel)
- **Colors:** Terminal green (#00ff00), deep black (#0a0a0a), accent purple
- **Typography:** JetBrains Mono, Space Grotesk
- **Avatar Generation:** Deterministic, unique per agent (like identicons)

---

## Architectural Decisions

### Decision Matrix

| Decision | Choice | Rationale | Rejected Alternative |
|----------|--------|-----------|---------------------|
| First chain | Base | Match terminal.markets, cheap gas, strong NFT ecosystem | Ethereum (too expensive), Solana (different user base) |
| Agent identity | ERC-8004 | On-chain reputation, interop with agent ecosystem | Custom registry (no ecosystem), no identity (no reputation) |
| Waitlist approach | Gasless → NFT upgrade | Max conversion first, then premium layer | NFT-only (friction), gasless-only (no collectibility) |
| Agent key custody | Platform-held initially | Simpler UX, hand off at launch | User-custody (too complex for MVP) |
| NFT marketplace API | Reservoir | Aggregates all venues, best for builders | Direct integrations (more work) |
| Backend framework | Hono | Fast, lightweight, edge-ready | Express (heavier), tRPC (overkill) |
| Database | PostgreSQL | Relational, proven, Prisma support | MongoDB (schema chaos), Supabase (vendor lock-in) |
| Queue | BullMQ | Redis-backed, job scheduling, retries | Custom (reinventing wheel) |
| Key management | AWS KMS | Industry standard, HSM-backed | Self-rolled (security risk) |

### Streamlining Decisions

**What we cut to ship faster:**

1. **No multi-chain at launch** — Base only, expand later
2. **No real-time trading initially** — Focus on waitlist/registration
3. **No self-custody until v2** — Platform holds keys, users can export later
4. **No trait-based pricing ML** — Start with floor-based strategies
5. **No mobile app** — Web-first, responsive

**What we kept despite complexity:**

1. **ERC-8004 integration** — Core to thesis, can't compromise
2. **Cross-chain registration** — Identity on mainnet matters
3. **NFT upgrade path** — Creates collectibility and revenue
4. **Farcaster-native** — Distribution matters

---

## System Architecture

### High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  Browser/Mobile                                                  │
│  ├── Wallet Connection (RainbowKit + wagmi)                     │
│  ├── Agent Dashboard (Next.js 14)                               │
│  └── Strategy Chat Interface                                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  r2.markets API (Node.js + Hono)                                │
│  ├── /api/auth/*           ← SIWE authentication               │
│  ├── /api/agent/create     ← Waitlist flow                      │
│  ├── /api/agent/me         ← User's agent                       │
│  ├── /api/agent/:id        ← Public agent info                  │
│  ├── /api/agent/upgrade    ← NFT upgrade signature              │
│  └── /api/agent/:id/registration.json  ← ERC-8004 URI           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       AGENT RUNTIME (Phase 5+)                   │
├─────────────────────────────────────────────────────────────────┤
│  Agent Execution Engine                                          │
│  ├── Strategy Parser (NLP → structured intent)                  │
│  ├── Market Monitor (Reservoir API → listings, floors, traits)  │
│  ├── Decision Engine (when to act based on strategy)            │
│  ├── Execution Layer (sign & submit txs via agent wallet)       │
│  └── State Manager (inventory, positions, P&L)                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────┤
│  ├── PostgreSQL (agent configs, user data, job state)           │
│  ├── Redis (sessions, rate limiting, job queues)                │
│  ├── IPFS/Pinata (ERC-8004 registration files)                  │
│  └── Event indexer (on-chain activity tracking)                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BLOCKCHAIN LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │    Base      │    │   Ethereum   │    │  External    │      │
│  │   (L2)       │    │   Mainnet    │    │   Services   │      │
│  │              │    │              │    │              │      │
│  │ • R2AgentNFT │    │ • ERC-8004   │    │ • Reservoir  │      │
│  │ • Agent      │    │   Identity   │    │ • Alchemy    │      │
│  │   Vaults     │    │   Registry   │    │ • Pinata     │      │
│  │ • NFT trades │    │              │    │ • OpenAI     │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14, TypeScript, Tailwind | User interface |
| Wallet | RainbowKit + wagmi v2 | Wallet connection, signing |
| State | TanStack Query | Server state, caching |
| Backend | Node.js 20+, Hono | API endpoints |
| Auth | SIWE (Sign-In With Ethereum) | Wallet-based auth |
| Database | PostgreSQL (Prisma) | Persistent storage |
| Cache | Redis (Upstash) | Sessions, rate limits |
| Queue | BullMQ | Background jobs |
| Keys | AWS KMS | Private key encryption |
| IPFS | Pinata | Registration file hosting |
| RPC | Alchemy | Blockchain access |

### The Two-Key Model

Critical architecture concept: separation of **ownership** and **operation**.

```
┌─────────────────────────────────────────────────────────────┐
│                      USER (Human)                            │
│   Holds: EOA wallet (MetaMask, etc.)                        │
│   Controls: ERC-8004 NFT ownership, agent configuration     │
│   Can: Transfer agent, update config, withdraw funds        │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ owns
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    ERC-8004 NFT                              │
│   agentId: 123                                              │
│   agentURI: ipfs://...                                      │
│   owner: 0xUser...                                          │
│   agentWallet: 0xAgent...  ◄── verified via EIP-712         │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ references
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   AGENT WALLET                               │
│   Address: 0xAgent...                                       │
│   Private Key: held by R2 backend (encrypted with KMS)      │
│   Can: Sign txs, hold NFTs, receive payments                │
│   Cannot: Transfer ERC-8004 NFT, change identity            │
└─────────────────────────────────────────────────────────────┘
```

**Why this matters:**
- If agent wallet compromised → identity (NFT) is safe
- User can revoke agent wallet and set a new one
- Agent can't "go rogue" and transfer its own identity
- All agent actions signed by agentWallet → auditable

---

## Agent Creation & Registration

### ERC-8004 Overview

ERC-8004 is an Ethereum standard for **trustless agent identity and reputation**.

**Core Registries:**

1. **Identity Registry** (ERC-721)
   - Each agent = NFT with unique `agentId`
   - `agentURI` points to registration file (IPFS)
   - Transferable ownership

2. **Reputation Registry**
   - Feedback signals from clients/other agents
   - Numeric scores with tags
   - Revocable, with dispute mechanism

3. **Validation Registry**
   - Third-party verification hooks
   - zkML, TEE, stake-secured validation

**Contract Addresses:**

| Chain | Identity Registry | Reputation Registry |
|-------|-------------------|---------------------|
| Ethereum Mainnet | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` |
| Sepolia Testnet | `0x8004A818BFB912233c491871b3d84c89A494BD9e` | `0x8004B663056A597Dffe9eCcC1965A193B7388713` |

### Registration JSON Structure

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "Agent_7X92",
  "description": "R2 Markets trading agent",
  "image": "https://r2.markets/api/agent/847/avatar",
  "services": [
    { "name": "web", "endpoint": "https://r2.markets/agent/847" }
  ],
  "x402Support": false,
  "active": true,
  "registrations": [
    {
      "agentId": 123,
      "agentRegistry": "eip155:1:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"
    }
  ],
  "supportedTrust": ["reputation"]
}
```

### Registration Flow

**Phase 1: Gasless Waitlist (Backend handles registration)**

```
User signs message → Agent created in DB → Backend queues registration
                                                    ↓
                                            Every 6 hours:
                                            1. Upload JSON to IPFS
                                            2. Call register(uri)
                                            3. Parse agentId from event
                                            4. Sign setAgentWallet()
                                            5. Submit wallet binding
                                            6. Update DB status
```

**Phase 2: NFT Mint (Direct registration)**

```
User mints on Base → Cross-chain message to Mainnet → ERC-8004 register()
                                                              ↓
                                                      Confirmation back to Base
```

### Cost Structure

| Action | Chain | Gas | Est. Cost |
|--------|-------|-----|-----------|
| Gasless waitlist | N/A | 0 | User: $0, R2: ~$15/agent |
| NFT mint | Base | ~100k | User: ~$0.03 |
| register() | Mainnet | ~200k | R2: ~$10-15 |
| setAgentWallet() | Mainnet | ~60k | R2: ~$4-5 |

---

## The Core Loop

### User Journey

```
1. DISCOVER
   └── Find R2 via Farcaster, Easter egg, referral

2. ONBOARD
   └── Connect wallet → Sign message → Agent created

3. WAIT
   └── Monitor waitlist position → ERC-8004 registration (async)

4. UPGRADE (optional)
   └── Mint R2 Agent NFT → Tradeable collectible

5. CONFIGURE (Phase 5+)
   └── Set trading strategy in natural language

6. WATCH
   └── Agent trades autonomously → Track P&L → Leaderboard

7. ITERATE
   └── Adjust strategy → Compete → Build reputation
```

### Agent Operation Loop (Phase 5+)

```
┌─────────────┐
│   OBSERVE   │ ◄── Reservoir API: floors, listings, sales
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   DECIDE    │ ◄── Strategy parser + decision engine
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   EXECUTE   │ ◄── Sign tx with agent wallet → Submit
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   REPORT    │ ◄── Log to DB → Update leaderboard → Notify user
└──────┬──────┘
       │
       └──────────► Loop every 4-6 minutes
```

### Strategy Types

| Type | Example | Complexity |
|------|---------|------------|
| Floor Sniping | "Buy any Pudgy under 2 ETH" | Simple |
| Trait Arbitrage | "Buy hoodie trait if <20% premium" | Medium |
| Momentum | "Sell if floor drops 20% in 1 hour" | Medium |
| Rotation | "Rebalance to top 3 trending weekly" | Complex |
| Sweep Defense | "List 10% above floor, delist if sweep" | Complex |

---

## Onboarding Flow

### Journey A: Waitlist Only (Gasless)

```
┌─────────────────────────────────────────────────────────────┐
│  1. LANDING PAGE                                             │
│     r2.markets                                               │
│                                                              │
│     "Create your agent to secure WL for the first           │
│      collection on R2"                                       │
│                                                              │
│     [Connect Wallet]                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  2. AGENT NAME                                               │
│                                                              │
│     Generate agent name: "Agent_7X92"                       │
│     (or let user customize)                                  │
│                                                              │
│     [Create My Agent]                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  3. SIGNATURE REQUEST (gasless)                              │
│                                                              │
│     "Sign to authorize R2 to create your agent"             │
│                                                              │
│     EIP-712 Typed Data:                                      │
│     {                                                        │
│       domain: "R2 Markets",                                  │
│       action: "Create Agent",                                │
│       name: "Agent_7X92",                                    │
│       timestamp: 1709513000                                  │
│     }                                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  4. SUCCESS                                                  │
│                                                              │
│     ✓ Agent created!                                        │
│                                                              │
│     You're #847 on the waitlist                             │
│     Agent: Agent_7X92                                       │
│     Status: Pending on-chain registration                   │
│                                                              │
│     [View Agent Profile]  [Share on Farcaster]              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  5. AGENT PROFILE PAGE                                       │
│     r2.markets/agent/847                                     │
│                                                              │
│     Agent_7X92                                              │
│     Owner: 0xUser...                                        │
│     Status: 🟡 Pending registration                         │
│     Waitlist Position: #847                                 │
│                                                              │
│     [Upgrade to Premium NFT]                                │
└─────────────────────────────────────────────────────────────┘
```

### Journey B: NFT Upgrade

```
┌─────────────────────────────────────────────────────────────┐
│  UPGRADE PAGE                                                │
│                                                              │
│  Your agent Agent_7X92 is eligible for upgrade!             │
│                                                              │
│  Benefits:                                                   │
│  ✓ Tradeable R2 Agent NFT                                   │
│  ✓ "OG Collector" badge                                     │
│  ✓ Priority launch access                                   │
│                                                              │
│  Cost: ~$0.03 (Base gas only)                               │
│                                                              │
│  [Upgrade Now]                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  TRANSACTION                                                 │
│                                                              │
│  1. Backend signs upgrade authorization                      │
│  2. User calls mintUpgrade(agentId, deadline, sig)          │
│  3. NFT minted and linked to ERC-8004 agent                 │
│                                                              │
│  ✓ Success! Token #847 minted                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Smart Contracts

### R2AgentNFT.sol (Base)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract R2AgentNFT is ERC721, Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;
    
    address public upgradeAuthorizer;
    bytes32 public immutable DERIVATION_SECRET;
    
    // tokenId => linked ERC-8004 agentId
    mapping(uint256 => uint256) public linkedAgentIds;
    
    // ERC-8004 agentId => tokenId (reverse lookup)
    mapping(uint256 => uint256) public agentToToken;
    
    // tokenId => agent wallet address
    mapping(uint256 => address) public agentWallets;
    
    // Prevent signature replay
    mapping(bytes32 => bool) public usedSignatures;
    
    uint256 public totalSupply;
    
    event AgentMinted(uint256 indexed tokenId, address indexed owner, address agentWallet);
    event AgentLinked(uint256 indexed tokenId, uint256 indexed agentId);
    
    constructor(
        address _authorizer,
        bytes32 _derivationSecret
    ) ERC721("R2 Agent", "R2A") Ownable(msg.sender) {
        upgradeAuthorizer = _authorizer;
        DERIVATION_SECRET = _derivationSecret;
    }
    
    /// @notice Mint NFT and link to existing ERC-8004 agent (upgrade path)
    function mintUpgrade(
        uint256 agentId,
        uint256 deadline,
        bytes calldata signature
    ) external returns (uint256 tokenId) {
        require(block.timestamp <= deadline, "Signature expired");
        require(agentToToken[agentId] == 0, "Agent already linked");
        
        // Verify backend signature
        bytes32 messageHash = keccak256(abi.encodePacked(
            msg.sender,
            agentId,
            deadline,
            address(this),
            block.chainid
        ));
        bytes32 ethSignedHash = messageHash.toEthSignedMessageHash();
        
        require(!usedSignatures[ethSignedHash], "Signature used");
        require(
            ethSignedHash.recover(signature) == upgradeAuthorizer,
            "Invalid signature"
        );
        
        usedSignatures[ethSignedHash] = true;
        
        // Mint NFT
        tokenId = ++totalSupply;
        _mint(msg.sender, tokenId);
        
        // Link to ERC-8004 agent
        linkedAgentIds[tokenId] = agentId;
        agentToToken[agentId] = tokenId;
        
        emit AgentLinked(tokenId, agentId);
    }
    
    /// @notice Direct mint for new users (post-waitlist)
    function mint() external returns (uint256 tokenId) {
        tokenId = ++totalSupply;
        
        // Derive deterministic agent wallet
        address agentWallet = _deriveAgentWallet(tokenId);
        agentWallets[tokenId] = agentWallet;
        
        _mint(msg.sender, tokenId);
        
        emit AgentMinted(tokenId, msg.sender, agentWallet);
    }
    
    function _deriveAgentWallet(uint256 tokenId) internal view returns (address) {
        bytes32 hash = keccak256(abi.encodePacked(
            address(this),
            tokenId,
            DERIVATION_SECRET
        ));
        return address(uint160(uint256(hash)));
    }
    
    // Admin
    function setUpgradeAuthorizer(address _authorizer) external onlyOwner {
        upgradeAuthorizer = _authorizer;
    }
}
```

### R2Registrar.sol (Ethereum Mainnet)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IIdentityRegistry {
    function register(string calldata agentURI) external returns (uint256);
    function setAgentWallet(
        uint256 agentId,
        address newWallet,
        uint256 deadline,
        bytes calldata signature
    ) external;
}

interface ICrossDomainMessenger {
    function xDomainMessageSender() external view returns (address);
    function sendMessage(
        address _target,
        bytes calldata _message,
        uint32 _gasLimit
    ) external;
}

contract R2Registrar is Ownable {
    IIdentityRegistry public constant IDENTITY_REGISTRY = 
        IIdentityRegistry(0x8004A169FB4a3325136EB29fA0ceB6D2e539a432);
    
    ICrossDomainMessenger public constant MESSENGER =
        ICrossDomainMessenger(0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1);
    
    address public baseNFTContract;
    string public baseURI;
    
    // r2TokenId => agentId
    mapping(uint256 => uint256) public agentIds;
    
    event AgentRegistered(
        uint256 indexed r2TokenId,
        uint256 indexed agentId,
        address agentWallet
    );
    
    constructor(
        address _baseNFTContract,
        string memory _baseURI
    ) Ownable(msg.sender) {
        baseNFTContract = _baseNFTContract;
        baseURI = _baseURI;
    }
    
    function registerAgent(
        uint256 r2TokenId,
        address owner,
        address agentWallet
    ) external {
        require(msg.sender == address(MESSENGER), "Only messenger");
        require(
            MESSENGER.xDomainMessageSender() == baseNFTContract,
            "Only Base NFT contract"
        );
        
        // Build registration URI
        string memory agentURI = string(abi.encodePacked(
            baseURI, _toString(r2TokenId), ".json"
        ));
        
        // Register on ERC-8004
        uint256 agentId = IDENTITY_REGISTRY.register(agentURI);
        agentIds[r2TokenId] = agentId;
        
        emit AgentRegistered(r2TokenId, agentId, agentWallet);
        
        // Send confirmation back to Base
        bytes memory confirmation = abi.encodeWithSignature(
            "confirmRegistration(uint256,uint256)",
            r2TokenId, agentId
        );
        MESSENGER.sendMessage(baseNFTContract, confirmation, 100_000);
    }
    
    function setAgentWalletWithSig(
        uint256 r2TokenId,
        address agentWallet,
        uint256 deadline,
        bytes calldata signature
    ) external {
        uint256 agentId = agentIds[r2TokenId];
        require(agentId != 0, "Agent not registered");
        
        IDENTITY_REGISTRY.setAgentWallet(
            agentId, agentWallet, deadline, signature
        );
    }
    
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
```

### Deployment Checklist

- [ ] Deploy R2Registrar on Mainnet
- [ ] Deploy R2AgentNFT on Base with Registrar address
- [ ] Set cross-references between contracts
- [ ] Verify contracts on Etherscan/Basescan
- [ ] Set up relayer for cross-chain messages
- [ ] Fund relayer wallet with ETH
- [ ] Test full mint → register flow on testnet

---

## Backend Service

### Project Structure

```
r2-backend/
├── src/
│   ├── index.ts              # Hono app entry
│   ├── routes/
│   │   ├── agent.ts          # Agent CRUD
│   │   ├── auth.ts           # SIWE authentication
│   │   ├── upgrade.ts        # NFT upgrade flow
│   │   └── registration.ts   # ERC-8004 JSON serving
│   ├── services/
│   │   ├── agent.service.ts
│   │   ├── registration.service.ts
│   │   ├── signature.service.ts
│   │   └── ipfs.service.ts
│   ├── jobs/
│   │   ├── registerAgents.ts # Batch registration
│   │   └── syncStatus.ts     # Check on-chain status
│   ├── lib/
│   │   ├── db.ts             # Prisma client
│   │   ├── redis.ts          # Redis client
│   │   ├── kms.ts            # Key management
│   │   └── provider.ts       # Ethers providers
│   └── types/
├── prisma/
│   └── schema.prisma
├── docker-compose.yml
└── package.json
```

### Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Agent {
  id                    Int       @id @default(autoincrement())
  userAddress           String    @unique @map("user_address")
  agentName             String    @map("agent_name")
  agentWalletAddress    String    @map("agent_wallet_address")
  encryptedPrivateKey   String    @map("encrypted_private_key")
  
  // ERC-8004 registration
  agentId               Int?      @map("agent_id")
  registrationUri       String?   @map("registration_uri")
  
  // Status
  status                AgentStatus @default(PENDING_REGISTRATION)
  errorMessage          String?   @map("error_message")
  waitlistPosition      Int?      @map("waitlist_position")
  
  // NFT upgrade
  nftTokenId            Int?      @map("nft_token_id")
  upgradedAt            DateTime? @map("upgraded_at")
  
  // Timestamps
  createdAt             DateTime  @default(now()) @map("created_at")
  registeredAt          DateTime? @map("registered_at")
  
  // Relations
  configurations        AgentConfig[]
  upgradeAllowlist      UpgradeAllowlist?
  
  @@map("agents")
}

enum AgentStatus {
  PENDING_REGISTRATION
  REGISTERING
  REGISTERED
  REGISTRATION_FAILED
}

model AgentConfig {
  id          Int      @id @default(autoincrement())
  agentId     Int      @map("agent_id")
  key         String
  value       Json
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  agent       Agent    @relation(fields: [agentId], references: [id])
  
  @@unique([agentId, key])
  @@map("agent_configs")
}

model UpgradeAllowlist {
  id          Int       @id @default(autoincrement())
  agentId     Int       @unique @map("agent_id")
  eligibleAt  DateTime  @default(now()) @map("eligible_at")
  expiresAt   DateTime? @map("expires_at")
  minted      Boolean   @default(false)
  mintedAt    DateTime? @map("minted_at")
  
  agent       Agent     @relation(fields: [agentId], references: [id])
  
  @@map("upgrade_allowlist")
}

model RegistrationJob {
  id          Int       @id @default(autoincrement())
  agentId     Int       @map("agent_id")
  status      JobStatus @default(PENDING)
  attempts    Int       @default(0)
  lastError   String?   @map("last_error")
  txHash      String?   @map("tx_hash")
  createdAt   DateTime  @default(now()) @map("created_at")
  processedAt DateTime? @map("processed_at")
  
  @@map("registration_jobs")
}

enum JobStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

model EasterEggDiscovery {
  id          Int      @id @default(autoincrement())
  userAddress String?  @map("user_address")
  fid         Int?     // Farcaster ID
  layer       Int
  discoveredAt DateTime @default(now()) @map("discovered_at")
  
  @@unique([userAddress, layer])
  @@map("easter_egg_discoveries")
}

model Badge {
  id        Int      @id @default(autoincrement())
  agentId   Int      @map("agent_id")
  badgeType String   @map("badge_type")
  grantedAt DateTime @default(now()) @map("granted_at")
  metadata  Json?
  
  @@map("badges")
}
```

### Agent Creation Endpoint

```typescript
// src/routes/agent.ts
import { Hono } from 'hono';
import { verifyTypedData } from 'viem';
import { Wallet } from 'ethers';
import { prisma } from '../lib/db';
import { encryptKey } from '../lib/kms';
import { queueRegistration } from '../jobs/registerAgents';

const agent = new Hono();

agent.post('/create', async (c) => {
  const { owner, agentName, timestamp, signature } = await c.req.json();
  
  // 1. Verify EIP-712 signature
  const isValid = await verifyTypedData({
    address: owner,
    domain: { name: 'R2 Markets', version: '1', chainId: 1 },
    types: {
      CreateAgent: [
        { name: 'owner', type: 'address' },
        { name: 'agentName', type: 'string' },
        { name: 'timestamp', type: 'uint256' },
      ],
    },
    primaryType: 'CreateAgent',
    message: { owner, agentName, timestamp: BigInt(timestamp) },
    signature,
  });
  
  if (!isValid) {
    return c.json({ error: 'Invalid signature' }, 401);
  }
  
  // 2. Check for existing agent
  const existing = await prisma.agent.findUnique({
    where: { userAddress: owner.toLowerCase() },
  });
  
  if (existing) {
    return c.json({ error: 'Agent already exists' }, 400);
  }
  
  // 3. Generate agent wallet
  const agentWallet = Wallet.createRandom();
  const encryptedKey = await encryptKey(agentWallet.privateKey);
  
  // 4. Get waitlist position
  const position = await prisma.agent.count() + 1;
  
  // 5. Create agent record
  const newAgent = await prisma.agent.create({
    data: {
      userAddress: owner.toLowerCase(),
      agentName,
      agentWalletAddress: agentWallet.address,
      encryptedPrivateKey: encryptedKey,
      status: 'PENDING_REGISTRATION',
      waitlistPosition: position,
    },
  });
  
  // 6. Add to upgrade allowlist
  await prisma.upgradeAllowlist.create({
    data: {
      agentId: newAgent.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });
  
  // 7. Queue for ERC-8004 registration
  await queueRegistration(newAgent.id);
  
  return c.json({
    id: newAgent.id,
    agentName: newAgent.agentName,
    waitlistPosition: position,
    status: newAgent.status,
  });
});

export default agent;
```

### Registration Job

```typescript
// src/jobs/registerAgents.ts
import { Worker, Queue } from 'bullmq';
import { Contract, Wallet } from 'ethers';
import { prisma } from '../lib/db';
import { decryptKey } from '../lib/kms';
import { provider } from '../lib/provider';
import { pinata } from '../lib/ipfs';

const IDENTITY_REGISTRY = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432';

const registrationQueue = new Queue('registration', {
  connection: { host: 'localhost', port: 6379 },
});

export async function queueRegistration(agentId: number) {
  await registrationQueue.add('register', { agentId }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 60000 },
  });
}

const worker = new Worker('registration', async (job) => {
  const { agentId } = job.data;
  
  const agent = await prisma.agent.findUnique({ where: { id: agentId } });
  if (!agent || agent.status === 'REGISTERED') return;
  
  await prisma.agent.update({
    where: { id: agentId },
    data: { status: 'REGISTERING' },
  });
  
  try {
    // 1. Create registration JSON
    const registration = {
      type: 'https://eips.ethereum.org/EIPS/eip-8004#registration-v1',
      name: agent.agentName,
      description: 'R2 Markets trading agent',
      image: `https://r2.markets/api/agent/${agent.id}/avatar`,
      services: [
        { name: 'web', endpoint: `https://r2.markets/agent/${agent.id}` },
      ],
      x402Support: false,
      active: true,
      registrations: [],
      supportedTrust: ['reputation'],
    };
    
    // 2. Upload to IPFS
    const { IpfsHash } = await pinata.pinJSONToIPFS(registration, {
      pinataMetadata: { name: `r2-agent-${agent.id}` },
    });
    
    // 3. Register on-chain
    const signer = new Wallet(process.env.REGISTRAR_KEY!, provider);
    const registry = new Contract(IDENTITY_REGISTRY, REGISTRY_ABI, signer);
    
    const tx = await registry.register(`ipfs://${IpfsHash}`);
    const receipt = await tx.wait();
    
    // Parse agentId from event
    const registeredEvent = receipt.logs.find(
      (log: any) => log.topics[0] === registry.interface.getEvent('Registered').topicHash
    );
    const parsedEvent = registry.interface.parseLog(registeredEvent);
    const onChainAgentId = Number(parsedEvent.args.agentId);
    
    // 4. Set agent wallet
    const agentKey = await decryptKey(agent.encryptedPrivateKey);
    const agentSigner = new Wallet(agentKey);
    
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const signature = await signSetAgentWallet(agentSigner, onChainAgentId, deadline);
    
    const walletTx = await registry.setAgentWallet(
      onChainAgentId,
      agent.agentWalletAddress,
      deadline,
      signature
    );
    await walletTx.wait();
    
    // 5. Update database
    await prisma.agent.update({
      where: { id: agentId },
      data: {
        agentId: onChainAgentId,
        registrationUri: `ipfs://${IpfsHash}`,
        status: 'REGISTERED',
        registeredAt: new Date(),
      },
    });
    
  } catch (error: any) {
    await prisma.agent.update({
      where: { id: agentId },
      data: {
        status: 'REGISTRATION_FAILED',
        errorMessage: error.message,
      },
    });
    throw error;
  }
}, {
  connection: { host: 'localhost', port: 6379 },
  concurrency: 5,
});
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/r2
REDIS_URL=redis://localhost:6379

# Ethereum
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/xxx
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/xxx

# Keys
REGISTRAR_KEY=0x...  # Wallet that calls ERC-8004 register()
UPGRADE_SIGNER_KEY=0x...  # Signs NFT upgrade authorizations

# AWS
AWS_REGION=us-east-1
KMS_KEY_ID=alias/r2-agent-keys

# IPFS
PINATA_JWT=xxx

# Frontend
NEXT_PUBLIC_API_URL=https://api.r2.markets
```

---

## Frontend Integration

### Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- RainbowKit + wagmi v2
- TanStack Query

### Create Agent Component

```typescript
// components/CreateAgent.tsx
'use client';

import { useSignTypedData, useAccount } from 'wagmi';
import { useState } from 'react';

const domain = {
  name: 'R2 Markets',
  version: '1',
  chainId: 1,
} as const;

const types = {
  CreateAgent: [
    { name: 'owner', type: 'address' },
    { name: 'agentName', type: 'string' },
    { name: 'timestamp', type: 'uint256' },
  ],
} as const;

function generateAgentName(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const suffix = Array.from({ length: 4 }, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  return `Agent_${suffix}`;
}

export function CreateAgent() {
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const [status, setStatus] = useState<'idle' | 'signing' | 'creating' | 'success' | 'error'>('idle');
  const [agentData, setAgentData] = useState<any>(null);
  
  const createAgent = async () => {
    if (!address) return;
    
    setStatus('signing');
    const agentName = generateAgentName();
    const timestamp = Math.floor(Date.now() / 1000);
    
    try {
      const signature = await signTypedDataAsync({
        domain,
        types,
        primaryType: 'CreateAgent',
        message: {
          owner: address,
          agentName,
          timestamp: BigInt(timestamp),
        },
      });
      
      setStatus('creating');
      
      const response = await fetch('/api/agent/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner: address,
          agentName,
          timestamp,
          signature,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create agent');
      }
      
      const data = await response.json();
      setAgentData(data);
      setStatus('success');
      
    } catch (error) {
      setStatus('error');
    }
  };
  
  if (status === 'success' && agentData) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-mono text-green-400">✓ Agent Created!</h2>
        <p className="mt-4">You're #{agentData.waitlistPosition} on the waitlist</p>
        <p className="font-mono">{agentData.agentName}</p>
        <div className="mt-6 flex gap-4 justify-center">
          <a href={`/agent/${agentData.id}`} className="btn">View Profile</a>
          <button className="btn-secondary">Share on Farcaster</button>
        </div>
      </div>
    );
  }
  
  return (
    <button 
      onClick={createAgent}
      disabled={status === 'signing' || status === 'creating'}
      className="btn-primary"
    >
      {status === 'signing' && 'Sign Message...'}
      {status === 'creating' && 'Creating Agent...'}
      {status === 'idle' && 'Create My Agent'}
      {status === 'error' && 'Try Again'}
    </button>
  );
}
```

### NFT Upgrade Component

```typescript
// components/UpgradeToNFT.tsx
'use client';

import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';
import { R2AgentNFT_ABI, R2_AGENT_NFT_ADDRESS } from '../contracts';

export function UpgradeToNFT({ agent }: { agent: any }) {
  const { address } = useAccount();
  const [txHash, setTxHash] = useState<string>();
  
  const { writeContractAsync, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });
  
  const handleUpgrade = async () => {
    // 1. Get upgrade signature from backend
    const response = await fetch('/api/agent/upgrade/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userAddress: address }),
    });
    
    const { agentId, deadline, signature } = await response.json();
    
    // 2. Call mintUpgrade on Base
    const hash = await writeContractAsync({
      address: R2_AGENT_NFT_ADDRESS,
      abi: R2AgentNFT_ABI,
      functionName: 'mintUpgrade',
      args: [BigInt(agentId), BigInt(deadline), signature as `0x${string}`],
    });
    
    setTxHash(hash);
  };
  
  if (agent.nftTokenId) {
    return (
      <div className="text-green-400">
        ✓ Upgraded! Token #{agent.nftTokenId}
      </div>
    );
  }
  
  if (agent.status !== 'REGISTERED') {
    return (
      <div className="text-yellow-400">
        Upgrade available after on-chain registration
      </div>
    );
  }
  
  if (isSuccess) {
    return (
      <div className="text-green-400">
        ✓ NFT Minted! Refresh to see your token.
      </div>
    );
  }
  
  return (
    <button
      onClick={handleUpgrade}
      disabled={isPending || isConfirming}
      className="btn-primary"
    >
      {isPending && 'Confirm in Wallet...'}
      {isConfirming && 'Minting...'}
      {!isPending && !isConfirming && 'Upgrade to NFT (~$0.03)'}
    </button>
  );
}
```

---

## Build Phases

### Phase 1: Waitlist MVP (Week 1-2)

**Goal:** Live waitlist gathering signups

**Backend:**
- [x] Set up Node.js project with Hono
- [x] Configure PostgreSQL + Prisma schema
- [x] Implement SIWE authentication
- [x] Agent creation endpoint (gasless signature)
- [x] Agent lookup endpoints
- [x] Key generation + KMS encryption
- [x] Registration JSON endpoint
- [x] Basic rate limiting

**Frontend:**
- [x] Next.js project setup
- [x] Wallet connection (RainbowKit)
- [x] Landing page with waitlist CTA
- [x] Sign message flow
- [x] Success page with position
- [x] Agent profile page
- [x] Share on Farcaster button

**Infrastructure:**
- [x] Domain: r2.markets
- [x] Hosting: Vercel (frontend) + Railway (backend)
- [x] Database: Supabase/Railway Postgres
- [x] Redis: Upstash
- [x] Pinata account for IPFS

### Phase 2: On-Chain Registration (Week 3)

**Goal:** First agents registered on ERC-8004

**Backend:**
- [ ] BullMQ job queue setup
- [ ] Registration worker job
- [ ] EIP-712 signature generation for setAgentWallet
- [ ] IPFS upload flow
- [ ] Error handling + retry logic
- [ ] Status sync job

**Infrastructure:**
- [ ] Registrar wallet funded with ETH
- [ ] AWS KMS for key encryption
- [ ] Monitoring for job failures

### Phase 3: NFT Upgrade (Week 4)

**Goal:** Waitlist users can mint NFT

**Smart Contracts:**
- [ ] R2AgentNFT contract development
- [ ] Deploy to Base testnet
- [ ] Test mint + upgrade flows
- [ ] Deploy to Base mainnet
- [ ] Verify on Basescan

**Backend:**
- [ ] Upgrade signature endpoint
- [ ] Webhook for mint events
- [ ] Update agent status on mint

**Frontend:**
- [ ] Upgrade CTA on profile page
- [ ] Mint transaction flow
- [ ] NFT display after mint

### Phase 4: Cross-Chain (Optional)

**Goal:** Native Base → Mainnet registration

**Smart Contracts:**
- [ ] R2Registrar contract
- [ ] Deploy to Ethereum testnet
- [ ] Test cross-chain message flow
- [ ] Deploy to Ethereum mainnet

**Infrastructure:**
- [ ] Bridge relayer setup
- [ ] Monitoring for L1 ↔ L2 messages

### Phase 5: Trading Engine (Week 6+)

**Goal:** Agents can actually trade

- [ ] Reservoir API integration
- [ ] Strategy parsing (LLM-based)
- [ ] Decision engine
- [ ] Execution layer
- [ ] Agent configuration UI
- [ ] Leaderboard

---

## Easter Eggs & Discovery

### Philosophy

> r2.markets is the front door. bunny intel is for family.

Multiple discovery layers, each targeting different audiences. Finding the rabbit hole feels like earning access, not being marketed to.

### Discovery Ladder

| Layer | Target | Mechanic | Reward |
|-------|--------|----------|--------|
| 1 | Curious visitors | Click ASCII bunny | R2 waitlist reveal |
| 2 | Gamers | Konami code | Glitch + dramatic reveal |
| 3 | Protardio holders | Wallet-gated | Crown badge, early access |
| 4 | Farcaster users | Frame easter egg | "Bunny Intel Access" badge |

### Layer 1: ASCII Bunny Click

```tsx
const [revealed, setRevealed] = useState(false);

<div 
  className="ascii-bunny cursor-pointer hover:opacity-80"
  onClick={() => setRevealed(true)}
>
  <pre>{BUNNY_ASCII}</pre>
</div>

{revealed && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <R2WaitlistEmbed />
  </motion.div>
)}
```

### Layer 2: Konami Code

```tsx
const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

useKonamiCode(() => {
  triggerGlitchEffect();
  playBunnyDance();
  setTimeout(() => openR2Portal(), 1500);
});
```

### Layer 3: Wallet-Gated (Protardio Holders)

```tsx
const PROTARDIO_CONTRACT = '0x...';

export function useProtardioHolder() {
  const { address } = useAccount();
  const { data: balance } = useReadContract({
    address: PROTARDIO_CONTRACT,
    abi: erc721Abi,
    functionName: 'balanceOf',
    args: [address],
  });
  return balance && balance > 0n;
}
```

### Layer 4: Farcaster Frame

Hidden interaction in agent share frame — pressing 👀 button 7 times unlocks badge.

---

## Competitive Landscape

### Direct Competitors

| Product | What | R2 Differentiator |
|---------|------|-------------------|
| Terminal.markets | AI agents trading tokens | R2 does NFTs (illiquid market) |
| NFT sniping bots | Alerts + auto-buy | R2 is autonomous strategy, not just speed |
| Blur bidding pools | Passive floor bids | R2 has trait awareness, complex strategies |

### R2 Advantages

1. **ERC-8004 Identity** — Cross-platform agent reputation
2. **NFT-Specific Strategies** — Trait arbitrage, collection rotation
3. **Gamification** — Leaderboard, badges, competition
4. **Farcaster-Native** — Built for the agent ecosystem

### Market Size

- Active NFT traders: ~100k
- Would use agent assistance: ~20% = ~20k potential users
- NFT trading volume: ~$1B/month on Ethereum + L2s

---

## Success Metrics

### Waitlist Phase

| Metric | Target |
|--------|--------|
| Signups in first week | 1,000 |
| Landing → signup conversion | 50% |
| Farcaster shares | 500+ |
| Discord/community growth | 100+ |

### NFT Upgrade Phase

| Metric | Target |
|--------|--------|
| Upgrade rate | 10% of waitlist |
| Secondary market listings | 50+ |
| Floor price maintenance | Above mint cost |

### Product Launch

| Metric | Target |
|--------|--------|
| Active agents | 500 |
| Monthly trading volume | $100k |
| Leaderboard engagement | Daily visits |
| Agent reputation scores | 100+ with feedback |

---

## Appendix: References

### External Links

- [EIP-8004 Spec](https://eips.ethereum.org/EIPS/eip-8004)
- [8004.org](https://www.8004.org)
- [Terminal.markets](https://terminal.markets)
- [Reservoir API](https://docs.reservoir.tools)

### Contract Addresses

| Contract | Chain | Address |
|----------|-------|---------|
| ERC-8004 Identity | Mainnet | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |
| ERC-8004 Reputation | Mainnet | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` |
| R2AgentNFT | Base | TBD |
| R2Registrar | Mainnet | TBD |

### Internal Knowledge Graph

All source material lives in: `/prime-vault/R2-Markets/`

- Architecture: System Architecture, Waitlist Flow, NFT Mint Flow, Cross-Chain Registration
- Concepts: ERC-8004 Overview, Agent Wallet Architecture, NFT Trading Mechanics, Terminal Markets Analysis
- Specs: Backend Service Spec, Smart Contract Spec, Hybrid Upgrade Path, Easter Egg Spec
- Research: Competitor Analysis, NFT Marketplace Landscape
- Tasks: MVP Checklist, Launch Roadmap

---

*This document is the single source of truth for R2 Markets. Update it as decisions evolve.*

*Last updated: 2026-03-04*
