'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import RepoCard from '@/components/ui/RepoCard'
import { getUserDataForQuickSave } from '@/app/actions/collections'
import styles from './page.module.css'

const REPOS_PER_PAGE = 12

type SortOption = 'newest' | 'oldest' | 'stars' | 'forks'

interface RepoData {
    id: string
    name: string
    owner: string
    description: string
    stars: number
    forks: number
    use_case: string
    purpose: string
    languages: string[]
    shared_at: string
}

export default function ProfileReposPage() {
    const params = useParams()
    const username = params.username as string

    const [repos, setRepos] = useState<RepoData[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [totalCount, setTotalCount] = useState(0)
    const [sortBy, setSortBy] = useState<SortOption>('newest')
    const [profile, setProfile] = useState<{ id: string; full_name?: string; avatar_url?: string } | null>(null)
    const [quickSaveData, setQuickSaveData] = useState<any>(null)

    const fetchRepos = useCallback(async (reset = false) => {
        const supabase = createClient()

        // First get the profile
        if (!profile) {
            const { data: profileData } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .eq('username', username)
                .single()

            if (!profileData) return
            setProfile(profileData)

            // Get total count
            const { count } = await supabase
                .from('repositories')
                .select('*', { count: 'exact', head: true })
                .eq('shared_by', profileData.id)

            setTotalCount(count || 0)
        }

        const profileId = profile?.id || (await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .single()).data?.id

        if (!profileId) return

        const offset = reset ? 0 : repos.length

        // Build query with sort
        let query = supabase
            .from('repositories')
            .select('*')
            .eq('shared_by', profileId)
            .range(offset, offset + REPOS_PER_PAGE - 1)

        switch (sortBy) {
            case 'newest':
                query = query.order('shared_at', { ascending: false })
                break
            case 'oldest':
                query = query.order('shared_at', { ascending: true })
                break
            case 'stars':
                query = query.order('stars', { ascending: false })
                break
            case 'forks':
                query = query.order('forks', { ascending: false })
                break
        }

        const { data } = await query

        if (data) {
            const newRepos = reset ? data : [...repos, ...data]
            setRepos(newRepos)
            setHasMore(data.length === REPOS_PER_PAGE)

            // Fetch QuickSave data for new repos
            const repoIds = data.map((r: RepoData) => r.id)
            const qsData = await getUserDataForQuickSave(repoIds)

            // Merge with existing data when loading more
            if (reset || !quickSaveData) {
                setQuickSaveData(qsData)
            } else if (qsData) {
                setQuickSaveData({
                    collections: qsData.collections,
                    repoMap: { ...quickSaveData.repoMap, ...qsData.repoMap }
                })
            }
        }
    }, [username, profile, repos, sortBy])

    useEffect(() => {
        setLoading(true)
        fetchRepos(true).finally(() => setLoading(false))
    }, [username, sortBy])

    const loadMore = async () => {
        setLoadingMore(true)
        await fetchRepos(false)
        setLoadingMore(false)
    }

    const handleSortChange = (newSort: SortOption) => {
        setSortBy(newSort)
        setRepos([])
    }

    if (loading) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <p>Loading repositories...</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <Link href={`/profile/${username}`} className={styles.backLink}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Profile
                    </Link>
                    <h1 className={styles.title}>
                        {profile?.full_name || username}'s Repositories
                        <span className={styles.count}>{totalCount}</span>
                    </h1>
                </div>

                {/* Sort Options */}
                <div className={styles.controls}>
                    <div className={styles.sortGroup}>
                        <span className={styles.sortLabel}>Sort by:</span>
                        {(['newest', 'oldest', 'stars', 'forks'] as SortOption[]).map((option) => (
                            <button
                                key={option}
                                className={`${styles.sortButton} ${sortBy === option ? styles.active : ''}`}
                                onClick={() => handleSortChange(option)}
                            >
                                {option === 'newest' && '🕐 Newest'}
                                {option === 'oldest' && '📅 Oldest'}
                                {option === 'stars' && '⭐ Most Stars'}
                                {option === 'forks' && '🍴 Most Forks'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Repos Grid */}
                <div className={styles.grid}>
                    {repos.map((repo) => (
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
                            userCollections={quickSaveData?.collections || []}
                            initialSavedCollectionIds={quickSaveData?.repoMap?.[repo.id] || []}
                        />
                    ))}
                </div>

                {/* Load More */}
                {hasMore && (
                    <div className={styles.loadMoreWrapper}>
                        <button
                            className={styles.loadMoreButton}
                            onClick={loadMore}
                            disabled={loadingMore}
                        >
                            {loadingMore ? (
                                <>
                                    <div className={styles.buttonSpinner}></div>
                                    Loading...
                                </>
                            ) : (
                                <>Load More Repositories</>
                            )}
                        </button>
                    </div>
                )}

                {/* End Message */}
                {!hasMore && repos.length > 0 && (
                    <div className={styles.endMessage}>
                        <p>You've seen all {totalCount} repositories</p>
                    </div>
                )}
            </div>
        </main>
    )
}
