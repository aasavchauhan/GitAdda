'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleLike(repoId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Authenticated user required')
    }

    // Check if already liked
    const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('repository_id', repoId)
        .single()

    if (existingLike) {
        // UNLIKE
        const { error } = await supabase
            .from('likes')
            .delete()
            .eq('id', existingLike.id)

        if (error) throw error
        return { isLiked: false }
    } else {
        // LIKE
        const { error } = await supabase
            .from('likes')
            .insert({
                user_id: user.id,
                repository_id: repoId
            })

        if (error) throw error
        return { isLiked: true }
    }
}

export async function getLikeStatus(repoId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Get Total Likes Count
    const { count, error: countError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('repository_id', repoId)

    if (countError) throw countError

    let isLiked = false

    // Check if current user liked it
    if (user) {
        const { data } = await supabase
            .from('likes')
            .select('id')
            .eq('user_id', user.id)
            .eq('repository_id', repoId)
            .single()

        if (data) isLiked = true
    }

    return {
        count: count || 0,
        isLiked
    }
}

/**
 * Batch-fetch like data for multiple repos in 2 queries (instead of 2 per card).
 * Returns { [repoId]: { count, isLiked } }
 */
export async function getBatchLikeData(repoIds: string[]): Promise<Record<string, { count: number; isLiked: boolean }>> {
    if (repoIds.length === 0) return {}

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Query 1: Get all likes for these repos (to count)
    const { data: allLikes, error: likesError } = await supabase
        .from('likes')
        .select('repository_id')
        .in('repository_id', repoIds)

    if (likesError) {
        console.error('Error batch-fetching likes:', likesError)
        return {}
    }

    // Aggregate counts
    const result: Record<string, { count: number; isLiked: boolean }> = {}
    for (const id of repoIds) {
        result[id] = { count: 0, isLiked: false }
    }
    for (const like of allLikes || []) {
        if (result[like.repository_id]) {
            result[like.repository_id].count++
        }
    }

    // Query 2: If logged in, check which repos the user liked
    if (user) {
        const { data: userLikes } = await supabase
            .from('likes')
            .select('repository_id')
            .eq('user_id', user.id)
            .in('repository_id', repoIds)

        for (const like of userLikes || []) {
            if (result[like.repository_id]) {
                result[like.repository_id].isLiked = true
            }
        }
    }

    return result
}
