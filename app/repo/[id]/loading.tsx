import styles from './page.module.css'

export default function Loading() {
    return (
        <div className={styles.main}>
            <div className={styles.container}>
                {/* Header Skeleton */}
                <div className={styles.header} style={{ animation: 'pulse 1.5s infinite' }}>
                    <div style={{ width: '60%', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '16px' }} />
                    <div style={{ width: '40%', height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                </div>

                <div className={styles.grid}>
                    {/* Main Content Skeleton */}
                    <div className={styles.content}>
                        <div className={styles.readme} style={{ height: '400px', background: 'rgba(10, 15, 26, 0.4)', borderRadius: '24px', padding: '40px' }}>
                            <div style={{ width: '100%', height: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '12px' }} />
                            <div style={{ width: '90%', height: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '12px' }} />
                            <div style={{ width: '95%', height: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '12px' }} />
                        </div>
                    </div>

                    {/* Sidebar Skeleton */}
                    <div className={styles.sidebar}>
                        <div className={styles.card} style={{ height: '200px', background: 'rgba(10, 15, 26, 0.6)', borderRadius: '24px' }} />
                        <div className={styles.card} style={{ height: '150px', background: 'rgba(10, 15, 26, 0.6)', borderRadius: '24px', marginTop: '24px' }} />
                    </div>
                </div>
            </div>
        </div>
    )
}
