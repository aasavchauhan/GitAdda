
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BulkImport from './BulkImport'
import styles from './page.module.css'

// Admin users by GitHub username — add your username here
const ADMIN_USERNAMES = ['aasavchauhan', 'AasavChauhan']

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Role-based access check via GitHub username
    const githubUsername = user.user_metadata?.preferred_username
        || user.user_metadata?.user_name

    if (!githubUsername || !ADMIN_USERNAMES.includes(githubUsername)) {
        redirect('/')
    }

    const accessToken = user.user_metadata?.provider_token || null

    return (
        <main className={styles.main}>
            <BulkImport userId={user.id} accessToken={accessToken} />
        </main>
    )
}
