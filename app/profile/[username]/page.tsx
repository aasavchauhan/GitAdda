import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import styles from './page.module.css'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileTabs from '@/components/profile/ProfileTabs'
import ProfileOverview from '@/components/profile/ProfileOverview'
import ProfileRepos from '@/components/profile/ProfileRepos'
import ProfileCollections from '@/components/profile/ProfileCollections'
import ProfileDock from '@/components/profile/ProfileDock'
import { getUserDataForQuickSave } from '@/app/actions/collections'

interface ProfilePageProps {
    params: { username: string }
    searchParams: { tab?: string }
}

export default async function ProfilePage({ params, searchParams }: ProfilePageProps) {
    const { username } = await params
    const tab = (await searchParams)?.tab || 'overview'

    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    // 1. Get profile
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    if (error || !profile) {
        notFound()
    }

    // 2. Fetch Repositories
    const { data: repositories, count: reposCount } = await supabase
        .from('repositories')
        .select('*', { count: 'exact' })
        .eq('shared_by', profile.id)
        .order('shared_at', { ascending: false })

    // 3. Fetch Collections
    const { data: collections, count: collectionsCount } = await supabase
        .from('collections')
        .select('*', { count: 'exact' })
        .eq('created_by', profile.id)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

    // 4. Counts
    const counts = {
        repos: reposCount || 0,
        collections: collectionsCount || 0,
        followers: 0, // Placeholder - add followers table if needed
        following: 0  // Placeholder
    }

    // Quick Save Data for Repos
    const repoIds = repositories?.map((r: any) => r.id) || []
    const quickSaveDataPromise = getUserDataForQuickSave(repoIds)

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <ProfileHeader
                    profile={profile}
                    currentUser={currentUser}
                    counts={counts}
                />

                <ProfileTabs counts={counts} />

                <div className={styles.contentArea}>
                    {tab === 'overview' && repositories && (
                        <ProfileOverview
                            repos={repositories}
                            username={username}
                        />
                    )}

                    {tab === 'repos' && repositories && (
                        <ProfileRepos
                            repositories={repositories}
                            username={username}
                            totalCount={reposCount || 0}
                            quickSaveDataPromise={quickSaveDataPromise}
                            limit={100} // Show all/more in tab view
                        />
                    )}

                    {tab === 'collections' && collections && (
                        <ProfileCollections collections={collections} />
                    )}
                </div>
            </div>
            {currentUser?.id === profile.id && <ProfileDock />}
        </main>
    )
}
