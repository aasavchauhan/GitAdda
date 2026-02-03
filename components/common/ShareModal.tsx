'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Check, Copy, Twitter, Linkedin, MessageCircle } from 'lucide-react'
import styles from './ShareModal.module.css'
import { toast } from 'sonner'

interface Props {
    isOpen: boolean
    onClose: () => void
    url: string
    title: string
}

export default function ShareModal({ isOpen, onClose, url, title }: Props) {
    const [mounted, setMounted] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen || !mounted) return null

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            toast.success('Link copied to clipboard')
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error('Failed to copy link')
        }
    }

    const shareLinks = [
        {
            name: 'Twitter',
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            color: '#1DA1F2'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            color: '#0A66C2'
        },
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
            color: '#25D366'
        }
    ]

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Share Repository</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.shareGrid}>
                        {shareLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.shareOption}
                            >
                                <div className={styles.iconWrapper} style={{ backgroundColor: `${link.color}20`, color: link.color }}>
                                    <link.icon size={24} />
                                </div>
                                <span className={styles.shareName}>{link.name}</span>
                            </a>
                        ))}
                    </div>

                    <div className={styles.copySection}>
                        <div className={styles.urlDisplay}>{url}</div>
                        <button
                            className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
                            onClick={handleCopy}
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}
