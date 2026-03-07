'use server';

import { db } from '@/lib/db';
import { betsTable, betOptionsTable, transactionsTable, usersTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function placeBet(userId: string, betOptionId: number, amount: number) {
    // 1. Get user (the /api/balance route creates them on first load)
    let [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) {
        // Fallback: auto-create user if they still don't exist
        const inserted = await db.insert(usersTable)
            .values({ id: userId, email: 'user@polybordel.com', balance: 100000, role: 'user' })
            .returning();
        user = inserted[0];
    }
    if (user.balance < amount) {
        throw new Error('Insufficient balance');
    }

    // 2. Get the bet option
    const [option] = await db.select().from(betOptionsTable).where(eq(betOptionsTable.id, betOptionId));
    if (!option) throw new Error('Option not found');

    const probabilityDecimal = option.probability / 100;
    const shares = probabilityDecimal > 0 ? Math.floor(amount / probabilityDecimal) : amount;

    // 3. Sequential updates — Neon HTTP driver does NOT support db.transaction()
    // Deduct balance
    await db.update(usersTable)
        .set({ balance: user.balance - amount })
        .where(eq(usersTable.id, userId));

    // Record transaction
    await db.insert(transactionsTable).values({
        userId,
        betOptionId,
        amount,
        shares,
    });

    // Update bet volume
    const [bet] = await db.select().from(betsTable).where(eq(betsTable.id, option.betId));
    if (bet) {
        await db.update(betsTable)
            .set({ volume: bet.volume + amount })
            .where(eq(betsTable.id, bet.id));
    }

    return { success: true, shares };
}
