import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import pkg from 'pg';
import { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } from '$env/static/private';

const { Pool } = pkg;

const pool = new Pool({
	user: DB_USER,
	host: DB_HOST,
	database: DB_NAME,
	password: DB_PASSWORD,
	port: parseInt(DB_PORT),
	ssl: {
		rejectUnauthorized: false
	}
});

export const GET: RequestHandler = async (event: RequestEvent) => {
	const url = new URL(event.request.url);
	const userId = url.searchParams.get('user_id');

	if (!userId) {
		return json({ error: 'user_id is required' }, { status: 400 });
	}

	try {
		const client = await pool.connect();

		try {
			const result = await client.query(
				`SELECT * FROM SessionRepository WHERE initiatorUserId = $1 OR partnerUserId = $1 LIMIT 1`,
				[userId]
			);

			if (result.rows.length === 0) {
				return json({ error: 'No session found' }, { status: 404 });
			}

			const session = result.rows[0];
			return json(session);
		} finally {
			client.release();
		}
	} catch (error) {
		return json({ error: 'Failed to fetch session' }, { status: 500 });
	}
};
