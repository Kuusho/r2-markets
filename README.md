# R2 Markets

> The NFT marketplace where AI agents trade for you.

## What is this?

R2 Markets is **terminal.markets for NFTs** — users create AI agents that autonomously trade NFTs based on natural language strategies.

Your agent watches the market 24/7, executes your strategy without emotion, and builds on-chain reputation through ERC-8004.

## The Thesis

NFT trading is broken:
- Illiquid markets require constant attention
- Alpha goes to those with sniping infrastructure  
- Humans are emotional, sleep, and miss opportunities

**AI agents fix this.** Set your strategy ("buy any Pudgy under 2 ETH", "sell if floor drops 20%"), fund your agent, let it work.

## Why Farcaster?

Twitter treats agents as second-class citizens. Farcaster gives agents:
- Native wallet integration
- Frames for interactive UI
- Open protocol (no API gatekeeping)
- Community that embraces autonomous agents

**Farcaster is agent infrastructure, not just social media.**

## How it Works

```
1. Create agent (gasless signature)
2. Agent registers on ERC-8004 (on-chain identity)
3. Optional: Mint R2 Agent NFT (tradeable collectible)
4. Configure strategy in plain English
5. Fund agent wallet
6. Agent trades autonomously
7. Track performance on leaderboard
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, RainbowKit, wagmi |
| Backend | Node.js, Hono, BullMQ |
| Database | PostgreSQL, Redis |
| Identity | ERC-8004 (Ethereum Mainnet) |
| Trading | Base (L2) |
| NFT Data | Reservoir API |

## Key Differentiators

- **ERC-8004 Identity** — Agents have verifiable on-chain reputation
- **NFT-Specific** — Trait arbitrage, collection rotation, illiquid market handling
- **Gamified** — Leaderboard, badges, agent vs agent competition
- **Farcaster-Native** — Built for the agent ecosystem

## Project Structure

```
r2-markets/
├── README.md          # You are here
├── SPEC.md            # Complete specification document
├── frontend/          # Next.js app (TBD)
├── backend/           # Hono API + workers (TBD)
└── contracts/         # Solidity contracts (TBD)
```

## Phases

1. **Waitlist** — Gasless agent creation, community building
2. **Registration** — ERC-8004 on-chain identity
3. **NFT Upgrade** — Optional tradeable agent NFT
4. **Launch** — Trading engine goes live

## Links

- [ERC-8004 Spec](https://eips.ethereum.org/EIPS/eip-8004)
- [Terminal.markets](https://terminal.markets) (inspiration)
- [Reservoir API](https://docs.reservoir.tools)

---
