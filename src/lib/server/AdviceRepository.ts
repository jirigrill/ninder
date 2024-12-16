import type { Advice } from '$lib/types';
import type { PrismaClient } from '@prisma/client';

export async function getAdvice(prisma: PrismaClient, userId: string): Promise<Advice> {
	const advice = await prisma.advices.findMany({ where: { user_id: userId } });

	if (advice.length === 0) {
		return { id: -1, userId: userId, active: false };
	}

	return { id: advice[0].id, userId: advice[0].user_id, active: true };
}

export async function deleteAdvice(prisma: PrismaClient, userId: string): Promise<void> {
	await prisma.advices.deleteMany({ where: { user_id: userId } });
}

export async function createAdvice(prisma: PrismaClient, userId: string): Promise<void> {
	await prisma.advices.create({ data: { user_id: userId } });
}
