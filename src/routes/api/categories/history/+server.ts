import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { pushToCategoryHistory } from '$lib/server/CategoryRepository';

export const POST: RequestHandler = async (event: RequestEvent) => {
	// TODO: Replace with proper authentication
	const user_id = 'default-user';
	const url = new URL(event.request.url);
	const category_id = Number.parseInt(url.searchParams.get('category') || '') || null;

	if (!category_id || !user_id) {
		return json({ error: 'Missing category_id or user_id' }, { status: 400 });
	}

	try {
		await pushToCategoryHistory(user_id, category_id);
		return new Response(null, { status: 204 });
	} catch (error) {
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
