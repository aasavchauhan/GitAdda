'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Developer } from '@/app/actions/developers'
import { FolderGit2, Github } from 'lucide-react'
import FollowButton from './FollowButton'

export default function DeveloperCard({ developer, rank }: { developer: Developer; rank: number }) {
    return (
        <div className="group relative flex flex-col items-center bg-[var(--glass-surface)] border border-[var(--glass-border)] 
                       rounded-2xl p-6 transition-all duration-300 hover:border-[var(--accent-cyan)]/50 hover:shadow-[var(--shadow-glow)]">

            {/* Rank Badge */}
            <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full 
                          bg-[var(--bg-elevated)] border border-[var(--border-default)] font-mono text-sm
                          text-[var(--text-secondary)] group-hover:text-[var(--accent-cyan)] group-hover:border-[var(--accent-cyan)]/50 transition-colors z-20">
                #{rank}
            </div>

            {/* Clickable Area Wrapper */}
            <Link href={`/profile/${developer.username}`} className="flex flex-col items-center w-full h-full">

                {/* Avatar */}
                <div className="relative w-20 h-20 mb-4 rounded-full overflow-hidden border-2 border-[var(--glass-border)] 
                              group-hover:border-[var(--accent-cyan)] transition-colors shadow-lg">
                    <Image
                        src={developer.avatar_url || `https://ui-avatars.com/api/?name=${developer.full_name || developer.username}&background=0D1117&color=00E5CC`}
                        alt={developer.username}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Info */}
                <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors truncate max-w-[200px]">
                        {developer.full_name || developer.username}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] font-mono">@{developer.username}</p>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mb-4 flex-wrap justify-center">
                    <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]" title="Repos Shared">
                        <FolderGit2 className="w-4 h-4 text-[var(--accent-cyan)]" />
                        <span>{developer.shared_count}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]" title="Followers">
                        <svg className="w-4 h-4 text-[var(--accent-coral)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span>{developer.follower_count}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]" title="Likes Received">
                        <svg className="w-4 h-4 text-[var(--accent-coral)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        <span>{developer.likes_received}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]" title="Collections">
                        <FolderGit2 className="w-4 h-4 text-[var(--accent-primary)]" />
                        <span>{developer.collections_count}</span>
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {developer.tech_stack?.slice(0, 3).map((tech) => (
                        <span
                            key={tech}
                            className="px-2 py-1 text-xs rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)]
                                     text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors"
                        >
                            {tech}
                        </span>
                    ))}
                    {(developer.tech_stack?.length || 0) > 3 && (
                        <span className="px-2 py-1 text-xs text-[var(--text-muted)]">
                            +{(developer.tech_stack?.length || 0) - 3}
                        </span>
                    )}
                </div>

                {/* Bio (Optional) */}
                {developer.bio && (
                    <p className="text-xs text-[var(--text-secondary)] text-center line-clamp-2 mb-4 h-8">
                        {developer.bio}
                    </p>
                )}

                {/* Spacer to push footer down if needed */}
                <div className="flex-grow" />
            </Link>

            {/* Actions Footer */}
            <div className="mt-4 pt-4 border-t border-[var(--border-default)] w-full flex items-center justify-between z-20">
                <FollowButton targetUserId={developer.id} isCompact />

                {developer.github_username && (
                    <a href={`https://github.com/${developer.github_username}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                        <Github className="w-3 h-3" />
                        <span className="hidden sm:inline">GitHub</span>
                    </a>
                )}
            </div>
        </div>
    )
}
