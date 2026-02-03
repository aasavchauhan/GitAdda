'use server'

import { createClient } from '@/lib/supabase/server'

const PAGE_SIZE = 12

export interface RepoData {
    id: string
    name: string
    owner: string
    description: string | null
    stars: number
    forks: number
    use_case?: string | null
    purpose?: string | null
    language?: string | null
}

export async function fetchPaginatedRepos({
    query = '',
    useCase = '',
    page = 0
}: {
    query?: string
    useCase?: string
    page?: number
}): Promise<{ repos: RepoData[]; hasMore: boolean }> {
    const supabase = await createClient()

    let dbQuery = supabase
        .from('repositories')
        .select('*')
        .order('shared_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (useCase) {
        dbQuery = dbQuery.eq('use_case', useCase)
    }

    if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    }

    const { data: repos, error } = await dbQuery

    if (error) {
        console.error('Error fetching repos:', error)
        return { repos: [], hasMore: false }
    }

    return {
        repos: repos || [],
        hasMore: (repos?.length || 0) === PAGE_SIZE
    }
}
