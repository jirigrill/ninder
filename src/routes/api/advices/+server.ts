import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { AdviceService } from '../services/AdviceService';

export const GET: RequestHandler = async (event: RequestEvent) => {
	// TODO: Replace with proper authentication
	const userId = 'default-user';

	try {
		const advice = await new AdviceService().getAdviceByUserId(userId);
		return json(advice);
	} catch (error) {
		return json({ error: 'Failed to fetch advice' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async (event) => {
	// TODO: Replace with proper authentication
	const userId = 'default-user';

	try {
		await new AdviceService().deleteAdvivceByUserId(userId);
		return json({ message: 'Advice deleted successfully' });
	} catch (error) {
		return json({ error: 'Failed to delete advice' }, { status: 500 });
	}
};
