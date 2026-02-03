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
                <div className="flex gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                        <FolderGit2 className="w-4 h-4 text-[var(--accent-coral)]" />
                        <span>{developer.collections_count} Collections</span>
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
