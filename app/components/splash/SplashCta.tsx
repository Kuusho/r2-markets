'use client'

import { useRouter } from 'next/navigation'
import styles from './SplashCta.module.css'

export function SplashCta() {
  const router = useRouter()

  return (
    <div className={styles.center}>
      <div className={styles.sysLabel}>// R2-SYSTEMS CORP. — AUTONOMOUS NFT GRID //</div>
      <div className={styles.logoR2}>R2</div>
      <div className={styles.logoMarkets}>MARKETS</div>
      <div className={styles.logoRule} />
      <div className={styles.tagline}>エージェント・プロトコル &nbsp;&nbsp;///&nbsp;&nbsp; BASE NETWORK &nbsp;&nbsp;///&nbsp;&nbsp; ERC-8004</div>
      <div className={styles.btnOuter}>
        <button
          className={styles.accessBtn}
          onClick={() => router.push('/waitlist')}
          aria-label="Access the grid"
        >
          <span className={styles.btnText}>// ACCESS.GRID</span>
        </button>
      </div>
    </div>
  )
}
