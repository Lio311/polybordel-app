'use client';

import React, { useState } from 'react';
import styles from './CategoryNav.module.css';

// Polymarket-style trending arrow SVG
function TrendingIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 17 7 10 11 14 19 4" />
            <polyline points="14 4 19 4 19 9" />
        </svg>
    );
}

const categories = [
    { label: 'טרנדים', value: 'trending', icon: true },
    { label: 'חדשות', value: 'breaking' },
    { label: 'ספורט', value: 'sports' },
    { label: 'פוליטיקה', value: 'politics' },
    { label: 'כלכלה', value: 'economy' },
    { label: 'בידור', value: 'entertainment' },
    { label: 'גיאופוליטיקה', value: 'geopolitics' },
    { label: 'טכנולוגיה', value: 'tech' },
];

export default function CategoryNav() {
    const [active, setActive] = useState('trending');

    return (
        <div className={styles.navBar}>
            <div className={styles.navInner}>
                {categories.map((cat, i) => (
                    <React.Fragment key={cat.value}>
                        {i === 1 && <div className={styles.divider} />}
                        <button
                            className={`${styles.navItem} ${active === cat.value ? styles.active : ''}`}
                            onClick={() => setActive(cat.value)}
                        >
                            {cat.icon && <TrendingIcon />}
                            {cat.label}
                        </button>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
