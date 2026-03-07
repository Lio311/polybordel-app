import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { usersTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ balance: 0 });
    }

    // Ensure user exists in our DB, since we don't have a reliable Clerk webhook hooked up yet
    let [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

    if (!user) {
        [user] = await db.insert(usersTable).values({
            id: userId,
            email: 'demo@example.com', // mock email since we don't retrieve clerk email strictly here
            balance: 100000, // 100000 cents = $1000.00
            role: 'user',
        }).returning();
    }

    return NextResponse.json({ balance: user.balance });
}
