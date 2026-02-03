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
