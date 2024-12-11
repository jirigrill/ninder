import type { CardInteraction } from '$lib/types';
import type { card_interactions, PrismaClient } from '@prisma/client';

export type InteractedCards = {
	name_id: number;
	categories: number[];
};

export async function getCardInteractions(
	prisma: PrismaClient,
	userId: string,
	cardIds: number[] | null = null
): Promise<InteractedCards[]> {
	let whereQuery: { user_id: string; id?: { in: number[] } } = { user_id: userId };
	if (cardIds) {
		whereQuery = { ...whereQuery, id: { in: cardIds } };
	}

	const queryResult = await prisma.card_interactions.findMany({
		where: whereQuery,
		select: {
			name_id: true,
			names: { select: { name_categories: { select: { category_id: true } } } }
		}
	});

	return queryResult.map((result) => ({
		name_id: result.name_id || -1,
		categories: result.names?.name_categories.map((category) => category.category_id) ?? []
	}));
}

export async function getPartnerCardInteractions(
	prisma: PrismaClient,
	userId: string,
	cardIds: number[]
): Promise<CardInteraction[]> {
	const result = await prisma.card_interactions.findMany({
		where: { user_id: userId, id: { in: cardIds } }
	});
	return result.map((interaction) => ({
		userId: userId,
		cardId: interaction.id,
		nameId: interaction.name_id,
		swipe: interaction.action as 'disliked' | 'liked' | 'superliked'
	}));
}
