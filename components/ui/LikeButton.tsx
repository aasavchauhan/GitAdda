'use client'

import { useState, useEffect } from 'react'
import { Icons } from '@/components/ui/Icons'
import { toggleLike, getLikeStatus } from '@/app/actions/likes'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import styles from './LikeButton.module.css'

interface LikeButtonProps {
    repoId: string
    initialLikes?: number
    initialIsLiked?: boolean
    className?: string
    size?: 'sm' | 'md'
}

export default function LikeButton({
    repoId,
    initialLikes = 0,
    initialIsLiked = false,
    className,
    size = 'sm'
}: LikeButtonProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [likesCount, setLikesCount] = useState(initialLikes)
    const [isLoading, setIsLoading] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const router = useRouter()

    useEffect(() => {
        getLikeStatus(repoId).then((status) => {
            setIsLiked(status.isLiked)
            setLikesCount(status.count)
        }).catch(() => {
            // Silent fail - user may not be logged in
        })
    }, [repoId])

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isLoading) return

        setIsLoading(true)
        setIsAnimating(true)

        // Optimistic update
        const previousLiked = isLiked
        const previousCount = likesCount

        setIsLiked(!previousLiked)
        setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1)

        try {
            const { isLiked: newLikedState } = await toggleLike(repoId)
            setIsLiked(newLikedState)
            router.refresh()
        } catch (error: any) {
            // Revert on error
            setIsLiked(previousLiked)
            setLikesCount(previousCount)
            if (error?.message?.includes('Authenticated')) {
                toast.error('Please sign in to like')
            } else {
                toast.error('Failed to update like')
            }
        } finally {
            setIsLoading(false)
            setTimeout(() => setIsAnimating(false), 300)
        }
    }

    const sizeClass = size === 'md' ? styles.sizeMd : styles.sizeSm

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`${styles.button} ${isLiked ? styles.active : ''} ${isAnimating ? styles.animating : ''} ${sizeClass} ${className || ''}`}
            title={isLiked ? "Unlike" : "Like"}
            aria-label={isLiked ? `Unlike (${likesCount} likes)` : `Like (${likesCount} likes)`}
        >
            <span className={styles.iconWrapper}>
                <Icons.Heart className={styles.icon} />
            </span>
            <span className={styles.count}>{likesCount}</span>
        </button>
    )
}
