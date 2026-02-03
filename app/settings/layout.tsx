import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from './layout.module.css'
import { User, Settings, Shield } from 'lucide-react'

export default async function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>Settings</h2>
                </div>
                <nav className={styles.nav}>
                    <Link href="/settings/profile" className={styles.navLink}>
                        <User size={18} />
                        Profile
                    </Link>
                    <Link href="/settings/account" className={styles.navLink}>
                        <Shield size={18} />
                        Account
                    </Link>
                    <Link href="/settings/preferences" className={styles.navLink}>
                        <Settings size={18} />
                        Preferences
                    </Link>
                </nav>
            </aside>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    )
}
