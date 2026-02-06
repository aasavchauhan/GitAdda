'use server'

import { createClient } from '@/lib/supabase/server'
import { normalizeUseCase } from '@/lib/use-cases'

interface ImportResult {
    url: string
    status: 'success' | 'error'
    message: string
}

export async function bulkImportRepos(
    urls: string[],
    userId: string,
    accessToken: string | null,
    defaultUseCase: string = 'other'
): Promise<ImportResult[]> {
    const supabase = await createClient()
    const results: ImportResult[] = []

    for (const url of urls) {
        try {
            // 1. Parse URL
            const match = url.trim().match(/github\.com\/([^\/]+)\/([^\/\?#]+)/)
            if (!match) {
                results.push({ url, status: 'error', message: 'Invalid GitHub URL' })
                continue
            }

            const [, owner, repo] = match
            const cleanRepoName = repo.replace('.git', '')

            // 2. Check if already exists in Supabase (Optimization to save API calls)
            const { data: existing } = await supabase
                .from('repositories')
                .select('id')
                .eq('github_url', `https://github.com/${owner}/${cleanRepoName}`)
                .single()

            if (existing) {
                // Double check with variations if needed, but this catches exact matches
                results.push({ url, status: 'error', message: 'Already exists in GitAdda' })
                continue
            }

            // 3. Fetch from GitHub
            const headers: Record<string, string> = {
                'Accept': 'application/vnd.github.v3+json'
            }
            if (accessToken) {
                headers['Authorization'] = `token ${accessToken}`
            }

            // Fix: Construct proper API URL
            const res = await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}`, { headers })

            if (!res.ok) {
                if (res.status === 404) {
                    results.push({ url, status: 'error', message: 'Repository not found or private' })
                } else if (res.status === 403) {
                    results.push({ url, status: 'error', message: 'Rate limit exceeded (add token)' })
                } else {
                    results.push({ url, status: 'error', message: `GitHub API error: ${res.status}` })
                }
                continue
            }

            const data = await res.json()

            // Double check: if the canonical URL from API is different and exists?
            // Usually not an issue, but good to be aware.
            // We proceed to insert.

            // 4. Intelligent Use Case Inference
            const normalizedDefault = normalizeUseCase(defaultUseCase)
            const shouldAutoDetect = !normalizedDefault
            let finalUseCase = normalizedDefault || 'other'

            // Helper to check if topics contain any of the keywords
            const hasTopic = (keywords: string[]) => {
                const topicsLower = (data.topics || []).map((t: string) => t.toLowerCase())
                return keywords.some(k => topicsLower.some((t: string) => t.includes(k)))
            }

            const language = (data.language || '').toLowerCase()

            if (shouldAutoDetect) {
                if (hasTopic(['ai', 'machine-learning', 'gpt', 'llm', 'neural', 'deep-learning', 'openai'])) {
                    finalUseCase = 'ai-ml'
                } else if (hasTopic(['database', 'sql', 'nosql', 'postgres', 'mongo', 'redis', 'db'])) {
                    finalUseCase = 'database'
                } else if (hasTopic(['ui', 'component', 'design-system', 'css', 'tailwind', 'frontend', 'react', 'vue', 'svelte', 'angular'])) {
                    finalUseCase = 'frontend'
                } else if (hasTopic(['api', 'server', 'backend', 'express', 'nest', 'django', 'flask', 'fastapi'])) {
                    finalUseCase = 'backend'
                } else if (hasTopic(['cli', 'terminal', 'command-line', 'shell', 'bash'])) {
                    finalUseCase = 'cli'
                } else if (hasTopic(['mobile', 'android', 'ios', 'flutter', 'react-native', 'swift', 'kotlin'])) {
                    finalUseCase = 'mobile'
                } else if (hasTopic(['devops', 'docker', 'kubernetes', 'aws', 'cloud', 'terraform', 'ci', 'cd'])) {
                    finalUseCase = 'devops'
                } else if (language === 'typescript' || language === 'javascript') {
                    // Heuristics for JS/TS if no topics
                    if (data.name.includes('ui') || data.name.includes('design')) finalUseCase = 'frontend'
                }
            }

            const { error: insertError } = await supabase.from('repositories').insert({
                shared_by: userId,
                github_url: data.html_url,
                name: data.name,
                owner: data.owner.login, // owner login
                description: data.description,
                stars: data.stargazers_count,
                forks: data.forks_count,
                languages: data.language ? [data.language] : [],
                topics: data.topics || [],
                use_case: finalUseCase,
                purpose: data.description ? data.description.substring(0, 200) : null,
            })

            if (insertError) {
                results.push({ url, status: 'error', message: insertError.message })
            } else {
                results.push({ url, status: 'success', message: 'Imported' })
            }

        } catch (error: any) {
            results.push({ url, status: 'error', message: error.message || 'Unknown error' })
        }
    }

    return results
}
