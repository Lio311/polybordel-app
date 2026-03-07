'use client';

import React, { useState } from 'react';
import styles from './CategoryNav.module.css';

const categories = [
    { label: '🔥 טרנדים', value: 'trending' },
    { label: '⚡ חדשות', value: 'breaking' },
    { label: '⚽ ספורט', value: 'sports' },
    { label: '🏛️ פוליטיקה', value: 'politics' },
    { label: '💰 כלכלה', value: 'economy' },
    { label: '🎬 בידור', value: 'entertainment' },
    { label: '🌍 גיאופוליטיקה', value: 'geopolitics' },
    { label: '💻 טכנולוגיה', value: 'tech' },
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
                            {cat.label}
                        </button>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
