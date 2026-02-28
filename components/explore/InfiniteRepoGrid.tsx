'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { fetchPaginatedRepos, RepoData, SortOption } from '@/app/actions/explore'
import RepoCardClient from './RepoCardClient'
import RepoCardSkeleton from '@/components/ui/RepoCardSkeleton'
import styles from '@/app/explore/page.module.css'

interface InfiniteRepoGridProps {
    initialRepos: RepoData[]
    query?: string
    useCase?: string
    sort?: string
    hasMore: boolean
    initialLikeData?: Record<string, { count: number; isLiked: boolean }>
}

export default function InfiniteRepoGrid({
    initialRepos,
    query = '',
    useCase = '',
    sort = 'recent',
    hasMore: initialHasMore,
    initialLikeData = {}
}: InfiniteRepoGridProps) {
    const [repos, setRepos] = useState<RepoData[]>(initialRepos)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(initialHasMore)
    const [isLoading, setIsLoading] = useState(false)
    const observerRef = useRef<HTMLDivElement>(null)

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return

        setIsLoading(true)
        try {
            const result = await fetchPaginatedRepos({
                query,
                useCase,
                page,
                sort: sort as SortOption
            })
            setRepos(prev => [...prev, ...result.repos])
            setHasMore(result.hasMore)
            setPage(prev => prev + 1)
        } catch (error) {
            console.error('Failed to load more repos:', error)
        } finally {
            setIsLoading(false)
        }
    }, [page, query, useCase, sort, isLoading, hasMore])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMore()
                }
            },
            { rootMargin: '400px' }
        )

        if (observerRef.current) {
            observer.observe(observerRef.current)
        }

        return () => observer.disconnect()
    }, [loadMore, hasMore, isLoading])

    // Reset when filters change
    useEffect(() => {
        setRepos(initialRepos)
        setPage(1)
        setHasMore(initialHasMore)
    }, [initialRepos, initialHasMore, query, useCase, sort])

    return (
        <>
            {repos.length === 0 && !isLoading ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🔍</div>
                    <h3 className={styles.emptyTitle}>No repositories found</h3>
                    <p className={styles.emptySub}>
                        Try adjusting your search or filters to discover more repos.
                    </p>
                </div>
            ) : (
                <>
                    <div className={styles.grid}>
                        {repos.map((repo) => (
                            <RepoCardClient
                                key={repo.id}
                                id={repo.id}
                                name={repo.name}
                                owner={repo.owner}
                                description={repo.description}
                                stars={repo.stars}
                                forks={repo.forks}
                                use_case={repo.use_case}
                                purpose={repo.purpose}
                                primary_language={repo.primary_language}
                                last_updated={repo.last_updated}
                                likeData={initialLikeData[repo.id]}
                            />
                        ))}

                        {/* Loading skeletons */}
                        {isLoading && (
                            <>
                                <RepoCardSkeleton />
                                <RepoCardSkeleton />
                                <RepoCardSkeleton />
                            </>
                        )}
                    </div>

                    {/* Infinite scroll trigger */}
                    {hasMore && <div ref={observerRef} className={styles.scrollTrigger} />}

                    {/* End of list */}
                    {!hasMore && repos.length > 0 && (
                        <div className={styles.endMessage}>
                            <span>✨</span> You've explored all repositories
                        </div>
                    )}
                </>
            )}
        </>
    )
}
