'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    // Parse tech stack from comma-separated string
    const techStackRaw = formData.get('tech_stack') as string
    const techStack = techStackRaw
        ? techStackRaw.split(',').map(t => t.trim()).filter(Boolean)
        : []

    const updates: Record<string, any> = {
        full_name: formData.get('full_name') as string || null,
        bio: formData.get('bio') as string || null,
        tech_stack: techStack,
        open_to_collab: formData.get('open_to_collab') === 'on',
        looking_for_contributors: formData.get('looking_for_contributors') === 'on',
        updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

    if (error) {
        console.error('Error updating profile:', error)
        throw new Error('Failed to update profile')
    }

    const username = user.user_metadata?.preferred_username || user.user_metadata?.user_name
    if (username) {
        revalidatePath(`/profile/${username}`)
    }
    revalidatePath('/profile/[username]', 'page')
    revalidatePath('/settings/profile')

    return { success: true }
}

export async function deleteAccount() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    // Delete user data cascade - comments, likes, collections, follows
    // Note: In production, use a service role client for full cascade deletion
    // For now, sign out and rely on DB cascade constraints
    await supabase.from('comments').delete().eq('user_id', user.id)
    await supabase.from('likes').delete().eq('user_id', user.id)
    await supabase.from('collection_items').delete().in(
        'collection_id',
        (await supabase.from('collections').select('id').eq('created_by', user.id)).data?.map(c => c.id) || []
    )
    await supabase.from('collections').delete().eq('created_by', user.id)
    await supabase.from('follows').delete().or(`follower_id.eq.${user.id},following_id.eq.${user.id}`)
    await supabase.from('profiles').delete().eq('id', user.id)

    await supabase.auth.signOut()
    redirect('/')
}
