// ─── Types ───────────────────────────────────────────────────────────────────

export interface MarketData {
    usdIls: number | null;
    btcUsd: number | null;
    btcChange: number | null;
    ethUsd: number | null;
    ethChange: number | null;
}

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
}

// ─── Exchange Rates (frankfurter.app – free, no key) ─────────────────────────

export async function getMarketData(): Promise<MarketData> {
    try {
        const [fxRes, btcRes] = await Promise.all([
            fetch('https://api.frankfurter.app/latest?from=USD&to=ILS', {
                next: { revalidate: 300 }, // cache 5 min
            }),
            fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
                { next: { revalidate: 300 } }
            ),
        ]);

        const fxData = fxRes.ok ? await fxRes.json() : null;
        const btcData = btcRes.ok ? await btcRes.json() : null;

        return {
            usdIls: fxData?.rates?.ILS ?? null,
            btcUsd: btcData?.bitcoin?.usd ?? null,
            btcChange: btcData?.bitcoin?.usd_24h_change ?? null,
            ethUsd: btcData?.ethereum?.usd ?? null,
            ethChange: btcData?.ethereum?.usd_24h_change ?? null,
        };
    } catch {
        return { usdIls: null, btcUsd: null, btcChange: null, ethUsd: null, ethChange: null };
    }
}

// ─── Breaking News (direct BBC/Reuters RSS XML parsing – no API key) ─────────

const RSS_FEEDS = [
    { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC World' },
    { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', source: 'BBC Tech' },
    { url: 'https://feeds.bbci.co.uk/sport/rss.xml', source: 'BBC Sport' },
];

function extractTag(xml: string, tag: string): string {
    const m = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
    return (m?.[1] || m?.[2] || '').trim();
}

async function parseRss(feed: { url: string; source: string }): Promise<NewsItem[]> {
    try {
        const res = await fetch(feed.url, {
            next: { revalidate: 600 },
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Polybordel/1.0)' },
        });
        if (!res.ok) return [];
        const xml = await res.text();
        const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];
        return itemMatches.slice(0, 4).map(m => {
            const body = m[1];
            return {
                title: extractTag(body, 'title'),
                link: extractTag(body, 'link') || extractTag(body, 'guid'),
                pubDate: extractTag(body, 'pubDate'),
                source: feed.source,
            };
        }).filter(n => n.title.length > 0);
    } catch {
        return [];
    }
}

export async function getBreakingNews(): Promise<NewsItem[]> {
    const results = await Promise.allSettled(RSS_FEEDS.map(parseRss));
    const all: NewsItem[] = [];
    for (const r of results) {
        if (r.status === 'fulfilled') all.push(...r.value);
    }
    const seen = new Set<string>();
    return all.filter(n => {
        if (!n.title || seen.has(n.title)) return false;
        seen.add(n.title);
        return true;
    }).slice(0, 8);
}
