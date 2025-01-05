import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { authenticate } from '$lib/server/authenticate';
import { AdviceService } from '../services/AdviceService';

export const GET: RequestHandler = async (event: RequestEvent) => {
	const userId = await authenticate(event);
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const advice = await new AdviceService().getAdviceByUserId(userId);
		return json(advice);
	} catch (error) {
		return json({ error: 'Failed to fetch advice' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async (event) => {
	const userId = await authenticate(event);
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		await new AdviceService().deleteAdvivceByUserId(userId);
		return json({ message: 'Advice deleted successfully' });
	} catch (error) {
		return json({ error: 'Failed to delete advice' }, { status: 500 });
	}
};
