import React from 'react';
import styles from './RightSidebar.module.css';

const breakingNews = [
    { title: 'האם המדד ינסוק ב-10% לפני אפריל?', pct: '11%', up: true },
    { title: 'בחירות 2026: האם ישראל תלך לבחירות לפני מרץ?', pct: '48%', up: true },
    { title: 'האם הדולר יחצה $4 עד סוף החודש?', pct: '16%', up: false },
];

const hotTopics = [
    { name: 'ענקית הטק', vol: '$17M היום' },
    { name: 'נדל"ן', vol: '$48M היום' },
    { name: 'מדד ת"א 35', vol: '$495K היום' },
    { name: 'בייסבול', vol: '$378K היום' },
    { name: 'קריפטו', vol: '$3M היום' },
];

export default function RightSidebar() {
    return (
        <aside className={styles.sidebar}>
            {/* Breaking News */}
            <div className={styles.widget}>
                <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>חדשות שוברות &rsaquo;</h2>
                </div>
                <div className={styles.newsList}>
                    {breakingNews.map((item, i) => (
                        <div key={i} className={styles.newsItem}>
                            <span className={styles.newsNum}>{i + 1}</span>
                            <div className={styles.newsBody}>
                                <p className={styles.newsTitle}>{item.title}</p>
                                <span className={styles.newsPct} style={{ color: item.up ? 'var(--yes)' : 'var(--no)' }}>
                                    {item.up ? '▲' : '▼'} {item.pct}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hot Topics */}
            <div className={styles.widget}>
                <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>נושאים חמים &rsaquo;</h2>
                </div>
                <div className={styles.topicsList}>
                    {hotTopics.map((topic, i) => (
                        <div key={i} className={styles.topicItem}>
                            <span className={styles.topicNum}>{i + 1}</span>
                            <span className={styles.topicName}>{topic.name}</span>
                            <span className={styles.topicVol}>{topic.vol}</span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
