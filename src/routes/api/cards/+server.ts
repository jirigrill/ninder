import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { authenticate } from '$lib/server/authenticate';
import { getNextCards } from '$lib/server/CardRepository';
import { getPartnerCardInteractions } from '$lib/server/CardInteractionRepository';
import { SessionService } from '../services/SessionService';

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
		const nextCards = await getNextCards(userId, country, take, sex);
		const sessionService = new SessionService();
		const session = await sessionService.getSessionByUserId(userId);
		const partnerUserId = sessionService.getPartnerUserId(userId, session);
		if (partnerUserId === null) {
			return json({ error: 'No partner found' }, { status: 404 });
		}

		const partnerInteractions = await getPartnerCardInteractions(
			partnerUserId,
			nextCards.map((card) => card.id)
		);

		nextCards.forEach((card) => {
			const interaction = partnerInteractions.find((interaction) => interaction.cardId === card.id);
			if (interaction) {
				card.partnerInteraction = interaction;
			}
		});

		return json(nextCards);
	} catch {
		return json({ error: 'Failed to fetch categories' }, { status: 500 });
	}
};
