import type { Advice } from '$lib/types';
import prisma from './PrismaContext';

export async function getAdvice(userId: string): Promise<Advice> {
	const advice = await prisma.advices.findMany({ where: { user_id: userId } });

	if (advice.length === 0) {
		return { id: -1, userId: userId, active: false };
	}

	return { id: advice[0].id, userId: advice[0].user_id, active: true };
}

export async function deleteAdvice(userId: string): Promise<void> {
	await prisma.advices.deleteMany({ where: { user_id: userId } });
}

export async function createAdvice(userId: string): Promise<void> {
	await prisma.advices.create({ data: { user_id: userId } });
}
