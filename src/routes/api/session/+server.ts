import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import type { Session } from '$lib/types';
import { authenticate } from '$lib/server/authenticate';
import { deleteHistory } from '$lib/server/CategoryRepository';
import { SessionService } from '../services/SessionService';

export const GET: RequestHandler = async (event: RequestEvent) => {
	const userId = await authenticate(event);
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!userId) {
		return json({ error: 'user_id is required' }, { status: 400 });
	}

	try {
		const session = await new SessionService().getSessionByUserId(userId);

		if (!session) {
			return json({ error: 'No session found' }, { status: 404 });
		}

		return json(session);
	} catch (error) {
		return json({ error: 'Failed to fetch session' }, { status: 500 });
	}
};

export const POST: RequestHandler = async (event: RequestEvent) => {
	const userId = await authenticate(event);
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	try {
		const newSession: Session = await event.request.json();
		if (!newSession.initiatorUserId && !newSession.partnerUserId) {
			return json(
				{ error: 'when creating a session, initiator_user_id is required!' },
				{ status: 400 }
			);
		}

		if (newSession.initiatorUserId && newSession.partnerUserId) {
			return json(
				{ error: 'when joining a session, initiator_user_id cannot be set!' },
				{ status: 400 }
			);
		}

		if (newSession.partnerUserId && !newSession.pairingCode) {
			return json({ error: 'when joining a session, pairing code is required!' }, { status: 400 });
		}

		let session = await new SessionService().createOrJoinSession(newSession);
		if (!session) {
			return json({ error: 'Failed to create or join session' }, { status: 404 });
		}

		return json(session, { status: 200 });
	} catch (error) {
		return json({ error: 'Failed to create session' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async (event) => {
	const userId = await authenticate(event);
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!userId) {
		return json({ error: 'user_id is required' }, { status: 400 });
	}

	try {
		await new SessionService().deleteSessionByUserId(userId);
		// await deleteAllCardInteractions(sessionId || -1);
		await deleteHistory(userId);

		return json({ message: 'Session deleted successfully' });
	} catch (error) {
		return json({ error: 'Failed to delete session' }, { status: 500 });
	}
};
