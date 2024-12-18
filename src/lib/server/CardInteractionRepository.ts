import type { CardInteraction } from '$lib/types';
import prisma from './PrismaContext';

export type InteractedCards = {
	name_id: number;
	categories: number[];
};

export async function getCardInteractions(
	userId: string,
	sex: string,
	cardIds: number[] | null = null
): Promise<InteractedCards[]> {
	let whereQuery: {
		user_id: string;
		id?: { in: number[] };
		names?: { sex: string };
	} = { user_id: userId };

	if (cardIds) {
		whereQuery = { ...whereQuery, id: { in: cardIds } };
	}

	if (sex && sex !== 'all') {
		whereQuery = { ...whereQuery, names: { sex: sex } };
	}

	const queryResult = await prisma.card_interactions.findMany({
		where: whereQuery,
		select: {
			name_id: true,
			names: {
				select: {
					name_categories: {
						select: { category_id: true }
					}
				}
			}
		}
	});

	return queryResult.map((result) => ({
		name_id: result.name_id || -1,
		categories: result.names?.name_categories.map((category) => category.category_id) ?? []
	}));
}

export async function getPartnerCardInteractions(
	userId: string,
	cardIds: number[]
): Promise<CardInteraction[]> {
	const result = await prisma.card_interactions.findMany({
		where: { user_id: userId, name_id: { in: cardIds } }
	});
	return result.map((interaction) => ({
		userId: userId,
		cardId: interaction.name_id || -1,
		swipe: interaction.action as 'disliked' | 'liked' | 'superliked'
	}));
}

export async function deleteAllCardInteractions(sessionId: number): Promise<void> {
	await prisma.card_interactions.deleteMany({ where: { session_id: sessionId } });
}

export async function createInteraction(
	nameId: number,
	userId: string,
	sessionId: number,
	action: 'disliked' | 'liked' | 'superliked'
): Promise<void> {
	await prisma.card_interactions.create({
		data: { name_id: nameId, user_id: userId, action: action, session_id: sessionId }
	});
}

export async function getLikedByPartner(
	partnerUserId: string,
	sex: string
): Promise<CardInteraction[]> {
	let whereClause = { user_id: partnerUserId, OR: [{ action: 'liked' }, { action: 'superliked' }] };
	if (sex !== 'all') {
		whereClause = { ...whereClause, names: { sex: sex } };
	}
	const result = await prisma.card_interactions.findMany({
		where: whereClause
	});

	return result.map((interaction) => ({
		userId: interaction.user_id,
		cardId: interaction.name_id || -1,
		swipe: interaction.action as 'disliked' | 'liked' | 'superliked'
	}));
}

export async function isMatch(partnerUserId: string, cardId: number): Promise<Boolean> {
	const result = await prisma.card_interactions.findFirst({
		where: { user_id: partnerUserId, name_id: cardId, action: 'liked' }
	});
	return result !== null;
}
