import { json, type RequestHandler } from "@sveltejs/kit";
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

export const POST: RequestHandler = async ({ params, request }) => {
    const name_id: string | undefined = params.id;
    const { user_id } = await request.json();

    if (!name_id || !user_id) {
        return json({ error: 'Missing name_id or user_id' }, { status: 400 });
    }

    try {
        const client = await pool.connect();
        const query = `
            INSERT INTO card_interactions (name_id, user_id, action)
            VALUES ($1, $2, 'disliked')
            RETURNING *;
        `;
        const values = [name_id, user_id];
        const result = await client.query(query, values);
        client.release();

        if (result.rowCount === 0) {
            return json({ error: `Names with the id ${name_id} not found` }, { status: 404 });
        }

        return new Response(null, { status: 204 });
    0
    } catch (error) {
        console.error(error);
        return json({ error: "Internal server error" }, { status: 500 });
    }
};