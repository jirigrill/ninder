import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { authenticate } from '$lib/server/authenticate';
import { PrismaClient } from '@prisma/client';
import { getPartnerUserId, getSessionId, getSessions } from '$lib/server/SessionRepository';
import { deleteMatch, getCardIdsOfMatches, getSuperLikeMatches } from '$lib/server/MatchRepository';
import { getNames } from '$lib/server/CardRepository';
import type { Match } from '$lib/types';

export const GET: RequestHandler = async (event: RequestEvent) => {
	const userId = await authenticate(event);
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const partnerUserId = await getPartnerUserId(userId);
		if (!partnerUserId) {
			return json({ error: 'No partner found' }, { status: 404 });
		}
		let matchIds = await getCardIdsOfMatches(userId, partnerUserId);
		let superMatches = await getSuperLikeMatches(userId, partnerUserId);
		const cardIds = [...matchIds, ...superMatches];
		const matches = await getNames(cardIds.map((card) => card.id));

		matches.forEach((match) => {
			match.superMatch = superMatches.some((superMatch) => superMatch.id === match.cardId);
		});

		return json(matches);
	} catch (error) {
		return json({ error: 'Failed to fetch categories' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async (event) => {
	const userId = await authenticate(event);
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const match: Match = await event.request.json();
	if (!match?.cardId) {
		return json({ error: "Match couldn't be found!" }, { status: 404 });
	}

	try {
		const partnerUserId = await getPartnerUserId(userId);
		await deleteMatch(userId, partnerUserId || '', match.cardId);

		return json({ message: 'Match deleted successfully' });
	} catch (error) {
		return json({ error: 'Failed to delete session' }, { status: 500 });
	}
};
