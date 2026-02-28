import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { getUserCollections } from "@/app/actions/collections"
import { getLikeStatus } from "@/app/actions/likes"
import { getComments } from "@/app/actions/comments"
import { getReadmeContent } from "@/app/actions/readme"
import RepoDetailClient from "./RepoDetailClient"

interface Props {
    params: Promise<{ id: string }>
}

// ── SSR Data Fetching ──────────────────────────────────────────
async function getRepo(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('repositories')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !data) return null
    return data
}

async function getRelatedRepos(owner: string, excludeId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('repositories')
        .select('id, name, description, primary_language, stars, owner')
        .eq('owner', owner)
        .neq('id', excludeId)
        .order('stars', { ascending: false })
        .limit(3)

    return data || []
}

// ── OG / SEO Metadata ──────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const repo = await getRepo(id)

    if (!repo) {
        return { title: 'Repository Not Found — GitAdda' }
    }

    const title = `${repo.name} by ${repo.owner} — GitAdda`
    const description = repo.description || repo.purpose || `Explore ${repo.name} on GitAdda`
    const ogImage = `https://opengraph.githubassets.com/1/${repo.owner}/${repo.name}`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: ogImage, width: 1200, height: 600 }],
            type: 'article',
            siteName: 'GitAdda',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
    }
}

// ── Page (SSR) ──────────────────────────────────────────────────
export default async function RepoPage({ params }: Props) {
    const { id } = await params
    const repo = await getRepo(id)

    if (!repo) {
        notFound()
    }

    // Derive fields that don't exist in DB but are useful in UI
    const fullName = repo.full_name || `${repo.owner}/${repo.name}`
    const githubUrl = repo.github_url || `https://github.com/${fullName}`
    const cloneUrl = `${githubUrl}.git`
    const ownerAvatarUrl = `https://github.com/${repo.owner}.png`

    // Parallel fetch helper data
    const [collections, likeStatus, comments, relatedRepos, readmeContent] = await Promise.all([
        getUserCollections().catch(() => []),
        getLikeStatus(repo.id).catch(() => ({ isLiked: false, count: 0 })),
        getComments(repo.id).catch(() => []),
        getRelatedRepos(repo.owner, repo.id),
        getReadmeContent(repo.id, fullName).catch(() => null),
    ])

    // Normalize shape for client component
    const repoData = {
        ...repo,
        // Derived fields
        full_name: fullName,
        github_url: githubUrl,
        clone_url: cloneUrl,
        owner_avatar_url: ownerAvatarUrl,
        // Map DB column names to display names
        star_count: repo.stars || 0,
        fork_count: repo.forks || 0,
        language: repo.primary_language || (repo.languages?.[0]) || null,
    }

    const helperData = {
        userCollections: collections || [],
        likeStatus: likeStatus || { isLiked: false, count: 0 },
        comments: comments || [],
        relatedRepos,
        readmeContent,
    }

    return (
        <RepoDetailClient
            repo={repoData}
            helperData={helperData}
        />
    )
}
