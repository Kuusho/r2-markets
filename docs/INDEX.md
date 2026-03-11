# R2 Markets — Knowledge Graph Index

> Quick navigation for all documentation.

## Quick Links

- **[Implementation Plan](../implementation_plan.md)** — Roadmap, decisions, status
- **[SPEC.md](../SPEC.md)** — Original specification (legacy)

---

## Core

| Document | Description |
|----------|-------------|
| [Vision](core/Vision.md) | Paradigm, thesis, inspiration |
| [Glossary](core/Glossary.md) | Term definitions |
| [Architecture](core/Architecture.md) | System diagram, components |
| [Point-Mechanics](core/Point-Mechanics.md) | **NEW** Season 1 incentive system |

---

## Contracts

| Document | Description |
|----------|-------------|
| [Agent Interface Standard](contracts/Agent-Interface-Standard.md) | **v1.1** — 13 parameters, 8 modes |
| [IAgentStrategy.sol](contracts/IAgentStrategy.sol) | Solidity interface |
| [Logic Pool](contracts/Logic-Pool.md) | Vault for user deposits |
| [Metadata Oracle](contracts/Metadata-Oracle.md) | On-chain trait storage |

---

## Infrastructure

| Document | Description |
|----------|-------------|
| [Replay Engine](infrastructure/Replay-Engine.md) | Tape, ghost traces, playback |
| [Reputation Engine](infrastructure/Reputation-Engine.md) | Scoring, slashing, seasons |

---

## Frontend

| Document | Description |
|----------|-------------|
| [Dashboard Spec](frontend/Dashboard-Spec.md) | Screen structure, design system |

---

## Roadmap

| Document | Description |
|----------|-------------|
| [Lego Blocks](roadmap/Lego-Blocks.md) | Core primitives, dependencies |
| [Skill-Marketplace](roadmap/Skill-Marketplace.md) | **NEW** Season 2-3 skill system + x402 |

---

## Mockups

All mockups in `/mockups/` directory:

| Screen | File |
|--------|------|
| Splash | `anime-screen-1-splash.html` |
| Dashboard | `anime-screen-2-dashboard.html` |
| Execute | `anime-screen-3-execute.html` |
| Manifest | `anime-screen-4-manifest.html` |
| Databank | `anime-screen-5-databank.html` |
| **Strategy v1.1** | `anime-screen-6-strategy.html` |
| Profile | `anime-screen-7-profile.html` |
| Waitlist | `anime-screen-8-waitlist.html` |

---

## Related Projects

- **Asciitardio** — Agent-native ASCII PFP collection (candidate first collection)
- **Bunny Intel** — Ecosystem monitoring (easter egg connection)
- **ERC-8004** — Agent identity standard

---

*Last Updated: 2026-03-07*
