'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Copy, Check, Trash2 } from 'lucide-react'
import styles from './AccountSettings.module.css'
import { deleteAccount } from '@/app/actions/settings'

interface AccountSettingsProps {
    email: string
    userId: string
}

export default function AccountSettings({ email, userId }: AccountSettingsProps) {
    const [copied, setCopied] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(userId)
        setCopied(true)
        toast.success('User ID copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            setIsDeleting(true)
            try {
                await deleteAccount()
            } catch (error) {
                toast.error('Failed to delete account')
                setIsDeleting(false)
            }
        }
    }

    return (
        <div className={styles.container}>
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3>Account Information</h3>
                    <p>Basic details about your GitAdda account.</p>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Email Address</label>
                    <div className={styles.inputWrapper}>
                        <input
                            className={styles.input}
                            value={email}
                            readOnly
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>User ID</label>
                    <div className={styles.inputWrapper}>
                        <input
                            className={styles.input}
                            value={userId}
                            readOnly
                        />
                        <button
                            className={styles.copyButton}
                            onClick={handleCopy}
                            title="Copy User ID"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>
            </section>

            <section className={`${styles.section} ${styles.dangerZone}`}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.dangerTitle}>Danger Zone</h3>
                    <p>Irreversible actions for your account.</p>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Delete Account</label>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                        className={styles.deleteButton}
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </button>
                </div>
            </section>
        </div>
    )
}
