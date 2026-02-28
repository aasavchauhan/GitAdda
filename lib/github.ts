// Lightweight GitHub API wrapper for fetching repository metadata
// Uses the public GitHub REST API (no auth needed for public repos, rate limit: 60 req/hr)

interface GitHubRepoData {
    name: string
    full_name: string
    description: string | null
    language: string | null
    stargazers_count: number
    forks_count: number
    open_issues_count: number
    topics: string[]
    updated_at: string
    created_at: string
    license: { spdx_id: string; name: string } | null
    owner: {
        login: string
        avatar_url: string
    }
    html_url: string
}

export interface RepoMetadata {
    stars: number
    forks: number
    language: string | null
    topics: string[]
    license: string | null
    last_updated: string
    open_issues: number
    owner_avatar: string
    owner_login: string
}

/**
 * Extract owner/repo from a GitHub URL
 * Supports: https://github.com/owner/repo, github.com/owner/repo, etc.
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    try {
        const cleaned = url.replace(/\/+$/, '') // trim trailing slashes
        const match = cleaned.match(/(?:github\.com)[/:]([^/]+)\/([^/]+?)(?:\.git)?$/)
        if (match) {
            return { owner: match[1], repo: match[2] }
        }
    } catch {
        // Invalid URL
    }
    return null
}

/**
 * Fetch repository metadata from GitHub API
 */
export async function fetchRepoMetadata(githubUrl: string): Promise<RepoMetadata | null> {
    const parsed = parseGitHubUrl(githubUrl)
    if (!parsed) return null

    try {
        const res = await fetch(
            `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'GitAdda-App',
                },
                next: { revalidate: 3600 }, // Cache for 1 hour
            }
        )

        if (!res.ok) {
            console.error(`GitHub API error: ${res.status} for ${parsed.owner}/${parsed.repo}`)
            return null
        }

        const data: GitHubRepoData = await res.json()

        return {
            stars: data.stargazers_count,
            forks: data.forks_count,
            language: data.language,
            topics: data.topics || [],
            license: data.license?.spdx_id || null,
            last_updated: data.updated_at,
            open_issues: data.open_issues_count,
            owner_avatar: data.owner.avatar_url,
            owner_login: data.owner.login,
        }
    } catch (error) {
        console.error('Failed to fetch GitHub metadata:', error)
        return null
    }
}

/**
 * Calculate freshness score (0–100) based on last update time
 * 100 = updated today, 0 = > 1 year ago
 */
export function freshnessScore(lastUpdated: string | null): number {
    if (!lastUpdated) return 0
    const now = Date.now()
    const updated = new Date(lastUpdated).getTime()
    const daysSince = (now - updated) / (1000 * 60 * 60 * 24)

    if (daysSince <= 7) return 100
    if (daysSince <= 30) return 85
    if (daysSince <= 90) return 65
    if (daysSince <= 180) return 40
    if (daysSince <= 365) return 20
    return 5
}

/**
 * Get freshness label and color class
 */
export function freshnessLabel(score: number): { label: string; level: 'hot' | 'warm' | 'cool' | 'stale' } {
    if (score >= 80) return { label: 'Active', level: 'hot' }
    if (score >= 50) return { label: 'Maintained', level: 'warm' }
    if (score >= 20) return { label: 'Slow', level: 'cool' }
    return { label: 'Inactive', level: 'stale' }
}

/**
 * Language color map (top 30 languages)
 */
export const LANGUAGE_COLORS: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572a5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Dart: '#00B4AB',
    Scala: '#c22d40',
    Shell: '#89e051',
    HTML: '#e34c26',
    CSS: '#563d7c',
    SCSS: '#c6538c',
    Vue: '#41b883',
    Svelte: '#ff3e00',
    Lua: '#000080',
    R: '#198CE7',
    Elixir: '#6e4a7e',
    Haskell: '#5e5086',
    Clojure: '#db5855',
    Zig: '#ec915c',
    Nim: '#ffc200',
    OCaml: '#3be133',
    Julia: '#a270ba',
}

/**
 * Get the color for a language
 */
export function getLanguageColor(language: string | null): string {
    if (!language) return '#8892b0'
    return LANGUAGE_COLORS[language] || '#8892b0'
}
