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

// ─── Breaking News (BBC World RSS via rss2json.com – free, no key) ────────────

const RSS_SOURCES = [
    // BBC World
    'https://feeds.bbci.co.uk/news/world/rss.xml',
    // Reuters Top News
    'https://feeds.reuters.com/reuters/topNews',
];

async function fetchRssJson(rssUrl: string): Promise<NewsItem[]> {
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=4`;
    const res = await fetch(url, { next: { revalidate: 600 } }); // 10 min cache
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'ok' || !Array.isArray(data.items)) return [];
    return data.items.map((item: any) => ({
        title: item.title as string,
        link: item.link as string,
        pubDate: item.pubDate as string,
        source: data.feed?.title ?? 'חדשות',
    }));
}

export async function getBreakingNews(): Promise<NewsItem[]> {
    try {
        const results = await Promise.allSettled(RSS_SOURCES.map(fetchRssJson));
        const all: NewsItem[] = [];
        for (const r of results) {
            if (r.status === 'fulfilled') all.push(...r.value);
        }
        // Deduplicate by title, take top 6
        const seen = new Set<string>();
        return all.filter(n => {
            if (seen.has(n.title)) return false;
            seen.add(n.title);
            return true;
        }).slice(0, 6);
    } catch {
        return [];
    }
}
