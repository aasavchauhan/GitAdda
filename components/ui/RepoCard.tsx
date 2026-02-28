import Link from 'next/link'
import Image from 'next/image'
import { Icons } from '@/components/ui/Icons'
import styles from './RepoCard.module.css'
import QuickSaveButton from '@/components/collections/QuickSaveButton'
import { Suspense } from 'react'
import QuickSaveResolver from '@/components/collections/QuickSaveResolver'
import { QuickSaveButtonSkeleton } from '@/components/collections/QuickSaveButtonSkeleton'
import { getUserDataForQuickSave } from '@/app/actions/collections'
import LikeButton from '@/components/ui/LikeButton'
import { freshnessScore, freshnessLabel, getLanguageColor } from '@/lib/github'

interface RepoCardProps {
    id: string
    name: string
    owner: string
    description: string | null
    stars: number
    forks: number
    use_case?: string | null
    purpose?: string | null
    languages?: string[]
    userCollections?: any[]
    initialSavedCollectionIds?: string[]
    quickSaveDataPromise?: ReturnType<typeof getUserDataForQuickSave>
    primary_language?: string | null
    last_updated?: string | null
    likeData?: { count: number; isLiked: boolean }
}

export default function RepoCard({
    id,
    name,
    owner,
    description,
    stars,
    forks,
    use_case,
    purpose,
    languages,
    userCollections = [],
    initialSavedCollectionIds = [],
    quickSaveDataPromise,
    primary_language,
    last_updated,
    likeData
}: RepoCardProps) {
    const freshScore = freshnessScore(last_updated || null)
    const fresh = freshnessLabel(freshScore)
    const ogUrl = `https://opengraph.githubassets.com/1/${owner}/${name}`

    // Clean text for comparison
    const cleanDesc = (description || '').toLowerCase().trim()
    const cleanPurpose = (purpose || '').toLowerCase().trim()

    // Don't show purpose if it's very similar to description start
    const showPurpose = purpose &&
        cleanPurpose !== cleanDesc &&
        !cleanDesc.startsWith(cleanPurpose.substring(0, 20)) // extensive check

    return (
        <div className={styles.cardWrapper}>
            <Link href={`/repo/${id}`} className={styles.card} prefetch={true}>
                {/* Social Preview Image */}
                <div className={styles.coverImage}>
                    <Image
                        src={ogUrl}
                        alt={`${name} preview`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        loading="lazy"
                    />
                </div>

                <div className={styles.header}>
                    <Image
                        src={`https://github.com/${owner}.png`}
                        alt={`${owner} avatar`}
                        width={40}
                        height={40}
                        className={styles.thumb}
                        loading="lazy"
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
                        {(primary_language || (languages && languages.length > 0)) && (
                            <span className={styles.language}>
                                <span
                                    className={styles.langDot}
                                    style={{ backgroundColor: getLanguageColor(primary_language || languages?.[0] || null) }}
                                />
                                {primary_language || languages?.[0]}
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
            </Link >
            <div className={styles.actions}>
                <LikeButton repoId={id} initialLikes={likeData?.count ?? 0} initialIsLiked={likeData?.isLiked ?? false} hasPrefetchedData={!!likeData} />
                {quickSaveDataPromise ? (
                    <Suspense fallback={<QuickSaveButtonSkeleton />}>
                        <QuickSaveResolver
                            repoId={id}
                            promise={quickSaveDataPromise}
                        />
                    </Suspense>
                ) : (
                    <QuickSaveButton
                        repoId={id}
                        initialSavedCollectionIds={initialSavedCollectionIds}
                        userCollections={userCollections}
                    />
                )}
            </div>
        </div >
    )
}
