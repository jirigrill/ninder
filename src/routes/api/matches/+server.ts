import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import pkg from 'pg';
import { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } from '$env/static/private';
import type { Match } from '$lib/types';

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
			const partnerUserId = await getPartnerUserId(userId, client);
            const cardIds = await getCardIdOfMatches(userId, partnerUserId, client);
            const names = await getNames(cardIds, client);

			return json(names);
		} finally {
			client.release();
		}
	} catch (error) {
		return json({ error: 'Failed to fetch categories' }, { status: 500 });
	}
};

async function getNames(nameIds: number[], client: pkg.PoolClient): Promise<Match[]> {
    const query = `
        SELECT name.id, name.name, name.meaning
        FROM names name
        WHERE NAME.id = ANY($1)
    `;

    const res = await client.query(query, [nameIds]);
    return res.rows.map((row) => ({ name: row.name, meaning: row.meaning, cardId: row.id }));
}

async function getPartnerUserId(userId: string, client: pkg.PoolClient): Promise<string | null> {
	const query = `
		SELECT partneruserid, initiatoruserid
		FROM sessions
		WHERE initiatoruserid = $1 OR partneruserid = $1
	`;
	const res = await client.query(query, [userId]);
	if (res.rows.length === 0) {
		return null;
	}
	const session = res.rows[0];
	const partnerUserId = session.initiatoruserid === userId ? session.partneruserid : session.initiatoruserid;
	return partnerUserId;
}

async function getCardIdOfMatches(userId: string, partnerId: string, client: pkg.PoolClient): Promise<number[]> {
	const query = `
        SELECT ci1.name_id, ci1.action AS user1_action, ci2.action AS user2_action
        FROM card_interactions ci1
        JOIN card_interactions ci2 ON ci1.name_id = ci2.name_id
        WHERE ci1.user_id = $1 AND ci2.user_id =$2 AND ci1.user_id != ci2.user_id
	`;
	const res = await client.query(query, [userId, partnerId]);
    return res.rows.map((row) => row.name_id);
}
