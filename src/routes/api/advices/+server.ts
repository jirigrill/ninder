import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { authenticate } from '$lib/server/authenticate';
import { PrismaClient } from '@prisma/client';
import { deleteAdvice, getAdvice } from '$lib/server/AdviceRepository';

export const GET: RequestHandler = async (event: RequestEvent) => {
	const userId = await authenticate(event);
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const prisma = new PrismaClient();
	try {
		const advice = await getAdvice(prisma, userId);

		return json(advice);
	} catch (error) {
		return json({ error: 'Failed to fetch advice' }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
};

export const DELETE: RequestHandler = async (event) => {
	const userId = await authenticate(event);
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const prisma = new PrismaClient();

		try {
			const sessionId = await deleteAdvice(prisma, userId);
			return json({ message: 'Advice deleted successfully' });
		} finally {
			prisma.$disconnect();
		}
	} catch (error) {
		return json({ error: 'Failed to delete advice' }, { status: 500 });
	}
};
