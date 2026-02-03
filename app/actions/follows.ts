'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleFollow(targetUserId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Authenticated user required')
    }

    if (user.id === targetUserId) {
        throw new Error('You cannot follow yourself')
    }

    // Check if already following
    const { data: existingFollow } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single()

    if (existingFollow) {
        // UNFOLLOW
        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('id', existingFollow.id)

        if (error) throw error

        revalidatePath(`/profile/${targetUserId}`)
        return { isFollowing: false }
    } else {
        // FOLLOW
        const { error } = await supabase
            .from('follows')
            .insert({
                follower_id: user.id,
                following_id: targetUserId
            })

        if (error) throw error

        revalidatePath(`/profile/${targetUserId}`)
        return { isFollowing: true }
    }
}

export async function getFollowStatus(targetUserId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { isFollowing: false }

    const { data } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single()

    return { isFollowing: !!data }
}
