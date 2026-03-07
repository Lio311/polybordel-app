'use client';

import React, { useState } from 'react';
import { submitBetResolution } from './actions';
import styles from './Admin.module.css';

interface ResolveBetFormProps {
    betId: number;
    betTitle: string;
}

export default function ResolveBetForm({ betId, betTitle }: ResolveBetFormProps) {
    const [loading, setLoading] = useState(false);

    const handleResolve = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const winningOptionIdStr = formData.get('winningOptionId') as string;

        if (winningOptionIdStr) {
            await submitBetResolution(betId, parseInt(winningOptionIdStr, 10));
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleResolve} className={styles.resolveForm}>
            <select name="winningOptionId" required className={styles.selectInput}>
                <option value="">Select Winner...</option>
                {/* For simplicity we assume Yes option is always inserted first with ID offset + 1, No + 2. In a real app we'd pass down the actual options from the DB */}
                <option value={1}>Yes</option>
                <option value={2}>No</option>
            </select>
            <button type="submit" className={styles.resolveBtn} disabled={loading}>
                {loading ? 'Resolving...' : 'Resolve'}
            </button>
        </form>
    );
}
