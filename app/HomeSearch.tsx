'use client'

import { useRouter } from 'next/navigation'
import { useState, FormEvent } from 'react'
import styles from './page.module.css'

export default function HomeSearch() {
    const router = useRouter()
    const [query, setQuery] = useState('')

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/explore?q=${encodeURIComponent(query)}`)
        } else {
            router.push('/explore')
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.searchForm}>
            <div className={styles.searchWrapper}>
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What do you want to build?"
                    className={styles.searchInput}
                    autoComplete="off"
                />
                <button type="submit" className={styles.searchButton}>
                    Search
                </button>
            </div>
        </form>
    )
}
