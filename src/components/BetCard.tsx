'use client';

import React from 'react';
import Image from 'next/image';
import BetCardActions from './BetCardActions';
import styles from './BetCard.module.css';

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
    options: BetOption[];
}

function formatVolume(cents: number) {
    const dollars = cents / 100;
    if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(1)}M`;
    if (dollars >= 1_000) return `$${(dollars / 1_000).toFixed(0)}K`;
    return `$${dollars.toFixed(0)}`;
}

function shareToWhatsApp(bet: Bet) {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/bet/${bet.id}` : '';
    const text = `הימור: ${bet.title}\n${url}`;
    if (navigator.share) {
        navigator.share({ title: bet.title, text, url });
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
}

export default function BetCard({ bet }: { bet: Bet }) {
    const yesOption = bet.options.find(o => o.name === 'Yes');
    const noOption = bet.options.find(o => o.name === 'No');

    return (
        <div className={styles.card}>
            {/* Top */}
            <div className={styles.top}>
                <div className={styles.imageWrapper}>
                    <img
                        src={bet.imageUrl}
                        alt={bet.title}
                        className={styles.image}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                    />
                </div>
                <div className={styles.titleArea}>
                    <p className={styles.category}>הימור</p>
                    <h3 className={styles.title}>{bet.title}</h3>
                </div>
            </div>

            {/* Options probabilities */}
            <div className={styles.options}>
                {yesOption && (
                    <div className={styles.optionRow}>
                        <span className={styles.optionName}>כן</span>
                        <span className={`${styles.optionPct} ${styles.yes}`}>{yesOption.probability}%</span>
                    </div>
                )}
                {noOption && (
                    <div className={styles.optionRow}>
                        <span className={styles.optionName}>לא</span>
                        <span className={`${styles.optionPct} ${styles.no}`}>{noOption.probability}%</span>
                    </div>
                )}
            </div>

            {/* Bet Actions */}
            <BetCardActions options={bet.options} />

            {/* Footer */}
            <div className={styles.footer}>
                <span className={styles.volume}>{formatVolume(bet.volume)} נפח</span>
                <button className={styles.shareBtn} onClick={() => shareToWhatsApp(bet)}>
                    שתף בוואטסאפ
                </button>
            </div>
        </div>
    );
}
