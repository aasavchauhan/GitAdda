import styles from './Navbar.module.css'
import { Icons } from '@/components/ui/Icons'
import Link from 'next/link'

export default function NavbarSkeleton() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {/* Logo */}
                <div className={styles.logo}>
                    <span className={styles.logoIcon}><Icons.Logo /></span>
                    <span className={styles.logoText}>GitAdda</span>
                </div>

                {/* Center Navigation */}
                <div className={styles.nav}>
                    <Link href="/explore" className={styles.navLink}>Explore</Link>
                    <Link href="/wars" className={styles.navLink}>Wars <Icons.Swords /></Link>
                    <Link href="/collections" className={styles.navLink}>Collections</Link>
                    <Link href="/developers" className={styles.navLink}>Developers</Link>
                </div>

                {/* Actions Skeleton */}
                <div className={styles.actions}>
                    <div style={{
                        width: '100px',
                        height: '40px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '6px'
                    }} />
                    <div className={styles.avatar} style={{ background: 'rgba(255,255,255,0.05)' }} />
                </div>
            </div>
        </nav>
    )
}
