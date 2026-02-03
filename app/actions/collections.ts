'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUserCollections() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('collections')
        .select('*, collection_items(count)')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching collections:', error)
        return []
    }
    return data
}

export async function createCollection(title: string, description: string, isPublic: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('collections')
        .insert({
            created_by: user.id,
            name: title,
            description,
            is_public: isPublic
        })
        .select()
        .single()

    if (error) throw error
    revalidatePath('/collections')
    return data
}

export async function addToCollection(collectionId: string, repoId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('collection_items')
        .insert({
            collection_id: collectionId,
            repository_id: repoId
        })

    if (error) {
        if (error.code === '23505') { // Unique violation
            return { error: 'Already in collection' }
        }
        throw error
    }
    revalidatePath(`/repo/${repoId}`)
}

export async function removeFromCollection(collectionId: string, repoId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('collection_items')
        .delete()
        .eq('collection_id', collectionId)
        .eq('repository_id', repoId)

    if (error) throw error
    revalidatePath(`/repo/${repoId}`)
}

export async function getRepoCollectionIds(repoId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // Find all collection IDs belonging to the user that contain this repo
    const { data, error } = await supabase
        .from('collection_items')
        .select('collection_id, collections!inner(created_by)')
        .eq('repository_id', repoId)
        .eq('collections.created_by', user.id)

    if (error) {
        console.error('Error fetching repo collections:', error)
        return []
    }

    return data.map((item: { collection_id: string }) => item.collection_id)
}

export async function getUserDataForQuickSave(repoIds: string[] = []) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { collections: [], repoMap: {} }

    // FETCH 1: Get User Collections (Always needed for the dropdown list)
    const { data: collections, error: colError } = await supabase
        .from('collections')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

    if (colError) {
        console.error('Error fetching collections:', colError)
        return { collections: [], repoMap: {} }
    }

    // Optimization: If no repos to check, return empty map
    if (repoIds.length === 0) {
        return { collections: collections || [], repoMap: {} }
    }

    // FETCH 2: Get Collection Items ONLY for specific repos
    const { data: items, error: itemError } = await supabase
        .from('collection_items')
        .select('repository_id, collection_id, collections!inner(created_by)')
        .eq('collections.created_by', user.id)
        .in('repository_id', repoIds)

    if (itemError) {
        console.error('Error fetching collection items:', itemError)
        return { collections: collections || [], repoMap: {} }
    }

    // Transform items into a Map: RepoID -> [CollectionIDs]
    const repoMap: Record<string, string[]> = {}
    items?.forEach((item: { repository_id: string; collection_id: string }) => {
        if (!repoMap[item.repository_id]) {
            repoMap[item.repository_id] = []
        }
        repoMap[item.repository_id].push(item.collection_id)
    })

    return { collections: collections || [], repoMap }
}

export async function updateCollection(id: string, name: string, description: string, isPublic: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('collections')
        .update({
            name,
            description,
            is_public: isPublic
        })
        .eq('id', id)
        .eq('created_by', user.id)

    if (error) throw error
    revalidatePath('/collections')
}

export async function deleteCollection(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id)
        .eq('created_by', user.id)

    if (error) throw error
    revalidatePath('/collections')
}
