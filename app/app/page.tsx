import { KatakanaBackground } from '@/components/layout/KatakanaBackground'
import { DiagonalAccent } from '@/components/layout/DiagonalAccent'
import { HudOverlay } from '@/components/layout/HudOverlay'
import { FlowNav } from '@/components/layout/FlowNav'
import { SplashCta } from '@/components/splash/SplashCta'
import styles from './page.module.css'

export default function SplashPage() {
  return (
    <div className={styles.page}>
      <KatakanaBackground />
      <DiagonalAccent variant="default" />

      {/* Cityscape + perspective grid */}
      <svg className={styles.citySvg} viewBox="0 0 1440 420" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="fadeBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A0B2E" stopOpacity="0" />
            <stop offset="100%" stopColor="#1A0B2E" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {/* Perspective floor grid */}
        <line x1="0" y1="300" x2="1440" y2="300" stroke="#00FFFF" strokeWidth="2" opacity="0.45" />
        <line x1="0" y1="320" x2="1440" y2="320" stroke="#00FFFF" strokeWidth="1.5" opacity="0.35" />
        <line x1="0" y1="336" x2="1440" y2="336" stroke="#00FFFF" strokeWidth="1" opacity="0.25" />
        <line x1="0" y1="350" x2="1440" y2="350" stroke="#00FFFF" strokeWidth="1" opacity="0.2" />
        <line x1="0" y1="362" x2="1440" y2="362" stroke="#00FFFF" strokeWidth="0.5" opacity="0.15" />
        <line x1="0" y1="372" x2="1440" y2="372" stroke="#00FFFF" strokeWidth="0.5" opacity="0.12" />
        <line x1="0" y1="381" x2="1440" y2="381" stroke="#00FFFF" strokeWidth="0.5" opacity="0.1" />
        <line x1="0" y1="389" x2="1440" y2="389" stroke="#00FFFF" strokeWidth="0.5" opacity="0.08" />
        <line x1="0" y1="396" x2="1440" y2="396" stroke="#00FFFF" strokeWidth="0.5" opacity="0.06" />
        <line x1="0" y1="402" x2="1440" y2="402" stroke="#00FFFF" strokeWidth="0.5" opacity="0.05" />
        {/* Vertical lines converging to vanishing point 720,300 */}
        <line x1="720" y1="300" x2="0" y2="420" stroke="#00FFFF" strokeWidth="0.5" opacity="0.35" />
        <line x1="720" y1="300" x2="144" y2="420" stroke="#00FFFF" strokeWidth="0.5" opacity="0.35" />
        <line x1="720" y1="300" x2="288" y2="420" stroke="#00FFFF" strokeWidth="0.5" opacity="0.35" />
        <line x1="720" y1="300" x2="432" y2="420" stroke="#00FFFF" strokeWidth="0.5" opacity="0.35" />
        <line x1="720" y1="300" x2="576" y2="420" stroke="#00FFFF" strokeWidth="0.5" opacity="0.35" />
        <line x1="720" y1="300" x2="720" y2="420" stroke="#00FFFF" strokeWidth="0.5" opacity="0.35" />
        <line x1="720" y1="300" x2="864" y2="420" stroke="#00FFFF" strokeWidth="0.5" opacity="0.35" />
        <line x1="720" y1="300" x2="1008" y2="420" stroke="#00FFFF" strokeWidth="0.5" opacity="0.35" />
        <line x1="720" y1="300" x2="1152" y2="420" stroke="#00FFFF" strokeWidth="0.5" opacity="0.35" />
        <line x1="720" y1="300" x2="1296" y2="420" stroke="#00FFFF" strokeWidth="0.5" opacity="0.35" />
        <line x1="720" y1="300" x2="1440" y2="420" stroke="#00FFFF" strokeWidth="0.5" opacity="0.35" />
        {/* Left building cluster */}
        <rect x="0" y="160" width="90" height="140" fill="#0D0520" />
        <rect x="0" y="160" width="90" height="140" fill="none" stroke="#FF007F" strokeWidth="2" opacity="0.5" />
        <rect x="10" y="170" width="14" height="9" fill="#FF007F" opacity="0.4" />
        <rect x="28" y="170" width="14" height="9" fill="#CCFF00" opacity="0.3" />
        <rect x="46" y="170" width="14" height="9" fill="#FF007F" opacity="0.5" />
        <rect x="64" y="170" width="14" height="9" fill="#00FFFF" opacity="0.3" />
        <rect x="10" y="192" width="14" height="9" fill="#00FFFF" opacity="0.25" />
        <rect x="28" y="192" width="14" height="9" fill="#FF007F" opacity="0.3" />
        <rect x="46" y="192" width="14" height="9" fill="#CCFF00" opacity="0.25" />
        <rect x="64" y="192" width="14" height="9" fill="#FF007F" opacity="0.4" />
        <rect x="100" y="200" width="70" height="100" fill="#0D0520" stroke="#00FFFF" strokeWidth="1.5" opacity="0.4" />
        <rect x="180" y="170" width="110" height="130" fill="#0D0520" stroke="#FF007F" strokeWidth="2" opacity="0.35" />
        <rect x="300" y="220" width="60" height="80" fill="#0D0520" stroke="#CCFF00" strokeWidth="1.5" opacity="0.3" />
        <rect x="370" y="240" width="50" height="60" fill="#0D0520" stroke="#FF007F" strokeWidth="1" opacity="0.25" />
        {/* Right building cluster */}
        <rect x="1360" y="180" width="80" height="120" fill="#0D0520" stroke="#FF007F" strokeWidth="2" opacity="0.5" />
        <rect x="1280" y="210" width="70" height="90" fill="#0D0520" stroke="#00FFFF" strokeWidth="1.5" opacity="0.35" />
        <rect x="1190" y="200" width="80" height="100" fill="#0D0520" stroke="#CCFF00" strokeWidth="1.5" opacity="0.3" />
        <rect x="1100" y="240" width="80" height="60" fill="#0D0520" stroke="#FF007F" strokeWidth="1" opacity="0.25" />
        <rect x="1010" y="250" width="80" height="50" fill="#0D0520" stroke="#00FFFF" strokeWidth="1" opacity="0.2" />
        {/* Central spire */}
        <polygon points="710,60 720,290 730,60 725,40 715,40" fill="none" stroke="#CCFF00" strokeWidth="2.5" opacity="0.7" />
        <line x1="720" y1="40" x2="720" y2="300" stroke="#CCFF00" strokeWidth="1" opacity="0.4" />
        <circle cx="720" cy="40" r="4" fill="#CCFF00" opacity="0.8" />
        {/* Fade overlay */}
        <rect x="0" y="0" width="1440" height="420" fill="url(#fadeBg)" />
      </svg>

      <HudOverlay
        tl={['SYS.VER // 1.0.4', 'CONN // BASE_NET', 'STATUS // STANDBY']}
        tr={['R2-OS KERNEL', 'ERC-8004 NODE', 'BLOCK #27491842']}
        bl={['PHASE 1 // ACTIVE', 'SLOTS // 3,241 REMAIN']}
        br={['© 2026 R2-SYSTEMS CORP.']}
      />

      <SplashCta />

      <FlowNav activeSlug="splash" />
    </div>
  )
}
