import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { authenticate } from '$lib/server/authenticate';
import { SessionService } from '../services/SessionService';
import { CategoryService } from '../services/CategoryService';

export const GET: RequestHandler = async (event: RequestEvent) => {
	const userId = await authenticate(event);
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const url = new URL(event.request.url);
	const sex = url.searchParams.get('sex') || 'all';
	const set = url.searchParams.get('set') || 'quick';

	try {
		const categoryService = new CategoryService(new SessionService());
		const categoryProgress = await categoryService.getCategories(set, sex, userId);

		return json(categoryProgress);
	} catch {
		return json({ error: 'Failed to fetch categories' }, { status: 500 });
	}
};
