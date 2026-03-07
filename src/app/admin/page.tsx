import React from 'react';
import { getEndedBetsPendingResolution } from '@/lib/admin';
import { submitNewBet } from './actions';
import ResolveBetForm from './ResolveBetForm';
import styles from './Admin.module.css';

export default async function AdminDashboard() {
    const pendingBets = await getEndedBetsPendingResolution();

    return (
        <div className={styles.adminContainer}>
            <h1 className={styles.title}>Admin Dashboard</h1>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Create New Market</h2>
                <form action={submitNewBet} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Market Title</label>
                        <input type="text" name="title" required placeholder="Will X happen?" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Description</label>
                        <textarea name="description" required placeholder="Rules of the market..."></textarea>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Image URL</label>
                        <input type="url" name="imageUrl" required placeholder="https://example.com/image.png" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>End Date</label>
                        <input type="datetime-local" name="endDate" required />
                    </div>

                    <button type="submit" className={styles.submitBtn}>Create Market</button>
                </form>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Pending Resolutions</h2>
                {pendingBets.length === 0 ? (
                    <p className={styles.emptyText}>No bets are waiting for resolution.</p>
                ) : (
                    <ul className={styles.betsList}>
                        {pendingBets.map(bet => (
                            <li key={bet.id} className={styles.betItem}>
                                <div className={styles.betItemInfo}>
                                    <strong>{bet.title}</strong>
                                    <span className={styles.endDate}>Ended: {new Date(bet.endDate).toLocaleDateString()}</span>
                                </div>
                                <ResolveBetForm betId={bet.id} betTitle={bet.title} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </div>
    );
}
