'use client'

import { useState } from 'react'
import { Icons } from '@/components/ui/Icons'

export default function CopyButton({ text, label }: { text: string, label: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy!', err)
        }
    }

    return (
        <button
            onClick={handleCopy}
            title="Click to copy"
            aria-label={`Copy ${label} command`}
            className="group relative flex items-center gap-2 px-3 py-2 text-sm font-mono text-slate-400 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-cyan/30 hover:text-cyan transition-all duration-200"
        >
            <span className="text-cyan/70 select-none" aria-hidden="true">$</span>
            <span>{label}</span>
            <div className="ml-auto pl-2">
                {copied ? (
                    <Icons.Check className="w-4 h-4 text-green-400" />
                ) : (
                    <Icons.Copy className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                )}
            </div>
        </button>
    )
}
