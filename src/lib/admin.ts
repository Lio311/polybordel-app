import { db } from '@/lib/db';
import { betsTable, betOptionsTable, transactionsTable, usersTable } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function createBet(title: string, description: string, imageUrl: string, endDate: Date, options: { name: string, probability: number }[]) {
    // Insert Bet
    const [newBet] = await db.insert(betsTable).values({
        title,
        description,
        imageUrl,
        endDate,
    }).returning();

    // Insert Options
    const optionValues = options.map(opt => ({
        betId: newBet.id,
        name: opt.name,
        probability: opt.probability
    }));

    await db.insert(betOptionsTable).values(optionValues);

    return newBet;
}

export async function getActiveBets() {
    const bets = await db.select().from(betsTable).where(eq(betsTable.resolved, false)).orderBy(desc(betsTable.id));
    return bets;
}

export async function getEndedBetsPendingResolution() {
    const now = new Date();

    // Wait for drizzle to support complex where clauses out of the box or use raw query.
    // For simplicity, fetch unresolved bets and filter in memory since it's a demo.
    const bets = await db.select().from(betsTable).where(eq(betsTable.resolved, false));
    return bets.filter(b => new Date(b.endDate) < now);
}

export async function resolveBetAndPayWinners(betId: number, winningOptionId: number) {
    // 1. Mark bet as resolved
    await db.update(betsTable)
        .set({ resolved: true, winningOptionId, payoutsProcessed: true })
        .where(eq(betsTable.id, betId));

    // 2. Find all transactions for the winning option
    const winningTx = await db.select()
        .from(transactionsTable)
        .where(eq(transactionsTable.betOptionId, winningOptionId));

    // 3. For each transaction, compute payout: payout = shares * 100 (cents)
    // Meaning if they bought 1 share at 50 cents, it pays out 100 cents ($1).
    for (const tx of winningTx) {
        const payout = tx.shares * 100;

        // fetch current user
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, tx.userId));
        if (user) {
            await db.update(usersTable)
                .set({ balance: user.balance + payout })
                .where(eq(usersTable.id, tx.userId));
        }
    }
}
