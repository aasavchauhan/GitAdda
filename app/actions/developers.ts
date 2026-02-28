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
    shared_count: number
    follower_count: number
    likes_received: number
    score: number
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
        .limit(50)

    if (error) {
        console.error('Error fetching developers:', error)
        return []
    }

    const userIds = profiles.map(p => p.id)

    // Fetch all counts in parallel (4 queries)
    const [collectionsRes, reposRes, followsRes, likesRes] = await Promise.all([
        // Collections count
        supabase
            .from('collections')
            .select('created_by')
            .in('created_by', userIds),
        // Shared repos count
        supabase
            .from('repositories')
            .select('shared_by')
            .in('shared_by', userIds),
        // Follower count
        supabase
            .from('follows')
            .select('following_id')
            .in('following_id', userIds),
        // Likes received (likes on repos they shared)
        supabase
            .from('likes')
            .select('repository_id, repositories!inner(shared_by)')
            .in('repositories.shared_by', userIds)
    ])

    // Build count maps
    const countMap = (rows: any[] | null, key: string) => {
        const map: Record<string, number> = {}
        for (const row of rows || []) {
            const k = row[key]
            map[k] = (map[k] || 0) + 1
        }
        return map
    }

    const collectionCounts = countMap(collectionsRes.data, 'created_by')
    const repoCounts = countMap(reposRes.data, 'shared_by')
    const followerCounts = countMap(followsRes.data, 'following_id')

    // Likes received — grouped by repo owner
    const likesReceivedMap: Record<string, number> = {}
    for (const like of likesRes.data || []) {
        const ownerId = (like as any).repositories?.shared_by
        if (ownerId) {
            likesReceivedMap[ownerId] = (likesReceivedMap[ownerId] || 0) + 1
        }
    }

    // Weighted score: repos ×3, followers ×2, likes ×1, collections ×1
    const developers: Developer[] = profiles.map(profile => {
        const shared_count = repoCounts[profile.id] || 0
        const follower_count = followerCounts[profile.id] || 0
        const likes_received = likesReceivedMap[profile.id] || 0
        const collections_count = collectionCounts[profile.id] || 0

        const score = (shared_count * 3) + (follower_count * 2) + likes_received + collections_count

        return {
            ...profile,
            tech_stack: Array.isArray(profile.tech_stack) ? profile.tech_stack : [],
            collections_count,
            shared_count,
            follower_count,
            likes_received,
            score
        }
    })

    // Sort by score descending, then filter out zero-activity users
    return developers
        .filter(d => d.score > 0)
        .sort((a, b) => b.score - a.score)
})

