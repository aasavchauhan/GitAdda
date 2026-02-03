'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Comment = {
    id: string
    content: string
    created_at: string
    user_id: string
    profiles: {
        username: string
        avatar_url: string | null
    }
}

export async function addComment(repoId: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Authenticated user required')
    }

    if (!content.trim()) {
        throw new Error('Comment cannot be empty')
    }

    const { error } = await supabase
        .from('comments')
        .insert({
            user_id: user.id,
            repository_id: repoId,
            content: content.trim()
        })

    if (error) throw error

    revalidatePath(`/repo/${repoId}`)
    return { success: true }
}

export async function getComments(repoId: string) {
    const supabase = await createClient()

    // We need to type cast the response because Supabase types might not perfectly infer the joined structure deep down
    const { data, error } = await supabase
        .from('comments')
        .select(`
            id,
            content,
            created_at,
            user_id,
            profiles:user_id (
                username,
                avatar_url
            )
        `)
        .eq('repository_id', repoId)
        .order('created_at', { ascending: false })

    if (error) throw error

    return data as any as Comment[]
}

export async function deleteComment(commentId: string, repoId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id)

    if (error) throw error

    revalidatePath(`/repo/${repoId}`)
    return { success: true }
}
