export const dynamic = 'force-dynamic';

import React from 'react';
import { getEndedBetsPendingResolution, getActiveBets } from '@/lib/admin';
import { db } from '@/lib/db';
import { betOptionsTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import ResolveBetForm from './ResolveBetForm';
import AdminForm from './AdminForm';
import ActiveBetsManager from './ActiveBetsManager';
import styles from './Admin.module.css';

export default async function AdminDashboard() {
    const pendingBets = await getEndedBetsPendingResolution();
    const activeBets = await getActiveBets();

    // Attach options to each active bet
    const activeBetsWithOptions = await Promise.all(
        activeBets.map(async (bet) => {
            const options = await db.select().from(betOptionsTable).where(eq(betOptionsTable.betId, bet.id));
            return { ...bet, options };
        })
    );

    return (
        <div className={styles.page}>

            {/* Header */}
            <div className={styles.pageHeader}>
                <div className={styles.pageHeaderIcon}>⚙</div>
                <div>
                    <h1 className={styles.pageTitle}>לוח בקרה</h1>
                    <p className={styles.pageSubtitle}>ניהול שווקי הניחושים</p>
                </div>
            </div>

            <div className={styles.grid}>

                {/* Create Market */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardIcon} style={{ background: '#eff6ff', color: '#0066ff' }}>+</div>
                        <div>
                            <h2 className={styles.cardTitle}>צור שוק חדש</h2>
                            <p className={styles.cardSubtitle}>הוסף הימור חדש לפלטפורמה</p>
                        </div>
                    </div>
                    <AdminForm />
                </div>

                {/* Active Bets Management */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardIcon} style={{ background: '#f0fdf4', color: '#16a34a' }}>📋</div>
                        <div>
                            <h2 className={styles.cardTitle}>הימורים פעילים</h2>
                            <p className={styles.cardSubtitle}>{activeBets.length} הימורים פעילים — עריכה ומחיקה</p>
                        </div>
                    </div>
                    <ActiveBetsManager bets={activeBetsWithOptions} />
                </div>

                {/* Pending Resolutions — full width */}
                {pendingBets.length > 0 && (
                    <div className={`${styles.card} ${styles.fullWidth}`}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon} style={{ background: '#fef9c3', color: '#ca8a04' }}>⏳</div>
                            <div>
                                <h2 className={styles.cardTitle}>ממתינים להכרעה</h2>
                                <p className={styles.cardSubtitle}>{pendingBets.length} שוקים הסתיימו ומחכים להכרעה</p>
                            </div>
                        </div>
                        <div className={styles.resolveList}>
                            {pendingBets.map(bet => (
                                <div key={bet.id} className={styles.resolveItem}>
                                    <div className={styles.resolveInfo}>
                                        <span className={styles.resolveTitle}>{bet.title}</span>
                                        <span className={styles.resolveDate}>הסתיים: {new Date(bet.endDate).toLocaleDateString('he-IL')}</span>
                                    </div>
                                    <ResolveBetForm betId={bet.id} betTitle={bet.title} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
