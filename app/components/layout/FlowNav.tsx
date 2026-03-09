import Link from 'next/link'
import styles from './FlowNav.module.css'

const items = [
  { num: '01', label: 'SPLASH', slug: 'splash', href: '/' },
  { num: '02', label: 'WAITLIST', slug: 'waitlist', href: '/waitlist' },
  { num: '03', label: 'PROFILE', slug: 'profile', href: '/profile' },
  { num: '08', label: 'DATABANK', slug: 'databank', href: '/databank' },
]

interface FlowNavProps {
  activeSlug: string
}

export function FlowNav({ activeSlug }: FlowNavProps) {
  const currentIndex = items.findIndex(i => i.slug === activeSlug)
  const prev = currentIndex > 0 ? items[currentIndex - 1] : items[items.length - 1]
  const next = currentIndex < items.length - 1 ? items[currentIndex + 1] : items[0]

  return (
    <nav className={styles.nav}>
      <Link className={`${styles.arrow} ${styles.prev}`} href={prev.href}>◀ PREV</Link>
      <div className={styles.items}>
        {items.map(item => (
          <Link
            key={item.slug}
            className={`${styles.item} ${item.slug === activeSlug ? styles.active : ''}`}
            href={item.href}
          >
            <span className={styles.num}>{item.num}</span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        ))}
      </div>
      <Link className={`${styles.arrow} ${styles.next}`} href={next.href}>NEXT ▶</Link>
    </nav>
  )
}
