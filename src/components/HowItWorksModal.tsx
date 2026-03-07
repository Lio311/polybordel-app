'use client';

import React, { useState } from 'react';
import { SignInButton } from '@clerk/nextjs';
import styles from './HowItWorksModal.module.css';

interface Props {
    onClose: () => void;
}

// Step 1 illustration — bet card with Yes/No
function Step1Illustration() {
    return (
        <div className={styles.card3d}>
            <p className={styles.cardTitle}>האם ישראל תצא לבחירות לפני יוני?</p>
            <div className={styles.percentRow}>
                <svg className={styles.circleProgress} viewBox="0 0 36 36">
                    <path d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <path d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31" fill="none" stroke="#16a34a" strokeWidth="3"
                        strokeDasharray="48, 100" strokeLinecap="round" />
                    <text x="18" y="21" textAnchor="middle" fontSize="9" fontWeight="700" fill="#111827">50%</text>
                </svg>
            </div>
            <div className={styles.demoButtons}>
                <button className={styles.demoYes}>כן</button>
                <button className={styles.demoNo}>לא</button>
            </div>
        </div>
    );
}

// Step 2 illustration — two trade cards stacked
function Step2Illustration() {
    return (
        <div className={styles.tradeCards}>
            <div className={styles.tradeCardBack}>
                <div className={styles.tradeAmount}>$100</div>
                <div className={styles.tradeWin}>לזכות ב-$133</div>
                <button className={`${styles.tradeBuyBtn} ${styles.tradeBuyNo}`}>קנה לא</button>
            </div>
            <div className={styles.tradeCardFront}>
                <div className={styles.tradeAmount}>$100</div>
                <div className={styles.tradeWin}>לזכות ב-$400</div>
                <button className={`${styles.tradeBuyBtn} ${styles.tradeBuyYes}`}>קנה כן</button>
            </div>
        </div>
    );
}

// Step 3 illustration — redeem card with confetti
const CONFETTI_COLORS = ['#34d399', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa'];

function Step3Illustration() {
    return (
        <div style={{ position: 'relative', width: 240 }}>
            <div className={styles.confetti}>
                {Array.from({ length: 18 }).map((_, i) => (
                    <span key={i} style={{
                        left: `${(i * 17) % 100}%`,
                        top: `${(i * 13) % 40}%`,
                        background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                        animationDuration: `${1.2 + (i % 5) * 0.3}s`,
                        animationDelay: `${(i % 6) * 0.15}s`,
                        width: i % 3 === 0 ? '10px' : '7px',
                        height: i % 3 === 0 ? '10px' : '5px',
                    }} />
                ))}
            </div>
            <div className={styles.redeemCard}>
                <div className={styles.redeemRow}><span>הסיכויים</span><span style={{ background: '#e5e7eb', borderRadius: 4, width: 48, height: 10, display: 'inline-block' }} /></div>
                <div className={styles.redeemRow}><span>סכום</span><span style={{ background: '#e5e7eb', borderRadius: 4, width: 36, height: 10, display: 'inline-block' }} /></div>
                <div className={styles.redeemValue}>$250</div>
                <button className={styles.cashOutBtn}>משוך כסף</button>
            </div>
        </div>
    );
}

const STEPS = [
    {
        illustration: <Step1Illustration />,
        title: '1. בחר שוק',
        desc: 'קנה מניות "כן" או "לא" לפי הניחוש שלך. הסיכויים משתנים בזמן אמת ככל שסוחרים נוספים נכנסים לפעולה.',
        btn: 'הבא',
    },
    {
        illustration: <Step2Illustration />,
        title: '2. בצע עסקה',
        desc: 'הפקד כסף וירטואלי לחשבונך — ואז אתה מוכן לסחור.',
        btn: 'הבא',
    },
    {
        illustration: <Step3Illustration />,
        title: '3. מימוש',
        desc: 'מכור את מניותיך בכל עת, או המתן לסיום השוק כדי לממש מניות זוכות. הצטרף ובצע את העסקה הראשונה שלך תוך דקות.',
        btn: 'בוא נתחיל!',
        disclaimer: true,
    },
];

export default function HowItWorksModal({ onClose }: Props) {
    const [step, setStep] = useState(0);
    const current = STEPS[step];
    const isLast = step === STEPS.length - 1;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>✕</button>

                {/* Illustration */}
                <div className={styles.illustration}>
                    {current.illustration}
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <h2 className={styles.stepNum}>{current.title}</h2>
                    <p className={styles.stepDesc}>{current.desc}</p>

                    {current.disclaimer && (
                        <p className={styles.disclaimer}>
                            המסחר כפוף לדרישות הסמכה ו<a href="#">תנאי שימוש</a>.
                        </p>
                    )}

                    {isLast ? (
                        <SignInButton mode="modal">
                            <button className={styles.nextBtn} onClick={onClose}>{current.btn}</button>
                        </SignInButton>
                    ) : (
                        <button className={styles.nextBtn} onClick={() => setStep(s => s + 1)}>
                            {current.btn}
                        </button>
                    )}

                    {/* Dots */}
                    <div className={styles.dots}>
                        {STEPS.map((_, i) => (
                            <div key={i} className={`${styles.dot} ${i === step ? styles.active : ''}`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
