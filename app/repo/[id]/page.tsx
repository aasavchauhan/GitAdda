'use client'

import React, { useState, useEffect } from "react"
import Link from "next/link"
import styles from "./page.module.css"
import { notFound } from "next/navigation"
import { Icons } from "@/components/ui/Icons"
import CopyButton from "@/components/ui/CopyButton"
import QuickSaveButton from "@/components/collections/QuickSaveButton"
import LikeButton from "@/components/ui/LikeButton"
import CommentsSection from "@/components/comments/CommentsSection"
import ShareModal from "@/components/common/ShareModal"
import { Share2, Globe } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import ReactMarkdown from "react-markdown"

// Import server actions
import { getUserCollections } from "@/app/actions/collections"
import { getLikeStatus } from "@/app/actions/likes"
import { getComments } from "@/app/actions/comments"
import { getReadmeContent } from "@/app/actions/readme"

// Safe formatting helpers
function formatSize(sizeKB: number | null | undefined): string {
    if (!sizeKB || isNaN(sizeKB)) return 'N/A'
    if (sizeKB >= 1024) {
        return `${(sizeKB / 1024).toFixed(1)} MB`
    }
    return `${sizeKB} KB`
}

function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString()
}

interface Props {
    params: Promise<{ id: string }>
}

export default function RepoPage({ params }: Props) {
    const [repoId, setRepoId] = useState<string | null>(null)
    const [repo, setRepo] = useState<any>(null)
    const [isShareOpen, setIsShareOpen] = useState(false)
    const [data, setData] = useState<any>({
        userCollections: [],
        likeStatus: { isLiked: false, count: 0 },
        comments: [],
        relatedRepos: []
    })
    const [loading, setLoading] = useState(true)
    const [readmeContent, setReadmeContent] = useState<string | null>(null)
    const [readmeLoading, setReadmeLoading] = useState(false)

    // Unwrap params
    useEffect(() => {
        params.then(p => setRepoId(p.id))
    }, [params])

    useEffect(() => {
        if (!repoId) return

        const fetchData = async () => {
            const supabase = createClient()

            // 1. Fetch Repository Details
            const { data: repoData, error } = await supabase
                .from('repositories')
                .select('*')
                .eq('id', repoId)
                .single()

            if (error || !repoData) {
                // Handle not found or error state
                setLoading(false)
                return
            }

            setRepo(repoData)

            // 2. Fetch Helper Data (Collections, Likes, Comments)
            // We can use the server actions directly here in useEffect
            try {
                const [cols, likes, coms, related] = await Promise.all([
                    getUserCollections(),
                    getLikeStatus(repoData.id),
                    getComments(repoData.id),
                    // Fetch related repos (same owner)
                    supabase
                        .from('repositories')
                        .select('id, name, description, language, stargazers_count, owner_login')
                        .eq('owner_login', repoData.owner_login)
                        .eq('visibility', 'Public')
                        .neq('id', repoData.id)
                        .limit(3)
                        .then(({ data }) => data || [])
                ])

                setData({
                    userCollections: cols || [],
                    likeStatus: likes || { isLiked: false, count: 0 },
                    comments: coms || [],
                    relatedRepos: related
                })

                // 3. Fetch README using cached server action
                if (repoData.full_name) {
                    setReadmeLoading(true)
                    try {
                        const readmeText = await getReadmeContent(repoData.id, repoData.full_name)
                        if (readmeText) {
                            setReadmeContent(readmeText)
                        }
                    } catch (readmeErr) {
                        console.error("Error fetching README:", readmeErr)
                    } finally {
                        setReadmeLoading(false)
                    }
                }
            } catch (err) {
                console.error("Error fetching helper data:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [repoId])

    if (loading) return (
        <div className={styles.loadingWrapper}>
            <div className={styles.container} style={{ width: '100%', maxWidth: '1000px' }}>
                <div style={{
                    height: '300px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    marginBottom: '2rem'
                }} />
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 340px',
                    gap: '2rem'
                }}>
                    <div style={{
                        height: '500px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }} />
                    <div style={{
                        height: '300px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }} />
                </div>
            </div>
        </div>
    )

    if (!repo) {
        // In a real client comp, we might not be able to call notFound() effectively during render if we want server-side 404. 
        // But for now, returning a UI message is fine.
        return <div className={styles.error}>Repository not found</div>
    }

    const savedCollectionIds = data.userCollections
        .filter((c: any) => c.items?.some((item: any) => item.repository_id === repo.id))
        .map((c: any) => c.id)

    // Helper to determine if we should show npm install
    const showNpmInstall = repo.language && ['JavaScript', 'TypeScript', 'Vue', 'Svelte', 'CoffeeScript'].includes(repo.language)

    // Helper to get language class for theming
    const getLangClass = (lang: string | null): string => {
        if (!lang) return ''
        const langMap: Record<string, string> = {
            'TypeScript': styles.langTypescript,
            'JavaScript': styles.langJavascript,
            'Python': styles.langPython,
            'Rust': styles.langRust,
            'Go': styles.langGo,
            'Java': styles.langJava,
            'Ruby': styles.langRuby,
            'PHP': styles.langPhp,
            'Swift': styles.langSwift,
            'Kotlin': styles.langKotlin,
            'C#': styles.langCsharp,
            'C++': styles.langCpp,
            'C': styles.langC,
            'HTML': styles.langHtml,
            'CSS': styles.langCss,
            'Vue': styles.langVue,
        }
        return langMap[lang] || ''
    }

    return (
        <div className={styles.container}>
            {/* Breadcrumbs */}
            <nav className={styles.breadcrumbs}>
                <Link href="/explore">Explore</Link>
                <span>/</span>
                <Link href={`/profile/${repo.owner_login}`}>{repo.owner_login}</Link>
                <span>/</span>
                <span className={styles.breadcrumbCurrent}>{repo.name}</span>
            </nav>

            {/* Hero Section */}
            <div className={`${styles.header} ${getLangClass(repo.language)}`}>
                <div className={styles.headerTop}>
                    <div className={styles.titleSection}>
                        <div className={styles.owner}>
                            {repo.owner_avatar_url && (
                                <img src={repo.owner_avatar_url} alt={repo.owner_login} className={styles.ownerAvatar} />
                            )}
                            <span className={styles.ownerName}>{repo.owner_login}</span>
                        </div>
                        <div className={styles.titleRow}>
                            <h1 className={styles.repoTitle}>{repo.name}</h1>
                        </div>
                        {repo.description && (
                            <p className={styles.description} style={{ marginTop: '0.5rem', marginBottom: '0' }}>
                                {repo.description}
                            </p>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <QuickSaveButton
                            repoId={repo.id}
                            initialSavedCollectionIds={savedCollectionIds}
                            userCollections={data.userCollections}
                        />

                        <LikeButton
                            repoId={repo.id}
                            initialLikes={data.likeStatus.count}
                            initialIsLiked={data.likeStatus.isLiked}
                        />

                        <button
                            className={styles.actionBtn}
                            onClick={() => setIsShareOpen(true)}
                            aria-label="Share repository"
                        >
                            <Share2 size={20} />
                        </button>

                        {repo.homepage && (
                            <a
                                href={repo.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.actionBtn}
                                aria-label="Visit Website"
                                title="Visit Website"
                            >
                                <Globe size={20} />
                            </a>
                        )}

                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className={styles.gitHubBtn}>
                            <Icons.GitHub />
                            GitHub
                        </a>
                    </div>
                </div>

                <div className={styles.heroContext}>
                    <div className={styles.contextItem}>
                        <span className={styles.contextLabel}>Use Case</span>
                        <div className={styles.contextValue}>
                            {repo.use_case || "General Purpose"}
                        </div>
                    </div>
                    {repo.purpose && (
                        <div className={styles.contextItem}>
                            <span className={styles.contextLabel}>Best For</span>
                            <div className={styles.contextValue}>
                                {repo.purpose}
                            </div>
                        </div>
                    )}
                    <div className={styles.contextItem}>
                        <span className={styles.contextLabel}>Visibility</span>
                        <div className={styles.contextValue}>
                            {repo.visibility || 'Public'}
                        </div>
                    </div>
                </div>

                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <Icons.Star />
                        <span>{repo.stargazers_count}</span>
                        <span className={styles.metaLabel}>Stars</span>
                    </div>
                    <div className={styles.statItem}>
                        <Icons.GitFork />
                        <span>{repo.forks_count}</span>
                        <span className={styles.metaLabel}>Forks</span>
                    </div>
                    <div className={styles.statItem}>
                        <Icons.Eye />
                        <span>{repo.watchers_count}</span>
                        <span className={styles.metaLabel}>Watchers</span>
                    </div>
                    {repo.language && (
                        <div className={styles.statItem}>
                            <div className={styles.langDot} />
                            <span>{repo.language}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className={styles.contentGrid}>
                {/* Main Content */}
                <div className={styles.leftColumn}>
                    <div className={styles.readme}>
                        <div className={styles.readmeHeader}>
                            <Icons.BookOpen />
                            <span>README.md</span>
                        </div>
                        <div className={styles.markdown}>
                            {readmeLoading ? (
                                <div className={styles.readmeLoading}>
                                    <div className={styles.loadingSpinner}></div>
                                    <span>Loading README...</span>
                                </div>
                            ) : readmeContent ? (
                                <ReactMarkdown>{readmeContent}</ReactMarkdown>
                            ) : (
                                <div className={styles.emptyReadme}>
                                    <div className={styles.emptyReadmeIcon}>
                                        <Icons.FileText size={48} />
                                    </div>
                                    <p className={styles.emptyReadmeText}>
                                        {repo.description || "No description provided."}
                                    </p>
                                    <span className={styles.emptyReadmeSubtext}>No README.md found</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Comments</h2>
                        <CommentsSection repoId={repo.id} initialComments={data.comments} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className={styles.sidebar}>
                    {/* Related Repos Section (New) */}
                    {data.relatedRepos && data.relatedRepos.length > 0 && (
                        <div className={styles.sidebarCard}>
                            <h3 className={styles.sidebarTitle}>
                                <Icons.Code size={16} />
                                More from {repo.owner_login}
                            </h3>
                            <div className={styles.relatedReposList}>
                                {data.relatedRepos.map((related: any) => (
                                    <Link key={related.id} href={`/repo/${related.id}`} className={styles.relatedRepoItem}>
                                        <div className={styles.relatedRepoHeader}>
                                            <span className={styles.relatedRepoName}>{related.name}</span>
                                            <span className={styles.relatedRepoStars}>
                                                <Icons.Star size={12} />
                                                {related.stargazers_count}
                                            </span>
                                        </div>
                                        <p className={styles.relatedRepoDesc}>
                                            {related.description?.slice(0, 60)}{related.description?.length > 60 ? '...' : ''}
                                        </p>
                                        <div className={styles.relatedRepoMeta}>
                                            {related.language && (
                                                <div className={styles.relatedRepoLang}>
                                                    <div
                                                        className={styles.langDot}
                                                        style={{ backgroundColor: getLangClass(related.language).replace('lang', 'var(--lang-').toLowerCase() + ')' }}
                                                    />
                                                    {related.language}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                                <Link
                                    href={`/profile/${repo.owner_login}/repos`}
                                    className={styles.viewAllRelatedBtn}
                                >
                                    View All Repositories →
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Get It Section */}
                    <div className={styles.sidebarCard}>
                        <h3 className={styles.sidebarTitle}>
                            <Icons.Download size={16} />
                            Get it
                        </h3>
                        <div className={styles.getItSection}>
                            <div className={styles.installBlock}>
                                <span className={styles.installLabel}>Git Clone</span>
                                <div className={styles.commandBox}>
                                    <code>git clone {repo.clone_url}</code>
                                    <CopyButton text={`git clone ${repo.clone_url}`} label="" />
                                </div>
                            </div>

                            {showNpmInstall && (
                                <div className={styles.installBlock}>
                                    <span className={styles.installLabel}>NPM Install</span>
                                    <div className={styles.commandBox}>
                                        <code>npm install {repo.name}</code>
                                        <CopyButton text={`npm install ${repo.name}`} label="" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div className={styles.sidebarCard}>
                        <h3 className={styles.sidebarTitle}>Details</h3>
                        <div className={styles.metaList}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>License</span>
                                <span className={styles.metaValue}>{repo.license?.spdx_id || 'None'}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Size</span>
                                <span className={styles.metaValue}>{formatSize(repo.size)}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Created</span>
                                <span className={styles.metaValue}>{formatDate(repo.created_at)}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Last Update</span>
                                <span className={styles.metaValue}>{formatDate(repo.updated_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    {repo.topics && (Array.isArray(repo.topics) ? repo.topics : []).length > 0 && (
                        <div className={styles.sidebarCard}>
                            <h3 className={styles.sidebarTitle}>Tags</h3>
                            <div className={styles.tags}>
                                {(repo.topics as string[]).map((topic) => (
                                    <span key={topic} className={styles.tag}>{topic}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                url={typeof window !== 'undefined' ? window.location.href : ''}
                title={`Check out ${repo.name} on GitAdda`}
            />
        </div>
    )
}
