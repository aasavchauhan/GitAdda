
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import styles from './page.module.css'
import { Icons } from '@/components/ui/Icons'

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                    }
                },
            },
        }
    )

    const { data: repos } = await supabase
        .from('repositories')
        .select(`
            *,
            profiles:shared_by (username, avatar_url)
        `)
        .order('elo_rating', { ascending: false })
        .limit(50)

    if (!repos) return null

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <Link href="/wars" className={styles.subtitle} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', textDecoration: 'none' }}>
                        <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}>
                            <Icons.ArrowRight />
                        </span>
                        Back to Wars
                    </Link>
                    <h1 className={styles.title}>Hall of Fame</h1>
                    <p className={styles.subtitle}>Top rated repositories by the community.</p>
                </div>

                <div className={styles.leaderboard}>
                    <div className={styles.tableHeader}>
                        <div className={styles.rank}>#</div>
                        <div>Repository</div>
                        <div>ELO Rating</div>
                        <div className={styles.matchesHidden}>Matches</div>
                        <div className={styles.actionHidden}></div>
                    </div>

                    <div className={styles.rows}>
                        {repos.map((repo, index) => (
                            <Link href={`/repo/${repo.id}`} key={repo.id} className={styles.row}>
                                <div className={styles.rank}>
                                    <span className={`${styles.rankNumber} ${index === 0 ? styles.topRank : index === 1 ? styles.topRank2 : index === 2 ? styles.topRank3 : ''}`}>
                                        {index === 0 ? '👑' : index + 1}
                                    </span>
                                </div>
                                <div className={styles.repoInfo}>
                                    <img
                                        src={`https://github.com/${repo.owner}.png`}
                                        alt={repo.owner}
                                        className={styles.avatar}
                                    />
                                    <div className={styles.repoDetails}>
                                        <span className={styles.repoName}>{repo.name}</span>
                                        <span className={styles.repoOwner}>{repo.owner}</span>
                                    </div>
                                </div>
                                <div className={styles.stat}>{repo.elo_rating}</div>
                                <div className={`${styles.matches} ${styles.matchesHidden}`}>{repo.matches_played} matches</div>
                                <div className={`${styles.action} ${styles.actionHidden}`}>
                                    <div className={styles.arrow}><Icons.ArrowRight /></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
