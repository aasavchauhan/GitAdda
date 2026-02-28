import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import styles from './page.module.css'
import HomeSearch from './HomeSearch'
import { Icons } from '@/components/ui/Icons'
import RecentRepos from '@/components/home/RecentRepos'
import { Suspense } from 'react'
import RepoCardSkeleton from '@/components/ui/RepoCardSkeleton'

const USE_CASES = [
  { label: 'SaaS', icon: <Icons.Cloud />, query: 'saas' },
  { label: 'AI/ML', icon: <Icons.Cpu />, query: 'ai' },
  { label: 'Backend', icon: <Icons.Terminal />, query: 'backend' },
  { label: 'Frontend', icon: <Icons.Layout />, query: 'frontend' },
  { label: 'DevTools', icon: <Icons.Terminal />, query: 'devtools' },
  { label: 'Mobile', icon: <Icons.Smartphone />, query: 'mobile' },
  { label: 'Auth', icon: <Icons.Lock />, query: 'auth' },
  { label: 'Database', icon: <Icons.Database />, query: 'database' },
]

const FEATURES = [
  {
    icon: <Icons.Search />,
    title: 'Intent-Based Discovery',
    description: 'Search by what you want to build, not just keywords. Find the right tool for the job.',
  },
  {
    icon: <Icons.Sparkles />,
    title: 'Hidden Gems',
    description: 'Discover underrated repositories that deserve more attention.',
  },
  {
    icon: <Icons.Layers />,
    title: 'Curated Stacks',
    description: 'Ready-to-use repository collections for specific use cases and projects.',
  },
  {
    icon: <Icons.Users />,
    title: 'Find Collaborators',
    description: 'Connect with developers working on similar projects.',
  },
  {
    icon: <Icons.Terminal />,
    title: 'Real Context',
    description: 'Community discussions, tips, and warnings about when to use (or avoid) a repo.',
  },
  {
    icon: <Icons.ArrowRight />,
    title: 'One-Click Share',
    description: 'Share any GitHub repository with context in seconds.',
  },
]

// Deterministic daily pick from top repos
function getDailyIndex(count: number): number {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
  return dayOfYear % count
}

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch top ELO repos for Repo of the Day
  const { data: topRepos } = await supabase
    .from('repositories')
    .select('id, name, owner, description, stars, forks, elo_rating, primary_language')
    .order('elo_rating', { ascending: false })
    .limit(7)

  const repoOfTheDay = topRepos && topRepos.length > 0
    ? topRepos[getDailyIndex(topRepos.length)]
    : null

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Discover Repositories
            <br />
            <span className={styles.heroGradient}>That Actually Matter</span>
          </h1>

          <p className={styles.heroSubtitle}>
            GitHub answers "where is the code?"
            <br />
            GitAdda answers "<strong>why, when, and how</strong> should I use it?"
          </p>

          <HomeSearch />

          <div className={styles.useCases}>
            {USE_CASES.map((useCase) => (
              <Link
                key={useCase.query}
                href={`/explore?use_case=${useCase.query}`}
                className={styles.useCase}
              >
                <span className={styles.iconWrapper}>{useCase.icon}</span>
                <span>{useCase.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Repo of the Day */}
      {repoOfTheDay && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>🏆</span>
              <h2 className={styles.sectionTitle}>Repo of the Day</h2>
            </div>

            <Link href={`/repo/${repoOfTheDay.id}`} className={styles.spotlightCard}>
              <div className={styles.spotlightCover}>
                <Image
                  src={`https://opengraph.githubassets.com/1/${repoOfTheDay.owner}/${repoOfTheDay.name}`}
                  alt={`${repoOfTheDay.name} preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
              <div className={styles.spotlightBody}>
                <div className={styles.spotlightHeader}>
                  <Image
                    src={`https://github.com/${repoOfTheDay.owner}.png`}
                    alt={repoOfTheDay.owner}
                    width={48}
                    height={48}
                    className={styles.spotlightAvatar}
                  />
                  <div>
                    <h3 className={styles.spotlightName}>{repoOfTheDay.name}</h3>
                    <span className={styles.spotlightOwner}>by {repoOfTheDay.owner}</span>
                  </div>
                  <span className={styles.spotlightElo}>⚡ {repoOfTheDay.elo_rating} ELO</span>
                </div>
                <p className={styles.spotlightDesc}>
                  {repoOfTheDay.description || 'No description provided.'}
                </p>
                <div className={styles.spotlightStats}>
                  <span>⭐ {repoOfTheDay.stars} Stars</span>
                  <span>🍴 {repoOfTheDay.forks} Forks</span>
                  {repoOfTheDay.primary_language && <span>🔤 {repoOfTheDay.primary_language}</span>}
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>⟩</span>
            <h2 className={styles.sectionTitle}>What GitAdda Does</h2>
          </div>

          <div className={styles.featuresGrid}>
            {FEATURES.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <span className={styles.featureIcon}>{feature.icon}</span>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Repositories */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>⟩</span>
            <h2 className={styles.sectionTitle}>Recently Shared</h2>
            <Link href="/explore" className={styles.sectionLink}>
              View all →
            </Link>
          </div>

          <Suspense fallback={
            <div className={styles.repoGrid}>
              {Array(4).fill(0).map((_, i) => (
                <RepoCardSkeleton key={i} />
              ))}
            </div>
          }>
            <RecentRepos />
          </Suspense>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Ready to discover?</h2>
          <p className={styles.ctaSubtitle}>Join developers finding the right tools for their projects.</p>
          <div className={styles.ctaButtons}>
            <Link href="/explore" className={styles.ctaPrimary}>
              Explore Repositories
            </Link>
            <Link href="/login" className={styles.ctaSecondary}>
              Login with GitHub
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p className={styles.footerText}>
            Built with 💙 for the developer community
          </p>
          <div className={styles.footerLinks}>
            <Link href="https://github.com" target="_blank">GitHub</Link>
            <Link href="/explore">Explore</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
