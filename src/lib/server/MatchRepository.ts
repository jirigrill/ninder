import prisma from './PrismaContext';

export type MatchPair = { id: number; superMatch: boolean };

export async function getCardIdsOfMatches(userId: string, partnerId: string): Promise<MatchPair[]> {
	const interactedCards = await prisma.card_interactions.groupBy({
		where: {
			OR: [
				{ user_id: userId, action: 'liked' },
				{ user_id: partnerId, action: 'liked' }
			]
		},
		by: ['name_id'],
		_count: { name_id: true },
		having: { name_id: { _count: { equals: 2 } } }
	});

	return interactedCards.map((card) => ({ id: card.name_id || -1, superMatch: false }));
}

export async function getSuperLikeMatches(userId: string, partnerId: string): Promise<MatchPair[]> {
	const interactedCards = await prisma.card_interactions.groupBy({
		where: {
			OR: [
				{ user_id: userId, action: 'superliked' },
				{ user_id: partnerId, action: 'superliked' }
			]
		},
		by: ['name_id'],
		_count: { name_id: true },
		having: { name_id: { _count: { gte: 1 } } }
	});

	return interactedCards.map((card) => ({ id: card.name_id || -1, superMatch: true }));
}

export async function deleteMatch(
	userId: string,
	partnerUserId: string,
	cardId: number
): Promise<void> {
	await prisma.card_interactions.updateMany({
		where: { user_id: userId, name_id: cardId },
		data: { action: 'disliked' }
	});
	await prisma.card_interactions.updateMany({
		where: { user_id: partnerUserId, name_id: cardId },
		data: { action: 'disliked' }
	});
}
