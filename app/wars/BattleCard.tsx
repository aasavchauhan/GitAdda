'use client'

import { useRef, useState } from 'react'
import { Icons } from '@/components/ui/Icons'
import styles from './BattleCard.module.css'

interface BattleCardProps {
    repo: {
        id: string
        name: string
        owner: string
        description: string | null
        stars: number
        forks: number
        languages: string[]
    }
    side: 'left' | 'right'
}

export default function BattleCard({ repo, side }: BattleCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [rotation, setRotation] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return

        const card = cardRef.current
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -10 // Max 10 deg rotation
        const rotateY = ((x - centerX) / centerX) * 10

        setRotation({ x: rotateX, y: rotateY })

        // Update CSS variables for shine effect
        card.style.setProperty('--mouse-x', `${x}px`)
        card.style.setProperty('--mouse-y', `${y}px`)
    }

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 })
    }

    return (
        <div
            ref={cardRef}
            className={`${styles.card} ${styles[side]}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
            }}
        >
            <div className={styles.shine} />

            <div className={styles.content}>
                <div className={styles.header}>
                    <img
                        src={`https://github.com/${repo.owner}.png`}
                        alt={repo.owner}
                        className={styles.avatar}
                    />
                    <div className={styles.meta}>
                        <h3 className={styles.name}>{repo.name}</h3>
                        <span className={styles.owner}>{repo.owner}</span>
                    </div>
                </div>

                <p className={styles.description}>
                    {repo.description || 'No description provided.'}
                </p>

                <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{repo.stars.toLocaleString()}</span>
                        <span className={styles.statLabel}>Stars</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{repo.forks.toLocaleString()}</span>
                        <span className={styles.statLabel}>Forks</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{repo.languages[0] || 'N/A'}</span>
                        <span className={styles.statLabel}>Lang</span>
                    </div>
                </div>

                <div className={styles.topics}>
                    {repo.languages.slice(0, 3).map(lang => (
                        <span key={lang} className={styles.topic}>{lang}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}
