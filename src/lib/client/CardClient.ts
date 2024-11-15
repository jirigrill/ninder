import { getUserStore } from '$lib/FirebaseStore.svelte';
import type { Card } from '$lib/types';

export const getCards = async (country: string, take: number) => {
	const response = await fetch(`/api/cards?country=${country}&take=${take}&user_id=${getUserStore().user?.uid}`);
	const data = await response.json();
	return (data as Card[]).reverse();
};

export const swipeCard = async (swipeAction: { card: Card, swipeAction: 'like' | 'dislike' }): Promise<void> => {
	await fetch(`/api/cards/${swipeAction.card.id}/${swipeAction.swipeAction}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ user_id: getUserStore().user?.uid })
	});
}