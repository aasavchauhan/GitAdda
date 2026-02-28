'use client'

import { useEffect, useState } from 'react'
import styles from './InstallPrompt.module.css'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [show, setShow] = useState(false)

    useEffect(() => {
        // Check if dismissed recently
        const dismissed = localStorage.getItem('pwa-install-dismissed')
        if (dismissed) {
            const dismissedAt = parseInt(dismissed, 10)
            const sevenDays = 7 * 24 * 60 * 60 * 1000
            if (Date.now() - dismissedAt < sevenDays) return
        }

        const handler = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            setShow(true)
        }

        window.addEventListener('beforeinstallprompt', handler)
        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
            setShow(false)
        }
        setDeferredPrompt(null)
    }

    const handleDismiss = () => {
        setShow(false)
        localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    }

    if (!show) return null

    return (
        <div className={styles.banner}>
            <div className={styles.content}>
                <div className={styles.iconWrap}>
                    <img src="/icons/icon-192.svg" alt="GitAdda" className={styles.icon} />
                </div>
                <div className={styles.text}>
                    <p className={styles.title}>Install GitAdda</p>
                    <p className={styles.desc}>Add to home screen for a faster, app-like experience</p>
                </div>
            </div>
            <div className={styles.actions}>
                <button onClick={handleDismiss} className={styles.dismissBtn}>
                    Not now
                </button>
                <button onClick={handleInstall} className={styles.installBtn}>
                    Install
                </button>
            </div>
        </div>
    )
}
