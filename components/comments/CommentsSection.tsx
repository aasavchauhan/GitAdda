'use client'

import React, { useState } from 'react'
import { Comment, addComment } from '@/app/actions/comments'
import CommentItem from './CommentItem'
import styles from './Comments.module.css'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CommentsSectionProps {
    repoId: string
    initialComments: Comment[]
    currentUserId?: string
}

export default function CommentsSection({ repoId, initialComments, currentUserId }: CommentsSectionProps) {
    const [commentText, setCommentText] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!commentText.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            await addComment(repoId, commentText)
            setCommentText('')
            toast.success('Comment added')
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error('Failed to post comment')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className={styles.section} id="comments">
            <h2 className={styles.header}>
                <MessageSquare className="w-5 h-5" />
                Comments
                <span className={styles.count}>({initialComments.length})</span>
            </h2>

            {currentUserId ? (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.textareaWrapper}>
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className={styles.textarea}
                            placeholder="Leave a comment..."
                            disabled={isSubmitting}
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isSubmitting || !commentText.trim()}
                            >
                                {isSubmitting ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className={styles.loginPrompt}>
                    Please <Link href={`/login?next=/repo/${repoId}`} className={styles.loginLink}>log in</Link> to join the discussion.
                </div>
            )}

            <div className={styles.list}>
                {initialComments.length > 0 ? (
                    initialComments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUserId={currentUserId}
                            repoId={repoId}
                        />
                    ))
                ) : (
                    <div className="text-center text-[var(--text-muted)] py-8 font-mono text-sm">
                        No comments yet. Be the first to share your thoughts!
                    </div>
                )}
            </div>
        </section>
    )
}
