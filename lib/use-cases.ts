export const CANONICAL_USE_CASES = [
  { value: 'saas', label: 'SaaS' },
  { value: 'ai-ml', label: 'AI/ML' },
  { value: 'backend', label: 'Backend' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'devops', label: 'DevOps' },
  { value: 'devtools', label: 'DevTools' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'auth', label: 'Auth' },
  { value: 'database', label: 'Database' },
  { value: 'cli', label: 'CLI' },
  { value: 'api', label: 'API' },
  { value: 'other', label: 'Other' },
] as const

export type UseCaseValue = (typeof CANONICAL_USE_CASES)[number]['value']

export const USE_CASE_LABELS = CANONICAL_USE_CASES.reduce((acc, useCase) => {
  acc[useCase.value] = useCase.label
  return acc
}, {} as Record<UseCaseValue, string>)

const USE_CASE_ALIASES: Record<string, UseCaseValue> = {
  'saas': 'saas',
  'ai': 'ai-ml',
  'ai-ml': 'ai-ml',
  'ai/ml': 'ai-ml',
  'aiml': 'ai-ml',
  'backend': 'backend',
  'frontend': 'frontend',
  'devops': 'devops',
  'dev-ops': 'devops',
  'devtools': 'devtools',
  'dev-tools': 'devtools',
  'tools': 'devtools',
  'tooling': 'devtools',
  'mobile': 'mobile',
  'auth': 'auth',
  'database': 'database',
  'db': 'database',
  'cli': 'cli',
  'api': 'api',
  'other': 'other',
}

export const normalizeUseCase = (value?: string | null): UseCaseValue | '' => {
  if (!value) return ''
  const trimmed = value.trim().toLowerCase()
  if (!trimmed) return ''
  const slug = trimmed.replace(/\s+/g, '-').replace(/\//g, '-')
  return USE_CASE_ALIASES[slug] ?? ''
}
