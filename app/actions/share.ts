'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface ShareRepoInput {
    github_url: string
    name: string
    owner: string
    description: string | null
    stars: number
    forks: number
    languages: string[]
    primary_language: string | null
    topics: string[]
    use_case: string
    purpose: string | null
}

export async function shareRepository(input: ShareRepoInput): Promise<{ id: string }> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('You must be logged in to share a repository')
    }

    // Duplicate check
    const { data: existing } = await supabase
        .from('repositories')
        .select('id')
        .eq('github_url', input.github_url)
        .single()

    if (existing) {
        throw new Error('This repository is already listed on GitAdda!')
    }

    const { data, error } = await supabase.from('repositories').insert({
        shared_by: user.id,
        github_url: input.github_url,
        name: input.name,
        owner: input.owner,
        description: input.description,
        stars: input.stars,
        forks: input.forks,
        languages: input.languages,
        topics: input.topics,
        use_case: input.use_case,
        purpose: input.purpose,
    }).select('id').single()

    if (error) {
        throw new Error(error.message || 'Failed to share repository')
    }

    revalidatePath('/explore')
    revalidatePath('/')

    return { id: data.id }
}
