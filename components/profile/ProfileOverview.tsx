'use client'

import styles from './ProfileOverview.module.css'
import RepoCardClient from '@/components/explore/RepoCardClient'
import { motion } from 'framer-motion'
import { Star, GitFork, Activity } from 'lucide-react'

// Define types locally for now, usually should be in a centralized types file
interface Repository {
    id: string
    name: string
    description: string | null
    stars: number
    forks: number
    language: string | null
    updated_at: string
    owner: string // string username
    use_case?: string | null
    purpose?: string | null
}

interface ProfileOverviewProps {
    repos: Repository[]
    username: string
}

export default function ProfileOverview({ repos, username }: ProfileOverviewProps) {
    // Logic for "Pinned" repos - for now, take top 4 by stars
    const pinnedRepos = [...repos]
        .sort((a, b) => (b.stars || 0) - (a.stars || 0))
        .slice(0, 4)

    // Calculate aggregated stats
    const totalStars = repos.reduce((acc, repo) => acc + (repo.stars || 0), 0)
    const totalForks = repos.reduce((acc, repo) => acc + (repo.forks || 0), 0)

    return (
        <div className={styles.container}>
            {/* Quick Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(255, 215, 0, 0.1)', color: '#FFD700' }}>
                        <Star size={20} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{totalStars}</div>
                        <div className={styles.statLabel}>Total Stars</div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(0, 229, 204, 0.1)', color: 'var(--neon-cyan)' }}>
                        <GitFork size={20} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{totalForks}</div>
                        <div className={styles.statLabel}>Total Forks</div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(255, 107, 91, 0.1)', color: 'var(--accent-coral)' }}>
                        <Activity size={20} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{repos.length}</div>
                        <div className={styles.statLabel}>Repositories</div>
                    </div>
                </div>
            </div>

            {/* Pinned/Popular Repositories */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    Featured Repositories
                </h2>

                {pinnedRepos.length > 0 ? (
                    <div className={styles.pinnedGrid}>
                        {pinnedRepos.map((repo, index) => (
                            <motion.div
                                key={repo.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <RepoCardClient
                                    id={repo.id}
                                    name={repo.name}
                                    owner={repo.owner}
                                    description={repo.description}
                                    stars={repo.stars}
                                    forks={repo.forks}
                                    use_case={repo.use_case}
                                    purpose={repo.purpose}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p>No repositories to show yet.</p>
                    </div>
                )}
            </section>
        </div>
    )
}
