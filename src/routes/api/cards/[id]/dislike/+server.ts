import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { authenticate } from '$lib/server/authenticate';
import { getSessionId } from '$lib/server/SessionRepository';
import { PrismaClient } from '@prisma/client';
import { createInteraction } from '$lib/server/CardInteractionRepository';

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
		await createInteraction(prisma, name_id, user_id, session_id, 'disliked');
		return new Response(null, { status: 204 });
	} catch (error) {
		console.error(error);
		return json({ error: 'Internal server error' }, { status: 500 });
	} finally {
		prisma.$disconnect;
	}
};
