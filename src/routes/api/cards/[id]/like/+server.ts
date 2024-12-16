import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { authenticate } from '$lib/server/authenticate';
import { PrismaClient } from '@prisma/client';
import { getPartnerUserId, getSessionId } from '$lib/server/SessionRepository';
import { createInteraction, isMatch } from '$lib/server/CardInteractionRepository';
import { createAdvice } from '$lib/server/AdviceRepository';

export const POST: RequestHandler = async (event: RequestEvent) => {
	const user_id = await authenticate(event);
	if (!user_id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const name_id: number = Number.parseInt(event.params.id || '');

	if (!name_id || !user_id) {
		return json({ error: 'Missing name_id or user_id' }, { status: 400 });
	}

	const prisma = new PrismaClient();
	try {
		const session_id = await getSessionId(prisma, user_id);
		if (session_id === null) {
			return json({ error: `No active session could be found!` }, { status: 400 });
		}
		await createInteraction(prisma, name_id, user_id, session_id, 'liked');
		const partnerUserId = await getPartnerUserId(user_id, prisma);
		const isLikedByPartner = await isMatch(prisma, partnerUserId || '', name_id);
		if (isLikedByPartner) {
			await createAdvice(prisma, partnerUserId || '');
			await createAdvice(prisma, user_id || '');
		}
		return new Response(null, { status: 204 });
	} catch (error) {
		console.error(error);
		return json({ error: 'Internal server error' }, { status: 500 });
	} finally {
		prisma.$disconnect;
	}
};
