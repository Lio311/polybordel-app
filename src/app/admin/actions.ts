'use server';

import { createBet, resolveBetAndPayWinners } from '@/lib/admin';
import { revalidatePath } from 'next/cache';

export async function submitNewBet(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const endDateStr = formData.get('endDate') as string;

    if (!title || !description || !imageUrl || !endDateStr) {
        throw new Error('Missing fields');
    }

    // Admin provides Yes/No automatically for simplicity
    const options = [
        { name: 'Yes', probability: 50 },
        { name: 'No', probability: 50 }
    ];

    await createBet(title, description, imageUrl, new Date(endDateStr), options);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function submitBetResolution(betId: number, winningOptionId: number) {
    await resolveBetAndPayWinners(betId, winningOptionId);
    revalidatePath('/');
    revalidatePath('/admin');
}
