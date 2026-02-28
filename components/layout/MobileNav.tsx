'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Icons } from '@/components/ui/Icons'
import styles from './MobileNav.module.css'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'

const STATIC_ITEMS = [
    { href: '/', label: 'Home', icon: 'Home' as const },
    { href: '/explore', label: 'Explore', icon: 'Search' as const },
    { href: '/share', label: 'Share', icon: 'Plus' as const, isFab: true },
    { href: '/wars', label: 'Wars', icon: 'Swords' as const },
]

export default function MobileNav() {
    const pathname = usePathname()
    const [profileHref, setProfileHref] = useState('/login')

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                const username = user.user_metadata?.preferred_username
                    || user.user_metadata?.user_name
                    || user.email
                setProfileHref(`/profile/${username}`)
            }
        })
    }, [])

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    const allItems = [
        ...STATIC_ITEMS,
        { href: profileHref, label: 'Profile', icon: 'User' as const },
    ]

    return (
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
            {allItems.map((item) => {
                const IconComponent = Icons[item.icon]
                const active = isActive(item.href)

                if ('isFab' in item && item.isFab) {
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={styles.fab}
                            aria-label={item.label}
                        >
                            <div className={styles.fabInner}>
                                <IconComponent />
                            </div>
                        </Link>
                    )
                }

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${active ? styles.active : ''}`}
                        aria-label={item.label}
                    >
                        <IconComponent />
                        <span className={styles.navLabel}>{item.label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}
