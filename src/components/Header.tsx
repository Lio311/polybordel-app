'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserButton, useUser, SignInButton } from '@clerk/nextjs';
import UserBalance from './UserBalance';
import styles from './Header.module.css';

export default function Header() {
    const { isLoaded, isSignedIn, user } = useUser();

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <Link href="/" className={styles.logoLink}>
                    <div className={styles.logoWrapper}>
                        <Image src="/logo.png" alt="Polybordel Logo" width={32} height={32} />
                    </div>
                    <span className={styles.logoText}>Polybordel</span>
                </Link>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.navItemActive}>Markets</Link>
                    <Link href="/portfolio" className={styles.navItem}>Portfolio</Link>
                    <Link href="/admin" className={styles.navItem}>Admin</Link>
                </nav>
            </div>

            <div className={styles.center}>
                <div className={styles.searchBar}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input type="text" placeholder="Search markets..." className={styles.searchInput} />
                </div>
            </div>

            <div className={styles.right}>
                {isLoaded && isSignedIn ? (
                    <div className={styles.userSection}>
                        <UserBalance />
                        <div className={styles.profileButton}>
                            <UserButton />
                        </div>
                    </div>
                ) : (
                    <div className={styles.authButtons}>
                        <SignInButton mode="modal">
                            <button className={styles.loginBtn}>Log In / Sign Up</button>
                        </SignInButton>
                    </div>
                )}
            </div>
        </header>
    );
}
