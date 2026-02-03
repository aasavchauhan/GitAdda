'use client'

import Link from 'next/link'
import { Icons } from '@/components/ui/Icons'
import styles from '@/components/ui/RepoCard.module.css'
import LikeButton from '@/components/ui/LikeButton'
import QuickSaveButton from '@/components/collections/QuickSaveButton'

interface RepoCardClientProps {
    id: string
    name: string
    owner: string
    description: string | null
    stars: number
    forks: number
    use_case?: string | null
    purpose?: string | null
}

export default function RepoCardClient({
    id,
    name,
    owner,
    description,
    stars,
    forks,
    use_case,
    purpose
}: RepoCardClientProps) {
    const ogUrl = `https://opengraph.githubassets.com/1/${owner}/${name}`

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
                        {use_case && (
                            <span className={styles.useCase}>{use_case}</span>
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
                <LikeButton repoId={id} initialLikes={0} />
                <QuickSaveButton
                    repoId={id}
                    initialSavedCollectionIds={[]}
                    userCollections={[]}
                />
            </div>
        </div>
    )
}
