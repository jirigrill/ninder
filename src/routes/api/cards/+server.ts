import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { SessionService } from '../services/SessionService';
import { CardService } from '../services/CardService';
import { requireAuth } from '$lib/server/auth-middleware';

export const GET: RequestHandler = async (event: RequestEvent) => {
	// Authenticate user
	let authenticatedUser;
	try {
		authenticatedUser = requireAuth(event);
	} catch {
		return json({ error: 'Authentication required' }, { status: 401 });
	}

	const url = new URL(event.request.url);
	const username = url.searchParams.get('username');
	const country = url.searchParams.get('country') ?? '';
	const take = url.searchParams.get('take') ? parseInt(url.searchParams.get('take') || '10') : 10;
	const sex = url.searchParams.get('sex') || 'all';

	// Verify the username matches the authenticated user
	if (username !== authenticatedUser.username) {
		return json({ error: 'Username mismatch' }, { status: 403 });
	}

	if (!username) {
		return json({ error: 'username is required' }, { status: 400 });
	}

	try {
		const sessionService = new SessionService();
		const cardService = new CardService(sessionService);
		const nextCards = await cardService.getNextCards(username, country, take, sex);

		return json(nextCards);
	} catch {
		return json({ error: 'Failed to fetch categories' }, { status: 500 });
	}
};
