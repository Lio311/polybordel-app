// ─── Types ───────────────────────────────────────────────────────────────────

export interface MarketData {
    usdIls: number | null;
    btcUsd: number | null;
    btcChange: number | null;
    ethUsd: number | null;
    ethChange: number | null;
    sp500Usd: number | null;
    sp500Change: number | null;
    nasdaqUsd: number | null;
    nasdaqChange: number | null;
}

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
}

// ─── Exchange Rates & Crypto & Indices ───────────────────────────────────────

export async function getMarketData(): Promise<MarketData> {
    try {
        const [fxRes, btcRes, sp500Res, nasdaqRes] = await Promise.all([
            fetch('https://api.frankfurter.app/latest?from=USD&to=ILS', { next: { revalidate: 300 } }),
            fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true', { next: { revalidate: 300 } }),
            fetch('https://query1.finance.yahoo.com/v8/finance/chart/^GSPC', { next: { revalidate: 300 } }),
            fetch('https://query1.finance.yahoo.com/v8/finance/chart/^IXIC', { next: { revalidate: 300 } }),
        ]);

        const fxData = fxRes.ok ? await fxRes.json() : null;
        const btcData = btcRes.ok ? await btcRes.json() : null;
        const spData = sp500Res.ok ? await sp500Res.json() : null;
        const ndqData = nasdaqRes.ok ? await nasdaqRes.json() : null;

        const spMeta = spData?.chart?.result?.[0]?.meta;
        const spChange = spMeta ? ((spMeta.regularMarketPrice - spMeta.previousClose) / spMeta.previousClose) * 100 : null;

        const ndqMeta = ndqData?.chart?.result?.[0]?.meta;
        const ndqChange = ndqMeta ? ((ndqMeta.regularMarketPrice - ndqMeta.previousClose) / ndqMeta.previousClose) * 100 : null;

        return {
            usdIls: fxData?.rates?.ILS ?? null,
            btcUsd: btcData?.bitcoin?.usd ?? null,
            btcChange: btcData?.bitcoin?.usd_24h_change ?? null,
            ethUsd: btcData?.ethereum?.usd ?? null,
            ethChange: btcData?.ethereum?.usd_24h_change ?? null,
            sp500Usd: spMeta?.regularMarketPrice ?? null,
            sp500Change: spChange,
            nasdaqUsd: ndqMeta?.regularMarketPrice ?? null,
            nasdaqChange: ndqChange,
        };
    } catch {
        return { usdIls: null, btcUsd: null, btcChange: null, ethUsd: null, ethChange: null, sp500Usd: null, sp500Change: null, nasdaqUsd: null, nasdaqChange: null };
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

async function translateToHebrew(text: string): Promise<string> {
    try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=iw&dt=t&q=${encodeURIComponent(text)}`);
        const data = await res.json();
        return data[0][0][0] || text;
    } catch {
        return text; // fallback to English if translation fails
    }
}

export async function getBreakingNews(): Promise<NewsItem[]> {
    const results = await Promise.allSettled(RSS_FEEDS.map(parseRss));
    const all: NewsItem[] = [];
    for (const r of results) {
        if (r.status === 'fulfilled') all.push(...r.value);
    }
    const seen = new Set<string>();
    const topUnique = all.filter(n => {
        if (!n.title || seen.has(n.title)) return false;
        seen.add(n.title);
        return true;
    }).slice(0, 8);

    // Translate titles to Hebrew
    return Promise.all(topUnique.map(async item => ({
        ...item,
        title: await translateToHebrew(item.title)
    })));
}
