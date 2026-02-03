import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Icons } from '@/components/ui/Icons'
import styles from './Navbar.module.css'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let profile = null
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', user.id)
            .single()
        profile = data
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}><Icons.Logo /></span>
                    <span className={styles.logoText}>GitAdda</span>
                </Link>

                {/* Center Navigation */}
                <div className={styles.nav}>
                    <Link href="/explore" className={styles.navLink}>Explore</Link>
                    <Link href="/wars" className={styles.navLink}>Wars <Icons.Swords /></Link>
                    <Link href="/collections" className={styles.navLink}>Collections</Link>
                    <Link href="/developers" className={styles.navLink}>Developers</Link>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    {user ? (
                        <>
                            <Link href="/share" className={styles.shareBtn}>
                                <Icons.Plus /> Share
                            </Link>
                            <Link href={`/profile/${profile?.username || user.id}`} className={styles.avatar}>
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className={styles.avatarImg} />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        {profile?.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                )}
                            </Link>
                        </>
                    ) : (
                        <Link href="/login" className={styles.loginBtn}>
                            <Icons.GitHub />
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
