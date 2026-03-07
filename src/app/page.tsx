import { getActiveBets } from '@/lib/admin';
import { db } from '@/lib/db';
import { betOptionsTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import BetCard from '@/components/BetCard';

export default async function Home() {
  const activeBets = await getActiveBets();

  // Populate options for each bet
  const betsWithOptions = await Promise.all(activeBets.map(async (bet) => {
    const options = await db.select().from(betOptionsTable).where(eq(betOptionsTable.betId, bet.id));
    return { ...bet, options };
  }));

  return (
    <div>
      <h1 className="animate-fadeInUp" style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: 700 }}>Trending Markets</h1>
      <p className="animate-fadeInUp" style={{ color: 'var(--muted)', marginBottom: '32px', animationDelay: '0.05s' }}>Welcome to Polybordel. Place your bets.</p>

      <div className="stagger-children" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {betsWithOptions.map((bet) => (
          <BetCard key={bet.id} bet={bet as any} />
        ))}
        {betsWithOptions.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>No markets are currently active.</p>
        )}
      </div>
    </div>
  );
}
