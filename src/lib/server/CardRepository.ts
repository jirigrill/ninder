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
	const interactedCards = await prisma.card_interactions
		.findMany({
			where:
				sex === 'all'
					? { user_id: userId }
					: { user_id: userId, names: { sex: { in: ['all', sex] } } },
			select: { name_id: true }
		})
		.then((interactions) => interactions.map((interaction) => interaction.name_id || -1));

	const whereClause =
		sex === 'all'
			? {
					id: { notIn: interactedCards }
				}
			: {
					id: { notIn: interactedCards },
					sex: { in: ['all', sex] }
				};
	if (letterCode === 'xdp') {
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
