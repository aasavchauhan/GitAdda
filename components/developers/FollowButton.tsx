'use client'

import { useState, useEffect } from 'react'
import { toggleFollow, getFollowStatus } from '@/app/actions/follows'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import styles from './FollowButton.module.css'

interface FollowButtonProps {
    targetUserId: string
    className?: string
    isCompact?: boolean
}

export default function FollowButton({ targetUserId, className, isCompact = false }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        getFollowStatus(targetUserId).then((status) => {
            setIsFollowing(status.isFollowing)
        })
    }, [targetUserId])

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isLoading) return

        setIsLoading(true)
        const previousState = isFollowing
        setIsFollowing(!previousState) // Optimistic

        try {
            const { isFollowing: newState } = await toggleFollow(targetUserId)
            setIsFollowing(newState)
            router.refresh()
            toast.success(newState ? 'Following user' : 'Unfollowed user')
        } catch (error: any) {
            setIsFollowing(previousState)
            toast.error(error.message || 'Failed to update follow status')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleToggle}
            className={`${styles.button} ${isFollowing ? styles.following : ''} ${className} ${isCompact ? styles.compact : ''}`}
        >
            {isFollowing ? 'Following' : 'Follow'}
        </button>
    )
}
