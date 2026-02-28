import { createClient } from '@/lib/supabase/server'
import RepoCard from '@/components/ui/RepoCard'
import { getUserDataForQuickSave } from '@/app/actions/collections'
import { getBatchLikeData } from '@/app/actions/likes'
import styles from '@/app/page.module.css'
import Link from 'next/link'

export default async function RecentRepos() {
    const supabase = await createClient()

    const { data: recentRepos } = await supabase
        .from('repositories')
        .select(`
      *,
      profiles:shared_by (username, avatar_url)
    `)
        .order('shared_at', { ascending: false })
        .limit(8)

    const repoIds = recentRepos?.map((r: any) => r.id) || []
    const [quickSaveDataPromise, likeDataMap] = await Promise.all([
        getUserDataForQuickSave(repoIds),
        getBatchLikeData(repoIds)
    ])

    if (!recentRepos || recentRepos.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p className={styles.emptyText}>No repositories shared yet.</p>
                <p className={styles.emptySubtext}>Be the first to share a hidden gem!</p>
                <Link href="/share" className={styles.emptyButton}>
                    + Share a Repository
                </Link>
            </div>
        )
    }

    return (
        <div className={styles.repoGrid}>
            {recentRepos.map((repo: any) => (
                <RepoCard
                    key={repo.id}
                    id={repo.id}
                    name={repo.name}
                    owner={repo.owner}
                    description={repo.description}
                    stars={repo.stars}
                    forks={repo.forks}
                    use_case={repo.use_case}
                    purpose={repo.purpose}
                    languages={repo.languages}
                    primary_language={repo.primary_language}
                    last_updated={repo.last_updated}
                    quickSaveDataPromise={Promise.resolve(quickSaveDataPromise)}
                    likeData={likeDataMap[repo.id]}
                />
            ))}
        </div>
    )
}

