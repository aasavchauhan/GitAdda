'use server'

import { createClient } from '@/lib/supabase/server'

export interface Notification {
    id: string
    user_id: string
    type: 'like' | 'follow' | 'comment'
    title: string
    message: string | null
    actor_id: string | null
    target_id: string | null
    target_type: 'repo' | 'comment' | 'profile' | null
    read: boolean
    created_at: string
    // Joined data
    actor?: {
        username: string
        avatar_url: string | null
    }
}

export async function getNotifications(limit = 20) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { notifications: [], unreadCount: 0 }

    const { data, error } = await supabase
        .from('notifications')
        .select(`
            *,
            actor:profiles!notifications_actor_id_fkey(username, avatar_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) {
        console.error('Failed to fetch notifications:', error)
        return { notifications: [], unreadCount: 0 }
    }

    // Get unread count
    const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false)

    return {
        notifications: (data || []) as Notification[],
        unreadCount: count || 0,
    }
}

export async function markAsRead(notificationId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id)

    return !error
}

export async function markAllRead() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)

    return !error
}

export async function getUnreadCount() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0

    const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false)

    return count || 0
}
