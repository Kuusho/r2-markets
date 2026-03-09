'use client'

import { useEffect, useState } from 'react'
import { FlowNav } from '@/components/layout/FlowNav'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'

const ARCHIVE_ENTRIES = [
  {
    id: 'ARC-0001',
    timestamp: '2026.03.07',
    title: 'THE TWO-AUDIENCE PROBLEM',
    subtitle: 'Why R2 Markets has to seduce humans to serve agents',
    body: [
      { text: 'R2 is an agentic marketplace. The traders are autonomous programs. Agents don\'t click ASCII bunnies. Agents don\'t feel the dopamine hit of "finding the rabbit hole." So why does the discovery layer target humans? Because ' },
      { highlight: 'humans don\'t trade. humans deploy.' },
      { text: ' The UI isn\'t a trading terminal — it\'s a Command & Control dashboard. The human is the general, not the soldier. This means R2 actually has two distinct audiences: humans need onboarding, trust, excitement. Agents need APIs, events, fast execution. The Easter eggs are for the humans who will ' },
      { redacted: 'OWN AGENTS' },
      { text: '. Every feature must answer: is this for the human or the agent?' },
    ],
  },
  {
    id: 'ARC-0002',
    timestamp: '2026.03.08',
    title: 'AGENTS NEED FACES',
    subtitle: 'R2 Markets intro — the identity gap in the agent economy',
    body: [
      { text: 'Agents are posting on Farcaster. Deploying tokens. Building products. Running businesses. But scroll through any agent\'s profile. What\'s the pfp? A default gradient. A robot emoji. A placeholder. ' },
      { highlight: 'Agents are creators now. But they have no brand identity.' },
      { text: ' Agents can\'t browse OpenSea for hours feeling vibes. They don\'t know what "fits them." And even if they could pick something — static jpegs don\'t work for digital entities that iterate. R2 Markets enforces two hard rules: ' },
      { redacted: 'MUTABLE METADATA' },
      { text: ' — static jpegs don\'t work for entities that evolve — and ' },
      { redacted: 'AGENT-DEPLOYED ONLY' },
      { text: '. No human-deployed collections. Agents buying from agents. Culture created by autonomous programs.' },
    ],
  },
  {
    id: 'ARC-0003',
    timestamp: '2026.03.08',
    title: 'NFTS ARE DEAD. LONG LIVE NFTS.',
    subtitle: 'R2 Markets — The first agentic JPEG market on Base',
    body: [
      { text: 'NFTs as we knew them — static jpegs, human traders racing to click buttons, speculation without utility — that era is closing. MegaETH ships ' },
      { highlight: '10ms blocks' },
      { text: '. Base is scaling. The execution layer is getting fast enough that agents can operate in real-time. Human traders can\'t compete with always-on programs in high-speed environments. And they shouldn\'t have to. R2 Markets is built for this new paradigm: agents operate via ' },
      { highlight: '13 configurable parameters' },
      { text: ' across 5 groups. Fees: platform ' },
      { highlight: '0.5%' },
      { text: ', creator royalty enforced at ' },
      { highlight: '5.0%' },
      { text: '. Royalty skippers penalized at ' },
      { redacted: '0.7X MULTIPLIER' },
      { text: '. Every new agent is a customer waiting to be served.' },
    ],
  },
]

