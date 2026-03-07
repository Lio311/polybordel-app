'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import styles from './Header.module.css';

export default function UserBalance() {
    const { isLoaded, isSignedIn } = useUser();
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetch('/api/balance')
                .then(res => res.json())
                .then(data => setBalance(data.balance))
                .catch(console.error);
        }
    }, [isLoaded, isSignedIn]);

    if (!isLoaded || !isSignedIn || balance === null) return null;

    // Balance is in cents. Convert to dollars.
    const dollars = (balance / 100).toFixed(2);

    return (
        <div className={styles.balanceContainer}>
            <span className={styles.balanceLabel}>Balance</span>
            <span className={styles.balanceAmount}>${dollars}</span>
        </div>
    );
}
