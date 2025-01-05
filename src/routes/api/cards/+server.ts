import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { authenticate } from '$lib/server/authenticate';
import { SessionService } from '../services/SessionService';
import { CardService } from '../services/CardService';

export const GET: RequestHandler = async (event: RequestEvent) => {
	const userId = await authenticate(event);
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const url = new URL(event.request.url);
	const country = url.searchParams.get('country') ?? '';
	const take = url.searchParams.get('take') ? parseInt(url.searchParams.get('take') || '10') : 10;
	const sex = url.searchParams.get('sex') || 'all';

	try {
		const sessionService = new SessionService();
		const cardService = new CardService(sessionService);
		const nextCards = await cardService.getNextCards(userId, country, take, sex);

		return json(nextCards);
	} catch {
		return json({ error: 'Failed to fetch categories' }, { status: 500 });
	}
};
