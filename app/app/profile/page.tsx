'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { KatakanaBackground } from '@/components/layout/KatakanaBackground'
import { DiagonalAccent } from '@/components/layout/DiagonalAccent'
import { FlowNav } from '@/components/layout/FlowNav'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'

type UserRecord = {
  wallet_address: string
  twitter_username: string | null
  discord_username: string | null
  is_holder: boolean
  referral_code: string | null
  status: string
  created_at: string
}

const RISK_TIERS = ['AGGRESSIVE', 'MODERATE', 'CONSERVATIVE'] as const
const PROTOCOLS: { label: string; color: string; dim?: boolean }[] = [
  { label: 'SNIPE', color: 'green' },
  { label: 'SWEEP', color: 'cyan' },
  { label: 'LEARN', color: 'pink' },
  { label: 'DUMP', color: 'pink', dim: true },
]

export default function ProfilePage() {
  const { address, isConnected } = useAccount()
  const [user, setUser] = useState<UserRecord | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [riskTier, setRiskTier] = useState<string>('AGGRESSIVE')
  const [queueSlot, setQueueSlot] = useState<number | null>(null)

  useEffect(() => {
    if (!address) return
    const supabase = createClient()
    supabase
      .from('users')
      .select('*')
      .eq('wallet_address', address.toLowerCase())
      .single()
      .then(({ data }) => {
        if (data) {
          setUser(data)
          setDisplayName(`R2-ALPHA-${data.wallet_address.slice(-4).toUpperCase()}`)
        }
      })

    supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .in('status', ['queued', 'upgraded'])
      .then(({ count }) => setQueueSlot(count))
  }, [address])

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const issuedDate = user ? new Date(user.created_at).toISOString().slice(0, 10).replace(/-/g, '.') : '2026.03.09'
  const expiresDate = user
    ? new Date(new Date(user.created_at).setFullYear(new Date(user.created_at).getFullYear() + 1))
        .toISOString().slice(0, 10).replace(/-/g, '.')
    : '2027.03.09'

  const mockDisplayName = 'R2-ALPHA-????'
  const effectiveDisplayName = displayName || mockDisplayName

  return (
    <div className={styles.page}>
      <KatakanaBackground />
      <DiagonalAccent variant="minimal" />

      {/* HUD stripe */}
      <div className={styles.hudStripe}>
        <span className={styles.hudTitle}>AGENT PROFILE</span>
        <span className={styles.hudCrumb}>HOME // REGISTRY // IDENTIFICATION</span>
        <div className={styles.hudRight}>
          AGENT: {address ? truncateAddress(address) : 'UNLINKED'}
          &nbsp;|&nbsp; BASE NET &nbsp;|&nbsp; BLOCK #27491842
        </div>
      </div>

      {/* BG grid lines */}
      <svg className={styles.bgGrid} viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,0 L60,0 M0,0 L0,60" stroke="#00FFFF" strokeWidth="2" opacity="0.3" />
        <path d="M1440,900 L1380,900 M1440,900 L1440,840" stroke="#CCFF00" strokeWidth="2" opacity="0.25" />
        <path d="M0,900 L60,900 M0,900 L0,840" stroke="#FF007F" strokeWidth="2" opacity="0.25" />
        <path d="M1440,0 L1380,0 M1440,0 L1440,60" stroke="#FF007F" strokeWidth="2" opacity="0.2" />
      </svg>

      {/* Corner info */}
      <div className={styles.ciTl}>
        REGISTRY // OPEN<br />
        SIGN // {user?.status === 'queued' ? 'COMPLETE' : 'PENDING'}<br />
        VER // 1.0.4
      </div>
      <div className={styles.ciBr}>
        CREDENTIAL // {user ? 'VALID' : 'PENDING'}<br />
        NEXT RENEW // 365d<br />
        NET // BASE MAINNET
      </div>

      {!isConnected && (
        <div className={styles.walletBanner}>
          <span className={styles.walletBannerIcon}>⚠</span>
          <span>NO AGENT LINKED — CONNECT WALLET TO LOAD CREDENTIALS</span>
          <span className={styles.walletBannerIcon}>⚠</span>
        </div>
      )}

      <div className={styles.main}>

        {/* ── ID CARD ── */}
        <div className={styles.idCard}>
          <svg className={styles.cardBorderSvg} viewBox="0 0 600 400" preserveAspectRatio="none">
            <polygon points="0,0 580,0 600,20 600,400 20,400 0,380"
              fill="none" stroke="#FF007F" strokeWidth="3" opacity="0.8" />
            <polygon points="4,4 576,4 596,24 596,396 24,396 4,376"
              fill="none" stroke="rgba(255,0,127,0.2)" strokeWidth="1" />
          </svg>

          {/* Barcode strip */}
          <div className={styles.barcodeStrip}>
            <div className={styles.barcodeInner} />
            <div className={styles.barcodeId}>
              {address ? `${address.slice(0, 10)} // 2026.03.09` : 'R2-ALPHA // 2026.03.09'}
            </div>
          </div>

          {/* Card body */}
          <div className={styles.cardBody}>
            <div className={styles.cardFields}>
              <div className={styles.cardHeaderStripe}>
                <span className={styles.cardHeaderBrand}>R2 MARKETS</span>
                <span className={styles.cardHeaderType}>// AGENT IDENTIFICATION CARD</span>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.fieldLabel}>DESIGNATION</div>
                <div className={`${styles.fieldValue} ${styles.fieldUnderline}`}>{effectiveDisplayName}</div>
              </div>

              <div className={styles.fieldsRow}>
                <div className={styles.fieldGroup}>
                  <div className={styles.fieldLabel}>CLEARANCE</div>
                  <div className={`${styles.fieldValue} ${styles.cyan} ${styles.sm} ${styles.fieldUnderline}`}>
                    {user?.status === 'upgraded' ? 'LVL.5 EXEC' : 'LVL.4 EXEC'}
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <div className={styles.fieldLabel}>CLASS</div>
                  <div className={`${styles.fieldValue} ${styles.green} ${styles.sm} ${styles.fieldUnderline}`}>BIDDER MK.II</div>
                </div>
              </div>

              <div className={styles.fieldsRow}>
                <div className={styles.fieldGroup}>
                  <div className={styles.fieldLabel}>ISSUED</div>
                  <div className={`${styles.fieldValue} ${styles.sm} ${styles.fieldUnderline} ${styles.dimmed}`}>{issuedDate}</div>
                </div>
                <div className={styles.fieldGroup}>
                  <div className={styles.fieldLabel}>EXPIRES</div>
                  <div className={`${styles.fieldValue} ${styles.sm} ${styles.fieldUnderline} ${styles.dimmed}`}>{expiresDate}</div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.fieldLabel}>WALLET ADDRESS</div>
                <div className={`${styles.fieldValue} ${styles.sm} ${styles.fieldUnderline}`} style={{ color: 'rgba(0,255,255,0.7)', fontSize: '11px' }}>
                  {address ?? '0x????????????????????????????????'}
                </div>
              </div>
            </div>

            <div className={styles.cardRight}>
              <div className={styles.avatarFrame}>
                <div className={styles.scanlines} />
                <div className={styles.avatarSvgWrap}>
                  <svg width="130" height="160" viewBox="0 0 130 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="130" height="160" fill="rgba(26,11,46,0.6)" />
                    <rect x="25" y="95" width="80" height="55" fill="rgba(0,255,255,0.05)" stroke="#00FFFF" strokeWidth="1" opacity="0.5" />
                    <rect x="45" y="105" width="20" height="14" stroke="#FF007F" strokeWidth="1" opacity="0.5" />
                    <rect x="65" y="105" width="20" height="14" stroke="#FF007F" strokeWidth="1" opacity="0.5" />
                    <rect x="50" y="82" width="30" height="13" fill="rgba(0,0,0,0.4)" stroke="#00FFFF" strokeWidth="0.8" opacity="0.5" />
                    <rect x="22" y="22" width="86" height="60" fill="rgba(0,0,10,0.7)" stroke="#00FFFF" strokeWidth="1.5" opacity="0.8" />
                    <rect x="34" y="38" width="22" height="10" fill="#FF007F" opacity="0.9" />
                    <rect x="74" y="38" width="22" height="10" fill="#FF007F" opacity="0.9" />
                    <rect x="38" y="40" width="14" height="6" fill="#fff" opacity="0.6" />
                    <rect x="78" y="40" width="14" height="6" fill="#fff" opacity="0.6" />
                    <line x1="38" y1="60" x2="92" y2="60" stroke="#00FFFF" strokeWidth="0.8" opacity="0.5" />
                    <line x1="38" y1="65" x2="92" y2="65" stroke="#00FFFF" strokeWidth="0.8" opacity="0.5" />
                    <line x1="38" y1="70" x2="92" y2="70" stroke="#00FFFF" strokeWidth="0.8" opacity="0.5" />
                    <line x1="65" y1="22" x2="65" y2="10" stroke="#CCFF00" strokeWidth="2" opacity="0.9" />
                    <circle cx="65" cy="8" r="4" fill="#CCFF00" opacity="0.9" />
                    <line x1="22" y1="27" x2="27" y2="22" stroke="#CCFF00" strokeWidth="1" opacity="0.6" />
                    <line x1="108" y1="22" x2="103" y2="27" stroke="#CCFF00" strokeWidth="1" opacity="0.6" />
                    <text x="65" y="126" fill="#CCFF00" fontSize="8" textAnchor="middle" fontFamily="'Share Tech Mono',monospace" letterSpacing="1" opacity="0.9">ALPHA-01</text>
                  </svg>
                </div>
              </div>

              <div className={styles.thumbprint}>
                <div className={styles.thumbprintLabel}>// BIOMETRIC</div>
                <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                  <ellipse cx="30" cy="10" rx="28" ry="8" stroke="#00FFFF" strokeWidth="0.8" opacity="0.4" />
                  <ellipse cx="30" cy="10" rx="22" ry="6" stroke="#00FFFF" strokeWidth="0.8" opacity="0.4" />
                  <ellipse cx="30" cy="10" rx="16" ry="4" stroke="#00FFFF" strokeWidth="0.8" opacity="0.4" />
                  <ellipse cx="30" cy="10" rx="10" ry="2.5" stroke="#00FFFF" strokeWidth="0.8" opacity="0.4" />
                  <circle cx="30" cy="10" r="2" fill="#00FFFF" opacity="0.6" />
                </svg>
                <div className={styles.thumbprintStatus}>
                  {user?.status === 'queued' ? 'VERIFIED' : 'PENDING'}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.holoOverlay} />
          <div className={styles.cardSecurity}>
            <span className={styles.cardSecurityText}>
              R2MARKETS // AGENT CREDENTIAL // CRYPTOGRAPHICALLY SIGNED // DO NOT DUPLICATE
            </span>
          </div>
        </div>

        {/* ── RIGHT EDIT PANEL ── */}
        <div className={styles.rightPanel}>
          <div className={styles.rpHeader}>// PROFILE EDIT</div>

          <div className={styles.editSection}>
            <div className={styles.editField}>
              <div className={styles.editFieldLabel}>DISPLAY NAME</div>
              <div className={styles.editFieldInput}>
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className={styles.editInput}
                  spellCheck={false}
                />
                <span className={styles.editCursor} />
              </div>
            </div>

            <div className={styles.editField}>
              <div className={styles.editFieldLabel}>WALLET LABEL</div>
              <div className={`${styles.editFieldInput} ${styles.readOnly}`} style={{ fontSize: '14px', color: 'rgba(0,255,255,0.8)' }}>
                {address ?? '0x????????????????????????????????'}
              </div>
            </div>

            <div className={styles.editField}>
              <div className={styles.editFieldLabel}>NOTIFICATION WEBHOOK</div>
              <div className={`${styles.editFieldInput} ${styles.readOnly}`} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                https://hooks.r2.markets/alpha
              </div>
            </div>

            <div className={styles.editField}>
              <div className={styles.editFieldLabel}>RISK TIER</div>
              <div className={styles.tagsRow}>
                {RISK_TIERS.map(tier => (
                  <button
                    key={tier}
                    className={`${styles.tag} ${riskTier === tier ? styles.tagFilledPink : styles.tagPink}`}
                    onClick={() => setRiskTier(tier)}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.editField}>
              <div className={styles.editFieldLabel}>ACTIVE PROTOCOLS</div>
              <div className={styles.tagsRow}>
                {PROTOCOLS.map(p => (
                  <div
                    key={p.label}
                    className={`${styles.tag} ${styles[`tag${p.color.charAt(0).toUpperCase() + p.color.slice(1)}`]}`}
                    style={p.dim ? { opacity: 0.35 } : undefined}
                  >
                    {p.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className={styles.confirmBtn}>
            <span className={styles.confirmText}>CONFIRM LOADOUT &gt;&gt;</span>
          </button>

          {queueSlot && (
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '8px', letterSpacing: '0.3em', color: 'rgba(204,255,0,0.4)', marginTop: '12px', textAlign: 'center' }}>
              QUEUE SLOT // #{queueSlot.toLocaleString()} / 5,000
            </div>
          )}
        </div>
      </div>

      <FlowNav activeSlug="profile" />
    </div>
  )
}
