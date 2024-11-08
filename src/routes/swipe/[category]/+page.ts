import type { Card } from "$lib/types";

export const load = async ({ params, fetch }) => {

    const response = await fetch(`/api/cards?country=${params.category}&skip=0&take=2`, { method: 'GET' });
    const newStack: Card[] = await response.json();
	return {
		cards: newStack
	};
};