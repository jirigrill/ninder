import type { CategoryProgress } from '$lib/types';
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
	try {
		const client = await pool.connect();

		try {
			const res = await client.query('SELECT * FROM categories WHERE visible = TRUE');
			const categories: CategoryProgress[] = res.rows.map((row) => ({
				name: row.name,
				letterCode: row.letter_code,
				totalCards: row.total_cards,
				swipedCards: 0,
				id: row.id
			}));
			return json(categories);
		} finally {
			client.release();
		}
	} catch (error) {
		return json({ error: 'Failed to fetch categories' }, { status: 500 });
	}
};
