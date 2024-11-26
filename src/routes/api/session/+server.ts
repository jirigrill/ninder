import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import pkg from 'pg';
import { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } from '$env/static/private';
import type { Session } from '$lib/types';

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

function generatePairingCode(): string {
	return Math.floor(1000 + Math.random() * 9000).toString();
}

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
				`SELECT * FROM sessions WHERE partnerUserId = $1 OR initiatorUserId = $1`,
				[userId]
			);

			if (result.rows.length === 0) {
				return json({ error: 'No session found' }, { status: 404 });
			}

			const sessions = result.rows;
			let preferredSession = sessions.find((session) => session.partneruserid === userId);

			if (!preferredSession) {
				preferredSession = sessions.find((session) => session.initiatoruserid === userId);
			}

			if (!preferredSession) {
				return json({ error: 'No session found' }, { status: 404 });
			}

			const session: Session = {
				initiatorUserId: preferredSession.initiatoruserid,
				partnerUserId: preferredSession.partneruserid,
				pairingCode: preferredSession.pairingcode
			};
			return json(session);
		} finally {
			client.release();
		}
	} catch (error) {
		return json({ error: 'Failed to fetch session' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const newSession: Session = await request.json();
		if (!newSession.initiatorUserId && !newSession.partnerUserId) {
			return json(
				{ error: 'when creating a session, initiator_user_id is required!' },
				{ status: 400 }
			);
		}

		if (newSession.initiatorUserId && newSession.partnerUserId) {
			return json(
				{ error: 'when joining a session, initiator_user_id cannot be set!' },
				{ status: 400 }
			);
		}

		if (newSession.partnerUserId && !newSession.pairingCode) {
			return json({ error: 'when joining a session, pairing code is required!' }, { status: 400 });
		}

		let isNewSession = !!newSession.initiatorUserId;

		const client = await pool.connect();

		try {
			if (isNewSession) {
				const pairingCode = generatePairingCode();
				const result = await client.query(
					`INSERT INTO sessions (initiatorUserId, partnerUserId, pairingCode) VALUES ($1, $2, $3) RETURNING *`,
					[newSession.initiatorUserId, null, pairingCode]
				);

				const dbRow = result.rows[0];
				const session: Session = {
					initiatorUserId: dbRow.initiatoruserid,
					partnerUserId: dbRow.partneruserid,
					pairingCode: dbRow.pairingcode
				};
				return json(session, { status: 201 });
			} else {
				const result = await client.query(
					`UPDATE sessions SET partnerUserId = $1 WHERE pairingCode = $2 AND partnerUserId IS NULL RETURNING *`,
					[newSession.partnerUserId, newSession.pairingCode]
				);

				if (result.rowCount === 0) {
					return json(
						{ error: 'No available session found with the provided pairing code' },
						{ status: 404 }
					);
				}

				const dbRow = result.rows[0];
				const session: Session = {
					initiatorUserId: dbRow.initiatoruserid,
					partnerUserId: dbRow.partneruserid,
					pairingCode: dbRow.pairingcode
				};
				return json(session, { status: 200 });
			}
		} finally {
			client.release();
		}
	} catch (error) {
		return json({ error: 'Failed to create session' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async (event) => {
	const url = new URL(event.request.url);
	const userId = url.searchParams.get('user_id');

	if (!userId) {
		return json({ error: 'user_id is required' }, { status: 400 });
	}

	try {
		const client = await pool.connect();

		try {
			const result = await client.query(
				`DELETE FROM sessions WHERE initiatorUserId = $1 OR partnerUserId = $1 RETURNING *`,
				[userId]
			);

			if (result.rows.length === 0) {
				return json({ error: 'No session found to delete' }, { status: 404 });
			}

			const deletedSession = result.rows[0];
			return json({ message: 'Session deleted successfully', session: deletedSession });
		} finally {
			client.release();
		}
	} catch (error) {
		return json({ error: 'Failed to delete session' }, { status: 500 });
	}
};
