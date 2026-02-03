
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BulkImport from './BulkImport'
import styles from './page.module.css'

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Optional: Add strict admin check here if you add an 'role' column to profiles
    // For now, we assume if you know this URL, you are the admin (Dev phase)

    const accessToken = user.user_metadata?.provider_token || null

    return (
        <main className={styles.main}>
            <BulkImport userId={user.id} accessToken={accessToken} />
        </main>
    )
}
