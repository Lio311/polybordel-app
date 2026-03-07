'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import UserBalance from './UserBalance';
import HowItWorksModal from './HowItWorksModal';
import styles from './Header.module.css';

// Clean SVG icons — no emojis
function SearchIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="9" r="6" />
            <line x1="15" y1="15" x2="19" y2="19" />
        </svg>
    );
}

function InfoIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
    );
}

function MenuIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
    );
}

export default function Header() {
    const { isLoaded, isSignedIn } = useUser();
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <header className={styles.header}>
                {/* 3-column grid: logo | search | nav */}
                <div className={styles.grid}>

                    {/* Left: Logo at natural proportions */}
                    <div className={styles.left}>
                        <Link href="/" className={styles.logo}>
                            <Image
                                src="/logo.png"
                                alt="Polybordel"
                                height={36}
                                width={130}
                                style={{ objectFit: 'contain', objectPosition: 'right center' }}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Center: Search bar */}
                    <div className={styles.center}>
                        <div className={styles.search}>
                            <span className={styles.searchIcon}><SearchIcon /></span>
                            <input
                                className={styles.searchInput}
                                placeholder="חפש שווקים..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <kbd className={styles.shortcut}>/</kbd>
                        </div>
                    </div>

                    {/* Right: Nav */}
                    <div className={styles.right}>
                        <button className={styles.howItWorks} onClick={() => setShowModal(true)}>
                            <InfoIcon />
                            <span>איך זה עובד</span>
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

                        <button className={styles.menuBtn} aria-label="תפריט">
                            <MenuIcon />
                        </button>
                    </div>

                </div>
            </header>

            {showModal && <HowItWorksModal onClose={() => setShowModal(false)} />}
        </>
    );
}
