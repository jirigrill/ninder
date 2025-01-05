import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { authenticate } from '$lib/server/authenticate';
import type { Match } from '$lib/types';
import { SessionService } from '../services/SessionService';
import { AdviceService } from '../services/AdviceService';
import { MatchService } from '../services/MatchService';

export const GET: RequestHandler = async (event: RequestEvent) => {
	const userId = await authenticate(event);
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const sessionService = new SessionService();
		const session = await sessionService.getSessionByUserId(userId);
		const partnerUserId = sessionService.getPartnerUserId(userId, session);
		if (!partnerUserId) {
			return json({ error: 'No partner found' }, { status: 404 });
		}

		const matchService = new MatchService(sessionService, new AdviceService());
		const matches = await matchService.getMatches(userId, partnerUserId);

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
		const sessionService = new SessionService();
		const session = await sessionService.getSessionByUserId(userId);
		const partnerUserId = sessionService.getPartnerUserId(userId, session);

		const matchService = new MatchService(sessionService, new AdviceService());
		await matchService.deleteMatch(userId, partnerUserId || '', match.cardId);

		return json({ message: 'Match deleted successfully' });
	} catch (error) {
		return json({ error: 'Failed to delete session' }, { status: 500 });
	}
};
