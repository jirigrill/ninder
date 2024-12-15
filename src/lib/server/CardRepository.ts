import type { Card } from '$lib/types';
import type { PrismaClient } from '@prisma/client';

export async function getNextCards(
	prisma: PrismaClient,
	userId: string,
	letterCode: string,
	take: number
): Promise<Card[]> {
	const interactedCards = await prisma.card_interactions
		.findMany({
			where: { user_id: userId },
			select: { name_id: true }
		})
		.then((interactions) => interactions.map((interaction) => interaction.name_id || -1));

	const response = await prisma.names.findMany({
		where: {
			id: { notIn: interactedCards },
			name_categories: { some: { categories: { letter_code: letterCode } } }
		},
		distinct: ['id'],
		orderBy: { id: 'asc' },
		take: take,
		include: { name_categories: { include: { categories: { select: { letter_code: true } } } } }
	});

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
