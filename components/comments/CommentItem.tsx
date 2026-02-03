'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { Comment, deleteComment } from '@/app/actions/comments'
import styles from './Comments.module.css'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CommentItemProps {
    comment: Comment
    currentUserId?: string
    repoId: string
}

export default function CommentItem({ comment, currentUserId, repoId }: CommentItemProps) {
    const router = useRouter()
    const isOwner = currentUserId === comment.user_id
    const [isDeleting, setIsDeleting] = React.useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this comment?')) return

        setIsDeleting(true)
        try {
            await deleteComment(comment.id, repoId)
            toast.success('Comment deleted')
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error('Failed to delete comment')
            setIsDeleting(false)
        }
    }

    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return 'just now'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
        return date.toLocaleDateString()
    }

    return (
        <div className={styles.comment}>
            <Link href={`/profile/${comment.profiles.username}`} className={styles.avatar}>
                <Image
                    src={comment.profiles.avatar_url || `https://ui-avatars.com/api/?name=${comment.profiles.username}&background=0D1117&color=00E5CC`}
                    alt={comment.profiles.username}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                />
            </Link>

            <div className={styles.contentWrapper}>
                <div className={styles.commentHeader}>
                    <div className={styles.userInfo}>
                        <Link href={`/profile/${comment.profiles.username}`} className={styles.username}>
                            {comment.profiles.username}
                        </Link>
                        <span className={styles.time}>{timeAgo(comment.created_at)}</span>
                    </div>

                    {isOwner && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className={styles.deleteBtn}
                            title="Delete comment"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
                <div className={styles.body}>{comment.content}</div>
            </div>
        </div>
    )
}
