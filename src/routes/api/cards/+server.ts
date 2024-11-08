import { json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";

import * as db from '../data';

export const GET: RequestHandler = async (event: RequestEvent) => {
    const country = event.url.searchParams.get("country");
    const take = parseInt(event.url.searchParams.get('take') || '10');
    const cards = db.getCards(country, take);
    return json(cards);
};