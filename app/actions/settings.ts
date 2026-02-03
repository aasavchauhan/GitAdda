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

    const updates = {
        full_name: formData.get('full_name') as string,
        bio: formData.get('bio') as string,
        location: formData.get('location') as string,
        website_url: formData.get('website_url') as string,
        github_username: formData.get('github_username') as string,
        // Parse tech stack from comma-separated string
        tech_stack: (formData.get('tech_stack') as string)
            ?.split(',')
            .map(t => t.trim())
            .filter(Boolean),
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

    revalidatePath(`/profile/${user.user_metadata.preferred_username || user.email}`)
    revalidatePath('/profile/[username]', 'page')

    return { success: true }
}

export async function deleteAccount() {
    const supabase = await createClient()

    // In a real production app, you would use a service role client to delete the user:
    // const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    // For this implementation, we will sign the user out to simulate deletion access.
    await supabase.auth.signOut()
    redirect('/')
}
