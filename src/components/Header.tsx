'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import UserBalance from './UserBalance';
import HowItWorksModal from './HowItWorksModal';
import styles from './Header.module.css';

export default function Header() {
    const { isLoaded, isSignedIn } = useUser();
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <header className={styles.header}>
                <div className={styles.inner}>

                    {/* Logo only — no text */}
                    <Link href="/" className={styles.logo}>
                        <Image src="/logo.png" alt="Polybordel" width={38} height={38} className={styles.logoImg} priority />
                    </Link>

                    {/* Wide Search bar — center */}
                    <div className={styles.search}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            className={styles.searchInput}
                            placeholder="חפש שווקים..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <kbd className={styles.shortcut}>/</kbd>
                    </div>

                    {/* Right Nav */}
                    <nav className={styles.nav}>
                        <button className={styles.howItWorks} onClick={() => setShowModal(true)}>
                            <span>ℹ️</span> איך זה עובד
                        </button>

                        {!isLoaded ? null : isSignedIn ? (
                            <div className={styles.userArea}>
                                <UserBalance />
                                <UserButton />
                            </div>
                        ) : (
                            <>
                                <SignInButton mode="modal">
                                    <button className={styles.loginBtn}>התחברות</button>
                                </SignInButton>
                                <SignInButton mode="modal">
                                    <button className={styles.signUpBtn}>הרשמה</button>
                                </SignInButton>
                            </>
                        )}

                        {/* Hamburger */}
                        <button className={styles.menuBtn} aria-label="תפריט">
                            <span />
                            <span />
                            <span />
                        </button>
                    </nav>
                </div>
            </header>

            {/* How It Works Modal */}
            {showModal && <HowItWorksModal onClose={() => setShowModal(false)} />}
        </>
    );
}
