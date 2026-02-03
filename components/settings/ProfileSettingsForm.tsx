'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/actions/settings'
import styles from './ProfileSettingsForm.module.css'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface ProfileSettingsFormProps {
    profile: any
}

export default function ProfileSettingsForm({ profile }: ProfileSettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)

        try {
            await updateProfile(formData)
            router.refresh()
            // Optional: Show toast
        } catch (error) {
            console.error(error)
            // Optional: Show error
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.formContainer}>
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

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="location">Location</label>
                    <input
                        className={styles.input}
                        type="text"
                        id="location"
                        name="location"
                        defaultValue={profile.location || ''}
                        placeholder="e.g. San Francisco, CA"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="website_url">Website URL</label>
                    <input
                        className={styles.input}
                        type="url"
                        id="website_url"
                        name="website_url"
                        defaultValue={profile.website_url || ''}
                        placeholder="https://your-website.com"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="github_username">GitHub Username</label>
                    <input
                        className={styles.input}
                        type="text"
                        id="github_username"
                        name="github_username"
                        defaultValue={profile.github_username || ''}
                        placeholder="github_username"
                    />
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
