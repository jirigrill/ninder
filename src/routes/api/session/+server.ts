import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import type { Session } from '$lib/types';
import { deleteHistory } from '$lib/server/CategoryRepository';
import { SessionService } from '../services/SessionService';
import { CardService } from '../services/CardService';
import { MatchService } from '../services/MatchService';
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

	// Verify the username matches the authenticated user
	if (username !== authenticatedUser.username) {
		return json({ error: 'Username mismatch' }, { status: 403 });
	}

	if (!username) {
		return json({ error: 'username is required' }, { status: 400 });
	}

	try {
		const session = await new SessionService().getSessionByUserId(username);

		if (!session) {
			return json({ error: 'No session found' }, { status: 404 });
		}

		return json(session);
	} catch (error) {
		return json({ error: 'Failed to fetch session' }, { status: 500 });
	}
};

export const POST: RequestHandler = async (event: RequestEvent) => {
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
	const url = new URL(event.request.url);
	const username = url.searchParams.get('username');

	if (!username) {
		return json({ error: 'username is required' }, { status: 400 });
	}

	try {
		const sessionService = new SessionService();

		await new CardService(sessionService).deleteAllCardInteractions(username);
		await deleteHistory(username);

		await sessionService.deleteSessionByUserId(username);

		return json({ message: 'Session deleted successfully' });
	} catch (error) {
		return json({ error: 'Failed to delete session' }, { status: 500 });
	}
};
