'use server'

import { createClient } from '@/lib/supabase/server'

export async function searchSuggestions(query: string) {
    if (!query || query.length < 2) return []

    const supabase = await createClient()
    const { data, error } = await supabase
        .rpc('search_suggestions', { search_query: query })

    if (error) {
        console.error('Search suggestions error:', error)
        return []
    }

    return data || []
}

export async function saveSearchHistory(query: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !query.trim()) return

    // Upsert: delete old same-query entry, then insert fresh
    await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id)
        .eq('query', query.trim())

    await supabase
        .from('search_history')
        .insert({ user_id: user.id, query: query.trim() })

    // Keep only last 10 searches
    const { data: history } = await supabase
        .from('search_history')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (history && history.length > 10) {
        const idsToDelete = history.slice(10).map(h => h.id)
        await supabase
            .from('search_history')
            .delete()
            .in('id', idsToDelete)
    }
}

export async function getSearchHistory() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('search_history')
        .select('id, query, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

    if (error) return []
    return data || []
}

export async function clearSearchHistory() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id)
}
