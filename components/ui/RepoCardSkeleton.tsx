import styles from './RepoCard.module.css'

export default function RepoCardSkeleton() {
    return (
        <div className={styles.cardWrapper}>
            <div className={styles.card}>
                {/* Cover Image Skeleton */}
                <div className={`${styles.coverImage} ${styles.skeleton}`} style={{ height: '160px', opacity: 0.5 }} />

                {/* Header Skeleton */}
                <div className={styles.header}>
                    <div className={`${styles.thumb} ${styles.skeleton}`} />
                    <div className={styles.info}>
                        <div className={`${styles.name} ${styles.skeleton}`} style={{ width: '70%', height: '24px' }} />
                        <div className={`${styles.user} ${styles.skeleton}`} style={{ width: '40%', height: '16px' }} />
                    </div>
                </div>

                {/* Description Skeleton */}
                <div className={styles.desc}>
                    <div className={styles.skeletonText} style={{ width: '100%' }} />
                    <div className={styles.skeletonText} style={{ width: '90%' }} />
                    <div className={styles.skeletonText} style={{ width: '60%' }} />
                </div>

                {/* Purpose Skeleton */}
                <div className={`${styles.purpose} ${styles.skeleton}`} style={{ height: '40px', border: 'none' }} />

                {/* Meta Skeleton */}
                <div className={styles.meta}>
                    <div className={styles.badges}>
                        <div className={`${styles.useCase} ${styles.skeleton}`} style={{ width: '60px', height: '20px', background: 'transparent' }} />
                        <div className={`${styles.language} ${styles.skeleton}`} style={{ width: '50px', height: '20px', background: 'transparent' }} />
                    </div>
                    <div className={styles.stats}>
                        <div className={`${styles.statItem} ${styles.skeleton}`} style={{ width: '30px', height: '16px' }} />
                        <div className={`${styles.statItem} ${styles.skeleton}`} style={{ width: '30px', height: '16px' }} />
                    </div>
                </div>
            </div>
        </div>
    )
}
