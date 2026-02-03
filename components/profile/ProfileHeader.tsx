'use client'

import styles from './ProfileHeader.module.css'
import Image from 'next/image'
import Link from 'next/link'
import FollowButton from '@/components/developers/FollowButton'
import { Icons } from '@/components/ui/Icons'
import { Check, Github, MapPin, Link as LinkIcon } from 'lucide-react'

// Define profile type locally or import from types if available
interface ProfileHeaderProps {
    profile: {
        id: string
        username: string
        full_name: string | null
        avatar_url: string | null
        bio: string | null
        github_url: string | null // Mapping github_username to url or use github_username
        github_username?: string | null
        website_url?: string | null
        location?: string | null
        tech_stack?: string[] | null
        open_to_collab?: boolean
        looking_for_contributors?: boolean
        looking_for_feedback?: boolean
    }
    currentUser: any | null
    counts: {
        repos: number
        followers: number
        following: number
    }
}

export default function ProfileHeader({ profile, currentUser, counts }: ProfileHeaderProps) {
    const isOwnProfile = currentUser?.id === profile.id

    return (
        <div className={styles.header}>
            <div className={styles.cover} />

            <div className={styles.content}>
                <div className={styles.mainInfo}>
                    <div className={styles.avatarWrapper}>
                        {profile.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.username}
                                className={styles.avatar}
                            />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {profile.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <div className={styles.onlineIndicator} />
                    </div>

                    <div className={styles.infoCol}>
                        <div className={styles.titleRow}>
                            <h1 className={styles.name}>{profile.full_name || profile.username}</h1>
                            <span className={styles.username}>@{profile.username}</span>
                        </div>

                        {profile.bio && <p className={styles.bio}>{profile.bio}</p>}

                        <div className={styles.statsRow}>
                            <div className={styles.stat}>
                                <strong>{counts.repos}</strong>
                                <span>Repos</span>
                            </div>
                            <div className={styles.stat}>
                                <strong>{counts.followers}</strong>
                                <span>Followers</span>
                            </div>
                            <div className={styles.stat}>
                                <strong>{counts.following}</strong>
                                <span>Following</span>
                            </div>
                        </div>

                        {/* Status Badges */}
                        <div className={styles.statusBadges}>
                            {profile.open_to_collab && (
                                <span className={`${styles.badge} ${styles.collabBadge}`}>
                                    <span className={styles.dot} />
                                    Open to Collab
                                </span>
                            )}
                            {profile.looking_for_contributors && (
                                <span className={`${styles.badge} ${styles.contribBadge}`}>
                                    Looking for Contributors
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={styles.actionsCol}>
                        {!isOwnProfile && (
                            <div className={styles.actionButtonWrapper}>
                                <FollowButton targetUserId={profile.id} />
                            </div>
                        )}

                        <div className={styles.socialLinks}>
                            {(profile.github_username || profile.github_url) && (
                                <a
                                    href={profile.github_url || `https://github.com/${profile.github_username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    title="GitHub"
                                >
                                    <Github size={20} />
                                </a>
                            )}
                            {profile.website_url && (
                                <a
                                    href={profile.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    title="Website"
                                >
                                    <LinkIcon size={20} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tech Stack */}
                {profile.tech_stack && profile.tech_stack.length > 0 && (
                    <div className={styles.techStackSection}>
                        <h3 className={styles.sectionLabel}>Tech Stack</h3>
                        <div className={styles.techStack}>
                            {profile.tech_stack.map((tech) => (
                                <span key={tech} className={styles.techPill}>
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
