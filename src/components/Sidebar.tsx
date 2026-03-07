import React from 'react';
import Link from 'next/link';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav}>
                <div className={styles.sectionHeader}>Categories</div>
                <ul className={styles.navList}>
                    <li>
                        <Link href="/category/politics" className={styles.navItem}>
                            <span className={styles.icon}>🏛️</span> Politics
                        </Link>
                    </li>
                    <li>
                        <Link href="/category/crypto" className={styles.navItem}>
                            <span className={styles.icon}>🪙</span> Crypto
                        </Link>
                    </li>
                    <li>
                        <Link href="/category/sports" className={styles.navItem}>
                            <span className={styles.icon}>⚽</span> Sports
                        </Link>
                    </li>
                    <li>
                        <Link href="/category/pop-culture" className={styles.navItem}>
                            <span className={styles.icon}>🎵</span> Pop Culture
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className={styles.footer}>
                <Link href="/leaderboard" className={styles.navItem}>
                    Leaderboard
                </Link>
                <Link href="/activity" className={styles.navItem}>
                    Activity
                </Link>
            </div>
        </aside>
    );
}
