'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/actions/settings'
import styles from './ProfileSettingsForm.module.css'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface ProfileSettingsFormProps {
    profile: any
}

export default function ProfileSettingsForm({ profile }: ProfileSettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const router = useRouter()

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 4000)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)

        try {
            await updateProfile(formData)
            router.refresh()
            showToast('success', 'Profile saved successfully!')
        } catch (error) {
            console.error(error)
            showToast('error', 'Failed to save profile. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.formContainer}>
            {toast && (
                <div className={`${styles.toast} ${styles[toast.type]}`}>
                    {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{toast.message}</span>
                </div>
            )}

            <div className={styles.header}>
                <h1 className={styles.title}>Edit Profile</h1>
                <p className={styles.subtitle}>Update your personal information and developer status.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="full_name">Display Name</label>
                    <input
                        className={styles.input}
                        type="text"
                        id="full_name"
                        name="full_name"
                        defaultValue={profile.full_name || ''}
                        placeholder="e.g. John Doe"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="bio">Bio</label>
                    <textarea
                        className={styles.textarea}
                        id="bio"
                        name="bio"
                        defaultValue={profile.bio || ''}
                        placeholder="Tell us about yourself..."
                        rows={3}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="tech_stack">Tech Stack</label>
                    <input
                        className={styles.input}
                        type="text"
                        id="tech_stack"
                        name="tech_stack"
                        defaultValue={profile.tech_stack?.join(', ') || ''}
                        placeholder="e.g. React, Node.js, TypeScript (comma separated)"
                    />
                    <span className={styles.helperText}>Separate technologies with commas</span>
                </div>

                <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="open_to_collab"
                            className={styles.checkbox}
                            defaultChecked={profile.open_to_collab}
                        />
                        <span>Open to Collaboration</span>
                    </label>

                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="looking_for_contributors"
                            className={styles.checkbox}
                            defaultChecked={profile.looking_for_contributors}
                        />
                        <span>Looking for Contributors</span>
                    </label>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </form>
        </div>
    )
}
