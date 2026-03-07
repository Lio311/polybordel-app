export const dynamic = 'force-dynamic';

import { getActiveBets } from '@/lib/admin';
import { db } from '@/lib/db';
import { betOptionsTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import BetCard from '@/components/BetCard';
import FeaturedBetCard from '@/components/FeaturedBetCard';
import RightSidebar from '@/components/RightSidebar';

type PageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function Home({ searchParams }: PageProps) {
  const sp = await searchParams;
  const category = sp?.category || 'trending';

  let activeBets = await getActiveBets();

  // 1. Filter by category
  if (category !== 'trending') {
    activeBets = activeBets.filter(bet => bet.category === category);
  }

  // 2. Sort logic
  // If 'trending', sort by volume desc. Otherwise, by ID desc (newest first).
  if (category === 'trending') {
    activeBets.sort((a, b) => (b.volume || 0) - (a.volume || 0));
  } else {
    activeBets.sort((a, b) => b.id - a.id);
  }

  // 3. Pinning logic
  // Pinned items always float to the top
  activeBets.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const betsWithOptions = await Promise.all(activeBets.map(async (bet) => {
    const options = await db.select().from(betOptionsTable).where(eq(betOptionsTable.betId, bet.id));
    return { ...bet, options };
  }));

  return (
    <div className="layout-wrapper">
      <div className="layout-body">
        {/* Main Content */}
        <div className="layout-main">
          <h1 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--foreground)' }}>
            שווקים פעילים
          </h1>

          {betsWithOptions.length === 0 ? (
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '48px',
              textAlign: 'center',
              color: 'var(--muted)'
            }}>
              <p style={{ fontSize: '2rem', marginBottom: '8px' }}>🏦</p>
              <p style={{ fontWeight: 600, fontSize: '15px' }}>אין שווקים פעילים כרגע</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>
                המנהל יוסיף הימורים בקרוב!
              </p>
            </div>
          ) : (
            <>
              {/* Highlight Region: Featured Market + Compact Sidebar */}
              <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', height: '50vh', alignItems: 'stretch' }}>
                {/* Compact Sidebar (First in RTL = Right side) */}
                {/* Let the sidebar overflow the height container visible if needed, without scrollbars */}
                <div className="layout-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
                  <RightSidebar />
                </div>

                {/* Main Featured Area (Second in RTL = Left side) */}
                <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
                  {betsWithOptions.length > 0 && betsWithOptions[0].isPinned && (
                    <FeaturedBetCard bet={betsWithOptions[0] as any} />
                  )}
                </div>
              </div>

              {/* Regular Grid */}
              <div className="stagger-children" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '16px',
              }}>
                {betsWithOptions.map((bet, i) => {
                  // Skip the first item if it was already rendered as the featured card
                  if (i === 0 && bet.isPinned) return null;
                  return <BetCard key={bet.id} bet={bet as any} />;
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
