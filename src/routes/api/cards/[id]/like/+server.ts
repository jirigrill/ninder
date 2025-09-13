import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { SessionService } from '../../../services/SessionService';
import { AdviceService } from '../../../services/AdviceService';
import { MatchService } from '../../../services/MatchService';
import { requireAuth } from '$lib/server/auth-middleware';

export const POST: RequestHandler = async (event: RequestEvent) => {
	// Authenticate user
	let authenticatedUser;
	try {
		authenticatedUser = requireAuth(event);
	} catch {
		return json({ error: 'Authentication required' }, { status: 401 });
	}

	const url = new URL(event.request.url);
	const username = url.searchParams.get('username');
	const name_id: number = Number.parseInt(event.params.id || '');
	const categoryOrigin = url.searchParams.get('categoryOrigin') || '';

	// Verify the username matches the authenticated user
	if (username !== authenticatedUser.username) {
		return json({ error: 'Username mismatch' }, { status: 403 });
	}

	if (!name_id || !username) {
		return json({ error: 'Missing name_id or username' }, { status: 400 });
	}

	try {
		const sessionService = new SessionService();
		const adviceService = new AdviceService();
		const matchService = new MatchService(sessionService, adviceService);

		const result = await matchService.createInteraction(name_id, username, 'liked', categoryOrigin);
		if (!result.success) {
			return json({ error: `Could not create card interaction!` }, { status: 400 });
		}

		return json(result.isMatch);
	} catch (error) {
		console.error(error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
