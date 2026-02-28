'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import SearchAutocomplete from '@/components/ui/SearchAutocomplete'
import styles from './page.module.css'

const SORT_OPTIONS = [
    { label: 'Recent', value: 'recent' },
    { label: '⭐ Stars', value: 'stars' },
    { label: '🔀 Forks', value: 'forks' },
    { label: '🔥 Trending', value: 'trending' },
]

export default function ExploreFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initial state from URL
    const initialQuery = searchParams.get('q') || ''
    const initialUseCase = searchParams.get('use_case') || ''
    const initialSort = searchParams.get('sort') || 'recent'

    const [query, setQuery] = useState(initialQuery)
    const [useCase, setUseCase] = useState(initialUseCase)
    const [sort, setSort] = useState(initialSort)

    const updateFilters = useCallback((newQuery: string, newUseCase: string, newSort: string) => {
        const params = new URLSearchParams()
        if (newQuery) params.set('q', newQuery)
        if (newUseCase) params.set('use_case', newUseCase)
        if (newSort && newSort !== 'recent') params.set('sort', newSort)
        router.push(`/explore?${params.toString()}`, { scroll: false })
    }, [router])

    const handleSearchSubmit = (q: string) => {
        setQuery(q)
        updateFilters(q, useCase, sort)
    }

    const handleTagClick = (value: string) => {
        const newUseCase = useCase === value ? '' : value
        setUseCase(newUseCase)
        updateFilters(query, newUseCase, sort)
    }

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value
        setSort(newSort)
        updateFilters(query, useCase, newSort)
    }

    const tags = [
        { label: 'All', value: '' },
        { label: 'SaaS', value: 'saas' },
        { label: 'AI/ML', value: 'ai/ml' },
        { label: 'Backend', value: 'backend' },
        { label: 'Frontend', value: 'frontend' },
        { label: 'DevOps', value: 'devops' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Tools', value: 'tools' },
    ]

    return (
        <div className={styles.filters}>
            <div className={styles.searchForm}>
                <SearchAutocomplete
                    value={query}
                    onChange={setQuery}
                    onSubmit={handleSearchSubmit}
                    placeholder="Search repositories..."
                    inputClassName={styles.searchInput}
                />
                <button
                    className={styles.searchBtn}
                    onClick={() => handleSearchSubmit(query)}
                >
                    Search
                </button>
            </div>

            <div className={styles.filtersRow}>
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

                <select
                    className={styles.sortSelect}
                    value={sort}
                    onChange={handleSortChange}
                    aria-label="Sort by"
                >
                    {SORT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}
