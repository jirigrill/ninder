import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import pkg from 'pg';
import { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } from '$env/static/private';
import type { Card, CardInteraction } from '$lib/types';

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
	const userId = url.searchParams.get('user_id');

	try {
		const client = await pool.connect();

		try {
			let cards = await getNextCards(userId, country, take, client);
			cards = await addPartnerCardInteractions(cards, userId, client);

			return new Response(JSON.stringify(cards), {
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

async function getNextCards(
	userId: string,
	country: string,
	take: number,
	client: pkg.PoolClient
): Promise<Card[]> {
	let query = `
  		SELECT  DISTINCT ON (n.id) n.id, n.name, n.meaning, c.name AS category_name
        FROM names n
        LEFT JOIN name_categories nc ON n.id = nc.name_id
        LEFT JOIN categories c ON nc.category_id = c.id
        WHERE n.id NOT IN (
            SELECT name_id
            FROM card_interactions
            WHERE user_id = $1
        )
    `;
	const params: any[] = [userId];

	if (country && country !== 'mixed') {
		query += ' AND c.letter_code = $2';
		params.push(country);
		query += ' ORDER BY n.id ASC';
		query += ' LIMIT $3';
		params.push(take);
	} else {
		query += ' ORDER BY n.id ASC';
		query += ' LIMIT $2';
		params.push(take);
	}

	const res = await client.query(query, params);
	let categories: Card[] = res.rows.map((row) => ({
		id: row.id,
		name: row.name,
		meaning: row.meaning,
		countries: [],
		partnerInteraction: null
	}));

	categories = await enhanceWithCountries(categories, client);

	return categories;
}

async function enhanceWithCountries(cards: Card[], client: pkg.PoolClient): Promise<Card[]> {
	const query = `
		SELECT n.id, c.letter_code
		FROM names n
		LEFT JOIN name_categories nc ON n.id = nc.name_id
		LEFT JOIN categories c ON nc.category_id = c.id
		WHERE n.id = ANY($1)
	`;
	const params: any[] = [cards.map((card) => card.id)];
	const res = await client.query(query, params);
	const countries: Record<number, string[]> = res.rows.reduce((acc, row) => {
		if (!acc[row.id]) {
			acc[row.id] = [];
		}
		acc[row.id].push(row.letter_code);
		return acc;
	}, {});

	cards.forEach((card) => {
		const cardCountries = countries[card.id];
		if (cardCountries) {
			card.countries = cardCountries;
		}
	});

	return cards;
}

async function getPartnerUserId(userId: string, client: pkg.PoolClient): Promise<number | null> {
	const result = await client.query(
		`SELECT * FROM sessions WHERE partnerUserId = $1 OR initiatorUserId = $1`,
		[userId]
	);

	if (result.rows.length === 0) {
		return null;
	}

	const sessions = result.rows;
	let preferredSession = sessions.find((session) => session.partneruserid === userId);

	if (!preferredSession) {
		preferredSession = sessions.find((session) => session.initiatoruserid === userId);
	}

	if (!preferredSession) {
		return null;
	}

	return preferredSession.partneruserid === userId
		? preferredSession.initiatoruserid
		: preferredSession.partneruserid;
}

async function addPartnerCardInteractions(
	cards: Card[],
	userId: string,
	client: pkg.PoolClient
): Promise<Card[]> {
	const partnerUserId = await getPartnerUserId(userId, client);
	const query = `
		SELECT ci.name_id, ci.action
		FROM card_interactions ci
		WHERE ci.user_id = $1
		AND ci.name_id = ANY($2)
	`;

	const params: any[] = [partnerUserId, cards.map((card) => card.id)];
	const res = await client.query(query, params);
	const interactions: CardInteraction[] = res.rows.map((row) => ({
		cardId: row.name_id,
		swipe: row.action,
		userId: partnerUserId
	}));

	cards.forEach((card) => {
		const interaction = interactions.find((interaction) => interaction.cardId === card.id);
		if (interaction) {
			card.partnerInteraction = interaction;
		}
	});

	return cards;
}
