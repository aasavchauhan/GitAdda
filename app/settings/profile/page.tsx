import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import ProfileSettingsForm from '@/components/settings/ProfileSettingsForm'

export default async function ProfileSettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile) {
        notFound()
    }

    return <ProfileSettingsForm profile={profile} />
}