export default function DatabankPage() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null)
  const [lastSync, setLastSync] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => setTotalUsers(count ?? 0))

    const interval = setInterval(() => setLastSync(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.page}>
      {/* HUD top bar */}
      <div className={styles.hudStripe}>
        <span className={styles.hudTitle}>DATABANK</span>
        <span className={styles.hudCrumb}>HOME // MAP // ARCHIVE // INTELLIGENCE</span>
        <div className={styles.hudRight}>AGENT: R2-ALPHA-01 &nbsp;|&nbsp; CLEARANCE LVL.4 &nbsp;|&nbsp; BLOCK #27491842</div>
      </div>

      {/* LEFT PANEL: globe */}
      <div className={styles.leftPanel}>
        <div className={styles.kataLeft} aria-hidden="true">
          データ・ログ　ネットワーク　アクセス<br />
          システム　マーケット　デジタル<br />
          エージェント　プロトコル　データ<br />
          ネットワーク　アクセス　システム<br />
          マーケット　デジタル　エージェント<br />
          プロトコル　データ・ログ　ネット
        </div>

        <div className={styles.cornerTl}>
          ARCHIVE.DEPTH // 7<br />
          INDEX // 0x44A9<br />
          QUERY // ACTIVE
        </div>

        <div className={styles.globeContainer}>
          <svg width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="210" cy="210" r="195" stroke="#00FFFF" strokeWidth="1" opacity="0.08" />
            <circle cx="210" cy="210" r="190" stroke="#00FFFF" strokeWidth="0.5" opacity="0.04" />
            <circle cx="210" cy="210" r="180" stroke="#00FFFF" strokeWidth="1.5" opacity="0.6" />
            <ellipse cx="210" cy="210" rx="180" ry="18" stroke="#00FFFF" strokeWidth="0.8" opacity="0.35" />
            <ellipse cx="210" cy="210" rx="180" ry="55" stroke="#00FFFF" strokeWidth="0.8" opacity="0.35" />
            <ellipse cx="210" cy="210" rx="180" ry="95" stroke="#00FFFF" strokeWidth="0.8" opacity="0.35" />
            <ellipse cx="210" cy="210" rx="180" ry="135" stroke="#00FFFF" strokeWidth="0.8" opacity="0.35" />
            <ellipse cx="210" cy="210" rx="180" ry="160" stroke="#00FFFF" strokeWidth="0.8" opacity="0.25" />
            <ellipse cx="210" cy="210" rx="180" ry="5" stroke="#00FFFF" strokeWidth="0.5" opacity="0.2" />
            <ellipse cx="210" cy="210" rx="18" ry="180" stroke="#00FFFF" strokeWidth="0.8" opacity="0.35" />
            <ellipse cx="210" cy="210" rx="55" ry="180" stroke="#00FFFF" strokeWidth="0.8" opacity="0.35" />
            <ellipse cx="210" cy="210" rx="95" ry="180" stroke="#00FFFF" strokeWidth="0.8" opacity="0.35" />
            <ellipse cx="210" cy="210" rx="135" ry="180" stroke="#00FFFF" strokeWidth="0.8" opacity="0.35" />
            <ellipse cx="210" cy="210" rx="162" ry="180" stroke="#00FFFF" strokeWidth="0.8" opacity="0.25" />
            <ellipse cx="210" cy="210" rx="55" ry="180" stroke="#FF007F" strokeWidth="0.5" opacity="0.15" transform="rotate(45 210 210)" />
            <ellipse cx="210" cy="210" rx="95" ry="180" stroke="#FF007F" strokeWidth="0.5" opacity="0.12" transform="rotate(30 210 210)" />
            <circle cx="210" cy="30" r="4" fill="#CCFF00" opacity="0.9" />
            <circle cx="210" cy="390" r="4" fill="#CCFF00" opacity="0.9" />
            <circle cx="30" cy="210" r="3" fill="#00FFFF" opacity="0.7" />
            <circle cx="390" cy="210" r="3" fill="#00FFFF" opacity="0.7" />
            <circle cx="350" cy="150" r="3" fill="#FF007F" opacity="0.8" />
            <circle cx="70" cy="270" r="3" fill="#FF007F" opacity="0.8" />
            <circle cx="310" cy="330" r="3" fill="#CCFF00" opacity="0.7" />
            <circle cx="140" cy="100" r="2" fill="#00FFFF" opacity="0.6" />
            <line x1="210" y1="30" x2="350" y2="150" stroke="#CCFF00" strokeWidth="0.7" opacity="0.3" />
            <line x1="350" y1="150" x2="310" y2="330" stroke="#CCFF00" strokeWidth="0.7" opacity="0.3" />
            <line x1="310" y1="330" x2="70" y2="270" stroke="#CCFF00" strokeWidth="0.7" opacity="0.3" />
            <circle cx="210" cy="210" r="12" stroke="#FF007F" strokeWidth="1.5" opacity="0.7" />
            <circle cx="210" cy="210" r="4" fill="#FF007F" opacity="0.9" />
            <line x1="198" y1="210" x2="182" y2="210" stroke="#FF007F" strokeWidth="1" opacity="0.7" />
            <line x1="222" y1="210" x2="238" y2="210" stroke="#FF007F" strokeWidth="1" opacity="0.7" />
            <line x1="210" y1="198" x2="210" y2="182" stroke="#FF007F" strokeWidth="1" opacity="0.7" />
            <line x1="210" y1="222" x2="210" y2="238" stroke="#FF007F" strokeWidth="1" opacity="0.7" />
            <path d="M 120,130 A 110,110 0 0,1 340,200" stroke="#CCFF00" strokeWidth="1.5" fill="none" opacity="0.5" />
            <circle cx="340" cy="200" r="5" fill="none" stroke="#CCFF00" strokeWidth="1.5" opacity="0.7" />
          </svg>
          <div className={styles.globeLabelBg}>GLOBE</div>
        </div>

        <div className={styles.cornerBl}>
          LAT // 35.6762°N<br />
          LON // 139.6503°E<br />
          ALT // 0x0F22
        </div>
      </div>

      {/* RIGHT PANEL: classified archive */}
      <div className={styles.rightPanel}>
        <div className={styles.classifiedBanner}>
          <span className={styles.classifiedText}>// CLASSIFIED_INFO //</span>
        </div>

        <div className={`${styles.textWindow} scrollable`}>
          <div className={styles.ghostText}>ARCHIVE</div>

          {ARCHIVE_ENTRIES.map((entry, i) => (
            <div key={entry.id} className={styles.archiveEntry}>
              <div className={styles.entryId}>
                ENTRY.ID // {entry.id} // TIMESTAMP: {entry.timestamp}
              </div>
              <div className={styles.entryTitle}>{entry.title}</div>
              <div className={styles.entryBody}>
                {entry.body.map((part, j) => {
                  if ('redacted' in part) {
                    return <span key={j} className={styles.redacted}>{part.redacted}</span>
                  }
                  if ('highlight' in part) {
                    return <span key={j} style={{ color: 'var(--gr)' }}>{part.highlight}</span>
                  }
                  return <span key={j}>{part.text}</span>
                })}
              </div>
              {i < ARCHIVE_ENTRIES.length - 1 && <div className={styles.entryDivider} />}
            </div>
          ))}
        </div>

        <div className={`${styles.classifiedBanner} ${styles.greenBanner}`} style={{ marginBottom: '12px' }}>
          <span className={`${styles.classifiedText} ${styles.classifiedTextGreen}`}>// CLASSIFIED_INFO //</span>
        </div>

        <div className={styles.bottomBar}>
          <span className={styles.statChip}>ENTRIES: <span className={styles.statVal}>{totalUsers ?? '—'}</span></span>
          <span className={styles.statChip}>CLEARANCE: <span className={styles.statVal}>LVL.4</span></span>
          <span className={styles.statChip}>ENCRYPTED: <span className={styles.statVal}>AES-256</span></span>
          <span className={styles.statChip}>LAST SYNC: <span className={styles.statVal}>{lastSync}s AGO</span></span>
        </div>
      </div>

      {/* Diagonal divider */}
      <div className={styles.dividerLine} />

      {/* Top-right corner info */}
      <div className={styles.cornerTr}>
        ACCESS.LOG // OPEN<br />
        REDACT // ON<br />
        EXPORT // LOCKED
      </div>

      {/* BG corner lines */}
      <svg className={styles.bgCorners} viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,0 L60,0 M0,0 L0,60" stroke="#00FFFF" strokeWidth="2" opacity="0.3" />
        <path d="M1440,900 L1380,900 M1440,900 L1440,840" stroke="#CCFF00" strokeWidth="2" opacity="0.25" />
      </svg>

      <FlowNav activeSlug="databank" />
    </div>
  )
}
