import { createClient } from '@/lib/supabase/server'
import RepoCard from '@/components/ui/RepoCard'
import { getUserDataForQuickSave } from '@/app/actions/collections'
// We need to import the styles from the page module to reuse grid layout
// However, importing page.module.css might work but ideally we'd pass classNames or use a shared component.
// For now, let's assume we can import it or just use inline styles for the grid if necessary?
// Actually, since this is a server component rendered INSIDE page.tsx, we can't easily use page.module.css classes unless we pass them or duplicate.
// But wait, page.module.css is largely specific to the page layout.
// The grid class `.repoGrid` is what we need.
// Let's modify app/page.tsx to export the styles? No.
// We should import the styles here.
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
    const quickSaveDataPromise = getUserDataForQuickSave(repoIds)

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
                    quickSaveDataPromise={quickSaveDataPromise}
                />
            ))}
        </div>
    )
}
