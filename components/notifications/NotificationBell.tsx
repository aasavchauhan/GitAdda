'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getNotifications, markAsRead, markAllRead, type Notification } from '@/app/actions/notifications'
import { Icons } from '@/components/ui/Icons'
import Link from 'next/link'
import styles from './NotificationBell.module.css'

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Fetch notifications on mount
    const fetchNotifications = useCallback(async () => {
        setLoading(true)
        const result = await getNotifications(15)
        setNotifications(result.notifications)
        setUnreadCount(result.unreadCount)
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications])

    // Subscribe to realtime notifications (filtered by user_id)
    useEffect(() => {
        const supabase = createClient()

        let channel: any = null

        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return

            channel = supabase
                .channel(`notifications-${user.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        const newNotification = payload.new as Notification
                        setNotifications(prev => [newNotification, ...prev].slice(0, 15))
                        setUnreadCount(prev => prev + 1)
                    }
                )
                .subscribe()
        })

        return () => {
            if (channel) {
                const supabase = createClient()
                supabase.removeChannel(channel)
            }
        }
    }, [])

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleMarkRead = async (id: string) => {
        await markAsRead(id)
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
    }

    const handleMarkAllRead = async () => {
        await markAllRead()
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
    }

    const getNotificationLink = (n: Notification) => {
        if (n.target_type === 'repo' && n.target_id) return `/repo/${n.target_id}`
        if (n.target_type === 'profile' && n.actor?.username) return `/profile/${n.actor.username}`
        return '#'
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'like': return <Icons.Heart />
            case 'follow': return <Icons.Users />
            case 'comment': return <Icons.BookOpen />
            default: return <Icons.Bell />
        }
    }

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return 'now'
        if (mins < 60) return `${mins}m`
        const hours = Math.floor(mins / 60)
        if (hours < 24) return `${hours}h`
        const days = Math.floor(hours / 24)
        return `${days}d`
    }

    return (
        <div className={styles.wrapper} ref={dropdownRef}>
            <button
                className={styles.bellBtn}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
            >
                <Icons.Bell />
                {unreadCount > 0 && (
                    <span className={styles.badge}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.header}>
                        <h3 className={styles.headerTitle}>Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead} className={styles.markAllBtn}>
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className={styles.list}>
                        {loading && notifications.length === 0 ? (
                            <div className={styles.empty}>Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className={styles.empty}>
                                <Icons.Bell />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <Link
                                    key={n.id}
                                    href={getNotificationLink(n)}
                                    className={`${styles.item} ${!n.read ? styles.unread : ''}`}
                                    onClick={() => {
                                        if (!n.read) handleMarkRead(n.id)
                                        setIsOpen(false)
                                    }}
                                >
                                    <div className={`${styles.typeIcon} ${styles[n.type]}`}>
                                        {getIcon(n.type)}
                                    </div>
                                    <div className={styles.itemContent}>
                                        <p className={styles.itemMessage}>{n.message}</p>
                                        <span className={styles.itemTime}>{timeAgo(n.created_at)}</span>
                                    </div>
                                    {!n.read && <div className={styles.unreadDot} />}
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
