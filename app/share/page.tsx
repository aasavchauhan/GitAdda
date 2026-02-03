import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ShareForm from '@/app/share/ShareForm'
import styles from './page.module.css'

export default async function SharePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user's GitHub username from profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('username, github_url')
        .eq('id', user.id)
        .single()

    // Extract GitHub username from user metadata or profile
    const githubUsername = user.user_metadata?.user_name ||
        user.user_metadata?.preferred_username ||
        profile?.username

    // Get the provider token if available (for authenticated GitHub API calls)
    const accessToken = user.user_metadata?.provider_token || null

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Share a Repository</h1>
                    <p className={styles.subtitle}>
                        Select from your repos or paste any GitHub URL
                    </p>
                </div>

                <ShareForm
                    userId={user.id}
                    accessToken={accessToken}
                    githubUsername={githubUsername}
                />
            </div>
        </main>
    )
}
