'use client'

import { LogOut, Settings, Share2, UserPen } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut } from '@/app/actions/auth'
import styles from './ProfileDock.module.css'

export default function ProfileDock() {
    const [isSharing, setIsSharing] = useState(false)
    const router = useRouter()

    const handleShare = async () => {
        setIsSharing(true)
        try {
            await navigator.clipboard.writeText(window.location.href)
            // You could add a toast here
            setTimeout(() => setIsSharing(false), 2000)
        } catch (err) {
            console.error('Failed to copy', err)
            setIsSharing(false)
        }
    }

    return (
        <div className={styles.dockContainer}>
            <Link
                href="/settings/profile"
                className={styles.dockItem}
                data-tooltip="Edit Profile"
            >
                <UserPen size={20} />
            </Link>

            <Link
                href="/settings"
                className={styles.dockItem}
                data-tooltip="Settings"
            >
                <Settings size={20} />
            </Link>

            <button
                className={`${styles.dockItem} ${isSharing ? styles.active : ''}`}
                onClick={handleShare}
                data-tooltip={isSharing ? "Copied!" : "Share Profile"}
            >
                <Share2 size={20} />
            </button>

            <div className={styles.separator} />

            <button
                className={`${styles.dockItem} ${styles.danger}`}
                onClick={() => signOut()}
                data-tooltip="Logout"
            >
                <LogOut size={20} />
            </button>
        </div>
    )
}
