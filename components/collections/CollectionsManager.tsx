'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2 } from 'lucide-react'
import styles from './CollectionsManager.module.css'
import CollectionDialog from './CollectionDialog'

interface Collection {
    id: string
    name: string
    description: string | null
    is_public: boolean
    emoji?: string
    collection_items: { count: number }[]
}

interface Props {
    collections: any[]
}

export default function CollectionsManager({ collections }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingCollection, setEditingCollection] = useState<Collection | undefined>(undefined)

    const handleEdit = (e: React.MouseEvent, collection: any) => {
        e.preventDefault()
        e.stopPropagation()
        setEditingCollection(collection)
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Collections</h1>
                    <p className={styles.subtitle}>
                        Curated lists of repositories organized by theme
                    </p>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className={styles.newCollectionBtn}
                    >
                        <Plus className="w-4 h-4" />
                        New Collection
                    </button>
                </div>

                {collections.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyEmoji}>📂</div>
                        <h2 className={styles.emptyTitle}>No collections yet</h2>
                        <p className={styles.emptyDesc}>
                            Start exploring repositories and save them to your first collection!
                        </p>
                        <Link href="/explore" className={styles.exploreBtn}>
                            Explore Repos
                        </Link>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {collections.map((collection) => (
                            <Link
                                href={`/collections/${collection.id}`}
                                key={collection.id}
                                className={styles.card}
                            >
                                <button
                                    className={styles.editBtn}
                                    onClick={(e) => handleEdit(e, collection)}
                                    aria-label="Edit collection"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>

                                <div className={styles.cardEmoji}>
                                    {collection.emoji || '📁'}
                                </div>
                                <h3 className={styles.cardTitle}>{collection.name}</h3>
                                <p className={styles.cardDesc}>
                                    {collection.description || 'No description provided'}
                                </p>
                                <span className={styles.cardCount}>
                                    {collection.collection_items?.[0]?.count || 0} repos
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <CollectionDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            <CollectionDialog
                isOpen={!!editingCollection}
                onClose={() => setEditingCollection(undefined)}
                initialData={editingCollection ? {
                    id: editingCollection.id,
                    name: editingCollection.name,
                    description: editingCollection.description || '',
                    is_public: editingCollection.is_public ?? true
                } : undefined}
            />
        </main>
    )
}
