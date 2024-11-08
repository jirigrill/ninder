import { json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";

import * as db from '../data';
import type { CategoryProgress } from "$lib/types";

export const GET: RequestHandler = async (event: RequestEvent) => {
    const categories = db.getCategories();

    const categoryProgress = new Array<CategoryProgress>();
    for(let category of categories) {
        categoryProgress.push({
            name: category.name,
            letterCode: category.letterCode,
            totalCards: db.getTotalCards(category.letterCode),
            swipedCards: db.getTotalSwipedCards(category.letterCode)
        });
    }

    return json(categoryProgress);
};