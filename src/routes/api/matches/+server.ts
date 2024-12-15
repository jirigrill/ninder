import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import type { Match } from '$lib/types';
import { authenticate } from '$lib/server/authenticate';
import { PrismaClient } from '@prisma/client';
import { getPartnerUserId } from '$lib/server/SessionRepository';
import { getCardIdsOfMatches, getSuperLikeMatches } from '$lib/server/MatchRepository';
import { getNames } from '$lib/server/CardRepository';

export const GET: RequestHandler = async (event: RequestEvent) => {
	const userId = await authenticate(event);
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	let prisma = new PrismaClient();
	try {
		const partnerUserId = await getPartnerUserId(userId, prisma);
		if (!partnerUserId) {
			return json({ error: 'No partner found' }, { status: 404 });
		}
		let matches = await getCardIdsOfMatches(prisma, userId, partnerUserId);
		let superMatches = await getSuperLikeMatches(prisma, userId, partnerUserId);
		const cardIds = [...matches, ...superMatches];
		const names = await getNames(
			prisma,
			cardIds.map((card) => card.id)
		);

		const response: Match[] = names.map((name) => ({
			cardId: name.name_id,
			name: name.name,
			meaning: '',
			superMatch: superMatches.some((match) => match.id === name.name_id)
		}));

		return json(response);
	} catch (error) {
		return json({ error: 'Failed to fetch categories' }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
};
