import styles from './page.module.css'

export default function Loading() {
    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div style={{ width: '200px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '16px' }} />
                    <div style={{ width: '300px', height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                </div>

                <div className={styles.filters}>
                    <div style={{ width: '100%', height: '50px', background: 'rgba(10, 15, 26, 0.6)', borderRadius: '12px', marginBottom: '24px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} style={{ width: '80px', height: '32px', background: 'rgba(10, 15, 26, 0.6)', borderRadius: '99px' }} />
                        ))}
                    </div>
                </div>

                <div className={styles.grid}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className={styles.card} style={{ height: '240px', animation: 'pulse 1.5s infinite' }}>
                            <div style={{ width: '60%', height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '12px' }} />
                            <div style={{ width: '40%', height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '24px' }} />
                            <div style={{ width: '100%', height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '8px' }} />
                            <div style={{ width: '80%', height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
