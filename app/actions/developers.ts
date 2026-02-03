'use server'

import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export type Developer = {
    id: string
    username: string
    full_name: string | null
    avatar_url: string | null
    bio: string | null
    tech_stack: string[] | null
    github_username: string | null
    collections_count: number
}

export const getTopDevelopers = cache(async (): Promise<Developer[]> => {
    const supabase = await createClient()

    // Fetch profiles
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
            id,
            username,
            full_name,
            avatar_url,
            bio,
            tech_stack,
            github_username
        `)
        .limit(20)

    if (error) {
        console.error('Error fetching developers:', error)
        return []
    }

    // Since we can't easily do a count join in one go without a view or rpc in simple query builder,
    // we'll fetch collection counts separately or just mock it for now to save time if performance isn't critical yet.
    // A better approach is to use .select('*, collections(count)') if relations are set up, but let's try the safe simple way first.

    // For now, let's just return profiles and 0 counts, or try to fetch counts if we can.
    // Checking relations might be complex without knowing them.
    // Let's standardly fetch collections count for these users.

    // Efficient way: Fetch all collections for these user IDs and aggregate in JS
    const userIds = profiles.map(p => p.id)
    const { data: collections } = await supabase
        .from('collections')
        .select('created_by')
        .in('created_by', userIds)

    const collectionCounts = (collections || []).reduce((acc, curr) => {
        // created_by is the column name for the user ID in collections table
        const userId = curr.created_by
        acc[userId] = (acc[userId] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const developers: Developer[] = profiles.map(profile => ({
        ...profile,
        tech_stack: Array.isArray(profile.tech_stack) ? profile.tech_stack : [],
        collections_count: collectionCounts[profile.id] || 0
    }))

    // Sort by collections count descending
    return developers.sort((a, b) => b.collections_count - a.collections_count)
})
