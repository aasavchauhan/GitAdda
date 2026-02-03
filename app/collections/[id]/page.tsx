import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Icons } from '@/components/ui/Icons'
import styles from './page.module.css'
import RepoCard from '@/components/ui/RepoCard'
import { getUserDataForQuickSave } from '@/app/actions/collections'

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch collection info
    const { data: collection, error } = await supabase
        .from('collections')
        .select(`
            *,
            profiles:created_by (username, avatar_url)
        `)
        .eq('id', id)
        .single()

    if (error || !collection) return notFound()

    // Fetch items
    const { data: items } = await supabase
        .from('collection_items')
        .select(`
            *,
            repository:repository_id (*)
        `)
        .eq('collection_id', id)
        .order('added_at', { ascending: false })

    // Setup QuickSave data for RepoCards
    const repoIds = items?.map((item: any) => item.repository?.id).filter(Boolean) || []
    const quickSaveDataPromise = getUserDataForQuickSave(repoIds)

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href={`/profile/${collection.profiles?.username}`} className={styles.backLink}>
                    <Icons.ArrowRight className="rotate-180 w-4 h-4" />
                    Back to Profile
                </Link>

                <div className={styles.header}>
                    <h1 className={styles.title}>
                        {collection.name}
                    </h1>
                    {collection.description && (
                        <p className={styles.desc}>{collection.description}</p>
                    )}
                    <div className={styles.meta}>
                        <div className={styles.user}>
                            <img
                                src={collection.profiles?.avatar_url || `https://github.com/${collection.profiles?.username}.png`}
                                alt={collection.profiles?.username}
                                className={styles.avatar}
                            />
                            <span>{collection.profiles?.username}</span>
                        </div>
                        <span>•</span>
                        <span>{new Date(collection.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{items?.length || 0} items</span>
                    </div>
                </div>

                <div className={styles.grid}>
                    {items?.map((item: any) => {
                        const repo = item.repository
                        if (!repo) return null
                        return (
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
                                quickSaveDataPromise={quickSaveDataPromise}
                            />
                        )
                    })}
                </div>
            </div>
        </main>
    )
}
