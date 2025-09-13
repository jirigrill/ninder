import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { SessionService } from '../services/SessionService';
import { CategoryService } from '../services/CategoryService';
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
	const sex = url.searchParams.get('sex') || 'all';
	const set = url.searchParams.get('set') || 'quick';

	// Verify the username matches the authenticated user
	if (username !== authenticatedUser.username) {
		return json({ error: 'Username mismatch' }, { status: 403 });
	}

	if (!username) {
		return json({ error: 'username is required' }, { status: 400 });
	}

	try {
		const categoryService = new CategoryService(new SessionService());
		const categoryProgress = await categoryService.getCategories(set, sex, username);

		return json(categoryProgress);
	} catch {
		return json({ error: 'Failed to fetch categories' }, { status: 500 });
	}
};
