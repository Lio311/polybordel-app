'use client';

import React, { useState } from 'react';
import { placeBet } from '@/app/actions';
import { useUser } from '@clerk/nextjs';
import styles from './BetCard.module.css';

interface BetOption {
    id: number;
    name: string;
    probability: number;
}

export default function BetCardActions({ options }: { options: BetOption[] }) {
    const { user, isLoaded } = useUser();
    const [loadingOptId, setLoadingOptId] = useState<number | null>(null);

    const yesOption = options.find(o => o.name === 'Yes');
    const noOption = options.find(o => o.name === 'No');

    const handleBet = async (optionId: number) => {
        if (!isLoaded || !user) {
            alert('יש להתחבר לחשבון לפני שמשחקים');
            return;
        }
        setLoadingOptId(optionId);
        try {
            await placeBet(user.id, optionId, 1000); // $10 per click
            alert('ההימור נרשם בהצלחה! ✅');
        } catch (e: any) {
            alert(e.message || 'שגיאה בניחום ההימור. בדוק את יתרתך.');
        } finally {
            setLoadingOptId(null);
        }
    };

    return (
        <div className={styles.actions}>
            <button
                className={`${styles.betBtn} ${styles.yesBtn}`}
                onClick={() => yesOption && handleBet(yesOption.id)}
                disabled={loadingOptId !== null || !yesOption}
            >
                {loadingOptId === yesOption?.id ? '...' : 'כן'}
                {yesOption && <span className={styles.btnPct}>{yesOption.probability}¢</span>}
            </button>
            <button
                className={`${styles.betBtn} ${styles.noBtn}`}
                onClick={() => noOption && handleBet(noOption.id)}
                disabled={loadingOptId !== null || !noOption}
            >
                {loadingOptId === noOption?.id ? '...' : 'לא'}
                {noOption && <span className={styles.btnPct}>{noOption.probability}¢</span>}
            </button>
        </div>
    );
}
