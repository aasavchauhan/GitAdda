'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './CollectionDialog.module.css'
import { createCollection, updateCollection, deleteCollection } from '@/app/actions/collections'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Props {
    isOpen: boolean
    onClose: () => void
    initialData?: {
        id: string
        name: string
        description: string
        is_public: boolean
    }
}

export default function CollectionDialog({ isOpen, onClose, initialData }: Props) {
    const [name, setName] = useState(initialData?.name || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [isPublic, setIsPublic] = useState(initialData?.is_public ?? true)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name)
            setDescription(initialData.description || '')
            setIsPublic(initialData.is_public)
        } else if (isOpen && !initialData) {
            setName('')
            setDescription('')
            setIsPublic(true)
        }
    }, [isOpen, initialData])

    if (!isOpen || !mounted) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setIsLoading(true)
        try {
            if (initialData) {
                await updateCollection(initialData.id, name, description, isPublic)
                toast.success('Collection updated')
            } else {
                await createCollection(name, description, isPublic)
                toast.success('Collection created')
            }
            router.refresh()
            onClose()
        } catch (error) {
            console.error(error)
            toast.error('Failed to save collection')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!initialData) return
        if (!confirm('Are you sure you want to delete this collection? This action cannot be undone.')) return

        setIsLoading(true)
        try {
            await deleteCollection(initialData.id)
            toast.success('Collection deleted')
            router.refresh()
            onClose()
        } catch (error) {
            console.error(error)
            toast.error('Failed to delete collection')
            setIsLoading(false)
        }
    }

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.dialog} onClick={e => e.stopPropagation()}>
                <h2 className={styles.header}>
                    {initialData ? 'Edit Collection' : 'New Collection'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label className={styles.label}>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className={styles.input}
                            placeholder="e.g. My Favorite Tools"
                            autoFocus
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className={styles.textarea}
                            placeholder="What is this collection about?"
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.checkboxWrapper}>
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={e => setIsPublic(e.target.checked)}
                            />
                            <span className={styles.label} style={{ marginBottom: 0 }}>Public Collection</span>
                        </label>
                    </div>
                    <div className={styles.actions}>
                        {initialData && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className={styles.deleteBtn}
                                disabled={isLoading}
                            >
                                Delete
                            </button>
                        )}
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitBtn} disabled={isLoading || !name.trim()}>
                            {isLoading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    )
}
