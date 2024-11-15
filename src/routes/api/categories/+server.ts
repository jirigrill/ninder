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
	const url = new URL(event.request.url);
	const userId = url.searchParams.get('user_id');

	try {
		const client = await pool.connect();

		try {
			const categories = await client.query('SELECT * FROM categories WHERE visible = TRUE');
			const progress = await getCategoryProgress(client, userId);

			const categoryProgress: CategoryProgress[] = categories.rows.map((row) => ({
				name: row.name,
				letterCode: row.letter_code,
				totalCards: row.total_cards,
				swipedCards: progress.get(row.name) || 0,
				id: row.id
			}));
			return json(categoryProgress);
		} finally {
			client.release();
		}
	} catch (error) {
		return json({ error: 'Failed to fetch categories' }, { status: 500 });
	}
};

async function getCategoryProgress(client: pkg.PoolClient, userId: string): Promise<Map<string, number>> {
	let query = `
		SELECT c.id AS category_id, c.name AS category_name, COUNT(ci.name_id) AS total_swiped_cards
		FROM categories c
		LEFT JOIN name_categories nc ON c.id = nc.category_id
		LEFT JOIN card_interactions ci ON nc.name_id = ci.name_id
		WHERE ci.user_id = $1
		GROUP BY c.id, c.name
		UNION ALL
		SELECT NULL AS category_id, 'Gemischt' AS category_name, COUNT(DISTINCT ci.name_id) AS total_swiped_cards
		FROM card_interactions ci
		WHERE ci.user_id = $1
		ORDER BY total_swiped_cards DESC
	`;
	const res = await client.query(query, [userId]);

	const categoryProgressMap = new Map<string, number>();
	res.rows.forEach(row => {
		categoryProgressMap.set(row.category_name, row.total_swiped_cards);
	});

	return categoryProgressMap;
}
