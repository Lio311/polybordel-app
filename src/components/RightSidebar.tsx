import React from 'react';
import { getMarketData, getBreakingNews } from '@/lib/liveData';
import styles from './RightSidebar.module.css';

function formatPrice(n: number | null, decimals = 2): string {
    if (n === null) return '—';
    return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function Change({ val }: { val: number | null }) {
    if (val === null) return null;
    const up = val >= 0;
    return (
        <span style={{ color: up ? '#16a34a' : '#dc2626', fontWeight: 600, fontSize: '0.78rem' }}>
            {up ? '▲' : '▼'} {Math.abs(val).toFixed(2)}%
        </span>
    );
}

function timeSince(dateStr: string): string {
    try {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `לפני ${mins} דקות`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `לפני ${hrs} שעות`;
        return `לפני ${Math.floor(hrs / 24)} ימים`;
    } catch {
        return '';
    }
}

export default async function RightSidebar() {
    const [market, news] = await Promise.all([
        getMarketData(),
        getBreakingNews(),
    ]);

    return (
        <aside className={styles.sidebar}>

            {/* Breaking News */}
            <div className={styles.widget}>
                <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>חדשות מתפרצות &rsaquo;</h2>
                </div>
                <div className={styles.newsList}>
                    {news.length === 0 ? (
                        <p style={{ color: '#9ca3af', fontSize: '0.82rem', textAlign: 'center', padding: '12px' }}>
                            טוען חדשות...
                        </p>
                    ) : (
                        news.slice(0, 4).map((item, i) => (
                            <a
                                key={i}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.newsItem}
                            >
                                <span className={styles.newsNum}>{i + 1}</span>
                                <div className={styles.newsBody}>
                                    <p className={styles.newsTitle}>{item.title}</p>
                                    <span className={styles.newsMeta}>
                                        {item.source} · {timeSince(item.pubDate)}
                                    </span>
                                </div>
                            </a>
                        ))
                    )}
                </div>
            </div>

            {/* Live Market Data */}
            <div className={styles.widget}>
                <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>שווקים חיים &rsaquo;</h2>
                </div>
                <div className={styles.marketGrid}>

                    <div className={styles.marketCard}>
                        <div className={styles.marketLabel}>דולר / שקל</div>
                        <div className={styles.marketValueArea}>
                            <div className={styles.marketValue}>
                                ₪{formatPrice(market.usdIls)}
                            </div>
                        </div>
                    </div>

                    <div className={styles.marketCard}>
                        <div className={styles.marketLabel}>S&P 500</div>
                        <div className={styles.marketValueArea}>
                            <div className={styles.marketValue}>
                                {formatPrice(market.sp500Usd, 2)}
                            </div>
                            <Change val={market.sp500Change} />
                        </div>
                    </div>

                    <div className={styles.marketCard}>
                        <div className={styles.marketLabel}>NASDAQ</div>
                        <div className={styles.marketValueArea}>
                            <div className={styles.marketValue}>
                                {formatPrice(market.nasdaqUsd, 2)}
                            </div>
                            <Change val={market.nasdaqChange} />
                        </div>
                    </div>

                    <div className={styles.marketCard}>
                        <div className={styles.marketLabel}>ביטקוין (BTC)</div>
                        <div className={styles.marketValueArea}>
                            <div className={styles.marketValue}>
                                ${formatPrice(market.btcUsd, 0)}
                            </div>
                            <Change val={market.btcChange} />
                        </div>
                    </div>

                    <div className={styles.marketCard}>
                        <div className={styles.marketLabel}>את'ריום (ETH)</div>
                        <div className={styles.marketValueArea}>
                            <div className={styles.marketValue}>
                                ${formatPrice(market.ethUsd, 0)}
                            </div>
                            <Change val={market.ethChange} />
                        </div>
                    </div>

                </div>
            </div>

        </aside>
    );
}
