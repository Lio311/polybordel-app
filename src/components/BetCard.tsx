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

interface BetCardProps {
    bet: Bet;
}

export default function BetCard({ bet }: BetCardProps) {
    // Format volume as currency shorthand (e.g. $1.2m, $500k)
    const formatVolume = (vol: number) => {
        if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}m Vol.`;
        if (vol >= 1000) return `$${(vol / 1000).toFixed(1)}k Vol.`;
        return `$${vol} Vol.`;
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const shareData = {
            title: bet.title,
            text: `Check out this market on Polybordel: ${bet.title}`,
            url: window.location.href, // Or a specific bet URL when dynamic routing exists
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            // Fallback to WhatsApp wa.me link
            const encodedText = encodeURIComponent(`${shareData.text} \n\n ${shareData.url}`);
            window.open(`https://wa.me/?text=${encodedText}`, '_blank');
        }
    };

    const yesOption = bet.options.find((o) => o.name === 'Yes');
    const noOption = bet.options.find((o) => o.name === 'No');

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.imageWrapper}>
                    <Image src={bet.imageUrl} alt={bet.title} width={48} height={48} className={styles.image} />
                </div>
                <div className={styles.topRightActions}>
                    <button onClick={handleShare} className={styles.shareBtn} aria-label="Share on WhatsApp">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                        </svg>
                    </button>
                    <div className={styles.volumeBadge}>
                        {formatVolume(bet.volume)}
                    </div>
                </div>
            </div>

            <h3 className={styles.title}>{bet.title}</h3>
            <BetCardActions options={bet.options} />
        </div>
    );
}
