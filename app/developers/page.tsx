import { getTopDevelopers } from '@/app/actions/developers'
import DeveloperCard from '@/components/developers/DeveloperCard'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Top Developers | GitAdda',
    description: 'Discover the top contributors and curators in the GitAdda community.',
}

export default async function DevelopersPage() {
    const developers = await getTopDevelopers()

    return (
        <main className="min-h-screen py-12 relative">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 blur-[100px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[var(--accent-secondary)]/5 blur-[100px] rounded-full mix-blend-screen" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent-cyan)] to-[var(--text-primary)] bg-[200%_auto] animate-gradient">
                        Top Developers
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Meet the curators and contributors shaping the GitAdda community.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {developers.map((developer, index) => (
                        <DeveloperCard
                            key={developer.id}
                            developer={developer}
                            rank={index + 1}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {developers.length === 0 && (
                    <div className="text-center py-20 bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-2xl">
                        <div className="text-4xl mb-4">👥</div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No developers found yet</h3>
                        <p className="text-[var(--text-secondary)]">
                            Be the first to join and create a collection!
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}
