import { fetchPaginatedRepos } from '@/app/actions/explore'
import InfiniteRepoGrid from './InfiniteRepoGrid'
import styles from '@/app/explore/page.module.css'

interface ExploreRepoListProps {
    query?: string
    useCase?: string
}

export default async function ExploreRepoList({ query = '', useCase = '' }: ExploreRepoListProps) {
    // Fetch initial page on the server
    const { repos, hasMore } = await fetchPaginatedRepos({ query, useCase, page: 0 })

    if (!repos || repos.length === 0) {
        const SUGGESTED_TAGS = ['React', 'Next.js', 'TypeScript', 'AI', 'Tools', 'Design']

        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIconWrapper}>
                    <span className={styles.emptyIcon}>🔍</span>
                </div>
                <h3 className={styles.emptyTitle}>No repositories found</h3>
                <p className={styles.emptyDesc}>We couldn't find anything matching your criteria.</p>

                <div className={styles.suggestions}>
                    <p className={styles.suggestionsLabel}>Try searching for:</p>
                    <div className={styles.tags}>
                        {SUGGESTED_TAGS.map(tag => (
                            <a key={tag} href={`/explore?q=${tag}`} className={styles.tag}>
                                {tag}
                            </a>
                        ))}
                    </div>
                </div>

                <a href="/explore" className={styles.clearBtn}>
                    Clear all filters
                </a>
            </div>
        )
    }

    return (
        <InfiniteRepoGrid
            initialRepos={repos}
            query={query}
            useCase={useCase}
            hasMore={hasMore}
        />
    )
}
