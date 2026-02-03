'use client'

import { useState } from 'react'
import { Icons } from '@/components/ui/Icons'
import styles from './page.module.css'
import { bulkImportRepos } from './actions'

interface BulkImportProps {
    userId: string
    accessToken: string | null
}

const USE_CASES = [
    'Auto-Detect', 'SaaS', 'AI/ML', 'Backend', 'Frontend', 'DevOps',
    'Mobile', 'CLI', 'Database', 'API', 'Other'
]

export default function BulkImport({ userId, accessToken }: BulkImportProps) {
    const [urls, setUrls] = useState('')
    const [useCase, setUseCase] = useState('Auto-Detect')
    const [isProcessing, setIsProcessing] = useState(false)
    const [logs, setLogs] = useState<{ url: string, status: 'success' | 'error', message: string }[]>([])

    const handleImport = async () => {
        if (!urls.trim()) return

        setIsProcessing(true)
        setLogs([])

        // Split by newlines and filter empty
        const urlList = urls.split('\n').map(u => u.trim()).filter(u => u.length > 0)

        // Demo simulation delay
        if (urls.includes('opensourceprojects.dev')) {
            await new Promise(r => setTimeout(r, 1500));
        }

        try {
            const results = await bulkImportRepos(urlList, userId, accessToken, useCase.toLowerCase())
            setLogs(results)
        } catch (error) {
            console.error(error)
            setLogs([{ url: 'System', status: 'error', message: 'Failed to execute bulk import action' }])
        } finally {
            setIsProcessing(false)
        }
    }

    const loadScrapedPage8 = () => {
        const page8Repos = [
            'https://github.com/medusajs/medusa',
            'https://github.com/calcom/cal.com',
            'https://github.com/appwrite/appwrite',
            'https://github.com/meilisearch/meilisearch',
            'https://github.com/strapi/strapi',
            'https://github.com/nocodb/nocodb',
            'https://github.com/hoppscotch/hoppscotch',
            'https://github.com/typebotio/typebot.io',
            'https://github.com/twentyhq/twenty',
            'https://github.com/dubinc/dub',
        ]
        setUrls(page8Repos.join('\n'))
        setUseCase('Auto-Detect')
    }

    const loadScrapedPage9 = () => {
        const page9Repos = [
            'https://github.com/langchain-ai/langchain',
            'https://github.com/significant-gravitas/AutoGPT',
            'https://github.com/huggingface/transformers',
            'https://github.com/ollama/ollama',
            'https://github.com/vllm-project/vllm',
            'https://github.com/streamlit/streamlit',
            'https://github.com/gradio-app/gradio',
            'https://github.com/microsoft/semantic-kernel',
            'https://github.com/run-llama/llama_index',
            'https://github.com/anthropics/anthropic-sdk-typescript',
        ]
        setUrls(page9Repos.join('\n'))
        setUseCase('AI/ML')
    }

    const loadScrapedPage10 = () => {
        const page10Repos = [
            'https://github.com/shadcn-ui/ui',
            'https://github.com/tailwindlabs/tailwindcss',
            'https://github.com/withastro/astro',
            'https://github.com/t3-oss/create-t3-app',
            'https://github.com/clerk/javascript',
            'https://github.com/resend/react-email',
            'https://github.com/pmndrs/react-three-fiber',
            'https://github.com/mui/material-ui',
            'https://github.com/chakra-ui/chakra-ui',
            'https://github.com/TanStack/query',
        ]
        setUrls(page10Repos.join('\n'))
        setUseCase('Frontend')
    }

    const loadScrapedPage11 = () => {
        const page11Repos = [
            'https://github.com/kubernetes/kubernetes',
            'https://github.com/docker/compose',
            'https://github.com/hashicorp/terraform',
            'https://github.com/prometheus/prometheus',
            'https://github.com/grafana/grafana',
            'https://github.com/ansible/ansible',
            'https://github.com/jenkins-ci/jenkins',
            'https://github.com/argoproj/argo-cd',
            'https://github.com/istio/istio',
            'https://github.com/nginx/nginx',
        ]
        setUrls(page11Repos.join('\n'))
        setUseCase('DevOps')
    }

    const loadScrapedPage12 = () => {
        const page12Repos = [
            'https://github.com/excalidraw/excalidraw',
            'https://github.com/tldraw/tldraw',
            'https://github.com/penpot/penpot',
            'https://github.com/logseq/logseq',
            'https://github.com/affine-work/affine',
            'https://github.com/AppFlowy-IO/AppFlowy',
            'https://github.com/laurent22/joplin',
            'https://github.com/jgraph/drawio-desktop',
            'https://github.com/baserow/baserow',
            'https://github.com/n8n-io/n8n',
        ]
        setUrls(page12Repos.join('\n'))
        setUseCase('SaaS')
    }

    const loadTrendShiftRepos = () => {
        const trendRepos = [
            'https://github.com/codecrafters-io/build-your-own-x',
            'https://github.com/microsoft/generative-ai-for-beginners',
            'https://github.com/lobehub/lobe-chat',
            'https://github.com/public-apis/public-apis',
            'https://github.com/practical-tutorials/project-based-learning',
            'https://github.com/donnemartin/system-design-primer',
            'https://github.com/langgenius/dify',
            'https://github.com/EbookFoundation/free-programming-books',
            'https://github.com/RVC-Boss/GPT-SoVITS',
            'https://github.com/pathwaycom/pathway',
            'https://github.com/onlook-dev/onlook',
            'https://github.com/nlohmann/json',
            'https://github.com/Skyvern-AI/skyvern',
            'https://github.com/OpenInterpreter/open-interpreter',
            'https://github.com/anthropics/prompt-eng-interactive-tutorial',
            'https://github.com/grpc/grpc-go',
            'https://github.com/CorentinTh/it-tools',
            'https://github.com/OpenDevin/OpenDevin',
            'https://github.com/huggingface/lerobot',
            'https://github.com/DiceDB/dice',
            'https://github.com/shadps4-emu/shadPS4',
            'https://github.com/block/goose',
            'https://github.com/punkpeye/awesome-mcp-servers',
            'https://github.com/modularml/mojo',
            'https://github.com/OpenBMB/ChatDev',
            'https://github.com/microsoft/ML-For-Beginners',
            'https://github.com/OpenBMB/MiniCPM-V',
            'https://github.com/VinciGit00/Scrapegraph-ai',
            'https://github.com/bol-van/zapret',
            'https://github.com/browserbase/stagehand',
        ]
        setUrls(trendRepos.join('\n'))
        setUseCase('Auto-Detect')
    }

    const successCount = logs.filter(l => l.status === 'success').length
    const errorCount = logs.filter(l => l.status === 'error').length

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className={styles.title}>
                            <Icons.Database /> Admin Import
                        </h1>
                        <p className={styles.subtitle}>
                            Bulk add repositories. One GitHub URL per line.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={loadScrapedPage8}
                            className={styles.button}
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                        >
                            Page 8 (COSS)
                        </button>
                        <button
                            onClick={loadScrapedPage9}
                            className={styles.button}
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                        >
                            Page 9 (AI)
                        </button>
                        <button
                            onClick={loadScrapedPage10}
                            className={styles.button}
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                        >
                            Page 10 (Web)
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={loadScrapedPage11}
                            className={styles.button}
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                        >
                            Page 11 (DevOps)
                        </button>
                        <button
                            onClick={loadTrendShiftRepos}
                            className={styles.button}
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                        >
                            <Icons.Sparkles /> TrendShift (Top 30)
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.form}>
                <div className={styles.section}>
                    <label className={styles.label}>Use Case (Applied to all)</label>
                    <select
                        className={styles.select}
                        value={useCase}
                        onChange={(e) => setUseCase(e.target.value)}
                    >
                        {USE_CASES.map(uc => (
                            <option key={uc} value={uc}>{uc}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.section}>
                    <label className={styles.label}>Repository URLs</label>
                    <textarea
                        className={styles.textarea}
                        placeholder={`https://github.com/facebook/react\nhttps://github.com/vercel/next.js`}
                        value={urls}
                        onChange={(e) => setUrls(e.target.value)}
                    />
                </div>

                <button
                    className={styles.button}
                    onClick={handleImport}
                    disabled={isProcessing || !urls.trim()}
                >
                    {isProcessing ? 'Importing...' : 'Start Import'}
                </button>
            </div>

            {logs.length > 0 && (
                <div className={styles.results}>
                    <h3 className={styles.resultTitle}>
                        Results: {successCount} Added, {errorCount} Failed
                    </h3>
                    <div className={styles.log}>
                        {logs.map((log, i) => (
                            <div key={i} className={`${styles.logItem} ${log.status === 'success' ? styles.success : styles.error}`}>
                                <span>{log.status === 'success' ? '✅' : '❌'}</span>
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {log.url}
                                </span>
                                <span>{log.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
