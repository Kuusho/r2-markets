'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAccount, useConnect, useSignMessage } from 'wagmi'
import { KatakanaBackground } from '@/components/layout/KatakanaBackground'
import { DiagonalAccent } from '@/components/layout/DiagonalAccent'
import { HudOverlay } from '@/components/layout/HudOverlay'
import { FlowNav } from '@/components/layout/FlowNav'
import { generateReferralCode } from '@/lib/referral'
import { buildInitMessage } from '@/lib/signature'
import styles from './page.module.css'

function WaitlistContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { signMessageAsync } = useSignMessage()

  const [twitterLinked, setTwitterLinked] = useState(false)
  const [twitterUsername, setTwitterUsername] = useState('')
  const [twitterVerifiedAt, setTwitterVerifiedAt] = useState('')
  const [followsVerified, setFollowsVerified] = useState(false)
  const [followStatus, setFollowStatus] = useState<Record<string, boolean>>({})
  const [verifyingFollows, setVerifyingFollows] = useState(false)
  const [discordLinked, setDiscordLinked] = useState(false)
  const [discordUsername, setDiscordUsername] = useState('')
  const [isHolder, setIsHolder] = useState(false)
  const [referralCount, setReferralCount] = useState(0)
  const [referralCode, setReferralCode] = useState('')
  const [agentInitialized, setAgentInitialized] = useState(false)
  const [queueSlot, setQueueSlot] = useState<number | null>(null)
  const [signing, setSigning] = useState(false)
  const [copied, setCopied] = useState(false)

  // Handle OAuth callback params
  useEffect(() => {
    const twitterStub = searchParams.get('twitter_stub')
    const twitterVerified = searchParams.get('twitter_verified')
    const twitterUser = searchParams.get('username')
    const discordStub = searchParams.get('discord_stub')
    const discordVerified = searchParams.get('discord_verified')
    const discordUser = searchParams.get('username')

    if (twitterStub === 'true' || twitterVerified === 'true') {
      setTwitterLinked(true)
      setTwitterUsername(twitterUser ?? 'R2AGENT')
      setTwitterVerifiedAt(new Date().toUTCString().slice(17, 25) + ' UTC')
    }
    if (discordStub === 'true' || discordVerified === 'true') {
      setDiscordLinked(true)
      setDiscordUsername(discordUser ?? 'R2AGENT#0042')
    }
  }, [searchParams])

  // Register wallet on connect + fetch referral count
  const registerWallet = useCallback(async (addr: string) => {
    const storedCode = localStorage.getItem('r2_referral_code') ?? undefined
    setReferralCode(generateReferralCode(addr))

    await fetch('/api/waitlist/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress: addr, referralCode: storedCode }),
    })

    const res = await fetch(`/api/waitlist/referrals?wallet=${addr}`)
    const data = await res.json()
    setReferralCount(data.count ?? 0)
  }, [])

  useEffect(() => {
    if (isConnected && address) {
      registerWallet(address)
    }
  }, [isConnected, address, registerWallet])

  // Verify follows handler
  const handleVerifyFollows = useCallback(async () => {
    if (!address || verifyingFollows) return
    setVerifyingFollows(true)
    try {
      const res = await fetch(`/api/auth/twitter/verify-follows?wallet=${address}`)
      const data = await res.json()
      if (data.success) {
        setFollowStatus(data.followStatus)
        setFollowsVerified(data.allFollowed)
      }
    } catch (err) {
      console.error('Failed to verify follows:', err)
    } finally {
      setVerifyingFollows(false)
    }
  }, [address, verifyingFollows])

  // Gate logic
  const card1Complete = isConnected && twitterLinked && followsVerified
  const card2Complete = referralCount >= 3
  const card3Unlocked = card1Complete
  const card3Complete = discordLinked
  const card4Unlocked = card1Complete && card2Complete && card3Complete

  // Card state helpers
  const cardState = (complete: boolean, active: boolean, locked: boolean) => {
    if (complete) return 'done'
    if (locked) return 'lock'
    if (active) return 'prog'
    return 'avail'
  }

  const card1State = cardState(card1Complete, isConnected && !twitterLinked, false)
  const card2State = cardState(card2Complete, referralCount > 0, false)
  const card3State = cardState(card3Complete, card3Unlocked && !card3Complete, !card3Unlocked)
  const card4State = cardState(agentInitialized, card4Unlocked, !card4Unlocked)

  const handleConnectWallet = () => {
    const injected = connectors.find(c => c.id === 'injected')
    const wc = connectors.find(c => c.id === 'walletConnect')
    connect({ connector: injected ?? wc ?? connectors[0] })
  }

  const handleInitAgent = async () => {
    if (!address || signing) return
    setSigning(true)
    const ts = Date.now()
    const message = buildInitMessage(address, ts)

    signMessageAsync({ message })
      .then(async (signature) => {
        const res = await fetch('/api/waitlist/verify-sig', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: address, signature, message }),
        })
        const data = await res.json()
        if (data.success) {
          setAgentInitialized(true)
          setQueueSlot(data.queueSlot)
          setTimeout(() => router.push('/profile'), 2000)
        }
      })
      .finally(() => setSigning(false))
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://r2.markets/ref/${referralCode}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const stepStates = [
    card1Complete ? 'done' : card1State === 'prog' ? 'pend' : 'lock',
    card2Complete ? 'done' : 'pend',
    card3Complete ? 'done' : card3Unlocked ? 'pend' : 'lock',
    agentInitialized ? 'done' : card4Unlocked ? 'pend' : 'lock',
  ]

  return (
    <div className={styles.page}>
      <KatakanaBackground />
      <DiagonalAccent variant="default" />

      <HudOverlay
        tl={['SYS.VER // 1.0.4', 'CONN // BASE_NET', 'PHASE_1 // ACTIVE']}
        tr={['R2-OS KERNEL', 'ERC-8004 NODE', 'BLOCK #27491842']}
        bl={[
          `AGENT // ${address ? truncateAddress(address) : 'UNLINKED'}`,
          `PROTOCOLS // ${[card1Complete, card2Complete, card3Complete, agentInitialized].filter(Boolean).length}/4`,
        ]}
        br={[
          '© 2026 R2-SYSTEMS CORP.',
          queueSlot ? `QUEUE SLOT #${queueSlot.toLocaleString()} / 5,000` : 'SLOT // PENDING',
        ]}
      />

      <div className={styles.layout}>

        {/* LEFT WARNING PANEL */}
        <div className={styles.lPanel}>
          <div className={styles.lHead}>
            <div className={styles.lHeadSup}>STATUS</div>
            <div className={styles.lHeadTitle}>DIRECTIVES</div>
          </div>

          <div className={styles.bannerRows}>
            {Array.from({ length: 24 }, (_, i) => {
              const mod = i % 5
              const cls = mod === 2 || mod === 3 ? styles.brLit : mod === 1 || mod === 4 ? styles.brMid : styles.brDim
              return <div key={i} className={`${styles.br} ${cls}`}>// DIRECTIVES_PENDING //</div>
            })}
          </div>

          <div className={styles.lSep} />

          <div className={styles.lProg}>
            <div className={styles.lProgLbl}>OBJECTIVE_STATUS</div>
            {[
              { label: 'COM_LINK', state: stepStates[0] },
              { label: 'RECRUITMENT', state: stepStates[1] },
              { label: 'BASE_CAMP', state: stepStates[2] },
              { label: 'INIT_AGENT', state: stepStates[3] },
            ].map(({ label, state }) => (
              <div key={label} className={styles.lStep}>
                <div className={`${styles.lDot} ${styles[`lDot_${state}`]}`} />
                <div className={`${styles.lLbl} ${styles[`lLbl_${state}`]}`}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN PANEL */}
        <div className={styles.mPanel}>
          <div className={styles.sHead}>
            <div className={styles.sTitle}>PROTOCOL.DIRECTIVES</div>
            <div className={styles.sSlash}>//</div>
            <div className={styles.sSub}>R2-MARKETS :: AGENT_CLAIM :: PHASE_1</div>
            <div className={styles.sRight}>
              OBJECTIVES: {[card1Complete, card2Complete, card3Complete, agentInitialized].filter(Boolean).length} / 4
              &nbsp;·&nbsp;
              {queueSlot ? `SLOT #${queueSlot.toLocaleString()}` : 'SLOT // PENDING'}
            </div>
          </div>

          <div className={styles.questStack}>

            {/* CARD 01: COM LINK */}
            <div className={`${styles.qcard} ${styles[`qcard_${card1State}`]}`}>
              <div className={styles.qcardBar} />
              <div className={styles.qcardWm}>01</div>
              <div className={styles.qcardBody}>
                <div className={styles.qcardTitle}>[01] COM_LINK ESTABLISHED</div>
                <div className={styles.qcardDesc}>
                  TARGET :: @R2MARKETS &nbsp;·&nbsp; PLATFORM :: X/TWITTER &nbsp;·&nbsp;
                  {isConnected ? `WALLET :: ${truncateAddress(address!)}` : 'WALLET :: DISCONNECTED'}
                </div>
                <div className={styles.qcardRow}>
                  {!isConnected ? (
                    <button className={`${styles.btn} ${styles.btnCy}`} onClick={handleConnectWallet}>
                      [ CONNECT WALLET ]
                    </button>
                  ) : !twitterLinked ? (
                    <>
                      <span className={styles.badgeDone} style={{ borderColor: 'rgba(0,255,255,0.4)', color: 'var(--cy)', background: 'rgba(0,255,255,0.05)' }}>
                        ✓ WALLET: {truncateAddress(address!)}
                      </span>
                      <button 
                        className={`${styles.btn} ${styles.btnPk}`} 
                        onClick={async () => {
                          await fetch('/api/auth/set-wallet', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ wallet: address }),
                          })
                          window.location.href = '/api/auth/twitter'
                        }}
                      >
                        [ AUTHENTICATE X/TWITTER ]
                      </button>
                    </>
                  ) : !followsVerified ? (
                    <>
                      <span className={styles.badgeDone} style={{ borderColor: 'rgba(0,255,255,0.4)', color: 'var(--cy)', background: 'rgba(0,255,255,0.05)' }}>
                        ✓ @{twitterUsername}
                      </span>
                      {/* R2MARKETS follow row */}
                      {followStatus.r2markets ? (
                        <span className={styles.badgeDone}>✓ @R2MARKETS</span>
                      ) : (
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <a 
                            className={`${styles.btn} ${styles.btnPk}`}
                            href="https://x.com/intent/follow?screen_name=r2markets" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >[ FOLLOW ]</a>
                          <button 
                            className={`${styles.btn} ${styles.btnGr}`}
                            onClick={handleVerifyFollows}
                            disabled={verifyingFollows}
                            style={{ padding: '4px 8px', fontSize: '8px' }}
                          >[ ✓ ]</button>
                          <span style={{ fontSize: '8px', opacity: 0.6 }}>@R2MARKETS</span>
                        </div>
                      )}
                      {/* KOREWAPANDESU follow row */}
                      {followStatus.korewapandesu ? (
                        <span className={styles.badgeDone}>✓ @KOREWAPANDESU</span>
                      ) : (
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <a 
                            className={`${styles.btn} ${styles.btnCy}`}
                            href="https://x.com/intent/follow?screen_name=korewapandesu" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >[ FOLLOW ]</a>
                          <button 
                            className={`${styles.btn} ${styles.btnGr}`}
                            onClick={handleVerifyFollows}
                            disabled={verifyingFollows}
                            style={{ padding: '4px 8px', fontSize: '8px' }}
                          >[ ✓ ]</button>
                          <span style={{ fontSize: '8px', opacity: 0.6 }}>@KOREWAPANDESU</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <span className={styles.badgeDone}>✓ LINK COMPLETE</span>
                      <span className={styles.badgeDone}>✓ @{twitterUsername}</span>
                      <span className={styles.badgeDone}>✓ FOLLOWS VERIFIED</span>
                      <span className={styles.verifiedTs}>VERIFIED {twitterVerifiedAt}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* CARD 02: RECRUITMENT */}
            <div className={`${styles.qcard} ${styles[`qcard_${card2State}`]}`}>
              <div className={styles.qcardBar} />
              <div className={styles.qcardWm}>02</div>
              <div className={styles.qcardBody}>
                <div className={styles.qcardTitle}>[02] RECRUITMENT PROTOCOL</div>
                <div className={styles.qcardDesc}>
                  DISTRIBUTE AGENT LINK &nbsp;·&nbsp; TARGET :: 3 RECRUITS &nbsp;·&nbsp; REWARD :: ENHANCED SLOT PRIORITY + COMMISSION
                </div>
                <div className={styles.qcardRow}>
                  <div className={styles.sqRow}>
                    {[0, 1, 2].map(i => (
                      <div key={i} className={`${styles.sq} ${i < referralCount ? styles.sqOn : ''}`} />
                    ))}
                    <span className={styles.sqCount}>{referralCount} / 3 RECRUITS</span>
                  </div>
                </div>
                {referralCode && (
                  <div className={styles.refBlock}>
                    <span className={styles.refLbl}>RECRUIT.URL //</span>
                    <span className={styles.refUrl}>r2.markets/ref/{referralCode}</span>
                    <button className={`${styles.btn} ${styles.btnGr}`} style={{ marginLeft: 'auto', padding: '4px 12px', fontSize: '8.5px' }} onClick={copyReferralLink}>
                      {copied ? '[ COPIED! ]' : '[ COPY_LINK ]'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* CARD 03: DISCORD */}
            <div className={`${styles.qcard} ${styles[`qcard_${card3State}`]}`}>
              <div className={styles.qcardBar} />
              <div className={styles.qcardWm}>03</div>
              <div className={styles.qcardBody}>
                <div className={styles.qcardTitle}>[03] BASE_CAMP INFILTRATION</div>
                <div className={styles.qcardDesc}>
                  JOIN R2-MARKETS DISCORD SERVER &nbsp;·&nbsp; VERIFY HOLDER STATUS &nbsp;·&nbsp; BIND DISCORD ID TO AGENT PROFILE
                </div>
                {card3State !== 'lock' && (
                  <div className={styles.qcardRow}>
                    {card3Complete ? (
                      <>
                        <span className={styles.badgeDone}>✓ LINK ACTIVE</span>
                        <span className={styles.discChip}>
                          {isHolder ? '◈ HOLDER VERIFIED' : `DISCORD: ${discordUsername}`}
                        </span>
                      </>
                    ) : (
                      <>
                        <a className={`${styles.btn} ${styles.btnPk}`} href="https://discord.gg/r2markets" target="_blank" rel="noopener noreferrer">[ JOIN_DISCORD ]</a>
                        <button 
                          className={`${styles.btn} ${styles.btnCy}`}
                          onClick={async () => {
                            await fetch('/api/auth/set-wallet', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ wallet: address }),
                            })
                            window.location.href = '/api/auth/discord'
                          }}
                        >[ AUTHENTICATE DISCORD ]</button>
                        <span className={styles.discChip}>DISCORD: DISCONNECTED</span>
                      </>
                    )}
                  </div>
                )}
                {card3State === 'lock' && (
                  <div className={styles.qcardRow}>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '8.5px', letterSpacing: '0.2em', color: 'rgba(80,80,80,0.35)' }}>
                      COMPLETE COM_LINK TO UNLOCK
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CARD 04: INITIALIZE AGENT */}
            <div className={`${styles.qcard} ${styles[`qcard_${card4State}`]}`}>
              <div className={styles.qcardBar} />
              <div className={styles.qcardWm}>04</div>
              <div className={styles.qcardBody}>
                <div className={styles.qcardTitle}>[04] INITIALIZE AGENT</div>
                <div className={styles.qcardDesc}>
                  DEPLOY ERC-8004 IDENTITY TOKEN &nbsp;·&nbsp; REGISTER TO BASE MAINNET &nbsp;·&nbsp; ALL PRIOR PROTOCOLS MUST BE COMPLETE
                </div>
                {agentInitialized ? (
                  <span className={styles.badgeDone}>✓ AGENT QUEUED — SLOT #{queueSlot?.toLocaleString()} — REDIRECTING...</span>
                ) : card4Unlocked ? (
                  <button
                    className={styles.initBtnActive}
                    onClick={handleInitAgent}
                    disabled={signing}
                  >
                    {signing ? '◈ SIGNING...' : '◈ INITIALIZE AGENT'}
                  </button>
                ) : (
                  <>
                    <button className={styles.initBtn} disabled>◈ &nbsp;INITIALIZE AGENT :: WAITING...</button>
                    <div className={styles.initSub}>COMPLETE ALL PROTOCOLS TO UNLOCK AGENT INITIALIZATION</div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <FlowNav activeSlug="waitlist" />
    </div>
  )
}

export default function WaitlistPage() {
  return (
    <Suspense>
      <WaitlistContent />
    </Suspense>
  )
}
