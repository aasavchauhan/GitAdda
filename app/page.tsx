import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import styles from './page.module.css'
import HomeSearch from './HomeSearch'
import { Icons } from '@/components/ui/Icons'
import RecentRepos from '@/components/home/RecentRepos'
import { Suspense } from 'react'
import RepoCardSkeleton from '@/components/ui/RepoCardSkeleton'
import { USE_CASE_LABELS, UseCaseValue } from '@/lib/use-cases'

const USE_CASES: Array<{ value: UseCaseValue; icon: JSX.Element }> = [
  { value: 'saas', icon: <Icons.Cloud /> },
  { value: 'ai-ml', icon: <Icons.Cpu /> },
  { value: 'backend', icon: <Icons.Terminal /> },
  { value: 'frontend', icon: <Icons.Layout /> },
  { value: 'devtools', icon: <Icons.Terminal /> },
  { value: 'mobile', icon: <Icons.Smartphone /> },
  { value: 'auth', icon: <Icons.Lock /> },
  { value: 'database', icon: <Icons.Database /> },
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

export default async function HomePage() {
  await createClient()



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
                key={useCase.value}
                href={`/explore?use_case=${useCase.value}`}
                className={styles.useCase}
              >
                <span className={styles.iconWrapper}>{useCase.icon}</span>
                <span>{USE_CASE_LABELS[useCase.value]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
            <Link href="/about">About</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
