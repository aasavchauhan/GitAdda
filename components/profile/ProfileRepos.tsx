import { createClient } from '@/lib/supabase/server'
import RepoCard from '@/components/ui/RepoCard'
import { getUserDataForQuickSave } from '@/app/actions/collections'
import styles from '@/app/profile/[username]/page.module.css'
import Link from 'next/link'

interface ProfileReposProps {
    repositories: any[]
    username: string
    limit?: number
    totalCount: number
    quickSaveDataPromise: Promise<any>
}

export default function ProfileRepos({
    repositories,
    username,
    limit = 8,
    totalCount,
    quickSaveDataPromise
}: ProfileReposProps) {
    if (!repositories || repositories.length === 0) {
        return (
            <div className={styles.empty}>
                <p>No repositories shared yet</p>
            </div>
        )
    }

    const hasMore = totalCount > limit
    const remaining = totalCount - limit

    return (
        <>
            <div className={styles.grid}>
                {repositories.map((repo: any) => (
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
                        quickSaveDataPromise={quickSaveDataPromise}
                    />
                ))}
            </div>

            {hasMore && (
                <div className={styles.viewAllWrapper}>
                    <Link href={`/profile/${username}?tab=repos`} className={styles.viewAllButton}>
                        <span>View All Repositories</span>
                        <span className={styles.viewAllCount}>{remaining} more</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            )}
        </>
    )
}
