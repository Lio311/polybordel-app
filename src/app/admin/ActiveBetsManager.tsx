'use client';

import React, { useState } from 'react';
import { deleteBet, updateBet, togglePin } from './actions';
import styles from './Admin.module.css';

interface BetOption {
    id: number;
    name: string;
    probability: number;
}

interface Bet {
    id: number;
    title: string;
    imageUrl: string;
    volume: number;
    endDate: Date;
    isPinned: boolean;
    options?: BetOption[];
}

export default function ActiveBetsManager({ bets }: { bets: Bet[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editProb, setEditProb] = useState(50);
    const [loading, setLoading] = useState<number | null>(null);

    function startEdit(bet: Bet) {
        const yesOpt = bet.options?.find(o => o.name === 'Yes');
        setEditProb(yesOpt ? Math.round(yesOpt.probability) : 50);
        setEditingId(bet.id);
    }

    async function handleDelete(betId: number) {
        if (!confirm('למחוק את ההימור? פעולה זו בלתי הפיכה.')) return;
        setLoading(betId);
        try {
            await deleteBet(betId);
        } catch (e) {
            alert('שגיאה: ' + (e instanceof Error ? e.message : String(e)));
        } finally {
            setLoading(null);
        }
    }

    async function handleUpdate(formData: FormData) {
        formData.set('yesProb', String(editProb));
        setLoading(editingId!);
        try {
            await updateBet(formData);
            setEditingId(null);
        } catch (e) {
            alert('שגיאה: ' + (e instanceof Error ? e.message : String(e)));
        } finally {
            setLoading(null);
        }
    }

    async function handlePin(betId: number, currentPinned: boolean) {
        setLoading(betId);
        try {
            await togglePin(betId, currentPinned);
        } catch (e) {
            alert('שגיאה: ' + (e instanceof Error ? e.message : String(e)));
        } finally {
            setLoading(null);
        }
    }

    if (bets.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📋</div>
                <p>אין הימורים פעילים כרגע</p>
            </div>
        );
    }

    return (
        <div className={styles.activeBetsList}>
            {bets.map(bet => (
                <div key={bet.id} className={styles.activeBetItem} style={{ border: bet.isPinned ? '2px solid #3b82f6' : undefined }}>
                    {editingId === bet.id ? (
                        /* Edit Mode */
                        <form action={handleUpdate} className={styles.editForm}>
                            <input type="hidden" name="betId" value={bet.id} />

                            <div className={styles.field}>
                                <label className={styles.label}>כותרת</label>
                                <input name="title" defaultValue={bet.title} required className={styles.input} dir="rtl" />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>תמונה</label>
                                <input name="imageUrl" defaultValue={bet.imageUrl} type="url" className={styles.input} dir="ltr" />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>סיכויי כן: <strong style={{ color: '#16a34a' }}>{editProb}%</strong> / לא: <strong style={{ color: '#dc2626' }}>{100 - editProb}%</strong></label>
                                <div className={styles.probBar} style={{ marginBottom: 4 }}>
                                    <div className={styles.probBarYes} style={{ flex: editProb }} />
                                    <div className={styles.probBarNo} style={{ flex: 100 - editProb }} />
                                </div>
                                <input
                                    type="range" min={1} max={99} value={editProb}
                                    onChange={e => setEditProb(Number(e.target.value))}
                                    style={{ width: '100%', cursor: 'pointer' }}
                                />
                            </div>

                            <div className={styles.editActions}>
                                <button type="submit" className={styles.saveBtn} disabled={loading === bet.id}>
                                    {loading === bet.id ? 'שומר...' : 'שמור שינויים'}
                                </button>
                                <button type="button" className={styles.cancelBtn} onClick={() => setEditingId(null)}>
                                    ביטול
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* View Mode */
                        <div className={styles.activeBetView}>
                            <div className={styles.activeBetInfo}>
                                {bet.imageUrl && (
                                    <img src={bet.imageUrl} alt="" className={styles.activeBetImg} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                )}
                                <div>
                                    <p className={styles.activeBetTitle}>
                                        {bet.isPinned && <span title="נעוץ" style={{ marginRight: 6 }}>📌</span>}
                                        {bet.title}
                                    </p>
                                    <p className={styles.activeBetMeta}>
                                        עד {new Date(bet.endDate).toLocaleDateString('he-IL')} · נפח: ${Math.round(bet.volume / 100).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.activeBetBtns}>
                                <button
                                    className={styles.editBtn}
                                    style={{ background: bet.isPinned ? '#e2e8f0' : '#dbeafe', color: bet.isPinned ? '#475569' : '#1d4ed8' }}
                                    onClick={() => handlePin(bet.id, bet.isPinned)}
                                    disabled={loading === bet.id}
                                >
                                    {bet.isPinned ? 'הסר נעיצה' : 'נעץ'}
                                </button>
                                <button className={styles.editBtn} onClick={() => startEdit(bet)}>עריכה</button>
                                <button className={styles.deleteBtn} onClick={() => handleDelete(bet.id)} disabled={loading === bet.id}>
                                    {loading === bet.id ? '...' : 'מחיקה'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
