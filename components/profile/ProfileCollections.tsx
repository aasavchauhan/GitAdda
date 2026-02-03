import Link from 'next/link'
import styles from '@/app/profile/[username]/page.module.css'

interface ProfileCollectionsProps {
    collections: any[]
}

export default function ProfileCollections({ collections }: ProfileCollectionsProps) {
    if (!collections || collections.length === 0) {
        return (
            <div className={styles.empty} style={{ gridColumn: '1 / -1' }}>
                <p>No public collections yet</p>
            </div>
        )
    }

    return (
        <div className={styles.grid}>
            {collections.map((col: any) => (
                <Link href={`/collections/${col.id}`} key={col.id} className={styles.repoCard}>
                    <div className={styles.repoHeader}>
                        <h3 className={styles.repoName}>{col.name}</h3>
                        <span className={styles.useCase} style={{ background: '#3b82f6', color: 'white' }}>
                            Collection
                        </span>
                    </div>
                    <p className={styles.repoDesc}>{col.description || 'No description'}</p>
                    <div className={styles.repoStats}>
                        <span className={styles.date}>{new Date(col.created_at).toLocaleDateString()}</span>
                        {/* Optional: Add item count if available in collection data */}
                    </div>
                </Link>
            ))}
        </div>
    )
}
