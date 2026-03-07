'use server';

import { createBet, resolveBetAndPayWinners, getActiveBets } from '@/lib/admin';
import { db } from '@/lib/db';
import { betsTable, betOptionsTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function submitNewBet(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const category = formData.get('category') as string || 'trending';
    const endDateStr = formData.get('endDate') as string;
    const yesProbStr = formData.get('yesProb') as string;

    if (!title || !description || !imageUrl || !endDateStr) {
        throw new Error('חסרים שדות חובה');
    }

    const yesProb = Math.min(99, Math.max(1, Number(yesProbStr) || 50));
    const noProb = 100 - yesProb;

    const options = [
        { name: 'Yes', probability: yesProb },
        { name: 'No', probability: noProb },
    ];

    await createBet(title, description, imageUrl, category, new Date(endDateStr), options);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function submitBetResolution(betId: number, winningOptionId: number) {
    await resolveBetAndPayWinners(betId, winningOptionId);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteBet(betId: number) {
    // Delete options first (FK constraint), then the bet
    await db.delete(betOptionsTable).where(eq(betOptionsTable.betId, betId));
    await db.delete(betsTable).where(eq(betsTable.id, betId));
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function togglePin(betId: number, currentPinned: boolean) {
    await db.update(betsTable).set({ isPinned: !currentPinned }).where(eq(betsTable.id, betId));
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updateBet(formData: FormData) {
    const betId = Number(formData.get('betId'));
    const title = formData.get('title') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const yesProbStr = formData.get('yesProb') as string;
    const yesProb = Math.min(99, Math.max(1, Number(yesProbStr) || 50));
    const noProb = 100 - yesProb;

    if (!betId || !title) throw new Error('Missing fields');

    await db.update(betsTable).set({ title, imageUrl }).where(eq(betsTable.id, betId));

    // Update probabilities on Yes/No options
    const options = await db.select().from(betOptionsTable).where(eq(betOptionsTable.betId, betId));
    for (const opt of options) {
        const prob = opt.name === 'Yes' ? yesProb : noProb;
        await db.update(betOptionsTable).set({ probability: prob }).where(eq(betOptionsTable.id, opt.id));
    }

    revalidatePath('/');
    revalidatePath('/admin');
}
