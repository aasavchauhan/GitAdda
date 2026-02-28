'use client'

import { useRouter } from 'next/navigation'
import { useState, FormEvent } from 'react'
import SearchAutocomplete from '@/components/ui/SearchAutocomplete'
import styles from './page.module.css'

export default function HomeSearch() {
    const router = useRouter()
    const [query, setQuery] = useState('')

    const handleSubmit = (q?: string) => {
        const searchQuery = q ?? query
        if (searchQuery.trim()) {
            router.push(`/explore?q=${encodeURIComponent(searchQuery)}`)
        } else {
            router.push('/explore')
        }
    }

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault()
        handleSubmit()
    }

    return (
        <form onSubmit={handleFormSubmit} className={styles.searchForm}>
            <div className={styles.searchWrapper}>
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <SearchAutocomplete
                    value={query}
                    onChange={setQuery}
                    onSubmit={handleSubmit}
                    placeholder="What do you want to build?"
                    inputClassName={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>
                    Search
                </button>
            </div>
        </form>
    )
}
