import { getUserStore } from '$lib/FirebaseStore.svelte';
import type { Card } from '$lib/types';

export const getCards = async (country: string, take: number) => {
	const idToken = await getUserStore().user?.getIdToken();
	const response = await fetch(
		`/api/cards?country=${country}&take=${take}&user_id=${getUserStore().user?.uid}`,
		{headers: {'Authorization': `Bearer ${idToken}` }}
	);
	const data = await response.json();
	return (data as Card[]).reverse();
};

export const swipeCard = async (swipeAction: {
	card: Card;
	swipeAction: 'like' | 'dislike';
}): Promise<void> => {
	const idToken = await getUserStore().user?.getIdToken();
	await fetch(`/api/cards/${swipeAction.card.id}/${swipeAction.swipeAction}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${idToken}`
			
		},
		body: JSON.stringify({ user_id: getUserStore().user?.uid })
	});
};
