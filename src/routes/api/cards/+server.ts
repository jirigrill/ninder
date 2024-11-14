import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import pkg from 'pg';
import { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } from '$env/static/private';
import type { Card } from '$lib/types';

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
	const country = url.searchParams.get('country');
	const take = url.searchParams.get('take') ? parseInt(url.searchParams.get('take') || '10') : 10;

	let query = `
        SELECT n.id, n.name, n.meaning, c.name AS category_name
        FROM names n
        LEFT JOIN name_categories nc ON n.id = nc.name_id
        LEFT JOIN categories c ON nc.category_id = c.id
    `;

	const params: any[] = [];
	if (country) {
		query += ' WHERE c.letter_code = $1';
		params.push(country);
	}
	query += ' LIMIT $2';
	params.push(take);

	try {
		const client = await pool.connect();

		try {
			const res = await client.query(query, params);
			const categories: Card[] = res.rows.map((row) => ({
				id: row.id,
				name: row.name,
				meaning: row.meaning,
				countries: []
			}));
			console.log(categories);
			return new Response(JSON.stringify(categories), {
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		} finally {
			client.release();
		}
	} catch (error) {
		console.error('Database query failed', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch names' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
