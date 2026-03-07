export const dynamic = 'force-dynamic';

import { getActiveBets } from '@/lib/admin';
import { db } from '@/lib/db';
import { betOptionsTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import BetCard from '@/components/BetCard';
import RightSidebar from '@/components/RightSidebar';

export default async function Home() {
  const activeBets = await getActiveBets();

  const betsWithOptions = await Promise.all(activeBets.map(async (bet) => {
    const options = await db.select().from(betOptionsTable).where(eq(betOptionsTable.betId, bet.id));
    return { ...bet, options };
  }));

  return (
    <div className="layout-wrapper">
      <div className="layout-body">
        {/* Right Sidebar (RTL: displayed on the right) */}
        <RightSidebar />

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
            <div className="stagger-children" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px',
            }}>
              {betsWithOptions.map((bet) => (
                <BetCard key={bet.id} bet={bet as any} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
