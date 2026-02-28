'use client'

import Link from 'next/link'
import { Icons } from '@/components/ui/Icons'
import styles from '@/components/ui/RepoCard.module.css'
import LikeButton from '@/components/ui/LikeButton'
import QuickSaveButton from '@/components/collections/QuickSaveButton'
import { freshnessScore, freshnessLabel, getLanguageColor } from '@/lib/github'

interface RepoCardClientProps {
    id: string
    name: string
    owner: string
    description: string | null
    stars: number
    forks: number
    use_case?: string | null
    purpose?: string | null
    primary_language?: string | null
    last_updated?: string | null
    likeData?: { count: number; isLiked: boolean }
}

export default function RepoCardClient({
    id,
    name,
    owner,
    description,
    stars,
    forks,
    use_case,
    purpose,
    primary_language,
    last_updated,
    likeData
}: RepoCardClientProps) {
    const ogUrl = `https://opengraph.githubassets.com/1/${owner}/${name}`
    const freshScore = freshnessScore(last_updated || null)
    const fresh = freshnessLabel(freshScore)

    // Clean text for comparison
    const cleanDesc = (description || '').toLowerCase().trim()
    const cleanPurpose = (purpose || '').toLowerCase().trim()

    // Don't show purpose if it's very similar to description start
    const showPurpose = purpose &&
        cleanPurpose !== cleanDesc &&
        !cleanDesc.startsWith(cleanPurpose.substring(0, 20))

    return (
        <div className={styles.cardWrapper}>
            <Link href={`/repo/${id}`} className={styles.card}>
                {/* Social Preview Image */}
                <div className={styles.coverImage}>
                    <img
                        src={ogUrl}
                        alt={`${name} preview`}
                        loading="lazy"
                    />
                </div>

                <div className={styles.header}>
                    <img
                        src={`https://github.com/${owner}.png`}
                        alt={`${owner} avatar`}
                        className={styles.thumb}
                    />
                    <div className={styles.info}>
                        <h3 className={styles.name}>{name}</h3>
                        <div className={styles.user}>
                            <span>by {owner}</span>
                        </div>
                    </div>
                </div>

                <p className={styles.desc}>{description || 'No description provided.'}</p>

                {showPurpose && (
                    <div className={styles.purpose}>
                        "{purpose!.length > 80 ? purpose!.substring(0, 80) + '...' : purpose}"
                    </div>
                )}

                <div className={styles.meta}>
                    <div className={styles.badges}>
                        {last_updated && (
                            <span className={`${styles.freshness} ${styles[fresh.level]}`}>
                                <span className={styles.freshnessDot} />
                                {fresh.label}
                            </span>
                        )}
                        {use_case && (
                            <span className={styles.useCase}>{use_case}</span>
                        )}
                        {primary_language && (
                            <span className={styles.language}>
                                <span
                                    className={styles.langDot}
                                    style={{ backgroundColor: getLanguageColor(primary_language) }}
                                />
                                {primary_language}
                            </span>
                        )}
                    </div>

                    <div className={styles.stats}>
                        <span className={styles.statItem} title={`${stars} Stars`}>
                            <Icons.Star className="w-4 h-4" />
                            {stars || 0}
                        </span>
                        <span className={styles.statItem} title={`${forks} Forks`}>
                            <Icons.GitFork className="w-4 h-4" />
                            {forks || 0}
                        </span>
                        <div className={styles.spacer} />
                    </div>
                </div>
            </Link>
            <div className={styles.actions}>
                <LikeButton repoId={id} initialLikes={likeData?.count ?? 0} initialIsLiked={likeData?.isLiked ?? false} hasPrefetchedData={!!likeData} />
                <QuickSaveButton
                    repoId={id}
                    initialSavedCollectionIds={[]}
                    userCollections={[]}
                />
            </div>
        </div>
    )
}
