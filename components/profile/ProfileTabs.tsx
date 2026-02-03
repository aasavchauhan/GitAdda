'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import styles from './ProfileTabs.module.css'
import { LayoutGrid, Book, Bookmark } from 'lucide-react'

interface ProfileTabsProps {
    counts: {
        repos: number
        collections: number
    }
}

export default function ProfileTabs({ counts }: ProfileTabsProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Default to 'overview' if no tab param is present
    const currentTab = searchParams.get('tab') || 'overview'

    const tabs = [
        {
            id: 'overview',
            label: 'Overview',
            icon: LayoutGrid,
            count: null
        },
        {
            id: 'repos',
            label: 'Repositories',
            icon: Book,
            count: counts.repos
        },
        {
            id: 'collections',
            label: 'Collections',
            icon: Bookmark,
            count: counts.collections
        }
    ]

    const handleTabChange = (tabId: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('tab', tabId)
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <div className={styles.container}>
            <div className={styles.tabsList}>
                {tabs.map((tab) => {
                    const isActive = currentTab === tab.id
                    const Icon = tab.icon

                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`${styles.tab} ${isActive ? styles.active : ''}`}
                        >
                            <span className={styles.tabContent}>
                                <Icon size={18} />
                                <span>{tab.label}</span>
                                {tab.count !== null && (
                                    <span className={styles.countBadge}>
                                        {tab.count}
                                    </span>
                                )}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className={styles.activeIndicator}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
