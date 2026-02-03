'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Icons } from '@/components/ui/Icons'
import { submitVote } from './actions'
import styles from './page.module.css'
import BattleCard from './BattleCard'
import StatComparison from './StatComparison'

interface Repo {
    id: string
    name: string
    owner: string
    description: string | null
    stars: number
    forks: number
    use_case: string | null
    purpose: string | null
    languages: string[]
}

interface ArenaProps {
    repo1: Repo
    repo2: Repo
}

export default function Arena({
    repo1,
    repo2,
}: ArenaProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [votingFor, setVotingFor] = useState<'left' | 'right' | null>(null)
    const [streak, setStreak] = useState(0)
    const [pressedKey, setPressedKey] = useState<'left' | 'right' | null>(null)
    const [isLeaving, setIsLeaving] = useState(false)

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isPending || votingFor || isLeaving) return

            if (e.key === 'ArrowLeft') {
                setPressedKey('left')
                handleVote(repo1.id, repo2.id, 'left')
            } else if (e.key === 'ArrowRight') {
                setPressedKey('right')
                handleVote(repo2.id, repo1.id, 'right')
            }
        }

        const handleKeyUp = () => setPressedKey(null)

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [isPending, votingFor, isLeaving, repo1.id, repo2.id])

    // Reset leaving state when repos change
    useEffect(() => {
        setIsLeaving(false)
    }, [repo1.id, repo2.id])

    const handleVote = async (winnerId: string, loserId: string, side: 'left' | 'right') => {
        if (votingFor || isLeaving) return
        setVotingFor(side)

        // Optimistic UI updates
        setStreak(s => s + 1)

        // Delay actual submission to show animation
        setTimeout(() => {
            setIsLeaving(true)
            startTransition(async () => {
                await submitVote(winnerId, loserId)
                setVotingFor(null)
                setPressedKey(null)
            })
        }, 600) // Match animation duration
    }

    const handleSkip = () => {
        if (isPending || isLeaving) return
        setIsLeaving(true)
        startTransition(() => {
            router.refresh()
        })
    }

    return (
        <div className={styles.main}>
            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>Repo Wars</h1>
                <p className={styles.subtitle}>
                    Who builds it better? Choose your fighter.
                </p>
            </header>

            <div className={`${styles.arenaContainer} ${votingFor ? styles.shake : ''} ${!isLeaving ? styles.entering : ''}`}>
                {streak > 0 && (
                    <div className={styles.streakBadge}>
                        <Icons.Flame className={styles.streakIcon} />
                        <span>{streak} Vote Streak</span>
                    </div>
                )}

                <div className={styles.battleField}>
                    {/* Left Challenger */}
                    <div
                        className={`
                            ${styles.cardWrapper} 
                            ${votingFor === 'left' ? styles.winning : ''}
                            ${votingFor === 'right' ? styles.exitingLeft : ''}
                        `}
                        onClick={() => handleVote(repo1.id, repo2.id, 'left')}
                    >
                        <BattleCard repo={repo1} side="left" />
                    </div>

                    {/* VS Core */}
                    <div className={styles.vsCore}>
                        <div className={styles.vsBadgeBig}></div>
                    </div>

                    {/* Right Challenger */}
                    <div
                        className={`
                            ${styles.cardWrapper}
                            ${votingFor === 'right' ? styles.winning : ''}
                            ${votingFor === 'left' ? styles.exitingRight : ''}
                        `}
                        onClick={() => handleVote(repo2.id, repo1.id, 'right')}
                    >
                        <BattleCard repo={repo2} side="right" />
                    </div>
                </div>

                <div className={styles.controls}>
                    <button className={styles.skipBtn} onClick={handleSkip} disabled={isPending || isLeaving}>
                        {isPending || isLeaving ? 'Loading...' : 'Skip Matchup'}
                    </button>
                </div>

                <StatComparison
                    leftStats={{ stars: repo1.stars, forks: repo1.forks }}
                    rightStats={{ stars: repo2.stars, forks: repo2.forks }}
                />

                <div className={styles.keyboardHint}>
                    Press <kbd className={`${styles.key} ${pressedKey === 'left' ? styles.active : ''}`}>←</kbd>
                    {' '}or{' '}
                    <kbd className={`${styles.key} ${pressedKey === 'right' ? styles.active : ''}`}>→</kbd>
                    to vote
                </div>

                <Link href="/wars/leaderboard" className={styles.leaderboardLink}>
                    <Icons.Trophy size={16} />
                    View Global Leaderboard
                </Link>
            </div>
        </div>
    )
}
