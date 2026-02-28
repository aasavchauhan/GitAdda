'use client'

import React, { useState } from "react"
import Link from "next/link"
import styles from "./page.module.css"
import { Icons } from "@/components/ui/Icons"
import CopyButton from "@/components/ui/CopyButton"
import QuickSaveButton from "@/components/collections/QuickSaveButton"
import LikeButton from "@/components/ui/LikeButton"
import CommentsSection from "@/components/comments/CommentsSection"
import ShareModal from "@/components/common/ShareModal"
import { Share2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

// ── Helpers ─────────────────────────────────────────────────────
function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getLangClass(lang: string | null): string {
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

// ── Types ───────────────────────────────────────────────────────
interface RepoData {
    id: string
    name: string
    owner: string
    description: string | null
    purpose: string | null
    use_case: string | null
    stars: number
    forks: number
    languages: string[] | null
    primary_language: string | null
    topics: string[] | null
    github_url: string
    full_name: string
    clone_url: string
    owner_avatar_url: string
    star_count: number
    fork_count: number
    language: string | null
    last_updated: string | null
    created_at?: string
    updated_at?: string
    shared_at?: string
}

interface HelperData {
    userCollections: any[]
    likeStatus: { isLiked: boolean; count: number }
    comments: any[]
    relatedRepos: any[]
    readmeContent: string | null
}

interface Props {
    repo: RepoData
    helperData: HelperData
}

// ── Component ───────────────────────────────────────────────────
export default function RepoDetailClient({ repo, helperData }: Props) {
    const [isShareOpen, setIsShareOpen] = useState(false)

    const savedCollectionIds = helperData.userCollections
        .filter((c: any) => c.items?.some((item: any) => item.repository_id === repo.id))
        .map((c: any) => c.id)

    // Helper to determine if we should show npm install
    const showNpmInstall = repo.language && ['JavaScript', 'TypeScript', 'Vue', 'Svelte', 'CoffeeScript'].includes(repo.language)

    return (
        <div className={styles.container}>
            {/* Breadcrumbs */}
            <nav className={styles.breadcrumbs}>
                <Link href="/explore">Explore</Link>
                <span>/</span>
                <Link href={`/profile/${repo.owner}`}>{repo.owner}</Link>
                <span>/</span>
                <span className={styles.breadcrumbCurrent}>{repo.name}</span>
            </nav>

            {/* Hero Section */}
            <div className={`${styles.header} ${getLangClass(repo.language)}`}>
                <div className={styles.headerTop}>
                    <div className={styles.titleSection}>
                        <div className={styles.owner}>
                            <img
                                src={repo.owner_avatar_url}
                                alt={repo.owner}
                                className={styles.ownerAvatar}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                            <span className={styles.ownerName}>{repo.owner}</span>
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
                            userCollections={helperData.userCollections}
                        />

                        <LikeButton
                            repoId={repo.id}
                            initialLikes={helperData.likeStatus.count}
                            initialIsLiked={helperData.likeStatus.isLiked}
                        />

                        <button
                            className={styles.actionBtn}
                            onClick={() => setIsShareOpen(true)}
                            aria-label="Share repository"
                        >
                            <Share2 size={20} />
                        </button>

                        <a href={repo.github_url} target="_blank" rel="noopener noreferrer" className={styles.gitHubBtn}>
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
                </div>

                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <Icons.Star />
                        <span>{repo.star_count.toLocaleString()}</span>
                        <span className={styles.metaLabel}>Stars</span>
                    </div>
                    <div className={styles.statItem}>
                        <Icons.GitFork />
                        <span>{repo.fork_count.toLocaleString()}</span>
                        <span className={styles.metaLabel}>Forks</span>
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
                            {helperData.readmeContent ? (
                                <ReactMarkdown>{helperData.readmeContent}</ReactMarkdown>
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
                        <CommentsSection repoId={repo.id} initialComments={helperData.comments} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className={styles.sidebar}>
                    {/* Related Repos Section */}
                    {helperData.relatedRepos && helperData.relatedRepos.length > 0 && (
                        <div className={styles.sidebarCard}>
                            <h3 className={styles.sidebarTitle}>
                                <Icons.Code size={16} />
                                More from {repo.owner}
                            </h3>
                            <div className={styles.relatedReposList}>
                                {helperData.relatedRepos.map((related: any) => (
                                    <Link key={related.id} href={`/repo/${related.id}`} className={styles.relatedRepoItem}>
                                        <div className={styles.relatedRepoHeader}>
                                            <span className={styles.relatedRepoName}>{related.name}</span>
                                            <span className={styles.relatedRepoStars}>
                                                <Icons.Star size={12} />
                                                {(related.stars || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className={styles.relatedRepoDesc}>
                                            {related.description?.slice(0, 60)}{related.description?.length > 60 ? '...' : ''}
                                        </p>
                                        {related.primary_language && (
                                            <div className={styles.relatedRepoMeta}>
                                                <div className={styles.relatedRepoLang}>
                                                    <div className={styles.langDot} />
                                                    {related.primary_language}
                                                </div>
                                            </div>
                                        )}
                                    </Link>
                                ))}
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
                                    <span className={styles.installLabel}>Quick Start</span>
                                    <div className={styles.commandBox}>
                                        <code>npx degit {repo.full_name}</code>
                                        <CopyButton text={`npx degit ${repo.full_name}`} label="" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div className={styles.sidebarCard}>
                        <h3 className={styles.sidebarTitle}>Details</h3>
                        <div className={styles.metaList}>
                            {repo.last_updated && (
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Last Update</span>
                                    <span className={styles.metaValue}>{formatDate(repo.last_updated)}</span>
                                </div>
                            )}
                            {repo.shared_at && (
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Shared on GitAdda</span>
                                    <span className={styles.metaValue}>{formatDate(repo.shared_at)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    {repo.topics && Array.isArray(repo.topics) && repo.topics.length > 0 && (
                        <div className={styles.sidebarCard}>
                            <h3 className={styles.sidebarTitle}>Tags</h3>
                            <div className={styles.tags}>
                                {repo.topics.map((topic) => (
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
