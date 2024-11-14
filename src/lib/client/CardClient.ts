import type { Card } from '$lib/types';

export const getCards = async (country: string, take: number) => {
	const response = await fetch(`/api/cards?country=${country}&take=${take}`);
	const data = await response.json();
	return data as Card[];
};
