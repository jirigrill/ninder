import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { authenticate } from '$lib/server/authenticate';
import { createInteraction, isMatch } from '$lib/server/CardInteractionRepository';
import { createAdvice } from '$lib/server/AdviceRepository';
import { SessionService } from '../../../services/SessionService';

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
		const session = await sessionService.getSessionByUserId(user_id);
		if (session === undefined) {
			return json({ error: `No active session could be found!` }, { status: 400 });
		}

		await createInteraction(name_id, user_id, session.id, 'liked', categoryOrigin);

		const partnerUserId = sessionService.getPartnerUserId(user_id, session);
		const isLikedByPartner = await isMatch(partnerUserId || '', name_id);
		if (isLikedByPartner) {
			await createAdvice(partnerUserId || '');
			await createAdvice(user_id || '');
		}

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error(error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
