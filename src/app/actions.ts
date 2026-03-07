'use server';

import { db } from '@/lib/db';
import { betsTable, betOptionsTable, transactionsTable, usersTable } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function placeBet(userId: string, betOptionId: number, amount: number) {
    // 1. Validate user has enough balance
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user || user.balance < amount) {
        throw new Error('Insufficient balance or user not found');
    }

    // 2. Calculate Shares (For simplicity: Shares = Amount / Probability)
    // E.g. placing 100¢ on a 50% probability option gives 2 shares.
    const [option] = await db.select().from(betOptionsTable).where(eq(betOptionsTable.id, betOptionId));
    if (!option) throw new Error('Option not found');

    // Convert probability to a 0-1 multiplier (e.g. 50 probability -> 0.5)
    // Amount is in cents.
    const probabilityDecimal = option.probability / 100;
    const shares = Math.floor(amount / probabilityDecimal);

    // 3. Perform the purchase transaction
    await db.transaction(async (trx) => {
        // Deduct balance
        await trx.update(usersTable)
            .set({ balance: user.balance - amount })
            .where(eq(usersTable.id, userId));

        // Create transaction record
        await trx.insert(transactionsTable).values({
            userId,
            betOptionId,
            amount,
            shares,
        });

        // Update the bet's total volume
        const [bet] = await trx.select().from(betsTable).where(eq(betsTable.id, option.betId));
        if (bet) {
            await trx.update(betsTable).set({ volume: bet.volume + amount }).where(eq(betsTable.id, bet.id));
        }
    });

    return { success: true, shares };
}
