import { json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";

import * as db from '../data';

export const GET: RequestHandler = async (event: RequestEvent) => {
    const country = event.url.searchParams.get("country");
    const skip = parseInt(event.url.searchParams.get('skip') || '0');
    const take = parseInt(event.url.searchParams.get('take') || '10');
    const cards = db.getCards(country, skip, take);
    return json(cards);
};