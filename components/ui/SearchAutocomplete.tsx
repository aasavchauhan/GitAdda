'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { searchSuggestions as fetchSuggestions } from '@/app/actions/search'
import { getSearchHistory, saveSearchHistory } from '@/app/actions/search'
import { useRouter } from 'next/navigation'
import styles from './SearchAutocomplete.module.css'

interface SearchAutocompleteProps {
    value: string
    onChange: (value: string) => void
    onSubmit: (query: string) => void
    placeholder?: string
    className?: string
    inputClassName?: string
}

interface Suggestion {
    name: string
    id: string
}

interface HistoryItem {
    id: string
    query: string
}

export default function SearchAutocomplete({
    value,
    onChange,
    onSubmit,
    placeholder = 'Search repositories...',
    className = '',
    inputClassName = '',
}: SearchAutocompleteProps) {
    const router = useRouter()
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [loading, setLoading] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Fetch suggestions when typing
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)

        if (!value || value.length < 2) {
            setSuggestions([])
            return
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true)
            const results = await fetchSuggestions(value)
            setSuggestions(results)
            setSelectedIndex(-1)
            setLoading(false)
        }, 300)

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [value])

    // Fetch search history on focus
    const handleFocus = useCallback(async () => {
        setShowDropdown(true)
        if (!value) {
            const h = await getSearchHistory()
            setHistory(h)
        }
    }, [value])

    // Close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        const items = value ? suggestions : history
        if (!showDropdown || items.length === 0) {
            if (e.key === 'Enter') {
                handleSubmit(value)
            }
            return
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(prev => Math.min(prev + 1, items.length - 1))
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(prev => Math.max(prev - 1, -1))
                break
            case 'Enter':
                e.preventDefault()
                if (selectedIndex >= 0) {
                    const item = items[selectedIndex]
                    const q = 'query' in item ? item.query : item.name
                    onChange(q)
                    handleSubmit(q)
                } else {
                    handleSubmit(value)
                }
                break
            case 'Escape':
                setShowDropdown(false)
                break
        }
    }

    const handleSubmit = async (query: string) => {
        setShowDropdown(false)
        if (query.trim()) {
            saveSearchHistory(query.trim())
        }
        onSubmit(query)
    }

    const handleSuggestionClick = (suggestion: Suggestion) => {
        onChange(suggestion.name)
        handleSubmit(suggestion.name)
    }

    const handleHistoryClick = (query: string) => {
        onChange(query)
        handleSubmit(query)
    }

    const showSuggestions = showDropdown && value && suggestions.length > 0
    const showHistory = showDropdown && !value && history.length > 0

    return (
        <div ref={wrapperRef} className={`${styles.wrapper} ${className}`}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={`${styles.input} ${inputClassName}`}
                autoComplete="off"
            />

            {(showSuggestions || showHistory) && (
                <div className={styles.dropdown}>
                    {showSuggestions && (
                        <>
                            <div className={styles.dropdownHeader}>Suggestions</div>
                            {suggestions.map((s, i) => (
                                <button
                                    key={s.id}
                                    className={`${styles.dropdownItem} ${i === selectedIndex ? styles.selected : ''}`}
                                    onClick={() => handleSuggestionClick(s)}
                                    onMouseEnter={() => setSelectedIndex(i)}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.itemIcon}>
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.35-4.35" />
                                    </svg>
                                    <span className={styles.itemText}>{s.name}</span>
                                </button>
                            ))}
                        </>
                    )}

                    {showHistory && (
                        <>
                            <div className={styles.dropdownHeader}>Recent Searches</div>
                            {history.map((h, i) => (
                                <button
                                    key={h.id}
                                    className={`${styles.dropdownItem} ${i === selectedIndex ? styles.selected : ''}`}
                                    onClick={() => handleHistoryClick(h.query)}
                                    onMouseEnter={() => setSelectedIndex(i)}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.itemIcon}>
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <span className={styles.itemText}>{h.query}</span>
                                </button>
                            ))}
                        </>
                    )}
                </div>
            )}

            {loading && <div className={styles.loadingDot} />}
        </div>
    )
}
