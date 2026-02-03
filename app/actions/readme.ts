'use server'

import { createClient } from '@/lib/supabase/server'

const README_CACHE_HOURS = 24

/**
 * Fetches README content, using Supabase cache if available and fresh.
 * Falls back to GitHub API if cache is stale or empty.
 */
export async function getReadmeContent(repoId: string, fullName: string): Promise<string | null> {
    const supabase = await createClient()

    // 1. Check cache first
    const { data: repo } = await supabase
        .from('repositories')
        .select('readme_content, readme_fetched_at')
        .eq('id', repoId)
        .single()

    if (repo?.readme_content && repo?.readme_fetched_at) {
        const fetchedAt = new Date(repo.readme_fetched_at)
        const now = new Date()
        const hoursSinceFetch = (now.getTime() - fetchedAt.getTime()) / (1000 * 60 * 60)

        // Cache is still fresh
        if (hoursSinceFetch < README_CACHE_HOURS) {
            return repo.readme_content
        }
    }

    // 2. Fetch from GitHub API
    try {
        const response = await fetch(
            `https://api.github.com/repos/${fullName}/readme`,
            {
                headers: {
                    'Accept': 'application/vnd.github.raw+json',
                    // Use GitHub token if available
                    ...(process.env.GITHUB_TOKEN && {
                        'Authorization': `token ${process.env.GITHUB_TOKEN}`
                    })
                },
                next: { revalidate: 3600 } // Also use Next.js cache as backup
            }
        )

        if (!response.ok) {
            console.error(`GitHub API error: ${response.status}`)
            // Return stale cache if available
            return repo?.readme_content || null
        }

        const readmeContent = await response.text()

        // 3. Save to cache
        await supabase
            .from('repositories')
            .update({
                readme_content: readmeContent,
                readme_fetched_at: new Date().toISOString()
            })
            .eq('id', repoId)

        return readmeContent
    } catch (error) {
        console.error('Error fetching README:', error)
        // Return stale cache if available
        return repo?.readme_content || null
    }
}
