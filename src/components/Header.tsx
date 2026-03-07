'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import UserBalance from './UserBalance';
import styles from './Header.module.css';

export default function Header() {
    const { isLoaded, isSignedIn } = useUser();
    const [search, setSearch] = useState('');

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <Image src="/logo.png" alt="Polybordel" width={28} height={28} className={styles.logoImg} />
                    Polybordel
                </Link>

                {/* Search */}
                <div className={styles.search}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        className={styles.searchInput}
                        placeholder="Search markets..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <span className={styles.shortcut}>/</span>
                </div>

                {/* Right Nav */}
                <nav className={styles.nav}>
                    <a href="/" className={styles.howItWorks}>ℹ️ How it works</a>

                    {!isLoaded ? null : isSignedIn ? (
                        <div className={styles.userArea}>
                            <UserBalance />
                            <UserButton />
                        </div>
                    ) : (
                        <>
                            <SignInButton mode="modal">
                                <button className={styles.signInBtn}>Log In</button>
                            </SignInButton>
                            <SignInButton mode="modal">
                                <button className={styles.signUpBtn}>Sign Up</button>
                            </SignInButton>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
