import type { Card } from '$lib/types';
import type { PrismaClient } from '@prisma/client';
import { getPartnerUserId } from './SessionRepository';
import { getLikedByPartner } from './CardInteractionRepository';

export async function getNextCards(
	prisma: PrismaClient,
	userId: string,
	letterCode: string,
	take: number
): Promise<Card[]> {
	let response = [];
	const interactedCards = await prisma.card_interactions
		.findMany({
			where: { user_id: userId },
			select: { name_id: true }
		})
		.then((interactions) => interactions.map((interaction) => interaction.name_id || -1));

	if (letterCode === '[MIX]') {
		response = await prisma.names.findMany({
			where: {
				id: { notIn: interactedCards }
			},
			distinct: ['id'],
			orderBy: { id: 'asc' },
			take: take,
			include: { name_categories: { include: { categories: { select: { letter_code: true } } } } }
		});
	} else if (letterCode === '[DP]') {
		const partnerUserId = await getPartnerUserId(userId, prisma);
		const partnerInteractions = await getLikedByPartner(prisma, partnerUserId || '');
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
				id: { notIn: interactedCards },
				name_categories: { some: { categories: { letter_code: letterCode } } }
			},
			distinct: ['id'],
			orderBy: { id: 'asc' },
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
			.filter((code): code is string => code !== null),
		partnerInteraction: null
	}));
}

export type Name = {
	name_id: number;
	name: string;
};

export async function getNames(prisma: PrismaClient, nameIds: number[]): Promise<Name[]> {
	const names = await prisma.names.findMany({
		where: { id: { in: nameIds } },
		select: { id: true, name: true }
	});
	return names.map((name) => ({ name_id: name.id, name: name.name }));
}
