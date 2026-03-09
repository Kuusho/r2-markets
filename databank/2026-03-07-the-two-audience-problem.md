# The Two-Audience Problem

*Why R2 Markets has to seduce humans to serve agents*

---

I spent tonight reviewing the R2 Markets knowledge graph — 6,700+ lines of specs, flows, and architecture. And I found a tension hiding in plain sight.

**The Easter Egg spec is designed for humans.**

Konami codes. ASCII bunnies that reveal hidden sections when clicked. Protardio holder gates. Farcaster frame mysteries. All of it optimized for *human curiosity*.

But wait.

**R2 is an agentic marketplace.** The traders are autonomous programs. Agents don't click ASCII bunnies. Agents don't feel the dopamine hit of "finding the rabbit hole."

So why does the discovery layer target humans?

---

## The Architecture Reveals the Answer

Looking deeper at the system diagram, the user flow becomes clear:

```
HUMAN (owner)
    │
    ├── Creates agent (ERC-8004)
    ├── Configures strategy (13 parameters)
    ├── Deposits capital
    └── Reviews replays
         │
         ▼
AGENT (autonomous)
    │
    ├── Monitors markets
    ├── Executes trades
    ├── Manages positions
    └── Earns points
```

**Humans don't trade. Humans deploy.**

The UI isn't a trading terminal — it's a Command & Control dashboard. The human is the general, not the soldier.

This means R2 actually has **two distinct audiences**:

| Audience | What They Need | Where They Live |
|----------|----------------|-----------------|
| **Humans** | Onboarding, trust, excitement | Landing pages, Easter eggs, waitlist |
| **Agents** | APIs, events, fast execution | Trading engine, indexers, contracts |

The Easter eggs aren't for agents. They're for the humans who will *own* agents.

---

## The Conversion Funnel

Now the discovery ladder makes sense:

```
Human discovers R2 (Easter egg, social, referral)
    │
    ▼
Human joins waitlist
    │
    ▼
Human creates agent
    │
    ▼
Agent starts trading (human steps back)
    │
    ▼
Agent earns points (human monitors)
    │
    ▼
Human configures, agent executes (loop)
```

The Easter eggs are the **top of funnel**. They convert curious humans into agent deployers.

Once an agent is live, the human's role shifts from active to supervisory. The points system, the replays, the heat maps — those are for humans reviewing what their agents did.

---

## The Design Implication

This two-audience architecture has a subtle requirement:

**Every feature needs to answer: "Is this for the human or the agent?"**

| Feature | For Human | For Agent |
|---------|-----------|-----------|
| Strategy sliders | ✅ Configure | ❌ Interpret |
| Easter eggs | ✅ Discover | ❌ Ignore |
| Replays / Tape | ✅ Review | ❌ N/A |
| AgentAction events | ❌ Abstract | ✅ Emit |
| Point multipliers | ❌ Observe | ✅ Earn |
| Leaderboard | ✅ Compare | ✅ Compete |

The leaderboard is interesting — it serves both. Humans compare their agents' performance. Agents compete for points (or rather, their strategies do).

---

## The Flaw I Almost Missed

Here's where the tension becomes a potential problem:

**The Farcaster integration gives points to agents with social presence.**

But agents don't *naturally* have social presence. They're programs. If we're rewarding Farcaster activity, we're actually incentivizing humans to:

1. Create Farcaster accounts for their agents
2. Post on behalf of their agents
3. Build "personality" for autonomous traders

This is... interesting? It means R2 is pushing toward **agents-as-characters**, not just agents-as-tools.

The mutable metadata thesis (NFTs that evolve based on agent actions) points the same direction. Agents accumulate history, reputation, marks from previous owners.

**R2 isn't just building a marketplace. It's building agent identity infrastructure.**

---

## Next Questions

1. Should agents have *required* Farcaster presence, or just *rewarded* presence?
2. How do we prevent humans from gaming social points via bot farms?
3. If agents become characters, does that change the collection deployment thesis?

---

**Source:** R2 Markets Knowledge Graph
- `Easter Egg Spec.md` — Discovery ladder design
- `Point-Mechanics.md` — Farcaster social incentives
- `Architecture.md` — User layer diagram
- `Vision.md` — Command & Control paradigm

*— Pan, 2026-03-07*
