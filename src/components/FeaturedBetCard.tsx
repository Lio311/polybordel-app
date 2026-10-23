'use client';

import React from 'react';
import BetCardActions from './BetCardActions';
import styles from './FeaturedBetCard.module.css';

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

// Placeholder SVG for the graph based on the reference image
// In a real app, this would be a dynamic SVG or a chart library
const Graph = () => (
    <svg viewBox="0 0 400 200" className={styles.graph} preserveAspectRatio="none">
        {/* Grid lines */}
        <path d="M 0 50 L 400 50" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
        <path d="M 0 100 L 400 100" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
        <path d="M 0 150 L 400 150" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4 4" fill="none" />

        {/* The line graph (mock data matching the blue trend line) */}
        <path
            d="M 10 160 Q 30 140, 40 165 T 60 150 T 80 160 T 90 90 T 110 50 L 120 70 L 130 50 L 140 100 L 150 90 L 160 110 L 170 120 L 180 80 L 190 90 T 210 110 T 230 110 T 260 90 T 280 120 T 310 100 T 320 60 T 340 15 T 350 30 T 360 40 L 370 70 L 380 60 L 390 90"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinejoin="round"
        />
        {/* Current point */}
        <circle cx="390" cy="90" r="4" fill="#2563eb" />
    </svg>
);

export default function FeaturedBetCard({ bet }: { bet: Bet }) {
    const yesOption = bet.options.find(o => o.name === 'Yes');

    return (
        <div className={styles.card}>
            <div className={styles.left}>
                <div className={styles.header}>
                    <img
                        src={bet.imageUrl}
                        alt=""
                        className={styles.image}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                    />
                    <span className={styles.category}>הימור מרכזי</span>
                </div>

                <h2 className={styles.title}>{bet.title}</h2>

                {yesOption && (
                    <div className={styles.chanceRow}>
                        <span className={styles.chancePct}>{yesOption.probability}% chance</span>
                    </div>
                )}

                <div className={styles.actionsWrapper}>
                    <BetCardActions options={bet.options} />
                </div>

                <div className={styles.newsSection}>
                    <div className={styles.newsItem}>
                        <span className={styles.newsSource}>AP News · 3d ago</span>
                        <span className={styles.newsTitle}>Trump says &apos;someone from within&apos; Iranian regime might be best choice to lead once war ends</span>
                    </div>
                    <div className={styles.newsItem}>
                        <span className={styles.newsSource}>The Washington Post · 1d ago</span>
                        <span className={styles.newsTitle}>Iran&apos;s regime maintains its grip, despite devastating losses</span>
                    </div>
                </div>
            </div>

            <div className={styles.right}>
                <div className={styles.graphContainer}>
                    <Graph />
                    <div className={styles.yAxis}>
                        <span>50%</span>
                        <span>40%</span>
                        <span>30%</span>
                        <span>20%</span>
                        <span>10%</span>
                        <span>0%</span>
                    </div>
                </div>
                <div className={styles.xAxis}>
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                </div>
            </div>
        </div>
    );
}
