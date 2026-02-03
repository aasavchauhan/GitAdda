import styles from './page.module.css'
import ExploreFilters from './ExploreFilters'
import ExploreRepoList from '@/components/explore/ExploreRepoList'
import { Suspense } from 'react'
import RepoCardSkeleton from '@/components/ui/RepoCardSkeleton'

interface ExplorePageProps {
    searchParams: Promise<{ q?: string; use_case?: string }>
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
    const { q: query = '', use_case: useCase = '' } = await searchParams

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                {/* Search Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Explore Repositories</h1>
                    <p className={styles.subtitle}>
                        {useCase ? `Showing ${useCase.replace('-', '/')} repositories` :
                            query ? `Search results for "${query}"` :
                                'Discover curated repositories for your next project'}
                    </p>
                </div>

                {/* Client-side Search & Filters */}
                <ExploreFilters />

                {/* Repository Grid */}
                <Suspense fallback={
                    <div className={styles.grid}>
                        {Array(8).fill(0).map((_, i) => (
                            <RepoCardSkeleton key={i} />
                        ))}
                    </div>
                }>
                    <ExploreRepoList query={query} useCase={useCase} />
                </Suspense>
            </div>
        </main>
    )
}
