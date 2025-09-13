import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import type { Match } from '$lib/types';
import { SessionService } from '../services/SessionService';
import { AdviceService } from '../services/AdviceService';
import { MatchService } from '../services/MatchService';

export const GET: RequestHandler = async (event: RequestEvent) => {
	const url = new URL(event.request.url);
	const username = url.searchParams.get('username');
	
	if (!username) {
		return json({ error: 'username is required' }, { status: 400 });
	}

	try {
		const sessionService = new SessionService();
		const session = await sessionService.getSessionByUserId(username);
		const partnerUserId = sessionService.getPartnerUserId(username, session);
		if (!partnerUserId) {
			return json({ error: 'No partner found' }, { status: 404 });
		}

		const matchService = new MatchService(sessionService, new AdviceService());
		const matches = await matchService.getMatches(username, partnerUserId);

		return json(matches);
	} catch (error) {
		return json({ error: 'Failed to fetch categories' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async (event) => {
	const url = new URL(event.request.url);
	const username = url.searchParams.get('username');
	
	if (!username) {
		return json({ error: 'username is required' }, { status: 400 });
	}

	const match: Match = await event.request.json();
	if (!match?.cardId) {
		return json({ error: "Match couldn't be found!" }, { status: 404 });
	}
	try {
		const sessionService = new SessionService();
		const session = await sessionService.getSessionByUserId(username);
		const partnerUserId = sessionService.getPartnerUserId(username, session);

		const matchService = new MatchService(sessionService, new AdviceService());
		await matchService.deleteMatch(username, partnerUserId || '', match.cardId);

		return json({ message: 'Match deleted successfully' });
	} catch (error) {
		return json({ error: 'Failed to delete session' }, { status: 500 });
	}
};
