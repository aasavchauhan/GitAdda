'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import styles from './PreferencesSettings.module.css'

export default function PreferencesSettings() {
    const [emailMarketing, setEmailMarketing] = useState(false)
    const [securityAlerts, setSecurityAlerts] = useState(true)

    const handleToggle = (setter: any, value: boolean, label: string) => {
        setter(value)
        toast.promise(new Promise(resolve => setTimeout(resolve, 500)), {
            loading: 'Updating...',
            success: `${label} updated`,
            error: 'Failed to update'
        })
    }

    return (
        <div className={styles.container}>
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3>Notifications</h3>
                    <p>Manage how we communicate with you.</p>
                </div>

                <div className={styles.option}>
                    <div className={styles.optionInfo}>
                        <h4>Security Alerts</h4>
                        <p>Receive emails about suspicious activity on your account.</p>
                    </div>
                    <input
                        type="checkbox"
                        className={styles.toggle}
                        checked={securityAlerts}
                        onChange={(e) => handleToggle(setSecurityAlerts, e.target.checked, 'Security settings')}
                    />
                </div>

                <div className={styles.option}>
                    <div className={styles.optionInfo}>
                        <h4>Product Updates</h4>
                        <p>Receive the latest news and feature updates from GitAdda.</p>
                    </div>
                    <input
                        type="checkbox"
                        className={styles.toggle}
                        checked={emailMarketing}
                        onChange={(e) => handleToggle(setEmailMarketing, e.target.checked, 'Email preferences')}
                    />
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3>Appearance</h3>
                    <p>Customize your interface experience.</p>
                </div>

                <div className={styles.option}>
                    <div className={styles.optionInfo}>
                        <h4>Theme</h4>
                        <p>This is currently managed by your system settings.</p>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>
                        System
                    </div>
                </div>
            </section>
        </div>
    )
}
