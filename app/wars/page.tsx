import { createClient } from '@/lib/supabase/server'
import Arena from './Arena'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function RepoWars() {
    const supabase = await createClient()

    // Fetching 2 random repos via RPC for a fair match
    const { data: repos, error } = await supabase.rpc('get_war_pair')

    if (error || !repos || repos.length < 2) {
        return (
            <div className={styles.main}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Repo Wars</h1>
                    <p className={styles.subtitle}>Not enough contenders for a battle yet!</p>
                </div>
            </div>
        )
    }

    const repo1 = repos[0]
    const repo2 = repos[1]

    return <Arena
        repo1={repo1}
        repo2={repo2}
    />
}
