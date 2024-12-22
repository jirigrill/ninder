import type { Card, Match } from '$lib/types';
import { getPartnerUserId } from './SessionRepository';
import { getLikedByPartner } from './CardInteractionRepository';
import prisma from './PrismaContext';

export async function getNextCards(
	userId: string,
	letterCode: string,
	take: number,
	sex: string
): Promise<Card[]> {
	let response = [];
	const interactedCards = await getIntercatedCards(userId, letterCode, sex);

	const whereClause =
		sex === 'all'
			? {
					id: { notIn: interactedCards }
				}
			: {
					id: { notIn: interactedCards },
					sex: { in: ['all', sex] }
				};

	if (letterCode.toUpperCase() === 'XDP') {
		const partnerUserId = await getPartnerUserId(userId);
		const partnerInteractions = await getLikedByPartner(partnerUserId || '', sex);
		const partnerInteractedCards = partnerInteractions.map((interaction) => interaction.cardId);

		response = await prisma.names.findMany({
			where: { AND: [{ id: { in: partnerInteractedCards } }, { id: { notIn: interactedCards } }] },
			distinct: ['id'],
			orderBy: { id: 'asc' },
			take: take,
			include: { name_categories: { include: { categories: { select: { letter_code: true } } } } }
		});
	} else {
		response = await prisma.names.findMany({
			where: {
				...whereClause,
				name_categories: { some: { categories: { letter_code: letterCode } } }
			},
			distinct: ['id'],
			orderBy: [{ popular: 'desc' }, { id: 'asc' }],
			take: take,
			include: { name_categories: { include: { categories: { select: { letter_code: true } } } } }
		});
	}

	return response.map((name) => ({
		id: name.id,
		name: name.name,
		meaning: name.meaning ?? '',
		countries: name.name_categories
			.map((nc) => nc.categories.letter_code)
			.filter((code): code is string => code !== null)
			.filter((code) => code[0] !== 'X'),
		partnerInteraction: null
	}));
}

export type Name = {
	name_id: number;
	name: string;
};

export async function getNames(nameIds: number[]): Promise<Match[]> {
	const names = await prisma.names.findMany({
		where: {
			id: { in: nameIds }
		},
		distinct: ['id'],
		orderBy: { name: 'asc' },
		include: { name_categories: { include: { categories: { select: { letter_code: true } } } } }
	});

	return names.map((name) => ({
		cardId: name.id,
		name: name.name,
		meaning: '',
		countries: name.name_categories
			.map((nc) => nc.categories.letter_code)
			.filter((code): code is string => code !== null),
		superMatch: false
	}));
}

async function getIntercatedCards(
	userId: string,
	category: string,
	sex: string
): Promise<number[]> {
	let cardInteractions: { name_id: number | null }[];

	if (category.toUpperCase() === 'XDP') {
		cardInteractions = await prisma.card_interactions.findMany({
			where:
				sex === 'all'
					? {
							user_id: userId,
							OR: [{ last_change: false }, { action: 'liked' }, { action: 'superliked' }]
						}
					: {
							user_id: userId,
							names: { sex: { in: ['all', sex] } },
							OR: [{ last_change: false }, { action: 'liked' }, { action: 'superliked' }]
						},
			select: { name_id: true }
		});
	} else {
		cardInteractions = await prisma.card_interactions.findMany({
			where:
				sex === 'all'
					? { user_id: userId }
					: { user_id: userId, names: { sex: { in: ['all', sex] } } },
			select: { name_id: true }
		});
	}
	return cardInteractions.map((interaction) => interaction.name_id || -1);
}
