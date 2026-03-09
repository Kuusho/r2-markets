import styles from './DiagonalAccent.module.css'

interface DiagonalAccentProps {
  variant?: 'default' | 'minimal'
}

export function DiagonalAccent({ variant = 'default' }: DiagonalAccentProps) {
  return (
    <svg
      className={styles.accent}
      viewBox="0 0 1440 900"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {variant === 'default' && (
        <>
          <line x1="-60" y1="430" x2="560" y2="-80" stroke="#FF007F" strokeWidth="4" opacity="0.09" />
          <line x1="-60" y1="490" x2="620" y2="-80" stroke="#FF007F" strokeWidth="1.5" opacity="0.055" />
          <line x1="1500" y1="460" x2="870" y2="980" stroke="#00FFFF" strokeWidth="3" opacity="0.07" />
          <line x1="1500" y1="410" x2="830" y2="980" stroke="#00FFFF" strokeWidth="1" opacity="0.04" />
          <line x1="0" y1="118" x2="1440" y2="118" stroke="#CCFF00" strokeWidth="0.5" opacity="0.055" />
          <line x1="0" y1="782" x2="1440" y2="782" stroke="#FF007F" strokeWidth="0.5" opacity="0.045" />
          <line x1="1372" y1="832" x2="1416" y2="832" stroke="#CCFF00" strokeWidth="1" opacity="0.4" />
          <line x1="1394" y1="810" x2="1394" y2="854" stroke="#CCFF00" strokeWidth="1" opacity="0.4" />
          <circle cx="1394" cy="832" r="3" fill="none" stroke="#CCFF00" strokeWidth="1" opacity="0.35" />
        </>
      )}
      {variant === 'minimal' && (
        <>
          <line x1="0" y1="0" x2="1440" y2="900" stroke="#FF007F" strokeWidth="1" opacity="0.04" />
          <line x1="1440" y1="0" x2="0" y2="900" stroke="#00FFFF" strokeWidth="1" opacity="0.03" />
          <path d="M0,0 L60,0 M0,0 L0,60" stroke="#00FFFF" strokeWidth="2" opacity="0.3" />
          <path d="M1440,900 L1380,900 M1440,900 L1440,840" stroke="#CCFF00" strokeWidth="2" opacity="0.25" />
          <path d="M0,900 L60,900 M0,900 L0,840" stroke="#FF007F" strokeWidth="2" opacity="0.25" />
          <path d="M1440,0 L1380,0 M1440,0 L1440,60" stroke="#FF007F" strokeWidth="2" opacity="0.2" />
        </>
      )}
    </svg>
  )
}
