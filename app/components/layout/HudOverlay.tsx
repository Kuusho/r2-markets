import styles from './HudOverlay.module.css'

interface HudOverlayProps {
  tl?: string[]
  tr?: string[]
  bl?: string[]
  br?: string[]
}

export function HudOverlay({ tl, tr, bl, br }: HudOverlayProps) {
  return (
    <>
      <div className={styles.cornerTl} />
      <div className={styles.cornerTr} />
      <div className={styles.cornerBl} />
      <div className={styles.cornerBr} />
      {tl && (
        <div className={styles.hudTl}>
          {tl.map((line, i) => <span key={i}>{line}<br /></span>)}
        </div>
      )}
      {tr && (
        <div className={styles.hudTr}>
          {tr.map((line, i) => <span key={i}>{line}<br /></span>)}
        </div>
      )}
      {bl && (
        <div className={styles.hudBl}>
          {bl.map((line, i) => <span key={i}>{line}<br /></span>)}
        </div>
      )}
      {br && (
        <div className={styles.hudBr}>
          {br.map((line, i) => <span key={i}>{line}<br /></span>)}
        </div>
      )}
    </>
  )
}
