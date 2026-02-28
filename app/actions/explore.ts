'use server'

import { createClient } from '@/lib/supabase/server'

const PAGE_SIZE = 15

export type SortOption = 'recent' | 'stars' | 'forks' | 'trending'

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
    primary_language?: string | null
    last_updated?: string | null
    shared_at?: string | null
    elo_rating?: number
}

// Sanitize user input for use in ilike filter patterns
function sanitizeFilterValue(input: string): string {
    // Escape Supabase PostgREST special characters in filter values
    return input.replace(/[%_\\]/g, (char) => `\\${char}`)
}

export async function fetchPaginatedRepos({
    query = '',
    useCase = '',
    page = 0,
    sort = 'recent' as SortOption,
}: {
    query?: string
    useCase?: string
    page?: number
    sort?: SortOption
}): Promise<{ repos: RepoData[]; hasMore: boolean }> {
    const supabase = await createClient()

    // Determine sort column and direction
    const sortConfig: Record<SortOption, { column: string; ascending: boolean }> = {
        recent: { column: 'shared_at', ascending: false },
        stars: { column: 'stars', ascending: false },
        forks: { column: 'forks', ascending: false },
        trending: { column: 'elo_rating', ascending: false },
    }
    const { column: sortColumn, ascending: sortAscending } = sortConfig[sort] || sortConfig.recent

    // If query is provided, try full-text search first via RPC
    if (query.trim()) {
        const { data: ftsResults, error: ftsError } = await supabase
            .rpc('search_repos', {
                search_query: query.trim(),
                result_limit: 100 // Fetch more to allow client-side filtering
            })

        // If full-text search returns results, use them
        if (!ftsError && ftsResults && ftsResults.length > 0) {
            // Apply use_case filter client-side (FTS doesn't filter by use_case)
            let filtered = ftsResults
            if (useCase) {
                filtered = ftsResults.filter((r: any) => r.use_case === useCase)
            }

            // Sort the filtered results
            filtered.sort((a: any, b: any) => {
                const aVal = a[sortColumn] ?? 0
                const bVal = b[sortColumn] ?? 0
                return sortAscending ? (aVal > bVal ? 1 : -1) : (bVal > aVal ? 1 : -1)
            })

            // Paginate
            const start = page * PAGE_SIZE
            const paged = filtered.slice(start, start + PAGE_SIZE)
            const hasMore = filtered.length > start + PAGE_SIZE

            // Enrich with columns not returned by the RPC
            const ids = paged.map((r: any) => r.id)
            if (ids.length === 0) return { repos: [], hasMore: false }

            const { data: enriched } = await supabase
                .from('repositories')
                .select('id, purpose, languages, primary_language, last_updated, shared_at, elo_rating')
                .in('id', ids)

            const enrichMap = new Map((enriched || []).map((e: any) => [e.id, e]))

            return {
                repos: paged.map((r: any) => {
                    const extra = enrichMap.get(r.id)
                    return {
                        ...r,
                        language: extra?.languages?.[0] || null,
                        primary_language: extra?.primary_language || null,
                        last_updated: extra?.last_updated || null,
                        shared_at: extra?.shared_at || null,
                        purpose: extra?.purpose || null,
                        elo_rating: extra?.elo_rating || null,
                    }
                }),
                hasMore
            }
        }

        // Fallback to ilike if FTS returned nothing (e.g., partial word match)
        const sanitized = sanitizeFilterValue(query.trim())
        let dbQuery = supabase
            .from('repositories')
            .select('*')
            .order(sortColumn, { ascending: sortAscending })
            .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

        if (useCase) {
            dbQuery = dbQuery.eq('use_case', useCase)
        }

        dbQuery = dbQuery.or(`name.ilike.%${sanitized}%,description.ilike.%${sanitized}%`)

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

    // No query — standard paginated browse
    let dbQuery = supabase
        .from('repositories')
        .select('*')
        .order(sortColumn, { ascending: sortAscending })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (useCase) {
        dbQuery = dbQuery.eq('use_case', useCase)
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
