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

interface BetCardActionsProps {
    options: BetOption[];
}

export default function BetCardActions({ options }: BetCardActionsProps) {
    const { user, isLoaded } = useUser();
    const [loadingOptId, setLoadingOptId] = useState<number | null>(null);

    const yesOption = options.find((o) => o.name === 'Yes');
    const noOption = options.find((o) => o.name === 'No');

    const handleBet = async (optionId: number) => {
        if (!isLoaded || !user) {
            alert('Please login to place a bet.');
            return;
        }

        setLoadingOptId(optionId);
        try {
            // Hardcode 1000 cents ($10) per bet click for demo
            await placeBet(user.id, optionId, 1000);
            alert('Bet placed successfully! Minus $10.00 from your balance.');
        } catch (error: any) {
            alert(error.message || 'Failed to place bet. Check your balance.');
        } finally {
            setLoadingOptId(null);
        }
    };

    return (
        <div className={styles.actions}>
            <button
                onClick={(e) => { e.stopPropagation(); handleBet(yesOption!.id) }}
                className={`${styles.betButton} ${styles.yesBtn}`}
                disabled={loadingOptId !== null || !yesOption}
            >
                <span className={styles.btnLabel}>{loadingOptId === yesOption?.id ? '...' : 'Yes'}</span>
                {yesOption && <span className={styles.btnOdds}>{yesOption.probability.toFixed(0)}¢</span>}
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); handleBet(noOption!.id) }}
                className={`${styles.betButton} ${styles.noBtn}`}
                disabled={loadingOptId !== null || !noOption}
            >
                <span className={styles.btnLabel}>{loadingOptId === noOption?.id ? '...' : 'No'}</span>
                {noOption && <span className={styles.btnOdds}>{noOption.probability.toFixed(0)}¢</span>}
            </button>
        </div>
    );
}
