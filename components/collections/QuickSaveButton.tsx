'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Icons } from '@/components/ui/Icons'
import styles from './QuickSaveButton.module.css'
import { addToCollection, removeFromCollection, createCollection } from '@/app/actions/collections'

interface Collection {
    id: string
    name: string
}

interface Props {
    repoId: string
    initialSavedCollectionIds?: string[]
    userCollections?: Collection[]
    className?: string
}

export default function QuickSaveButton({
    repoId,
    initialSavedCollectionIds = [],
    userCollections = [],
    className = ''
}: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [savedIds, setSavedIds] = useState<string[]>(initialSavedCollectionIds)
    const [collections, setCollections] = useState(userCollections)
    const [isCreating, setIsCreating] = useState(false)
    const [newColName, setNewColName] = useState('')
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })

    // Handle window resize/scroll close to avoid floating menu detachment
    useEffect(() => {
        const handleResize = () => setIsOpen(false)
        window.addEventListener('resize', handleResize)
        window.addEventListener('scroll', handleResize, { capture: true })
        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('scroll', handleResize, { capture: true })
        }
    }, [])

    const toggleOpen = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            // Position above the button, right aligned
            setMenuPosition({
                top: rect.top, // We'll handle "bottom" alignment via CSS transform or calculation
                left: rect.right
            })
        }
        setIsOpen(!isOpen)
    }

    async function toggleCollection(colId: string) {
        const isSelected = savedIds.includes(colId)
        // Optimistic
        const nextIds = isSelected
            ? savedIds.filter(id => id !== colId)
            : [...savedIds, colId]

        setSavedIds(nextIds)

        try {
            if (isSelected) {
                await removeFromCollection(colId, repoId)
            } else {
                await addToCollection(colId, repoId)
            }
        } catch (e) {
            console.error(e)
            setSavedIds(savedIds) // Revert
        }
    }

    async function handleCreate() {
        if (!newColName.trim()) return
        setIsCreating(true)

        try {
            const newCol = await createCollection(newColName, '', true)
            if (newCol) {
                setCollections([newCol, ...collections])
                setNewColName('')
                // Auto add
                await addToCollection(newCol.id, repoId)
                setSavedIds(prev => [...prev, newCol.id])
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsCreating(false)
        }
    }

    const isSaved = savedIds.length > 0

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={toggleOpen}
                className={`${styles.button} ${className}`}
                title="Save to collection"
                aria-label="Save to collection"
            >
                <Icons.Bookmark
                    className={`${styles.icon} ${isSaved ? styles.saved : styles.notSaved}`}
                />
            </button>

            {isOpen && createPortal(
                <div className="fixed inset-0 z-[9999] isolate">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-transparent"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsOpen(false)
                        }}
                    />

                    {/* Menu */}
                    <div
                        className={styles.menu}
                        style={{
                            position: 'fixed',
                            top: 'auto',
                            bottom: `${window.innerHeight - menuPosition.top + 10}px`,
                            left: 'auto',
                            right: `${window.innerWidth - menuPosition.left - 10}px`,
                            transform: 'none', // Reset CSS transform if any
                            zIndex: 10000
                        }}
                        onClick={e => { e.preventDefault(); e.stopPropagation() }}
                    >
                        <div className={styles.menuHeader}>Save to Collection</div>
                        <div className={styles.menuList}>
                            {collections.length === 0 && (
                                <div className={styles.emptyState}>No collections yet</div>
                            )}
                            {collections.map(col => (
                                <div
                                    key={col.id}
                                    className={styles.menuItem}
                                    onClick={() => toggleCollection(col.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            toggleCollection(col.id)
                                        }
                                    }}
                                    aria-label={`Toggle ${col.name} collection`}
                                >
                                    <div className={`${styles.checkbox} ${savedIds.includes(col.id) ? styles.checked : ''}`}>
                                        {savedIds.includes(col.id) && <Icons.Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="truncate">{col.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.createRow}>
                            <input
                                className={styles.input}
                                placeholder="New Collection..."
                                aria-label="New collection name"
                                value={newColName}
                                onClick={(e) => e.stopPropagation()}
                                onChange={e => setNewColName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                            />
                            <button
                                className={styles.createBtn}
                                onClick={handleCreate}
                                disabled={!newColName.trim() || isCreating}
                                aria-label="Create collection"
                                title="Create collection"
                            >
                                <Icons.Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
