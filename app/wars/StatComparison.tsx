'use client'

import { useEffect, useState } from 'react'
import styles from './StatComparison.module.css'

interface RepoStats {
    stars: number
    forks: number
}

interface StatComparisonProps {
    leftStats: RepoStats
    rightStats: RepoStats
}

export default function StatComparison({ leftStats, rightStats }: StatComparisonProps) {
    const [animate, setAnimate] = useState(false)

    useEffect(() => {
        // Trigger animation on mount
        const timer = setTimeout(() => setAnimate(true), 100)
        return () => clearTimeout(timer)
    }, [leftStats, rightStats]) // Re-run when stats change (new battle)

    const calculateWidth = (val1: number, val2: number) => {
        const total = val1 + val2
        if (total === 0) return 0
        // Min width 10%, Max width 90%
        const percentage = (val1 / total) * 100
        return Math.max(10, Math.min(90, percentage))
    }

    return (
        <div className={styles.container}>
            <StatRow
                label="Stars"
                leftValue={leftStats.stars}
                rightValue={rightStats.stars}
                animate={animate}
                calculateWidth={calculateWidth}
            />
            <div style={{ height: 12 }}></div>
            <StatRow
                label="Forks"
                leftValue={leftStats.forks}
                rightValue={rightStats.forks}
                animate={animate}
                calculateWidth={calculateWidth}
            />
        </div>
    )
}

import { Icons } from '@/components/ui/Icons'

function StatRow({ label, leftValue, rightValue, animate, calculateWidth }: any) {
    const isLeftWinner = leftValue > rightValue
    const isRightWinner = rightValue > leftValue

    return (
        <div className={styles.statRow}>
            <div className={styles.label}>{label}</div>
            <div className={styles.barContainer}>

                {/* Left Side */}
                <div className={`${styles.valueWrapper} ${styles.left}`}>
                    {isLeftWinner && <Icons.Trophy className={styles.winnerIcon} size={14} />}
                    <div className={`${styles.value} ${styles.left} ${isLeftWinner ? styles.winner : ''}`}>
                        {leftValue.toLocaleString()}
                    </div>
                </div>

                <div className={`${styles.barWrapper} ${styles.left}`}>
                    <div
                        className={`${styles.bar} ${styles.left}`}
                        style={{ width: animate ? `${calculateWidth(leftValue, rightValue)}%` : '0%' }}
                    />
                </div>

                <div className={styles.vsBadge}>VS</div>

                <div className={`${styles.barWrapper} ${styles.right}`}>
                    <div
                        className={`${styles.bar} ${styles.right}`}
                        style={{ width: animate ? `${calculateWidth(rightValue, leftValue)}%` : '0%' }}
                    />
                </div>

                {/* Right Side */}
                <div className={`${styles.valueWrapper} ${styles.right}`}>
                    <div className={`${styles.value} ${styles.right} ${isRightWinner ? styles.winner : ''}`}>
                        {rightValue.toLocaleString()}
                    </div>
                    {isRightWinner && <Icons.Trophy className={styles.winnerIcon} size={14} />}
                </div>
            </div>
        </div>
    )
}
