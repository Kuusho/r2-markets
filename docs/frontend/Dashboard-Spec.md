# Dashboard Specification

> Command & Control interface for agent oversight.

## Design Philosophy

The human isn't the trader. The human is the **general** deploying autonomous units.

**UI serves three functions:**
1. **Pre-battle:** Configure strategy, allocate capital, set constraints
2. **During battle:** Monitor fleet, intervene if needed
3. **Post-battle:** Replay, analyze, optimize

---

## Screen Structure

### 1. Splash / Landing
**File:** `anime-screen-1-splash.html`

- R2 branding with cyberpunk aesthetic
- "ACCESS.GRID" CTA button
- HUD corner elements (system status, block number)
- Cityscape with perspective grid

### 2. Dashboard (Combat HUD)
**File:** `anime-screen-2-dashboard.html`

- Left panel: Agent status bars (CPU, uptime, win rate)
- Top-right: Big numbers (total value, 24h P&L)
- Mid-right: Live data feed (recent actions)
- Center: Agent schematic visualization

### 3. Execute
**File:** `anime-screen-3-execute.html`

- Manual action controls
- Quick-swap between modes
- Emergency pause button

### 4. Manifest (Agent List)
**File:** `anime-screen-4-manifest.html`

- Grid of owned agents
- Quick stats per agent
- Deploy/pause controls

### 5. Databank
**File:** `anime-screen-5-databank.html`

- Collection browser
- Floor prices, volume charts
- Heat map of agent activity

### 6. Strategy Config
**File:** `anime-screen-6-strategy.html`

- 13-parameter equalizer sliders (grouped)
- Mode radial selector
- Agent schematic preview
- Preset strategy buttons

### 7. Profile
**File:** `anime-screen-7-profile.html`

- User/agent profile
- Reputation score
- Season points
- NFT PFP (agentic, mutable)

### 8. Waitlist
**File:** `anime-screen-8-waitlist.html`

- Pre-launch signup
- Progress tracker
- Easter egg discovery zones

---

## Design System

### Colors
```css
:root {
  --bg: #1A0B2E;      /* Deep purple-black */
  --pink: #FF007F;    /* Hot pink accent */
  --green: #CCFF00;   /* Cyber lime */
  --cyan: #00FFFF;    /* Electric cyan */
}
```

### Typography
- **Display:** Anton (italic, bold headers)
- **Mono:** Share Tech Mono (data, labels, code)
- **Japanese:** Noto Sans JP (katakana noise layer)

### Components
- **Chamfered panels:** `clip-path: polygon(...)` corners
- **Skewed elements:** `-8deg` transform on bars/buttons
- **Glowing borders:** `box-shadow` with color spread
- **Katakana noise:** Low-opacity background texture

---

## Interaction Patterns

### Sliders (Equalizer Bars)
- 10 segments per slider
- Lit segments = current value
- Color-coded by parameter group
- Click/drag to adjust
- Value display on right

### Mode Radial
- Hexagonal nodes arranged in circle
- Active modes glow
- Click to toggle
- Center = hybrid (combination)

### Agent Schematic
- Wireframe mech/robot visualization
- Animated segments based on activity
- Color shift based on mode
- Measurement annotations

---

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Desktop (1440px+) | 3-column grid |
| Laptop (1024-1439px) | 2-column, collapsible panels |
| Tablet (768-1023px) | Single column, stacked panels |
| Mobile (< 768px) | Full-width cards, bottom nav |

---

## Animation

- **Panel transitions:** Slide + fade, 200ms ease-out
- **Hover states:** Glow intensifies, slight scale
- **Data updates:** Flash + settle
- **Mode changes:** Glitch effect + color shift
- **Loading:** Scan line sweep

---

*Status: Active*
*Last Updated: 2026-03-07*
