import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
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
		let matchIds = await getCardIdsOfMatches(prisma, userId, partnerUserId);
		let superMatches = await getSuperLikeMatches(prisma, userId, partnerUserId);
		const cardIds = [...matchIds, ...superMatches];
		const matches = await getNames(
			prisma,
			cardIds.map((card) => card.id)
		);

		matches.forEach((match) => {
			match.superMatch = superMatches.some((superMatch) => superMatch.id === match.cardId);
		});

		return json(matches);
	} catch (error) {
		return json({ error: 'Failed to fetch categories' }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
};
