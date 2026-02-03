'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/Icons'
import styles from './page.module.css'

interface ShareFormProps {
    userId: string
    accessToken: string | null
    githubUsername: string | null
}

interface GitHubRepo {
    id: number
    name: string
    full_name: string
    description: string
    html_url: string
    stargazers_count: number
    forks_count: number
    language: string
    topics: string[]
    owner: {
        avatar_url: string
    }
}

const USE_CASES = [
    'SaaS', 'AI/ML', 'Backend', 'Frontend', 'DevOps',
    'Mobile', 'CLI', 'Database', 'API', 'Other'
]

export default function ShareForm({ userId, accessToken, githubUsername }: ShareFormProps) {
    const router = useRouter()
    const supabase = createClient()

    const [mode, setMode] = useState<'select' | 'url'>('select')
    const [myRepos, setMyRepos] = useState<GitHubRepo[]>([])
    const [loadingRepos, setLoadingRepos] = useState(true)
    const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)

    // URL mode states
    const [repoUrl, setRepoUrl] = useState('')
    const [loading, setLoading] = useState(false)

    // Shared states
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [useCase, setUseCase] = useState('')
    const [whyShare, setWhyShare] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    // Fetch user's GitHub repos
    useEffect(() => {
        if (githubUsername) {
            fetchMyRepos()
        } else {
            setLoadingRepos(false)
        }
    }, [githubUsername])

    const fetchMyRepos = async () => {
        try {
            const headers: Record<string, string> = {
                'Accept': 'application/vnd.github.v3+json'
            }
            if (accessToken) {
                headers['Authorization'] = `token ${accessToken}`
            }

            const response = await fetch(
                `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`,
                { headers }
            )
            if (response.ok) {
                const data = await response.json()
                setMyRepos(data)
            }
        } catch (err) {
            console.error('Failed to fetch repos:', err)
        } finally {
            setLoadingRepos(false)
        }
    }

    const fetchRepoByUrl = async () => {
        setError('')
        setSelectedRepo(null)

        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/)
        if (!match) {
            setError('Please enter a valid GitHub repository URL')
            return
        }

        const [, owner, repo] = match
        setLoading(true)

        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo.replace('.git', '')}`)
            if (!response.ok) throw new Error('Repository not found')
            const data = await response.json()
            setSelectedRepo(data)
        } catch (err) {
            setError('Could not fetch repository. Make sure it exists and is public.')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedRepo || !useCase) return

        setSubmitting(true)
        setError('')

        try {
            // Check if already exists
            const { data: existing } = await supabase
                .from('repositories')
                .select('id')
                .eq('github_url', selectedRepo.html_url)
                .single()

            if (existing) {
                setError('This repository is already listed on GitAdda!')
                setSubmitting(false)
                return
            }

            const { data, error: dbError } = await supabase.from('repositories').insert({
                shared_by: userId,
                github_url: selectedRepo.html_url,
                name: selectedRepo.name,
                owner: selectedRepo.full_name.split('/')[0],
                description: selectedRepo.description,
                stars: selectedRepo.stargazers_count,
                forks: selectedRepo.forks_count,
                languages: selectedRepo.language ? [selectedRepo.language] : [],
                topics: selectedRepo.topics || [],
                use_case: useCase.toLowerCase(),
                purpose: whyShare || null,
            }).select().single()

            if (dbError) throw dbError

            // Show success state briefly before redirect
            setSuccess(true)

            // Prefetch the page to speed up the actual navigation
            router.prefetch(`/repo/${data.id}`)

            setTimeout(() => {
                router.push(`/repo/${data.id}`)
                router.refresh()
            }, 1000)

        } catch (err: any) {
            setError(err.message || 'Failed to share repository')
            setSubmitting(false)
        }
    }

    const filteredRepos = myRepos.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (success) {
        return (
            <div className={styles.formContainer} style={{ minHeight: '400px', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    background: 'rgba(0, 229, 204, 0.1)',
                    padding: '2rem',
                    borderRadius: '50%',
                    marginBottom: '1.5rem',
                    boxShadow: '0 0 30px rgba(0, 229, 204, 0.2)'
                }}>
                    <Icons.Check className="w-12 h-12 text-cyan" />
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan to-blue-500 mb-2">
                    Repository Shared!
                </h2>
                <p className="text-slate-400">Taking you to the repo page...</p>
            </div>
        )
    }

    return (
        <div className={styles.formContainer}>
            {/* Mode Toggle */}
            <div className={styles.modeToggle}>
                <button
                    type="button"
                    className={`${styles.modeBtn} ${mode === 'select' ? styles.modeBtnActive : ''}`}
                    onClick={() => { setMode('select'); setSelectedRepo(null) }}
                    disabled={submitting}
                >
                    <Icons.Book /> My Repos
                </button>
                <button
                    type="button"
                    className={`${styles.modeBtn} ${mode === 'url' ? styles.modeBtnActive : ''}`}
                    onClick={() => { setMode('url'); setSelectedRepo(null) }}
                    disabled={submitting}
                >
                    <Icons.Link /> Paste URL
                </button>
            </div>

            {/* Select Mode: Show user's repos */}
            {mode === 'select' && (
                <div className={styles.repoSelector}>
                    <input
                        type="text"
                        placeholder="Search your repos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                        disabled={submitting}
                    />

                    <div className={styles.repoGrid}>
                        {loadingRepos ? (
                            <div className={styles.loadingState}>Loading your repos...</div>
                        ) : filteredRepos.length > 0 ? (
                            filteredRepos.map(repo => (
                                <button
                                    key={repo.id}
                                    type="button"
                                    className={`${styles.repoOption} ${selectedRepo?.id === repo.id ? styles.repoOptionSelected : ''}`}
                                    onClick={() => setSelectedRepo(repo)}
                                    disabled={submitting}
                                >
                                    <div className={styles.repoOptionHeader}>
                                        <span className={styles.repoOptionName}>{repo.name}</span>
                                        {repo.language && <span className={styles.repoOptionLang}>{repo.language}</span>}
                                    </div>
                                    <p className={styles.repoOptionDesc}>{repo.description || 'No description'}</p>
                                    <div className={styles.repoOptionStats}>
                                        <span><Icons.Star /> {repo.stargazers_count}</span>
                                        <span><Icons.GitFork /> {repo.forks_count}</span>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                {githubUsername ? 'No repos found' : 'Could not fetch your repos'}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* URL Mode: Paste any repo URL */}
            {mode === 'url' && (
                <div className={styles.urlSection}>
                    <div className={styles.urlInput}>
                        <input
                            type="url"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            placeholder="https://github.com/username/repo"
                            className={styles.input}
                            disabled={submitting}
                        />
                        <button
                            type="button"
                            onClick={fetchRepoByUrl}
                            disabled={loading || !repoUrl || submitting}
                            className={styles.fetchBtn}
                        >
                            {loading ? 'Fetching...' : 'Fetch'}
                        </button>
                    </div>
                </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            {/* Selected Repo Form */}
            {selectedRepo && (
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Preview Card */}
                    <div className={styles.preview}>
                        <div className={styles.previewHeader}>
                            <img src={selectedRepo.owner.avatar_url} alt="" className={styles.previewAvatar} />
                            <div>
                                <h3 className={styles.previewName}>{selectedRepo.full_name}</h3>
                                <p className={styles.previewDesc}>{selectedRepo.description || 'No description'}</p>
                            </div>
                        </div>
                        <div className={styles.previewStats}>
                            <span><Icons.Star /> {selectedRepo.stargazers_count}</span>
                            <span><Icons.GitFork /> {selectedRepo.forks_count}</span>
                            {selectedRepo.language && <span><Icons.Code /> {selectedRepo.language}</span>}
                        </div>
                        {selectedRepo.topics && selectedRepo.topics.length > 0 && (
                            <div className={styles.previewTopics}>
                                {selectedRepo.topics.slice(0, 5).map(topic => (
                                    <span key={topic} className={styles.topic}>{topic}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Use Case */}
                    <div className={styles.section}>
                        <label className={styles.label}>What's the use case?</label>
                        <div className={styles.useCases}>
                            {USE_CASES.map(uc => (
                                <button
                                    key={uc}
                                    type="button"
                                    className={`${styles.useCaseBtn} ${useCase === uc ? styles.useCaseActive : ''}`}
                                    onClick={() => setUseCase(uc)}
                                    disabled={submitting}
                                >
                                    {uc}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Why Share */}
                    <div className={styles.section}>
                        <label className={styles.label}>Why share this? (optional)</label>
                        <textarea
                            value={whyShare}
                            onChange={(e) => setWhyShare(e.target.value)}
                            placeholder="e.g., Great for building AI chatbots..."
                            className={styles.textarea}
                            rows={3}
                            disabled={submitting}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={submitting || !useCase}
                        className={styles.submitBtn}
                    >
                        {submitting ? 'Sharing...' : <><Icons.Plus /> Share Repository</>}
                    </button>
                </form>
            )}
        </div>
    )
}
