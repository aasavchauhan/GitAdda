'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import styles from './page.module.css'
import { normalizeUseCase, USE_CASE_LABELS, UseCaseValue } from '@/lib/use-cases'

export default function ExploreFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initial state from URL
    const initialQuery = searchParams.get('q') || ''
    const initialUseCase = normalizeUseCase(searchParams.get('use_case')) || ''

    const [query, setQuery] = useState(initialQuery)
    const [useCase, setUseCase] = useState(initialUseCase)
    const [isPending, setIsPending] = useState(false)

    // Debounce search update
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query !== initialQuery) {
                updateFilters(query, useCase)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [query])

    const updateFilters = useCallback((newQuery: string, newUseCase: string) => {
        setIsPending(true)
        const params = new URLSearchParams()
        if (newQuery) params.set('q', newQuery)
        if (newUseCase) params.set('use_case', newUseCase)

        router.push(`/explore?${params.toString()}`, { scroll: false })
        setIsPending(false)
    }, [router])

    const handleTagClick = (value: string) => {
        const newUseCase = useCase === value ? '' : value
        setUseCase(newUseCase)
        updateFilters(query, newUseCase)
    }

    const tags: Array<{ label: string; value: UseCaseValue | '' }> = [
        { label: 'All', value: '' },
        { label: USE_CASE_LABELS.saas, value: 'saas' },
        { label: USE_CASE_LABELS['ai-ml'], value: 'ai-ml' },
        { label: USE_CASE_LABELS.backend, value: 'backend' },
        { label: USE_CASE_LABELS.frontend, value: 'frontend' },
        { label: USE_CASE_LABELS.devops, value: 'devops' },
        { label: USE_CASE_LABELS.mobile, value: 'mobile' },
        { label: USE_CASE_LABELS.devtools, value: 'devtools' },
    ]

    return (
        <div className={styles.filters}>
            <div className={styles.searchForm}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search repositories..."
                    className={styles.searchInput}
                />
                <button className={`${styles.searchBtn} ${isPending ? styles.pending : ''}`} disabled={isPending}>
                    {isPending ? 'Search...' : 'Search'}
                </button>
            </div>

            <div className={styles.tags}>
                {tags.map(tag => (
                    <button
                        key={tag.value}
                        onClick={() => handleTagClick(tag.value)}
                        className={`${styles.tag} ${useCase === tag.value ? styles.tagActive : ''}`}
                    >
                        {tag.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
