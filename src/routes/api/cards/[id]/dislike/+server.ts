import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { authenticate } from '$lib/server/authenticate';
import { SessionService } from '../../../services/SessionService';
import { AdviceService } from '../../../services/AdviceService';
import { MatchService } from '../../../services/MatchService';

export const POST: RequestHandler = async (event: RequestEvent) => {
	const user_id = await authenticate(event);
	if (!user_id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const name_id: number = Number.parseInt(event.params.id || '');
	const url = new URL(event.request.url);
	const categoryOrigin = url.searchParams.get('categoryOrigin') || '';

	if (!name_id || !user_id) {
		return json({ error: 'Missing name_id or user_id' }, { status: 400 });
	}

	try {
		const sessionService = new SessionService();
		const adviceService = new AdviceService();
		const matchService = new MatchService(sessionService, adviceService);

		const result = await matchService.createInteraction(
			name_id,
			user_id,
			'disliked',
			categoryOrigin
		);
		if (!result) {
			return json({ error: `Could not create card interaction!` }, { status: 400 });
		}

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error(error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
